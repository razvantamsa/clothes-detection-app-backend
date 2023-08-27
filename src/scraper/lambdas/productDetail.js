const { logToCloudWatch } = require('../../utils/aws/cloudwatch');
const { sendMessageToQueue, deleteMessageFromQueue } = require('../../utils/aws/sqs');
const IntegrationUtils = require('../integrations');

const { 
    AWS_LAMBDA_FUNCTION_NAME,
    SQS_PRODUCT_DETAIL_QUEUE_URL,
    SQS_UPLOAD_PRODUCT_DATA_QUEUE_URL,
} = process.env;

const determineWorker = () => {
    const stringArray = AWS_LAMBDA_FUNCTION_NAME.split('-');
    return stringArray[stringArray.length - 1];
}

const log = async (message) => logToCloudWatch(
    '/aws/lambda/clothes-detection-resources-dev-productDetail',
    'index',
    message
);

exports.handler = async (event) => {
    try {
        const { integration, type, href } =  JSON.parse(event.Records[0].body);
        const Utils = IntegrationUtils[integration.website];

        await log(`Worker ${determineWorker()}: ${href}`);
        const productDetails = await Utils.scrapeProductDetail(integration, type, href);

        await sendMessageToQueue(
            JSON.stringify({
                type,
                website: integration.website, 
                brand: integration.brand, 
                model: productDetails.model,
                productData: productDetails.productData,
                productImages: productDetails.productImages
            }), 
            SQS_UPLOAD_PRODUCT_DATA_QUEUE_URL,
        );

        await deleteMessageFromQueue(SQS_PRODUCT_DETAIL_QUEUE_URL, event.Records[0].receiptHandle);
        await log(`Success for ${integration.brand} ${productDetails.model}`);
    } catch (error) {
        await log(error.message);
    }

    return { statusCode: 200 }
};