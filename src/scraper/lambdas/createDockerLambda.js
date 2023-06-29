const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-west-2' });
const lambda = new AWS.Lambda();

const role = "arn:aws:iam::367859350018:role/clothes-detection-scraper-dev-us-west-2-lambdaRole";

exports.handler = async (event, context) => {
  console.log('Event payload:', event);
  const { 
    functionName,
    imageUri,
    environment,
  } = event;

  const params = {
    FunctionName: functionName,
    Code: {
      ImageUri: imageUri,
    },
    Role: role,
    PackageType: 'Image',
    Architectures: ['x86_64'],
    Timeout: 900,
    MemorySize: 2048,
    Environment: {
      Variables: environment,
    },
    TracingConfig: {
        Mode: 'PassThrough',
    },
  }

  try {
    await lambda.createFunction(params).promise();

    return {
      statusCode: 200,
      body: 'Success'
    };
  } catch (error) {
    console.error('Error:', error);

    return {
      statusCode: 500,
      body: 'Error'
    };
  }
};