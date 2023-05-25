const express = require('express');
const { invokeAsyncFunction } = require('../../utils/aws/lambda');
const { urlList } = require('../../utils/scraping/constants');
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

router.post('/:brand', async (req, res) => {
    try {
        const { brand } = req.params;

        if(!Object.keys(urlList).some(key => key.includes(brand))) {
            console.log('Not implemented');
            return;
        }

        await invokeAsyncFunction(`sneaker-api-scraper-dev-scrapeUrl`, { brand });
        return res.status(200).send(`Started scraping on ${brand}'s website`);
    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
});
  
module.exports = router;