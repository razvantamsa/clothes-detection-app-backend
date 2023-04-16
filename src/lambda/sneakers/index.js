const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

const getAllSneakerBrands = require('./requests/getAllSneakerBrands');
const getSneakerByBrandAndModel = require('./requests/getSneakerByBrandAndModel');
const getSneakersByBrand = require('./requests/getSneakersByBrand');
const getSneaker = require('./requests/getSneakersByBrand');
const postSneaker = require('./requests/postSneaker');
const updateSneaker = require('./requests/updateSneaker');
const deleteSneaker = require('./requests/deleteSneaker');

app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.json());

// Define route handlers
app.use('/sneakers', 
    getAllSneakerBrands,
    getSneakerByBrandAndModel,
    getSneakersByBrand,
    getSneaker, 
    postSneaker, 
    updateSneaker, 
    deleteSneaker
);

module.exports.handler = serverless(app);