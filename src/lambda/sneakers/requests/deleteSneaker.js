const express = require('express');
const router = express.Router();

router.delete('/:sneakerId', (req, res) => {
    res.status(200).send(`Delete a sneaker with sneakerId: ${req.params.sneakerId}`);
});
  
module.exports = router;