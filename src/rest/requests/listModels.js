const express = require('express');
const router = express.Router();
const { getItemByPk: getDynamoDBByPK } = require('../../utils/aws/dynamodb');

router.get('/:brand', async (req, res) => {
    const { DYNAMODB_TABLE } = process.env;

    try {
        const entries = await getDynamoDBByPK(DYNAMODB_TABLE, 'brand', req.params.brand);
        res.status(200).send(entries);
    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
});
  
module.exports = router;