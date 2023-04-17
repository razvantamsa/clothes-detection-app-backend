const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

const createSneaker = require('./requests/createSneaker');
const listSneakerBrands = require('./requests/listSneakerBrands');
const listSneakersByBrand = require('./requests/listSneakersByBrand');
const getOneSneaker = require('./requests/getOneSneaker');
const updateOneSneaker = require('./requests/updateOneSneaker');
const deleteOneSneaker = require('./requests/deleteOneSneaker');

app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.json());

// Define route handlers
app.use('/sneakers', 
    createSneaker, 
    listSneakerBrands,
    listSneakersByBrand,
    getOneSneaker,
    updateOneSneaker, 
    deleteOneSneaker
);

module.exports.handler = serverless(app);