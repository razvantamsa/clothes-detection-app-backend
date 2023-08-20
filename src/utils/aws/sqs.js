require('dotenv').config({ path: 'src/utils/aws/credentials.env' });
const AWS = require('aws-sdk');
const crypto = require('crypto');

function generateRandomString(length) {
  const bytes = crypto.randomBytes(Math.ceil(length / 2));
  return bytes.toString('hex').slice(0, length);
}

if (!process.env.AWS_EXECUTION_ENV) {
  AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  });
}

const sqs = new AWS.SQS();

async function sendMessageToQueue(MessageBody, QueueUrl, MessageGroupId) {
    const params = { 
        MessageBody, 
        QueueUrl, 
        MessageGroupId,
        MessageDeduplicationId: generateRandomString(16),
    };
    try {
      const data = await sqs.sendMessage(params).promise();
      return data.MessageId;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = { sendMessageToQueue };