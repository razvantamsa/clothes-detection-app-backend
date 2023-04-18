const express = require('express');
const router = express.Router();
const { postItem: postDynamoDB } = require('../../../utils/aws/dynamodb');
const { postItem: postS3 } = require('../../../utils/aws/s3');

const { DYNAMODB_SNEAKERS_TABLE, S3_BUCKET_NAME } = process.env;

router.post('/', async (req, res) => {
    try {
        const files = Object.entries(req.files)
            .map(([key, value]) => Object.assign(value, {name: key}));
    
        const { brand, model } = req.body;
        const updatedFiles = [];
    
        for(const file of files) {
            const result = await postS3(
                S3_BUCKET_NAME, 
                `${brand}/${model}/${file.name}`, 
                file.data,
                file.data.length);
            updatedFiles.push(result.ETag);
        }
    
        await postDynamoDB(DYNAMODB_SNEAKERS_TABLE, req.body);
        res.status(200).send({ body: req.body, updatedFiles });
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

module.exports = router;