require('dotenv').config({ path: 'src/utils/aws/credentials.env' });
const AWS = require('aws-sdk');

if (!process.env.AWS_EXECUTION_ENV) {
  AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  });
}

const sqs = new AWS.SQS();

async function sendMessageToQueue(MessageBody, QueueUrl) {
    const params = { 
        MessageBody, 
        QueueUrl, 
        DelaySeconds: 30,
    };
    try {
      const data = await sqs.sendMessage(params).promise();
      return data.MessageId;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = { sendMessageToQueue };