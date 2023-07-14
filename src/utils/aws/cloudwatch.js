require('dotenv').config({ path: 'src/utils/aws/credentials.env' });
const AWS = require('aws-sdk');

if (!process.env.AWS_EXECUTION_ENV) {
  AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  });
}

const cloudWatchLogs = new AWS.CloudWatchLogs()

const listLogGroups = async () => {
    try {
        const response = await cloudWatchLogs.describeLogGroups({}).promise();
        const logGroups = response.logGroups;
        return logGroups.map(logGroup => logGroup.logGroupName);
    } catch (error) {
        throw new Error(error);
    }
  };
  

const deleteLogGroup = async (logGroupName) => {
    try {
        await cloudWatchLogs.deleteLogGroup({ logGroupName }).promise();
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = { 
    listLogGroups,
    deleteLogGroup,
    cloudWatchLogs 
}