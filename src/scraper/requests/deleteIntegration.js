const express = require('express');
const { deleteItem } = require('../../utils/aws/dynamodb');
const logger = require('../../utils/logger')();
const router = express.Router();

const { APP_DYNAMODB_INTEGRATIONS_TABLE } = process.env;

router.delete('/integration', async (req, res) => {
    try {
        await deleteItem(APP_DYNAMODB_INTEGRATIONS_TABLE, req.body);
        return res.status(200).send(req.body);
    } catch (err) {
        logger.error(err);
        res.status(400).send(err.message);
    }
});
  
module.exports = router;