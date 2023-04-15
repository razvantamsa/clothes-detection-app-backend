const express = require('express');
const router = express.Router();

router.get('/:brand', (req, res) => {
    // await postItem('sneakers', req.body);
    res.status(200).send(`Posted one sneaker: ${JSON.stringify(req.body)}`);
});
  
module.exports = router;