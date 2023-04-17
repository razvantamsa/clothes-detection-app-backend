const express = require('express');
const { deleteItem } = require('../../../utils/aws/dynamodb');
const router = express.Router();

router.delete('/:brand/:model', async (req, res) => {
    await deleteItem('sneakers', req.params);
    res.status(200).send(`Successfully deleted ${req.params.brand} ${req.params.model}`);
});
  
module.exports = router;