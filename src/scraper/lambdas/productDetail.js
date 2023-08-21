const stream = require('stream');
const { loadHtml } = require("../../utils/scraping/cheerio/init");
const { loadDynamicPage } = require("../../utils/scraping/puppeteer/init");
const staticUtils = require("../../utils/scraping/cheerio/detail.utils");
const dynamicUtils = require("../../utils/scraping/puppeteer/detail.utils");
const { invokeAsyncFunction } = require("../../utils/aws/lambda");
const { uploadStreamToS3 } = require('../../utils/aws/s3');
const { postItem: postDynamoDB } = require("../../utils/aws/dynamodb");
const { default: axios } = require('axios');
const { selectResources } = require('../../utils/middelware/verifyTypeHeader');
const { logToCloudWatch } = require('../../utils/aws/cloudwatch');

const { 
    DEPLOYMENT_NAME,
    ENVIRONMENT,
    AWS_LAMBDA_FUNCTION_NAME,
} = process.env;


exports.handler = async (event, context) => {
    try {
        const { counter, content } =  JSON.parse(event.Records[0].body);

        const stringArray = AWS_LAMBDA_FUNCTION_NAME.split('-');
        const lastElement = stringArray[stringArray.length - 1];
        // if((counter + 1) % parseInt(NUMBER_OF_WORKERS) !== lastElement) {
        //     return;
        // }
        await logToCloudWatch(
            `/aws/lambda/${DEPLOYMENT_NAME}-${ENVIRONMENT}-productDetail`,
            'index',
            `Worker ${lastElement} picked ${counter + 1}, ${content}`
        );

            //         await sendMessageToQueue(
    //             JSON.stringify({ counter: i, content: 'testing the flows' }), 
    //             SQS_PRODUCT_DETAIL_QUEUE_URL,
    //         );
    } catch (error) {
        throw new Error(error);
    }
    // console.log('Event payload:', event);
    // let { type, hrefs, brand } = event;
    // const [DYNAMODB_TABLE, S3_BUCKET] = selectResources(type);

    // if(!hrefs.length) {
    //     console.log('Finished scraping');
    //     return;
    // }

    // const url = hrefs.shift();

    // try {
    //     const $ = await loadHtml(url);
    //     const name = staticUtils.getProductName($);
    //     const price = staticUtils.getProductPrice($);
    //     const color = staticUtils.getProductColor($);
    //     const rating = staticUtils.getProductRating($);
    //     const nrOfReviews = staticUtils.getNumberOfReviews($);
    //     const data = staticUtils.getProductData($);

    //     const [page, closeBrowserCallback] = await loadDynamicPage();
    //     const imageLinks = await dynamicUtils.getProductImageLinks(page, closeBrowserCallback, url);

        
    //     for(const [index, imageLink] of imageLinks.entries()) {
    //         const response = await axios({
    //             method: 'GET',
    //             url: imageLink,
    //             responseType: 'stream'
    //         });
    //         const uploadStream = new stream.PassThrough();
    //         response.data.pipe(uploadStream);
    //         const key = `${brand}/${name}/pic${index}`;
    //         console.log({ key });
    //         const result = await uploadStreamToS3(S3_BUCKET, key, uploadStream);
    //         console.log(result);
    //     }
        
    //     const uploadObject = { brand, model: name, color, rating, nrOfReviews, price, ...data };
    //     const result = await postDynamoDB(DYNAMODB_TABLE, uploadObject);
    //     console.log(result);

    // } catch (err) {
    //     console.error(err);
    // }

    // await invokeAsyncFunction(
    //     'clothes-detection-scraper-dev-scrapeProductDetail',
    //     { type, hrefs, brand },
    // );


    // console.log('Received event:', JSON.stringify(event, null, 2));

    // try {
    //     const { integration, type } =  event.Records[0].body;
    //     let url = integration.types[type];
    //     console.log(url);

    //     for (let i = 1; i <= 50; i++) {
    //         await sendMessageToQueue(
    //             JSON.stringify({ counter: i, content: 'testing the flows' }), 
    //             SQS_PRODUCT_DETAIL_QUEUE_URL,
    //         );
    //       }

    // } catch (error) {
    //     throw new Error(error);
    // }

    return { statusCode: 200 };
};