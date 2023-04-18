require('dotenv').config({ path: 'src/utils/aws/credentials.env' });
const AWS = require('aws-sdk');

if (!process.env.AWS_EXECUTION_ENV) {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });
}

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const postItem = async (TableName, Item) => {
    const params = {
      TableName,
      Item
    };
    try {
      await dynamoDB.put(params).promise();
    } catch (err) {
      throw new Error(err);
    }
};

const getAttributeSet = async (TableName, attribute) => {
  const params = {
    TableName,
    ProjectionExpression: attribute,
  };
  try {
    const result = await dynamoDB.scan(params).promise();
    return [...new Set(result.Items.map(item => item[attribute]))];
  } catch (err) {
    throw new Error(err);
  }
}

const getItem = async (TableName, Key) => {
    const params = {
      TableName,
      Key
    };
    try {
      const result = await dynamoDB.get(params).promise();
      return result.Item;
    } catch (err) {
      throw new Error(err);
    }
};

const getItemByPk = async (TableName, pkName, pkValue) => {
  const params = {
    TableName,
    KeyConditionExpression: `${pkName} = :${pkName}`,
    ExpressionAttributeValues: {
      [`:${pkName}`]: pkValue
    }
  };
  try {
    const result = await dynamoDB.query(params).promise();
    return result.Items;
  } catch (err) {
    throw new Error(err);
  }
};

const updateItem = async (TableName, Key, updatedAttributes) => {
  let UpdateExpression = 'set', 
    ExpressionAttributeNames = {}, 
    ExpressionAttributeValues = {};
  
  Object.entries(updatedAttributes).forEach(([key, value], index) => {
    UpdateExpression += ` #attr${index} = :attr${index}`;
    ExpressionAttributeNames[`#attr${index}`] = key;
    ExpressionAttributeValues[`:attr${index}`] = value;

    if(index+1 !== Object.entries(updatedAttributes).length) {
      UpdateExpression += ',';
    }
  });

  const params = {
    TableName,
    Key,
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ReturnValues: 'ALL_NEW'
  };
  try {
    const result = await dynamoDB.update(params).promise();
    return result.Attributes;
  } catch (err) {
    throw new Error(err);
  }
}

const deleteItem = async (TableName, Key) => {
  const params = {
    TableName,
    Key
  };
  try {
    await dynamoDB.delete(params).promise();
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  getItem,
  getItemByPk,
  getAttributeSet,
  postItem,
  updateItem,
  deleteItem,
}