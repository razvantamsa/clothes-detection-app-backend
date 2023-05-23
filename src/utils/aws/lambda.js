require('dotenv').config({ path: 'src/utils/aws/credentials.env' });
const AWS = require('aws-sdk');

if (!process.env.AWS_EXECUTION_ENV) {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });
}

const lambda = new AWS.Lambda();

async function invokeAsyncFunction(FunctionName, payload) {
    try {
      const params = {
        FunctionName,
        InvocationType: 'Event', // Invoke asynchronously
        Payload: JSON.stringify(payload),
      };
  
      // Invoke the function asynchronously
      const response = await lambda.invoke(params).promise();
      console.log(response);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
}

module.exports = {
    invokeAsyncFunction
}