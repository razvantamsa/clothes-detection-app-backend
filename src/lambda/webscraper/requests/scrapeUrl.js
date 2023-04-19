const express = require('express');
const { baseNikeScrape } = require('../../../utils/scraping/baseNikeScrape');
const router = express.Router();

router.post('/url', async (req, res) => {
    try {
        const domain = new URL(req.body.url).hostname.split('.')[1];
        let products;

        switch(domain) {
            case 'nike':
                products = await baseNikeScrape(req.body.url);
                break;
            case 'adidas':
            case 'jordan':
            case 'converse':
            case 'rebook':
            case 'puma':
            case 'vans':
            case 'newbalance':
            default:
                res.status(400).send('Not yet implemented');
                return;
        }

        res.status(200).send(products);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});
  
module.exports = router;