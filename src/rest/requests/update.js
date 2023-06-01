const express = require('express');
const router = express.Router();
const { updateItem: updateDynamoDB } = require('../../utils/aws/dynamodb');
const { postItem: postS3 } = require('../../utils/aws/s3');

router.put('/:brand/:model', async (req, res) => {
    const { DYNAMODB_TABLE, S3_BUCKET } = process.env;

    try {
        const { brand, model } = req.params;
        const images = [];

        for(const [key, value] of Object.entries(req.files)) {
            const result = await postS3(
                S3_BUCKET, 
                `${brand}/${model}/${key}`, 
                value.data,
                value.data.length,
                "image/jpeg"
            );
            images.push(result.ETag);
        }

        await updateDynamoDB(DYNAMODB_TABLE, req.params, req.body);
        res.status(200).send({ data: req.body, images });
    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
});
  
module.exports = router;