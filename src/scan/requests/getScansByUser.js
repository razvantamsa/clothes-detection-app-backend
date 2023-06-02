const express = require('express');
const { queryTableByGSI } = require('../../utils/aws/dynamodb');
const router = express.Router();

const { SCAN_TABLE_GSI_NAME, DYNAMODB_SCAN_TABLE } = process.env;

router.get('/', async (req, res) => {
    try {
        const userName = req.headers.user;
        const scans = await queryTableByGSI(
            DYNAMODB_SCAN_TABLE,
            SCAN_TABLE_GSI_NAME,
            { userName }
        );
        scans.forEach(entry => entry.userName = undefined);
        res.status(200).send(scans);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

module.exports = router;
  