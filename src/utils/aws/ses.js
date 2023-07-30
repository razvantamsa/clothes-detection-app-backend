require('dotenv').config({ path: 'src/utils/aws/credentials.env' });
const AWS = require('aws-sdk');

if (!process.env.AWS_EXECUTION_ENV) {
  AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  });
}

console.log(process.env.ACCESS_KEY_ID, process.env.SECRET_ACCESS_KEY, process.env.AWS_REGION)

const ses = new AWS.SES();

const receiverEmailAddress = 'razvantamsa295@gmail.com';
const senderEmailAddress = 'stylespotterapp@gmail.com';

async function sendEmail(Subject, Body) {
    try {
        var params = {
            Destination: { ToAddresses: [ receiverEmailAddress ] },
            Message: { Subject, Body },
            Source: senderEmailAddress,
          };
  
        await ses.sendEmail(params).promise();
    } catch (error) {
      throw new Error(error);
    }
}

module.exports = { sendEmail };
