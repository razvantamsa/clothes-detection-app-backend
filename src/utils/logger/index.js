const winston = require('winston');
const WinstonCloudWatch = require('winston-cloudwatch');
const { cloudWatchLogs } = require('../aws/cloudwatch');

const initLogger = (logGroupName, logStreamName) => {
    const logger = winston.createLogger({
        levels: {
          info: 'info',
          error: 'error',
        },
        format: winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format((info) => {
            info.level = info.level.toUpperCase();
            const functionName = process.env.AWS_LAMBDA_FUNCTION_NAME || 'local';
            info.message = `${functionName}: ${info.message}`;
            return info;
          })(),
          winston.format.printf(({ level, message }) => {
            return `${level}: ${message}`;
          })
        ),
        transports: [
          new WinstonCloudWatch({
            cloudWatchLogs,
            logGroupName,
            logStreamName,
          }),
        ],
      });

    logger.info = (message) => logger.log('info', message);
    logger.error = (message) => logger.log('error', message);

    return logger;
}

module.exports = { initLogger }