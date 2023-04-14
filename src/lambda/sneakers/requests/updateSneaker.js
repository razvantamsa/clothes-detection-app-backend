const express = require('express');
const router = express.Router();

router.put('/:sneakerId', (req, res) => {
    res.status(200).send(`Update a sneaker with sneakerId: ${req.params.sneakerId}`);
});
  
module.exports = router;