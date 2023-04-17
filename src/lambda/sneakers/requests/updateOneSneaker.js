const express = require('express');
const { updateItem } = require('../../../utils/aws/dynamodb');
const router = express.Router();

router.put('/:brand/:model', async (req, res) => {
    try {
        const result = await updateItem('sneakers', req.params, req.body);
        res.status(200).send(result);
    } catch (err) {
        res.status(400).send(err);
    }});
  
module.exports = router;