const express = require('express');
const { invokeAsyncFunction } = require('../../utils/aws/lambda');
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

router.post('/:domain', async (req, res) => {
    try {
        const { domain } = req.params;
        const domainList = ['nike', 'adidas', 'puma', 'converse', 'rebook', 'vans', 'newbalance']

        if(!domainList.includes(domain)) {
            return res.status(400).send(`Not implemented for ${domain}`);
        }

        await invokeAsyncFunction(`sneaker-api-dev-scrapeUrl`, { domain });
        return res.status(200).send(`Started scraping on ${domain}'s website`);
    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
});
  
module.exports = router;