const express = require('express');
const router = express.Router();
const { getItem: getDynamoDB, queryTableByGSI } = require('../../utils/aws/dynamodb');
const { getSignedUrl } = require('../../utils/aws/s3');

// workflow:
/**
 * check if image exists in dynamodb
 * return status: /processed + relevant data / to be processed
 */

const { DYNAMODB_SCAN_TABLE, S3_SCAN_BUCKET, SCAN_TABLE_GSI_NAME } = process.env;

router.get('/:dataId', async (req, res) => {
    try {
        const { dataId } = req.params;
        const userName = req.headers.user;

        const scanResult = await getDynamoDB(DYNAMODB_SCAN_TABLE, { dataId, userName });

        if(scanResult.status !== 'unprocessed') {
            // scan for children
            const children = await queryTableByGSI(
                DYNAMODB_SCAN_TABLE,
                SCAN_TABLE_GSI_NAME,
                { userName: dataId }
            );

            scanResult.children = children.map(child => child.dataId);
        
            // scan for parent
            // use scan
        }

        const image = await getSignedUrl(S3_SCAN_BUCKET, dataId);

        res.status(200).send({ scanResult, image });
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});
  
module.exports = router;