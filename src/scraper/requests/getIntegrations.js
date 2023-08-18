const express = require('express');
const { scanTable, getItemByPk, queryTableByGSI, getItem } = require('../../utils/aws/dynamodb');
const router = express.Router();

const { 
    APP_DYNAMODB_INTEGRATIONS_TABLE,
    APP_INTEGRATIONS_TABLE_GSI_NAME
} = process.env;

router.get('/integration', async (req, res) => {
    try {
        let items;
        const { website, brand } = req.headers;

        if (website && brand) {
            items = await getItem(APP_DYNAMODB_INTEGRATIONS_TABLE, { website, brand });
        } else if(website && !brand) {
            items = await getItemByPk(APP_DYNAMODB_INTEGRATIONS_TABLE, { website }); 
        } else if (!website && brand) {
            items = await queryTableByGSI(APP_DYNAMODB_INTEGRATIONS_TABLE, APP_INTEGRATIONS_TABLE_GSI_NAME, { brand });
        } else {
            items = await scanTable(APP_DYNAMODB_INTEGRATIONS_TABLE)
        }
        return res.status(200).send(items);
    } catch (err) {
        console.error(err);
        res.status(400).send(err.message);
    }
});
  
module.exports = router;