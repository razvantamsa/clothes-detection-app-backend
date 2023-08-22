const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const start = require('./requests/start');
const getIntegrations = require('./requests/getIntegrations');
const addIntegration = require('./requests/addIntegration');
const deleteIntegration = require('./requests/deleteIntegration');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());

app.use('/scraper',
    start,
    addIntegration,
    getIntegrations,
    deleteIntegration
);

if(process.env.ENVIRONMENT === 'local'){
    app.listen(process.env.SCRAPER_API_PORT, () => {
        console.log(`Web Scraper API listening on ${process.env.SCRAPER_API_PORT}`)
    });
}


module.exports.handler = serverless(app);