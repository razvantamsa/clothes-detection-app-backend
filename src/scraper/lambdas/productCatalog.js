const { invokeAsyncFunction } = require('../../utils/aws/lambda');
const { sendMessageToQueue } = require('../../utils/aws/sqs');
const utils = require('../../utils/scraping/cheerio/catalog.utils');
const { loadHtml } = require('../../utils/scraping/cheerio/init');

// const { APP_MAX_PRODUCT_LIMIT } = process.env;

const { 
    // APP_DYNAMODB_INTEGRATIONS_TABLE,
    SQS_PRODUCT_DETAIL_QUEUE_URL,
} = process.env;

exports.handler = async (event) => {
    // console.log('Event payload: ', event);

    // const { type, brand, baseUrl } = event, products = [];
    // let url = baseUrl;

    // try {
    //     while(products.length <= APP_MAX_PRODUCT_LIMIT && url) {
    //         const $ = await loadHtml(url);
    //         const foundProducts = utils.scrapeProductsFromPage($);
    //         url = utils.scrapeNextPageHref($);
    //         products.push(...foundProducts);
    //         console.log(products.length, url);
    //     }
    // } catch (error) {
    //     throw error.message;
    // }

    // console.log(products.length);

    // await invokeAsyncFunction(
    //     'clothes-detection-scraper-dev-scrapeProductDetail',
    //     { type, hrefs: products, brand },
    // );

    // console.log('Received event:', JSON.stringify(event, null, 2));
    const delay = () => new Promise((resolve) => setTimeout(resolve, 5000));

    try {
        const { integration, type } =  JSON.parse(event.Records[0].body);
        console.log(integration, type);
        console.log(integration.types[type]);

        for (let i = 0; i < 50; i++) {
            await delay();
            await sendMessageToQueue(
                JSON.stringify({ counter: i, content: 'testing the flows' }), 
                SQS_PRODUCT_DETAIL_QUEUE_URL,
            );
        }

    } catch (error) {
        throw new Error(error);
    }

    return { statusCode: 200 };
};