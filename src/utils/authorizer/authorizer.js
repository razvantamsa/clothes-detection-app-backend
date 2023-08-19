const { getSecretValue } = require("../aws/secrets-manager");

async function authorizerMiddleware (req, res, next) {
    const { authorization } = req.headers;
    const secret = (await getSecretValue('authorization'));

    if(authorization !== secret) {
        return res.status(401).send('Unauthorized');
    }

    next();
}

module.exports = { authorizerMiddleware };