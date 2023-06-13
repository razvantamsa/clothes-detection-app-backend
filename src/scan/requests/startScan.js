const express = require('express');
const { calculateImageHash } = require('../../utils/authorizer/hashCode');
const { postItem: postS3 } = require('../../utils/aws/s3');
const { postItem: postDynamoDB } = require('../../utils/aws/dynamodb');
const { invokeAsyncFunction } = require('../../utils/aws/lambda');
const router = express.Router();

// workflow:
/**
 * get image from request and upload to s3 - to be processed
 * trigger processing lambda for s3 image
 */

const { DYNAMODB_SCAN_TABLE, S3_SCAN_BUCKET } = process.env;

router.post('/', async (req, res) => {
    try {

        const userName = req.headers.user;
        const file = req.files.image;

        const dataId = calculateImageHash(file.data);

        await postS3(
            S3_SCAN_BUCKET, 
            dataId, 
            file.data,
            file.data.length,
            "image/jpeg"
        );

        await postDynamoDB(DYNAMODB_SCAN_TABLE, { 
            dataId, 
            userName, 
            status: 'unprocessed',
            fileName: file.name
        });

        await invokeAsyncFunction(
            'clothes-detection-scan-dev-extractFeatures',
            { dataId, userName },
        );

        return res.status(200).send({ dataId });

    } catch (err) {
        console.log(err);
        return res.status(400).send(err.message);
    }
});
  
module.exports = router;