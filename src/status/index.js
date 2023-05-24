const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const morgan = require('morgan');

const app = express();

const getStatus = require('./requests/getStatus');
const getDocs = require('./requests/getDocs');

app.use(cors());
app.use(morgan('combined'));
app.use('/healthcheck', getStatus);
app.use('/docs', getDocs);

if(process.env.ENVIRONMENT === 'local'){
    app.listen(process.env.STATUS_API_PORT, () => {
        console.log(`Status API listening on ${process.env.STATUS_API_PORT}`)
    });
}

module.exports.handler = serverless(app);