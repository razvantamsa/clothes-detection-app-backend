const express = require('express');
const fs = require('fs');
const { getItem } = require('../../utils/aws/s3');
const router = express.Router();

const { S3_ASSETS_BUCKET } = process.env;

const DOCS_FILE_PATH = '/tmp/openapi.html', DOCS_FILE_NAME = 'openapi.html';

async function downloadDocs() {
    const data = await getItem(S3_ASSETS_BUCKET, DOCS_FILE_NAME);
    const fileStream = fs.createWriteStream(DOCS_FILE_PATH);
    fileStream.write(data.Body);
    fileStream.end();
}

router.get('/', async (req, res) => {
    try {
        const fileExists = fs.existsSync(DOCS_FILE_PATH);
        if(!fileExists) {
            await downloadDocs();
        }
        const htmlContent = fs.readFileSync(DOCS_FILE_PATH);
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