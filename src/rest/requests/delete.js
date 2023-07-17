const express = require('express');
const router = express.Router();
const { deleteItem: deleteDynamoDB } = require('../../utils/aws/dynamodb');
const { deleteItem: deleteS3, listItemsFromPath } = require('../../utils/aws/s3');

router.delete('/:brand/:model', async (req, res) => {
    const { DYNAMODB_TABLE, S3_BUCKET } = process.env;

    try {
        const { brand, model } = req.params;
        const data = await listItemsFromPath(S3_BUCKET, `${brand}/${model}/`);
        
        if(!data.Contents.length) {
            return res.status(404).send('Item not found');
        }
        
        const imagesToBeDeleted = data.Contents.map((entry) => deleteS3(S3_BUCKET, entry.Key));
        
        await Promise.all(imagesToBeDeleted);
        await deleteDynamoDB(DYNAMODB_TABLE, req.params);
        
        res.status(200).send(`Successfully deleted ${req.params.brand} ${req.params.model}`);
    } catch (err) {
        logger.error(err);
        res.status(400).send(err.message);
    }
});
  
module.exports = router;