const express = require('express');
const { postItem } = require('../../utils/aws/s3');
const { authorizerMiddleware } = require('../../utils/authorizer/authorizer');
const router = express.Router();


const { APP_S3_ASSETS_BUCKET } = process.env;

router.post('/', authorizerMiddleware, async (req, res) => {
    try {
        const file = req.files.docs;
        await postItem(
            APP_S3_ASSETS_BUCKET,
            file.name,
            file.data,
            file.data.length,
            "text/html"
        );
            
        return res.status(200).send('updated');
    } catch (err) {
        console.error(err);
        res.status(400).send(err.message);
    }
});
  
module.exports = router;