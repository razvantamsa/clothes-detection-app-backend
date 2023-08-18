const express = require('express');
const { deleteItem } = require('../../utils/aws/dynamodb');
const router = express.Router();
const { authorizerMiddleware } = require('../../utils/authorizer/authorizer');

const { APP_DYNAMODB_INTEGRATIONS_TABLE } = process.env;

router.delete('/integration', authorizerMiddleware, async (req, res) => {
    try {
        await deleteItem(APP_DYNAMODB_INTEGRATIONS_TABLE, req.body);
        return res.status(200).send(req.body);
    } catch (err) {
        console.error(err);
        res.status(400).send(err.message);
    }
});
  
module.exports = router;