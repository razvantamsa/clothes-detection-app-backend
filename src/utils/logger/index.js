const cloudwatch = require("../aws/cloudwatch");

async function log (message) {
    const logGroupName = process.env.APP_LOG_GROUP_NAME || process.env.AWS_LOG_GROUP_NAME; 
    const logStreamName = process.env.APP_LOG_STREAM_NAME || process.env.AWS_LOG_STREAM_NAME;
    await cloudwatch.logToCloudWatch(message, logGroupName, logStreamName);

    const logGroupExists = await cloudwatch.checkLogGroupExists(logGroupName);
    if(!logGroupExists) {
        await cloudwatch.createLogGroup(logGroupName);
    }

    const logStreamExists = await cloudwatch.checkLogStreamExists(logGroupName, logStreamName);
    if(!logStreamExists) {
        await cloudwatch.createLogStream(logGroupName, logStreamName);
    }

    await cloudwatch.logToCloudWatch(message, logGroupName, logStreamName);
}

module.exports = { log }; 