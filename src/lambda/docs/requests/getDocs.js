const express = require('express');
const router = express.Router();
const { S3 } = require('../../../utils/aws/clients');

const { S3_DOCS_BUCKET } = process.env;

router.get('/', async (req, res) => {
    try {
        const params = {
            Bucket: S3_DOCS_BUCKET,
            Key: 'openapi.html',
        };
        const data = await S3.getObject(params).promise();

        const htmlContent = data.Body.toString('utf-8');
        return res
            .status(200)
            .header('Content-Type', 'text/html')
            .send(htmlContent);

    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});
  
module.exports = router;