const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const app = express();

const scrapeUrl = require('./requests/scrapeUrl');

app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());

app.use('/scrape',
    scrapeUrl
);

module.exports.handler = serverless(app);