const express = require('express');
const { deleteItem } = require('../../../utils/aws/dynamodb');
const router = express.Router();

const { DYNAMODB_SNEAKERS_TABLE } = process.env;

router.delete('/:brand/:model', async (req, res) => {
    await deleteItem(DYNAMODB_SNEAKERS_TABLE, req.params);
    res.status(200).send(`Successfully deleted ${req.params.brand} ${req.params.model}`);
});
  
module.exports = router;