require('dotenv').config({ path: 'src/utils/aws/credentials.env' });
const AWS = require('aws-sdk');

if (!process.env.AWS_EXECUTION_ENV) {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });
}

const s3 = new AWS.S3();

const postItem = async (Bucket, Key, Body, ContentLength) => {
    const params = {
        Bucket,
        Key,
        Body,
        ContentLength,
        ContentType: 'image/jpeg',
    };
    return s3.upload(params).promise();
};

const getItem = async (Bucket, Key) => {
  const params = {
      Bucket,
      Key,
  };
  return s3.getSignedUrlPromise('getObject', params);
};

module.exports = {
    postItem,
    getItem
}