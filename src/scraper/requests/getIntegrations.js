const express = require('express');
const { scanTable } = require('../../utils/aws/dynamodb');
const logger = require('../../utils/logger')();
const router = express.Router();

router.get('/integration', async (req, res) => {
    try {
        const items = await scanTable('scraper-integration-table')
        return res.status(200).send(items);
    } catch (err) {
        logger.error(err);
        res.status(400).send(err.message);
    }
});
  
module.exports = router;