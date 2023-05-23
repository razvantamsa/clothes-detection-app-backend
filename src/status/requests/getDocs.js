const express = require('express');
const { getItem } = require('../../utils/aws/s3');
const router = express.Router();

const { S3_DOCS_BUCKET } = process.env;

router.get('/', async (req, res) => {
    try {
        const data = await getItem(S3_DOCS_BUCKET, 'openapi.html');
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