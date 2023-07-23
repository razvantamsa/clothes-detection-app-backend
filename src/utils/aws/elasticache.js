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

// async function scaleClusterNodes(CacheClusterId, NumCacheNodes) {
//     try {
//       const describeParams = { CacheClusterId };
//       const data = await elasticache.describeCacheClusters(describeParams).promise();
//       const cluster = data.CacheClusters[0];
    
//       if (cluster.NumCacheNodes > 0) {
//         const updateParams = { CacheClusterId, NumCacheNodes };
//         await elasticache.modifyCacheCluster(updateParams).promise();
//         console.log("Cluster scaled down to 0 nodes.");
//       } else {
//         console.log("The cluster is already scaled down to 0 nodes.");
//       }
//     } catch (err) {
//       console.log("Error:", err);
//     }
// }

module.exports = {
    getClusters
}