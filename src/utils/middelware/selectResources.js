function selectResources(type) {
    const {
        DYNAMODB_SHIRTS_TABLE, S3_SHIRTS_BUCKET,
        DYNAMODB_TROUSERS_TABLE, S3_TROUSERS_BUCKET,
        DYNAMODB_SHOES_TABLE, S3_SHOES_BUCKET,
    } = process.env;
    
    switch(type) {
        case 'shirts':
            return [DYNAMODB_SHIRTS_TABLE, S3_SHIRTS_BUCKET];
        case 'trousers':
            return [DYNAMODB_TROUSERS_TABLE, S3_TROUSERS_BUCKET];
        case 'shoes':
            return [DYNAMODB_SHOES_TABLE, S3_SHOES_BUCKET];
        default:
            return []
    }
}

module.exports = { selectResources };