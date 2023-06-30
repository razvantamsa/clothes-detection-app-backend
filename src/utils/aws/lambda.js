require('dotenv').config({ path: 'src/utils/aws/credentials.env' });
const AWS = require('aws-sdk');

if (!process.env.AWS_EXECUTION_ENV) {
  AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
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
  
      return lambda.invoke(params).promise(); // Invoke the function asynchronously
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
}

async function invokeSyncFunction(FunctionName, payload) {
  try {
    const params = {
      FunctionName,
      Payload: JSON.stringify(payload),
    };

    return lambda.invoke(params).promise(); // Invoke the function asynchronously
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function createLambdaFromEcr(FunctionName, Role, ImageUri, Variables) {
  const params = {
    FunctionName,
    Code: { ImageUri },
    Role,
    PackageType: 'Image',
    Architectures: ['x86_64'],
    Timeout: 900,
    MemorySize: 2048,
    Environment: { Variables },
    TracingConfig: { Mode: 'PassThrough' },
  }

  try {
    const response = await lambda.createFunction(params).promise();
    return response.FunctionArn;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function deleteLambda(functionName, accountId) {
  const params = {
      FunctionName: `arn:aws:lambda:${process.env.AWS_REGION}:${accountId}:function:${functionName}`,
  };

  try {
      await lambda.deleteFunction(params).promise();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function checkLambdaState(FunctionName) {
  try {
    const params = { FunctionName };
    const response = await lambda.getFunctionConfiguration(params).promise();
    return response.State;  
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

module.exports = {
    invokeAsyncFunction,
    invokeSyncFunction,
    createLambdaFromEcr,
    deleteLambda,
    checkLambdaState
}