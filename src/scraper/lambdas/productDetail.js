const { logToCloudWatch } = require('../../utils/aws/cloudwatch');
const { sendMessageToQueue } = require('../../utils/aws/sqs');
const IntegrationUtils = require('../integrations');

const { 
    AWS_LAMBDA_FUNCTION_NAME,
    SQS_UPLOAD_PRODUCT_DATA_QUEUE_URL,
} = process.env;

const determineWorker = () => {
    const stringArray = AWS_LAMBDA_FUNCTION_NAME.split('-');
    return stringArray[stringArray.length - 1];
}

exports.handler = async (event) => {
    try {
        const { integration, type, href } =  JSON.parse(event.Records[0].body);
        const Utils = IntegrationUtils[integration.website];

        await logToCloudWatch(
            '/aws/lambda/clothes-detection-resources-dev-productDetail',
            'index',
            `Worker ${determineWorker()}: ${href}`
        );

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

    } catch (error) {
        console.log(error);
        await logToCloudWatch(
            '/aws/lambda/clothes-detection-resources-dev-productDetail',
            'index',
            error.message
        );

        return { statusCode: 500 }
    }

    return { statusCode: 200 }
};