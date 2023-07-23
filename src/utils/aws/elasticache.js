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

async function getClusters () {
    try {
        return (await elasticache.describeCacheClusters({}).promise()).CacheClusters;
    } catch (err) {
        console.log("Error:", err);
    }
}

async function scaleClusterNodes(CacheClusterId, NumCacheNodes) {
    try {
        const updateParams = { CacheClusterId, NumCacheNodes };
        await elasticache.modifyCacheCluster(updateParams).promise();
        console.log(`${CacheClusterId} scaled to ${NumCacheNodes} nodes`);
    } catch (err) {
      console.log("Error:", err);
    }
}

module.exports = {
    getClusters,
    scaleClusterNodes
}