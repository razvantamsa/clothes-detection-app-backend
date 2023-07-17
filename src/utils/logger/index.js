const { logToCloudWatch } = require("../aws/cloudwatch");

const logging = (logGroupName, logStreamName, level, ...args) => {
  if(!args.length) {
    return;
  }

  const messages = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg);
  const message = messages.join(' ');

  const functionName = process.env.AWS_LAMBDA_FUNCTION_NAME || 'unknown';
  const logEvent = [{
    message: `${level}: ${functionName} - ${message}`,
    timestamp: Date.now(),
  }];

  logToCloudWatch(logGroupName, logStreamName, logEvent);
};

const logger = (logGroupName = `microservice/${process.env.SERVICE}`, logStreamName = 'index') => ({
  info: (...args) => logging(logGroupName, logStreamName, 'INFO', ...args),
  error: (...args) => logging(logGroupName, logStreamName, 'ERROR', ...args),
})

module.exports = logger;