const express = require('express');
const router = express.Router();

// workflow:
/**
 * check if image exists in dynamodb
 * return status: /processed + relevant data / to be processed
 */

router.get('/', async (req, res) => {
    try {
        res.status(200).send('ok');
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});
  
module.exports = router;