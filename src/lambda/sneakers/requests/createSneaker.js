const express = require('express');
const parser = require('lambda-multipart-parser');
const router = express.Router();
const { postItem: postDynamoDB } = require('../../../utils/aws/dynamodb');
const { postItem: postS3 } = require('../../../utils/aws/s3');

const DYNAMODB_SNEAKERS_TABLE = 'sneakers';
const S3_BUCKET_NAME = 'sneakers-bucket';

router.post('/', async (req, res) => {
    const { files, ...body} = await parser.parse(req);
    body.files = [];

    for(const file of files) {
        const key = `${body.brand}/${body.model}/${file.filename}`;
        const s3Body = file.content;
        const contentLength = file.content.length;
        const result = await postS3(
            S3_BUCKET_NAME, 
            key, 
            s3Body, 
            contentLength);
        body.files.push(result.ETag);
    }

    await postDynamoDB(DYNAMODB_SNEAKERS_TABLE, body);

    res.status(200).send(JSON.stringify(body));
});

module.exports = router;