const express = require('express');
const { scanTable, getItemByPk, queryTableByGSI, getItem } = require('../../utils/aws/dynamodb');
const logger = require('../../utils/logger')();
const router = express.Router();

router.get('/integration', async (req, res) => {
    try {
        let items;
        const { website, brand } = req.headers;

        if (website && brand) {
            items = await getItem('scraper-integration-table', { website, brand });
        } else if(website && !brand) {
            items = await getItemByPk('scraper-integration-table', { website }); 
        } else if (!website && brand) {
            items = await queryTableByGSI('scraper-integration-table', 'brand-gsi', { brand });
        } else {
            items = await scanTable('scraper-integration-table')
        }
        return res.status(200).send(items);
    } catch (err) {
        logger.error(err);
        res.status(400).send(err.message);
    }
});
  
module.exports = router;