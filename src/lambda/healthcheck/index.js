const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');

const app = express();

// Enable CORS
app.use(cors());

// Define route handlers
app.get('/healthcheck', (req, res) => {
  res.status(200).send('Sneaker API Running!');
});

module.exports.handler = serverless(app);