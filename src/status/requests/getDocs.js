const express = require('express');
const fs = require('fs');
const { getItem, headItem } = require('../../utils/aws/s3');
const router = express.Router();

const { S3_ASSETS_BUCKET } = process.env;
const DOCS_FILE_PATH = '/tmp/openapi.html', DOCS_FILE_NAME = 'openapi.html';

let lastModified = '';

async function mountDocsLocally(data) {
    await new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(DOCS_FILE_PATH);
        fileStream.write(data.Body);
        fileStream.end();
      });
}

async function getDocumentation() {
    const fileData = await headItem(S3_ASSETS_BUCKET, DOCS_FILE_NAME);
    const unixTimestamp = new Date(fileData.LastModified).getTime() / 1000;
    
    const fileExists = fs.existsSync(DOCS_FILE_PATH);

    if(unixTimestamp !== lastModified || !fileExists) {
        lastModified = unixTimestamp;
        downloadToggle = true;

        const data = await getItem(S3_ASSETS_BUCKET, DOCS_FILE_NAME);
        mountDocsLocally(data);
        return data.Body.toString('utf-8');
    }

    return fs.readFileSync(DOCS_FILE_PATH);

}


router.get('/', async (req, res) => {
    try {
        const htmlContent = await getDocumentation()
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