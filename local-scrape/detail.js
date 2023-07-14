const { default: axios } = require('axios');
const stream = require('stream');
const { loadHtml } = require('../src/utils/scraping/cheerio/init');
const { loadDynamicPage } = require('../src/utils/scraping/puppeteer/init');
const staticUtils = require('../src/utils/scraping/cheerio/detail.utils');
const dynamicUtils = require('../src/utils/scraping/puppeteer/detail.utils');
const { uploadStreamToS3 } = require('../src/utils/aws/s3');
const { postItem } = require('../src/utils/aws/dynamodb');
const { selectResources } = require('../src/utils/middelware/verifyTypeHeader');

const fs = require('fs').promises;

async function readInputFromFile() {
    try {
        const data = await fs.readFile('./local-scrape/output.txt', 'utf8');
        const text = data.split('\n');
        const url = text.shift();
        const modifiedText = text.join('\n');
        return [url, modifiedText];
      } catch (err) {
        console.error('Error reading file:', err);
      }
}

async function writeOutputToFile(output) {
    try {
        await fs.writeFile('./local-scrape/output.txt', output);
      } catch (err) {
        console.error('Error writing to file:', err);
      }
}


async function scrapeDetail(type, brand, url) {
    try {
        const [DYNAMODB_TABLE, S3_BUCKET] = selectResources(type);

        const $ = await loadHtml(url);
        const name = staticUtils.getProductName($);
        const price = staticUtils.getProductPrice($);
        const color = staticUtils.getProductColor($);
        const rating = staticUtils.getProductRating($);
        const nrOfReviews = staticUtils.getNumberOfReviews($);
        const data = staticUtils.getProductData($);

        const [page, closeBrowserCallback] = await loadDynamicPage();
        const imageLinks = await dynamicUtils.getProductImageLinks(page, closeBrowserCallback, url);

        
        for(const [index, imageLink] of imageLinks.entries()) {
            const response = await axios({
                method: 'GET',
                url: imageLink,
                responseType: 'stream'
            });
            const uploadStream = new stream.PassThrough();
            response.data.pipe(uploadStream);
            const key = `${brand}/${name}/pic${index}`;
            await uploadStreamToS3(S3_BUCKET, key, uploadStream);
        }
        
        const uploadObject = { brand, model: name, color, rating, nrOfReviews, price, ...data };
        await postItem(DYNAMODB_TABLE, uploadObject);
        
        console.log('Success');

    } catch (err) {
        console.log(err.message);
    }
}

(async () => {
    const [type, brand] = process.argv.slice(2);
    const [url, modifiedText] = await readInputFromFile();
    console.log('Scraping: ', url);
    await scrapeDetail(type, brand, url);
    await writeOutputToFile(modifiedText);
})();