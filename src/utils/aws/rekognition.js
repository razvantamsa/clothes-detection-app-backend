require('dotenv').config({ path: 'src/utils/aws/credentials.env' });
const AWS = require('aws-sdk');

if (!process.env.AWS_EXECUTION_ENV) {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  });
}
const rekognition = new AWS.Rekognition();

async function detectImageLabels(Bucket, Name) {
    const params = {
        Image: {
            S3Object: {
                Bucket,
                Name
            }
        },
        MaxLabels: 10,
        MinConfidence: 70
    };
    try {
        const data = await rekognition.detectLabels(params).promise();
        return data;
    } catch(err) {
        throw new Error(err);
    }
}

module.exports = {
    detectImageLabels
}