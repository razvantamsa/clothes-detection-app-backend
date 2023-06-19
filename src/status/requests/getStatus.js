const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const packageJson = require('../../../package.json');
    const version = packageJson.version;
    res.status(200).send(`Clothes Detection API version ${version}`);
});
  
module.exports = router;