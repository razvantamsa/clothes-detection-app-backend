const express = require('express');
const { postItem } = require('../../utils/aws/s3');
const { authorizerMiddleware } = require('../../utils/authorizer/authorizer');
const router = express.Router();

const { S3_DOCS_BUCKET } = process.env;

router.post('/', authorizerMiddleware, async (req, res) => {
    // try {
    //     const data = await getItem(S3_DOCS_BUCKET, 'openapi.html');
    //     const htmlContent = data.Body.toString('utf-8');
    //     return res
    //         .status(200)
    //         .header('Content-Type', 'text/html')
    //         .send(htmlContent);

    // } catch (err) {
    //     console.log(err);
    //     res.status(400).send(err);
    // }
    try {
        // const files = Object.entries(req.files)
        //     .map(([key, value]) => Object.assign(value, {name: key}));
    
        const file = req.files.docs;
        await postItem(
            S3_DOCS_BUCKET,
            file.name,
            file.data,
            file.data.length,
            "text/html"
        );
            
        return res.status(200).send('updated');
    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
});
  
module.exports = router;