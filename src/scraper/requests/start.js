const express = require('express');
const { invokeAsyncFunction } = require('../../utils/aws/lambda');
const { authorizerMiddleware } = require('../../utils/authorizer/authorizer');
const { verifyTypeHeader } = require('../../utils/middelware/verifyTypeHeader');
const { getItem } = require('../../utils/aws/dynamodb');
const { sendEmail } = require('../../utils/aws/ses');
const { sendMessageToQueue } = require('../../utils/aws/sqs');
const router = express.Router();

const { 
    APP_DYNAMODB_INTEGRATIONS_TABLE,
    SQS_PRODUCT_CATALOG_QUEUE_URL,
    MESSAGE_GROUP_ID
} = process.env;

router.post('/start', [authorizerMiddleware, verifyTypeHeader], async (req, res) => {
    try {
        const { brand, website, type} = req.headers;
        const integration = await getItem(APP_DYNAMODB_INTEGRATIONS_TABLE, { brand, website });
        
        if(!integration) {
            return res.status(404).send(`Integration for ${brand} on ${website} does not exist`);
        }
        if(!Object.prototype.hasOwnProperty.call(integration.types, type)) {
            return res.status(400).send(`Integration for ${brand} on ${website} does not accept ${type}`);
        }

        // await invokeAsyncFunction(`clothes-detection-scraper-dev-scrapeProductCatalog`, { type, brand, baseUrl });

        const Subject = 'Web Scraping API';
        const Body = `Scraping ${website} for ${brand} ${type}, started on ${(new Date(Date.now())).toUTCString()}`;
        // await sendEmail(Subject, Body);

        await sendMessageToQueue(
            JSON.stringify({Subject, Body}), 
            SQS_PRODUCT_CATALOG_QUEUE_URL,
            MESSAGE_GROUP_ID
        );

        return res.status(200).send(`Started scraping for ${brand}'s ${type}`);
    } catch (err) {
        console.error(err);
        res.status(400).send(err.message);
    }
});
  
module.exports = router;