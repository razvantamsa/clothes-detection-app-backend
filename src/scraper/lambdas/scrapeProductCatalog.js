const { invokeAsyncFunction } = require('../../utils/aws/lambda');
const utils = require('../../utils/scraping/cheerio/catalog.utils');
const { loadHtml } = require('../../utils/scraping/cheerio/init');

const { MAX_PRODUCT_LIMIT } = process.env;

exports.handler = async (event, context) => {
    console.log('Event payload: ', event);

    const { type, brand, baseUrl } = event, products = [];
    let url = baseUrl;

    try {
        while(products.length <= MAX_PRODUCT_LIMIT && url) {
            const $ = await loadHtml(url);
            const foundProducts = utils.scrapeProductsFromPage($);
            url = utils.scrapeNextPageHref($);
            products.push(...foundProducts);
            console.log(products.length, url);
        }
    } catch (error) {
        throw error.message;
    }

    console.log(products.length);

    await invokeAsyncFunction(
        'clothes-detection-scraper-dev-scrapeProductDetail',
        { type, hrefs: products, brand },
    );

};