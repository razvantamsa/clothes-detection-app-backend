const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const morgan = require('morgan');

const app = express();

// Enable CORS
app.use(cors());
app.use(morgan('combined'));

// Define route handlers

// GET all sneakers
app.get('/sneakers/', (req, res) => {
  res.status(200).send('Get all sneakers');
});

// POST all sneakers
app.post('/sneakers/', (req, res) => {
    res.status(200).send('Post one sneaker');
});

// GET one sneaker
app.get('/sneakers/:sneakerId', (req, res) => {
    res.status(200).send(`Get a sneaker with sneakerId: ${req.params.sneakerId}`);
});

// PUT one sneaker
app.put('/sneakers/:sneakerId', (req, res) => {
    res.status(200).send(`Update a sneaker with sneakerId: ${req.params.sneakerId}`);
});

// DELETE one sneaker
app.delete('/sneakers/:sneakerId', (req, res) => {
    res.status(200).send(`Delete a sneaker with sneakerId: ${req.params.sneakerId}`);
});


module.exports.handler = serverless(app);