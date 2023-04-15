const AWS = require('aws-sdk');

AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: 'sneaker-app' });
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const postItem = async (TableName, Item) => {
    const params = {
      TableName,
      Item
    };
    await dynamoDB.put(params).promise();
};

const getItem = async (TableName, Key) => {
    const params = {
      TableName,
      Key
    };
    const result = await dynamoDB.get(params).promise();
    return result.Item;
  };

module.exports = {
    postItem,
    getItem,
}