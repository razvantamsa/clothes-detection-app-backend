const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');

const app = express();

// Enable CORS
app.use(cors());

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
app.get('/sneakers/:id', (req, res) => {
    res.status(200).send(`Get a sneaker with id: ${req.params.id}`);
});

// PUT one sneaker
app.put('/sneakers/:id', (req, res) => {
    res.status(200).send(`Update a sneaker with id: ${req.params.id}`);
});

// DELETE one sneaker
app.delete('/sneakers/:id', (req, res) => {
    res.status(200).send(`Delete a sneaker with id: ${req.params.id}`);
});


module.exports.handler = serverless(app);