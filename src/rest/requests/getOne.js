const express = require('express');
const router = express.Router();
const { getItem: getDynamoDB } = require('../../utils/aws/dynamodb');
const { listItemsFromPath, getSignedUrl } = require('../../utils/aws/s3');

router.get('/:brand/:model', async (req, res) => {
    const { DYNAMODB_TABLE, S3_BUCKET } = process.env;

    try {
        const { brand, model } = req.params;
        const data = await listItemsFromPath(S3_BUCKET, `${brand}/${model}/`);
        const body = await getDynamoDB(DYNAMODB_TABLE, req.params);

        if(!body || !data.Contents.length ) {
            return res.status(404).send('Item not found');
        }

        const images = data.Contents.map((entry) => getSignedUrl(S3_BUCKET, entry.Key));

        return res.status(200).send({ data: body, images: await Promise.all(images) });
    } catch (err) {
        console.log(err);
        return res.status(400).send(err.message);
    }
});
  
module.exports = router;