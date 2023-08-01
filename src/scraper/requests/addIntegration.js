const express = require('express');
const { postItem } = require('../../utils/aws/dynamodb');
const logger = require('../../utils/logger')();
const router = express.Router();

router.post('/integration', async (req, res) => {
    console.log('integrasion');
    try {
        await postItem('scraper-integration-table', req.body);
        return res.status(200).send('ok');
    } catch (err) {
        logger.error(err);
        res.status(400).send(err.message);
    }
});
  
module.exports = router;