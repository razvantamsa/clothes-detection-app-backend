const express = require('express');
const router = express.Router();
const { getItem: getDynamoDB, queryTableByGSI, scanTableByHash, getItem } = require('../../utils/aws/dynamodb');
const { getSignedUrl } = require('../../utils/aws/s3');
const { selectResources } = require('../../utils/middelware/selectResources');

// workflow:
/**
 * check if image exists in dynamodb
 * return status: /processed + relevant data / to be processed
 */

const { DYNAMODB_SCAN_TABLE, S3_SCAN_BUCKET, SCAN_TABLE_GSI_NAME } = process.env;

async function getChildren (dataId) {
    const children = await queryTableByGSI(
        DYNAMODB_SCAN_TABLE,
        SCAN_TABLE_GSI_NAME,
        { userName: dataId }
    );

    if(children.length){ 
        return children.map(child => ({ dataId: child.dataId, type: child.type, status: child.status }))
    }
    return undefined;
}

async function getParent (userName) {
    const parents = await scanTableByHash(
        DYNAMODB_SCAN_TABLE,
        { dataId: userName }
    );
    
    return parents[0];
}


router.get('/:dataId', async (req, res) => {
    try {
        const { dataId } = req.params;
        const userName = req.headers.user;

        const scanResult = await getDynamoDB(DYNAMODB_SCAN_TABLE, { dataId, userName });

        if(scanResult.status !== 'unprocessed') {
            // scan for children
            scanResult.children = await getChildren(dataId);

            // scan for parent
            scanResult.parent = await getParent(userName);
        }

        const image = await getSignedUrl(S3_SCAN_BUCKET, dataId);

        if(!!scanResult.parent && scanResult.brand && scanResult.model) {
            const [DYNAMODB_TABLE, S3_BUCKET] = selectResources(scanResult.type);
            scanResult.data = await getDynamoDB(
                DYNAMODB_TABLE,
                { brand: scanResult.brand, model: scanResult.model }
                );
            scanResult.brand = undefined; 
            scanResult.model = undefined;
        }

        res.status(200).send({ scanResult, image });
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});
  
module.exports = router;