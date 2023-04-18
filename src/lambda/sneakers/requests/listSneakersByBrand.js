const express = require('express');
const { getItemByPk } = require('../../../utils/aws/dynamodb');
const router = express.Router();

const { DYNAMODB_SNEAKERS_TABLE } = process.env;

router.get('/:brand', async (req, res) => {
    try {
        const result = await getItemByPk(DYNAMODB_SNEAKERS_TABLE, 'brand', req.params.brand);
        res.status(200).send(result);
    } catch (err) {
        res.status(400).send(err);
    }
});
  
module.exports = router;