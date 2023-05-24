const { uploadShoeDataToDatabase } = require("../../utils/scraping/common");
const { urlList } = require("../../utils/scraping/constants");

exports.handler = async (event, context) => {
    console.log('Event payload:', event);

    const { domain } = event;

    if(!Object.keys(urlList).includes(domain)) {
        console.log('Not implemented');
        return;
    }

    const scrapingConfig = urlList[domain];
    const productData = await scrapingConfig.extractShoeDataFunction(event.productHref);
    const model = productData.productName.toLowerCase().replace(/\s+/g, '-');
    await uploadShoeDataToDatabase(domain, model, productData.productPrice, productData.sources)

    return;
};