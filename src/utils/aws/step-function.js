require('dotenv').config({ path: 'src/utils/aws/credentials.env' });
const AWS = require('aws-sdk');

if (!process.env.AWS_EXECUTION_ENV) {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });
}

const sf = new AWS.StepFunctions();

async function startStepFunctionExecution(stateMachineArn, input) {
    try {
      const params = {
        stateMachineArn,
        input,
      };
  
      const result = await sf.startExecution(params).promise();
      console.log(`Started execution with ARN: ${result.executionArn}`);
    } catch (err) {
      console.error(`Failed to start execution: ${err}`);
    }
  };
  

module.exports = {
    startStepFunctionExecution,
}