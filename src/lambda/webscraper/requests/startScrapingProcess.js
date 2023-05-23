const express = require('express');
const { invokeAsyncFunction } = require('../../../utils/aws/lambda');
const router = express.Router();

/**
 * list of brands for scraping:
 * nike
 * adidas
 * converse
 * rebook
 * puma
 * vans
 * newbalance
*/

router.post('/url', async (req, res) => {
    try {
        const domain = new URL(req.body.url).hostname.split('.')[1];
        const domainList = ['nike', 'adidas', 'puma', 'converse', 'rebook', 'vans', 'newbalance']

        if(!domainList.includes(domain)) {
            return res.status(400).send('Not implemented for domain');
        }

        await invokeAsyncFunction(`sneaker-api-dev-scrapeUrl`, { url: req.body.url, domain });
        return res.status(200).send(`Started scraping on ${req.body.url}`);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});
  
module.exports = router;