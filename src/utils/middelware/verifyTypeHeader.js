const { selectResources } = require("./selectResources");

async function verifyTypeHeader (req, res, next) {
    const type = req.headers.type;
    const errorMessage = 'Type not supported; must be one of /shirts/trousers/shoes'
    
    if(!['shirts', 'trousers', 'shoes'].includes(type)) {
        return res.status(400).send(errorMessage);
    }

    const [dynamo, s3] = selectResources(type);
    process.env.DYNAMODB_TABLE = dynamo;
    process.env.S3_BUCKET = s3;

    return next();
}

module.exports = { verifyTypeHeader };