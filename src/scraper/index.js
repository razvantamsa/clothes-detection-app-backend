const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const startScrapingProcess = require('./requests/startScrapingProcess');
const { authorizerMiddleware } = require('../utils/authorizer/authorizer');
const { verifyTypeHeader } = require('../utils/middelware/verifyTypeHeader');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());
app.use(authorizerMiddleware, verifyTypeHeader);

app.use('/scrape',
    startScrapingProcess
);

if(process.env.ENVIRONMENT === 'local'){
    app.listen(process.env.SCRAPER_API_PORT, () => {
        console.log(`Web Scraper API listening on ${process.env.SCRAPER_API_PORT}`)
    });
}


module.exports.handler = serverless(app);