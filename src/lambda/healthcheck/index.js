const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const morgan = require('morgan');

const app = express();

const getStatus = require('./requests/getStatus');

app.use(cors());
app.use(morgan('combined'));
app.use('/healthcheck', getStatus);

module.exports.handler = serverless(app);