const express = require('express');
const { getItem: getDynamoDB } = require('../../../utils/aws/dynamodb');
const { getItem: getS3 } = require('../../../utils/aws/s3');
const router = express.Router();

const { DYNAMODB_SNEAKERS_TABLE, S3_SNEAKERS_BUCKET } = process.env;

router.get('/:brand/:model', async (req, res) => {
    try {
        const { brand, model } = req.params;
        const uploadedFiles = [];

        const files = ['pic1', 'pic2', 'pic3', 'pic4'];
        for(const file of files) {
            const key = `${brand}/${model}/${file}`;
            const result = await getS3(S3_SNEAKERS_BUCKET, key);
            uploadedFiles.push(result);
        }

        const body = await getDynamoDB(DYNAMODB_SNEAKERS_TABLE, req.params);
        res.status(200).send({ body, uploadedFiles });
    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
});
  
module.exports = router;