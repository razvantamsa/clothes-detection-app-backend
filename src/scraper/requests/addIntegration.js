const express = require('express');
const { postItem } = require('../../utils/aws/dynamodb');
const logger = require('../../utils/logger')();
const router = express.Router();

const { APP_DYNAMODB_INTEGRATIONS_TABLE } = process.env;

router.post('/integration', async (req, res) => {
    console.log('integrasion');
    try {
        await postItem(APP_DYNAMODB_INTEGRATIONS_TABLE, req.body);
        return res.status(200).send('ok');
    } catch (err) {
        logger.error(err);
        res.status(400).send(err.message);
    }
});
  
module.exports = router;