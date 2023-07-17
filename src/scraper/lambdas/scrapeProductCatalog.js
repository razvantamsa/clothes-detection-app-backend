const { invokeAsyncFunction } = require('../../utils/aws/lambda');
const utils = require('../../utils/scraping/cheerio/catalog.utils');
const { loadHtml } = require('../../utils/scraping/cheerio/init');
const logger = require('../../utils/logger')();

const { APP_MAX_PRODUCT_LIMIT } = process.env;

exports.handler = async (event, context) => {
    logger.info('Event payload: ', event);

    const { type, brand, baseUrl } = event, products = [];
    let url = baseUrl;

    try {
        while(products.length <= APP_MAX_PRODUCT_LIMIT && url) {
            const $ = await loadHtml(url);
            const foundProducts = utils.scrapeProductsFromPage($);
            url = utils.scrapeNextPageHref($);
            products.push(...foundProducts);
            logger.info(products.length, url);
        }
    } catch (error) {
        throw error.message;
    }

    logger.info(products.length);

    await invokeAsyncFunction(
        'clothes-detection-scraper-dev-scrapeProductDetail',
        { type, hrefs: products, brand },
    );

};