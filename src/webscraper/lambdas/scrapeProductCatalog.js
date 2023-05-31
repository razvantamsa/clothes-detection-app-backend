const { invokeAsyncFunction } = require('../../utils/aws/lambda');
const utils = require('../../utils/scraping/cheerio/catalog.utils');
const { loadHtml } = require('../../utils/scraping/cheerio/init');

const { MAX_SHOES_LIMIT } = process.env;

exports.handler = async (event, context) => {
    console.log('Event payload: ', event);

    const { brand, baseUrl } = event, shoes = [];
    let url = baseUrl;

    try {
        while(shoes.length <= MAX_SHOES_LIMIT) {
            const $ = await loadHtml(url);
            const foundShoes = utils.scrapeProductsFromPage($);
            url = utils.scrapeNextPageHref($);
            shoes.push(...foundShoes);
            console.log(shoes.length, url);
        }
    } catch (error) {
        throw error.message;
    }

    console.log(shoes.length);
    return 'ok';

    // await invokeAsyncFunction(
    //     'sneaker-api-scraper-dev-scrapeIndividual',
    //     { href: shoe.link, brand },
    // );

};