const { scaleClusterNodes, getClusters } = require("../aws/elasticache");

async function scaleDownRedis() {
    const data = await getClusters();
    console.log(data);
    return;
}

scaleDownRedis();