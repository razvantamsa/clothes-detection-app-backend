require('dotenv').config({ path: 'src/utils/aws/credentials.env' });
const AWS = require('aws-sdk');

if (!process.env.AWS_EXECUTION_ENV) {
  AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  });
}

const sts = new AWS.STS();

const getCallerIdentity = async () => {
    try {
      return sts.getCallerIdentity().promise();
    } catch (error) {
      throw new Error(error.message);
    }
};

module.exports = {
    getCallerIdentity
}