const express = require('express');
const { getItem } = require('../../../utils/aws/dynamodb');
const router = express.Router();

const { DYNAMODB_SNEAKERS_TABLE } = process.env;

router.get('/:brand/:model', async (req, res) => {
    try {
        const result = await getItem(DYNAMODB_SNEAKERS_TABLE, req.params);
        res.status(200).send(result);
    } catch (err) {
        res.status(400).send(err);
    }

});
  
module.exports = router;