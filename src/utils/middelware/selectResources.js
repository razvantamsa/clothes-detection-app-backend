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

module.exports = { selectResources };