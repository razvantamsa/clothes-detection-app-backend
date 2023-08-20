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

async function logToCloudWatch(logGroupName, logStreamName, message) {
    const params = {
      logGroupName,
      logStreamName,
      logEvents: [{ message, timestamp: new Date().getTime() }]
    };
  
    try {
      await cloudwatch.putLogEvents(params).promise();
    } catch (error) {
      throw new Error(error);
    }
}

module.exports = { logToCloudWatch }