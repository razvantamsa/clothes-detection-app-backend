const express = require('express');
const { getItemByPk } = require('../../../utils/aws/dynamodb');
const router = express.Router();

router.get('/:brand', async (req, res) => {
    const result = await getItemByPk('sneakers', 'brand', req.params.brand);
    res.status(200).send(result);
});
  
module.exports = router;