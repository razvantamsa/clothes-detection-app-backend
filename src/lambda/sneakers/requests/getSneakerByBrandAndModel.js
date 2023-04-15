const express = require('express');
const { getItem } = require('../../../utils/aws/dynamodb');
const router = express.Router();

router.get('/:brand/:model', async (req, res) => {
    try {
        const result = await getItem('sneakers', req.params);
        res.status(200).send(result);
    } catch (err) {
        res.status(400).send(err);
    }

});
  
module.exports = router;