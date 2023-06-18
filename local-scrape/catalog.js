const fs = require('fs').promises;
const utils = require('../src/utils/scraping/cheerio/catalog.utils');
const { loadHtml } = require('../src/utils/scraping/cheerio/init');

const { MAX_PRODUCT_LIMIT } = process.env;

async function scrapeCatalog(url) {
    let products = [];

    try {
        while(products.length <= MAX_PRODUCT_LIMIT && url) {
            const $ = await loadHtml(url);
            const foundProducts = utils.scrapeProductsFromPage($);
            url = utils.scrapeNextPageHref($)
            products.push(...foundProducts);
            console.log(products.length, url);
        }
    } catch (error) {
        throw error.message;
    }

    return products;
}


async function writeOutputToFile(output) {
    try {
        await fs.writeFile('./local-scrape/output.txt', output);
      } catch (err) {
        console.error('Error writing to file:', err);
      }
}

(async () => {
    const [baseUrl] = process.argv.slice(2);
    const products = await scrapeCatalog(baseUrl);
    const output = products.join('\n');
    await writeOutputToFile(output);
})();
