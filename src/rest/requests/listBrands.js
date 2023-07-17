const express = require('express');
const { listItemsFromPath } = require('../../utils/aws/s3');
const logger = require('../../utils/logger')();
const router = express.Router();

router.get('/', async (req, res) => {
    const { S3_BUCKET } = process.env;

    try {
        const data = await listItemsFromPath(S3_BUCKET, '');
        const brands = new Set();

        data.Contents.forEach(entry => {
            const brand = entry.Key.split('/')[0];
            brands.add(brand);
        });

        res.status(200).send([...brands]);
    } catch (err) {
        logger.error(err);
        res.status(400).send(err.message);
    }
});
  
module.exports = router;