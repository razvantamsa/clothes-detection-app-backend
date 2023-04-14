const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const morgan = require('morgan');

const app = express();

const getAllSneakers = require('./requests/getAllSneakers');
const getSneaker = require('./requests/getSneaker');
const postSneaker = require('./requests/postSneaker');
const updateSneaker = require('./requests/updateSneaker');
const deleteSneaker = require('./requests/deleteSneaker');

app.use(cors());
app.use(morgan('combined'));

// Define route handlers
app.use('/sneakers', 
    getAllSneakers, 
    getSneaker, 
    postSneaker, 
    updateSneaker, 
    deleteSneaker
);

module.exports.handler = serverless(app);