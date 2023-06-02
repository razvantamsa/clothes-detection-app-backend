const express = require('express');
const router = express.Router();

// workflow:
/**
 * get image from request and upload to s3 - to be processed
 * trigger processing lambda for s3 image
 */

router.post('/', async (req, res) => {
    try {
        res.status(200).send('ok');
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});
  
module.exports = router;