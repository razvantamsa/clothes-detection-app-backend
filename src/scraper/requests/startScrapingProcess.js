const express = require('express');
const { invokeAsyncFunction } = require('../../utils/aws/lambda');
const { authorizerMiddleware } = require('../../utils/authorizer/authorizer');
const { verifyTypeHeader } = require('../../utils/middelware/verifyTypeHeader');
const { sendEmail } = require('../../utils/aws/ses');
const router = express.Router();

router.post('/start/:brand', [authorizerMiddleware, verifyTypeHeader], async (req, res) => {
    try {
        const { brand } = req.params;
        const { baseUrl } = req.body;
        const type = req.headers['type'];

        // await invokeAsyncFunction(`clothes-detection-scraper-dev-scrapeProductCatalog`, { type, brand, baseUrl });

        const Subject = 'Web Scraping API';
        const Body = `Scraping ${baseUrl} for ${brand} ${type}, started on ${(new Date(Date.now())).toUTCString()}`;
        await sendEmail(Subject, Body);

        return res.status(200).send(`Started scraping for ${brand}'s ${type}`);
    } catch (err) {
        console.error(err);
        res.status(400).send(err.message);
    }
});
  
module.exports = router;