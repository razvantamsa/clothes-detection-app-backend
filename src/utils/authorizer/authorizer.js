const { getSecretValue } = require("../aws/secrets-manager");

async function authorizerMiddleware (req, res, next) {
    const authToken = req.headers['authorization'];
    const secret = (await getSecretValue('authorization'));

    if(authToken !== secret) {
        return res.status(401).send('Unauthorized');
    }

    next();
}

module.exports = { authorizerMiddleware };