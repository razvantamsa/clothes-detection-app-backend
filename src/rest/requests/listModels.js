const express = require('express');
const router = express.Router();
const { getItemByPk: getDynamoDBByPK } = require('../../utils/aws/dynamodb');

router.get('/:brand', async (req, res) => {
    const { DYNAMODB_TABLE } = process.env;
    const { brand } = req.params;

    try {
        const entries = await getDynamoDBByPK(DYNAMODB_TABLE, { brand });
        res.status(200).send(entries);
    } catch (err) {
        console.error(err);
        res.status(400).send(err.message);
    }
});
  
module.exports = router;