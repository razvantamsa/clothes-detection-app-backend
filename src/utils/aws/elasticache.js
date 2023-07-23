require('dotenv').config({ path: 'src/utils/aws/credentials.env' });
const AWS = require('aws-sdk');

if (!process.env.AWS_EXECUTION_ENV) {
  AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  });
}

const elasticache = new AWS.ElastiCache();

const CacheClusterId = process.env.REDIS_CACHE_CLUSTER;

async function createCluster () {
    try {
        const createParams = {
          CacheClusterId,
          CacheNodeType: 'cache.t2.micro',
          NumCacheNodes:1,
          Engine: 'redis',
          EngineVersion: '6.x',
          Port: 6379,
          VpcSecurityGroupIds: ['sg-0456d623ed5d62f0c']
        };
    
        await elasticache.createCacheCluster(createParams).promise();
      } catch (err) {
        console.log("Error:", err);
      }
}

async function deleteCluster() {
    try {    
        await elasticache.deleteCacheCluster({ CacheClusterId }).promise();
      } catch (err) {
        console.log("Error:", err);
      }
}

module.exports = {
    createCluster,
    deleteCluster,
}