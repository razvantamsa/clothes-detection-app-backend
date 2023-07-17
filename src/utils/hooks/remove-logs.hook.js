const { listLogGroups, deleteLogGroup } = require("../aws/cloudwatch");

async function removeBaseLogs (serviceName) {
    const logGroups = await listLogGroups();
    logGroups.forEach(async (logGroup) => {
        if(logGroup.includes(serviceName) && !logGroup.includes('microservice')) {
            await deleteLogGroup(logGroup);
            console.log(`Deleted ${logGroup}`);
        }
    });
}

removeBaseLogs(process.argv[2]);