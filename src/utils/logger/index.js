const { logToCloudWatch } = require("../aws/cloudwatch");

const logging = (logGroupName, logStreamName, level, message) => {
    const functionName = process.env.AWS_LAMBDA_FUNCTION_NAME || 'unknown';
    const logEvent = [{
      message: `${level}: ${functionName} - ${message}`,
      timestamp: Date.now(),
    }];
  
    logToCloudWatch(logGroupName, logStreamName, logEvent);
};

const logger = (logGroupName = `microservice/${process.env.SERVICE}`, logStreamName = 'index') => ({
    info: (message) => logging(logGroupName, logStreamName, 'INFO', message),
    error: (message) => logging(logGroupName, logStreamName, 'ERROR', message),
})

module.exports = logger;