require('dotenv').config({ path: 'src/utils/aws/credentials.env' });
const AWS = require('aws-sdk');

if (!process.env.AWS_EXECUTION_ENV) {
  AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  });
}

const ses = new AWS.SES();

async function sendEmail(SubjectData, BodyData) {
    try {
        var params = {
            Destination: { ToAddresses: [ process.env.RECEIVER_MAIL ] },
            Message: { 
                Subject: {
                    Charset: "UTF-8",
                    Data: SubjectData
                }, 
                Body: { Text: {
                    Charset: "UTF-8",
                    Data: BodyData
                }}
            },
            Source: process.env.SENDER_MAIL,
          };
  
        await ses.sendEmail(params).promise();
    } catch (error) {
      throw new Error(error);
    }
}

module.exports = { sendEmail };
