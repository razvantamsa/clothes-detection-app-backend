const express = require('express');
const { getAttributeSet } = require('../../../utils/aws/dynamodb');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const result = await getAttributeSet('sneakers', 'brand');
        res.status(200).send(result);
    } catch (err) {
        res.status(400).send(err);
}});
  
module.exports = router;