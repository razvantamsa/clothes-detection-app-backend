const express = require('express');
const { listAllTableEntries } = require('../../utils/aws/dynamodb');
const logger = require('../../utils/logger')();
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const items = await listAllTableEntries('scraper-integration-table', 'website, brand')
        return res.status(200).send(items);
    } catch (err) {
        logger.error(err);
        res.status(400).send(err.message);
    }
});
  
module.exports = router;