const express = require('express');
const router = express.Router();
const { updateItem: updateDynamoDB } = require('../../utils/aws/dynamodb');
const { postItem: postS3 } = require('../../utils/aws/s3');

async function updateFiles(S3_BUCKET, files, brand, model) {
    if(!files) { return [] };

    const images = [];
    for(const [key, value] of Object.entries(files)) {
        const result = await postS3(
            S3_BUCKET, 
            `${brand}/${model}/${key}`, 
            value.data,
            value.data.length,
            "image/jpeg"
        );
        images.push(result.ETag);
    }

    return images;
}

router.put('/:brand/:model', async (req, res) => {
    const { DYNAMODB_TABLE, S3_BUCKET } = process.env;

    try {
        const { brand, model } = req.params;
        const images = await updateFiles(S3_BUCKET, req.files, brand, model);

        await updateDynamoDB(DYNAMODB_TABLE, req.params, req.body);
        res.status(200).send({ data: req.body, images });
    } catch (err) {
        console.error(err);
        res.status(400).send(err.message);
    }
});
  
module.exports = router;