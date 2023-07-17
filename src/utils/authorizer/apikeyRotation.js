const { updateSecretValue } = require("../aws/secrets-manager");
const logger = require('../logger')();

const SECRET_LENGTH = 64;

module.exports.handler = async (event, context) => {
    logger.info('Event payload: ', event);
    try {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let apikey = '';
      
        for (let i = 0; i < SECRET_LENGTH; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          apikey += characters.charAt(randomIndex);
        }

        await updateSecretValue('authorization', apikey);
    } catch (err) {
        logger.error(err);
    }
}