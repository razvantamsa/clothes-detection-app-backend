const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const app = express();

const getStatus = require('./requests/getStatus');
const getDocs = require('./requests/getDocs');
const postDocs = require('./requests/postDocs');

app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());

app.use('/healthcheck', getStatus);
app.use('/docs', getDocs, postDocs);

if(process.env.ENVIRONMENT === 'local'){
    app.listen(process.env.STATUS_API_PORT, () => {
        console.log(`Status API listening on ${process.env.STATUS_API_PORT}`)
    });
}

module.exports.handler = serverless(app);