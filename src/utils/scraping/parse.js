function getStackName(functionName) {
    const splitName = functionName.split('-');
    splitName.pop();
    return splitName.join('-');
}

function getEnvironmentVariables(logGroupName) {
    const envVars = { APP_LOG_GROUP_NAME: logGroupName };
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const time = currentDate.toISOString().split('T')[1].replace(/\..+/, '');
    envVars.APP_LOG_STREAM_NAME = `${year}/${month}/${day}/[$LATEST]${time}`;

    return Object.entries(process.env)
        .filter(([key, value]) => key.startsWith('APP_'))
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), envVars);
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