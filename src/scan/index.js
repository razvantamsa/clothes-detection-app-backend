const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const { authorizerMiddleware } = require('../utils/authorizer/authorizer');

const app = express();

const startScan = require('./requests/startScan');
const getScanResult = require('./requests/getScanResult');
const getScansByUser = require('./requests/getScansByUser');

app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());
app.use(authorizerMiddleware);

app.use('/scan', startScan, getScanResult, getScansByUser);

if(process.env.ENVIRONMENT === 'local'){
    app.listen(process.env.SCAN_API_PORT, () => {
        console.log(`Scan API listening on ${process.env.SCAN_API_PORT}`)
    });
}

module.exports.handler = serverless(app);