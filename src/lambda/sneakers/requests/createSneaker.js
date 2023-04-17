const express = require('express');
const router = express.Router();
const { postItem } = require('../../../utils/aws/dynamodb');

router.post('/', async (req, res) => {
    await postItem('sneakers', req.body);
    res.status(200).send(`Posted one sneaker: ${JSON.stringify(req.body)}`);
});
  
module.exports = router;