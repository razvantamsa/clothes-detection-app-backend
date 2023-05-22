const express = require('express');
const { getItemByPk: getDynamoDBByPK } = require('../../../utils/aws/dynamodb');
const { getSignedUrl: getS3 } = require('../../../utils/aws/s3');
const router = express.Router();

const { DYNAMODB_SNEAKERS_TABLE, S3_SNEAKERS_BUCKET } = process.env;

router.get('/:brand', async (req, res) => {
    try {
        const entries = await getDynamoDBByPK(DYNAMODB_SNEAKERS_TABLE, 'brand', req.params.brand);
        
        const files = ['pic1', 'pic2', 'pic3', 'pic4'];
        for(const [index, entry] of entries.entries()) {
            console.log(index, entry);
            entries[index].files = [];
            for(const file of files) {
                const key = `${entry.brand}/${entry.model}/${file}`;
                const result = await getS3(S3_SNEAKERS_BUCKET, key);
                entries[index].files.push(result);
            }
        }

        res.status(200).send(entries);
    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
});
  
module.exports = router;