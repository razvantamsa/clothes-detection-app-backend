const { updateSecretValue } = require("../aws/secrets-manager");

const SECRET_LENGTH = 32;

module.exports.handler = async (event, context) => {
    console.log('Event payload: ', event);
    try {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let apikey = '';
      
        for (let i = 0; i < SECRET_LENGTH; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          apikey += characters.charAt(randomIndex);
        }

        await updateSecretValue('authorization', apikey);
    } catch (err) {
        console.log('Error rotating secret: ', err.message);
    }
}