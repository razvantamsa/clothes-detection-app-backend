const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    res.status(200).send('Post one sneaker');
});
  
module.exports = router;