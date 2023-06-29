const AWS = require('aws-sdk');
const { getAWSAccountId } = require('../../utils/aws/securitytokenservice');

AWS.config.update({ region: 'us-west-2' });

const lambda = new AWS.Lambda();

const accoundId = '';

exports.handler = async (event, context) => {
    console.log('Event payload:', event);

    const accoundId = await getAWSAccountId();
    console.log(accoundId);
    
    const { 
        functionName,
      } = event;

    const params = {
        FunctionName: functionName,
    };

    try {
        await lambda.deleteFunction(params).promise();

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