const { sendMessageToQueue, deleteMessageFromQueue } = require('../../utils/aws/sqs');
const IntegrationUtils = require('../integrations');

const {
    SQS_PRODUCT_CATALOG_QUEUE_URL,
    SQS_PRODUCT_DETAIL_QUEUE_URL,
} = process.env;

const delay = () => new Promise((resolve) => setTimeout(resolve, 5000));

const sendToWorker = async (body) => {
    await delay();
    await sendMessageToQueue(
        JSON.stringify(body), 
        SQS_PRODUCT_DETAIL_QUEUE_URL,
    );
}

exports.handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    try {
        const { integration, type } =  JSON.parse(event.Records[0].body);
        const Utils = IntegrationUtils[integration.website];
        await Utils.scrapeProductCatalog(integration, type, sendToWorker);
        await deleteMessageFromQueue(SQS_PRODUCT_CATALOG_QUEUE_URL, event.Records[0].receiptHandle);
    } catch (error) {
        console.log(error);
    }

    return { statusCode: 200 };
};