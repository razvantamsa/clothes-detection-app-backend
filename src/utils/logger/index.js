const winston = require('winston');
const WinstonCloudWatch = require('winston-cloudwatch');
const { cloudWatchLogs } = require('../aws/cloudwatch');

const logLevels = {
    info: 'info',
    warn: 'warn',
    error: 'error',
  };

console.log(logLevels);

const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize({ all: true }),
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
);
console.log(logFormat);

const initLogger = (logGroupName, logStreamName) => {
    console.log(logGroupName, logStreamName);
    const logger = winston.createLogger({
        levels: logLevels,
        format: logFormat,
        transports: [
          new WinstonCloudWatch({
            cloudWatchLogs,
            logGroupName,
            logStreamName,
          }),
        ],
      });

    // Assign log methods to the logger object
    logger.info = (message) => {
        logger.log('info', message);
        console.log(message);
    };

    logger.warn = (message) => {
        logger.log('warn', message);
        console.log(message);
    };

    logger.error = (message) => {
        logger.log('error', message);
        console.log(message);
    };

    return logger;
}

module.exports = { initLogger }