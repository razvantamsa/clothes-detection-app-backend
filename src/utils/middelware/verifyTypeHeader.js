function selectResources(type) {
    const {
        APP_DYNAMODB_SHIRTS_TABLE, APP_S3_SHIRTS_BUCKET,
        APP_DYNAMODB_TROUSERS_TABLE, APP_S3_TROUSERS_BUCKET,
        APP_DYNAMODB_SHOES_TABLE, APP_S3_SHOES_BUCKET,
    } = process.env;
    
    switch(type) {
        case 'shirts':
            return [APP_DYNAMODB_SHIRTS_TABLE, APP_S3_SHIRTS_BUCKET];
        case 'trousers':
            return [APP_DYNAMODB_TROUSERS_TABLE, APP_S3_TROUSERS_BUCKET];
        case 'shoes':
            return [APP_DYNAMODB_SHOES_TABLE, APP_S3_SHOES_BUCKET];
        default:
            return []
    }
}

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

module.exports = { verifyTypeHeader, selectResources };