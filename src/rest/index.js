const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const app = express();

const create = require('./requests/create');
const getOne = require('./requests/getOne');
const update = require('./requests/update');
const deleteOne = require('./requests/delete');
const listModels = require('./requests/listModels');
const listBrands = require('./requests/listBrands');
const { authorizerMiddleware } = require('../utils/authorizer/authorizer');
const { verifyTypeHeader } = require('../utils/middelware/verifyTypeHeader');

app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());
app.use(authorizerMiddleware, verifyTypeHeader);

app.use('/api', 
    create,
    update,
    deleteOne,
    getOne,
    listModels,
    listBrands,
);

if(process.env.ENVIRONMENT === 'local'){
    app.listen(process.env.REST_API_PORT, () => {
        console.log(`Rest API listening on ${process.env.REST_API_PORT}`)
    });
}

module.exports.handler = serverless(app);