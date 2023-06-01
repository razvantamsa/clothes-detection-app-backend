require('dotenv').config({ path: 'src/utils/aws/credentials.env' });
const AWS = require('aws-sdk');

if (!process.env.AWS_EXECUTION_ENV) {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  });
}

const secretsManager = new AWS.SecretsManager();

async function getSecretValue(secretName) {
    try {
        const data = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
        const secretValue = JSON.parse(data.SecretString);
        return secretValue;
  
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
}

async function updateSecretValue(SecretId, newSecret) {
    try {
        const params = {
            SecretId, 
            SecretString: JSON.stringify(newSecret)
        }
        await secretsManager.updateSecret(params).promise();  
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
}

module.exports = {
    getSecretValue,
    updateSecretValue
}