const {
    DYNAMODB_SHIRTS_TABLE,
    S3_SHIRTS_BUCKET,
    DYNAMODB_TROUSERS_TABLE,
    S3_TROUSERS_BUCKET,
    DYNAMODB_SHOES_TABLE,
    S3_SHOES_BUCKET,
} = process.env;

async function verifyTypeHeader (req, res, next) {
    const type = req.headers.type;
    const errorMessage = 'Type not supported; must be one of /shirts/trousers/shoes'
    if(!['shirts', 'trousers', 'shoes'].includes(type)) {
        return res.status(400).send(errorMessage);
    }
    switch(type) {
        case 'shirts':
            process.env.DYNAMODB_TABLE = DYNAMODB_SHIRTS_TABLE;
            process.env.S3_BUCKET = S3_SHIRTS_BUCKET;
            return next();
        case 'trousers':
            process.env.DYNAMODB_TABLE = DYNAMODB_TROUSERS_TABLE;
            process.env.S3_BUCKET = S3_TROUSERS_BUCKET;
            return next();
        case 'shoes':
            process.env.DYNAMODB_TABLE = DYNAMODB_SHOES_TABLE;
            process.env.S3_BUCKET = S3_SHOES_BUCKET;
            return next();
        default: 
            return res.status(400).send(errorMessage);
    }
}

module.exports = { verifyTypeHeader };