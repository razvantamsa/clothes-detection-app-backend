const express = require('express');
const { invokeAsyncFunction } = require('../../utils/aws/lambda');
const logger = require('../../utils/logger')();
const { authorizerMiddleware } = require('../../utils/authorizer/authorizer');
const { verifyTypeHeader } = require('../../utils/middelware/verifyTypeHeader');
const router = express.Router();

router.post('/:brand', [authorizerMiddleware, verifyTypeHeader], async (req, res) => {
    try {
        const { brand } = req.params;
        const { baseUrl } = req.body;
        const type = req.headers['type'];

        await invokeAsyncFunction(`clothes-detection-scraper-dev-scrapeProductCatalog`, { type, brand, baseUrl });
        return res.status(200).send(`Started scraping for ${brand}'s ${type}`);
    } catch (err) {
        logger.error(err);
        res.status(400).send(err.message);
    }
});
  
module.exports = router;