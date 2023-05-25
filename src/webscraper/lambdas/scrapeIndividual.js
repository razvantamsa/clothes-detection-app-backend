const { uploadShoeDataToDatabase } = require("../../utils/scraping/common");
const { urlList } = require("../../utils/scraping/constants");

exports.handler = async (event, context) => {
    console.log('Event payload:', event);

    const { productHref, domain } = event;

    if(!Object.keys(urlList).includes(domain)) {
        console.log('Not implemented');
        return;
    }

    
    try {
        const scrapingConfig = urlList[domain];
        const { productName, productPrice, sources } = await scrapingConfig.extractShoeDataFunction(productHref);
        const model = productName.toLowerCase().replace(/\s+/g, '-');
        const price = parseFloat(productPrice.replace("$", ""));
        await uploadShoeDataToDatabase(domain, model, price, sources);
    } catch (err) {
        console.error(err.message);
    }

    return;
};