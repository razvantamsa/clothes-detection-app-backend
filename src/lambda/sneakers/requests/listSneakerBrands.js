const express = require('express');
const { getAttributeSet } = require('../../../utils/aws/dynamodb');
const router = express.Router();

const { DYNAMODB_SNEAKERS_TABLE } = process.env;

router.get('/', async (req, res) => {
    try {
        const result = await getAttributeSet(DYNAMODB_SNEAKERS_TABLE, 'brand');
        res.status(200).send(result);
    } catch (err) {
        res.status(400).send(err);
}});
  
module.exports = router;