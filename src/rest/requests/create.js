const express = require('express');
const router = express.Router();
const { postItem: postDynamoDB } = require('../../utils/aws/dynamodb');
const { postItem: postS3 } = require('../../utils/aws/s3');

router.post('/', async (req, res) => {
    const { DYNAMODB_TABLE, S3_BUCKET } = process.env;
    try {
        const { brand, model } = req.body;
        const files = Object.values(req.files);
        
        const images = [];
        
        for(const [index, file] of files.entries()) {
            const result = await postS3(
                S3_BUCKET, 
                `${brand}/${model}/pic${index+1}`, 
                file.data,
                file.data.length,
                "image/jpeg"
            );
            images.push(result.ETag);
        }
            
        await postDynamoDB(DYNAMODB_TABLE, req.body);
        return res.status(200).send({ data: req.body, images });
    } catch (err) {
        console.error(err);
        return res.status(400).send(err.message);
    }
});

module.exports = router;