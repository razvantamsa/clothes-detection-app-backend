require('dotenv').config({ path: 'src/utils/aws/credentials.env' });
const AWS = require('aws-sdk');

if (!process.env.AWS_EXECUTION_ENV) {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  });
}

const s3 = new AWS.S3();

const postItem = async (Bucket, Key, Body, ContentLength, ContentType) => {
  const params = {
      Bucket,
      Key,
      Body,
      ContentLength,
      ContentType
  };
  try {
    return s3.upload(params).promise();
  } catch (err) {
    throw new Error(err);
  }
};

const uploadStreamToS3 = async (Bucket, Key, Body) => {
  const params = {
      Bucket,
      Key,
      Body,
  };
  try {
    return s3.upload(params).promise();
  } catch (err) {
    throw new Error(err);
  }
};

const getSignedUrl = async (Bucket, Key) => {
  const params = {
      Bucket,
      Key,
  };
  try {
    return s3.getSignedUrlPromise('getObject', params);
  } catch (err) {
    throw new Error(err);
  }
};

const getItem = async (Bucket, Key) => {
  const params = {
    Bucket,
    Key,
  };
  try {
    return s3.getObject(params).promise();
  } catch (err) {
    throw new Error(err);
  }
}

const deleteItem = async (Bucket, Key) => {
  const params = {
      Bucket,
      Key,
  };
  try {
    return s3.deleteObject(params).promise();
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
    postItem,
    uploadStreamToS3,
    getSignedUrl,
    getItem,
    deleteItem,
}