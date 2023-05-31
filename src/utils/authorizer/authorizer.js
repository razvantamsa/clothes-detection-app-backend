const { getSecretValue } = require("../aws/secrets-manager");

async function authorizerMiddleware (req, res, next) {
    console.log(req.headers);
    const authToken = req.headers['authorization'];
    console.log(authToken);
    const secret = (await getSecretValue('authorization'));
    console.log(secret);

    if(authToken !== secret) {
        return res.status(401).send('Unauthorized');
    }

    next();
}

module.exports = { authorizerMiddleware };