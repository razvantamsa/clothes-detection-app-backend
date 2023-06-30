function getStackName(functionName) {
    const splitName = functionName.split('-');
    splitName.pop();
    return splitName.join('-');
}

function getEnvironmentVariables(logGroupName) {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const time = currentDate.toISOString().split('T')[1].replace(/\..+/, '');
    const logStreamName = `${year}/${month}/${day}/[$LATEST]${time}`;

    return {
        DYNAMODB_SHIRTS_TABLE: process.env.DYNAMODB_SHIRTS_TABLE,
        S3_SHIRTS_BUCKET: process.env.S3_SHIRTS_BUCKET,
        DYNAMODB_TROUSERS_TABLE: process.env.DYNAMODB_TROUSERS_TABLE,
        S3_TROUSERS_BUCKET: process.env.S3_TROUSERS_BUCKET,
        DYNAMODB_SHOES_TABLE: process.env.DYNAMODB_SHOES_TABLE,
        S3_SHOES_BUCKET: process.env.S3_SHOES_BUCKET,
        MAX_PRODUCT_LIMIT: process.env.MAX_PRODUCT_LIMIT,
        PRODUCT_RATE_LIMIT:process.env.PRODUCT_RATE_LIMIT,
        LOG_GROUP_NAME: logGroupName,
        LOG_STREAM_NAME: logStreamName
    }
}

function getBaseImageUri(accountId) {
    const { AWS_LAMBDA_FUNCTION_NAME, AWS_REGION } = process.env;
    const stackName = getStackName(AWS_LAMBDA_FUNCTION_NAME);
    return `${accountId}.dkr.ecr.${AWS_REGION}.amazonaws.com/serverless-${stackName}:base-image`;
}

function getLambdaRole(accountId) {
    const { AWS_LAMBDA_FUNCTION_NAME, AWS_REGION } = process.env;
    const stackName = getStackName(AWS_LAMBDA_FUNCTION_NAME);
    return `arn:aws:iam::${accountId}:role/${stackName}-${AWS_REGION}-lambdaRole`
}

module.exports = { 
    getEnvironmentVariables,
    getBaseImageUri,
    getLambdaRole
 };