require('dotenv').config({ path: 'src/utils/aws/credentials.env' });
const AWS = require('aws-sdk');

if (!process.env.AWS_EXECUTION_ENV) {
  AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  });
}

const cloudwatch = new AWS.CloudWatchLogs();

const createLogGroup = async (logGroupName) => {
    try {
        await cloudwatch.createLogGroup({ logGroupName }).promise();
    } catch (err) {
        throw new Error(err);
    }
}

const createLogStream = async (logGroupName, logStreamName) => {
    try {
        await cloudwatch.createLogStream({ logGroupName, logStreamName }).promise();
    } catch (err) {
        throw new Error(err);
    }
}

const logToCloudWatch = async (message, logGroupName, logStreamName) => {
    const params = {
      logGroupName,
      logStreamName,
      logEvents: [{ message, timestamp: new Date().getTime() }],
    };
  
    try {
      await cloudwatch.putLogEvents(params).promise();
    } catch (err) {
        throw new Error(err);
    }
};

const checkLogGroupExists = async (logGroupName) => {
    try {
        const params = {
          logGroupNamePrefix: logGroupName,
          limit: 1
        };
    
        const response = await cloudwatch.describeLogGroups(params).promise();
        const logGroups = response.logGroups;
        return logGroups.length > 0;
    } catch (err) {
        throw new Error(err);
    }
}

const checkLogStreamExists = async (logGroupName, logStreamName) => {
    try {
        const params = {
            logGroupName: logGroupName,
            logStreamNamePrefix: logStreamName,
            limit: 1
          };
      
        const response = await cloudwatch.describeLogStreams(params).promise();
        const logStreams = response.logStreams;
        return logStreams.length > 0;
    } catch (err) {
        throw new Error(err);
    }
}

module.exports = {
    createLogGroup,
    createLogStream,
    checkLogGroupExists,
    checkLogStreamExists,
    logToCloudWatch
};