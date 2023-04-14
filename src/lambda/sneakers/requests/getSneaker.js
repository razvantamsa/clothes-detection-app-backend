const express = require('express');
const router = express.Router();

router.get('/:sneakerId', (req, res) => {
    res.status(200).send(`Get a sneaker with sneakerId: ${req.params.sneakerId}`);
});
  
module.exports = router;