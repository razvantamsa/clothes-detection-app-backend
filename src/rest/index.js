const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const app = express();

const create = require('./requests/create');
const { authorizerMiddleware } = require('../utils/authorizer/authorizer');
const { verifyTypeHeader } = require('../utils/middelware/verifyTypeHeader');
// const listSneakerBrands = require('./requests/listSneakerBrands');
// const listSneakersByBrand = require('./requests/listSneakersByBrand');
// const getOneSneaker = require('./requests/getOneSneaker');
// const updateOneSneaker = require('./requests/updateOneSneaker');
// const deleteOneSneaker = require('./requests/deleteOneSneaker');

app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());
app.use(authorizerMiddleware, verifyTypeHeader);

// Define route handlers
app.use('/api', 
    create, 
//     listSneakerBrands,
//     listSneakersByBrand,
//     getOneSneaker,
//     updateOneSneaker, 
//     deleteOneSneaker
);

if(process.env.ENVIRONMENT === 'local'){
    app.listen(process.env.SNEAKERS_API_PORT, () => {
        console.log(`Rest API listening on ${process.env.SNEAKERS_API_PORT}`)
    });
}

module.exports.handler = serverless(app);