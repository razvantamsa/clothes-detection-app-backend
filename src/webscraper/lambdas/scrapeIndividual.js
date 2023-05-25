const { invokeAsyncFunction } = require("../../utils/aws/lambda");
const { uploadShoeDataToDatabase } = require("../../utils/scraping/common");
const { urlList } = require("../../utils/scraping/constants");

exports.handler = async (event, context) => {
    console.log('Event payload:', event);

    const { productHrefs, domain } = event;

    if(!Object.keys(urlList).includes(domain)) {
        console.log('Not implemented');
        return;
    }

    const product = productHrefs.shift();
    if(!product) {
        return 'Scraping Process Ended';
    }
    
    // scrape first product of array
    try {
        const scrapingConfig = urlList[domain];
        const { productName, productPrice, sources } = await scrapingConfig.extractShoeDataFunction(product);
        const model = productName.toLowerCase().replace(/\s+/g, '-');
        const price = parseFloat(productPrice.replace("$", ""));
        await uploadShoeDataToDatabase(domain, model, price, sources);
    } catch (err) {
        console.error(err.message);
        console.log('Skipping:', product);
    }

    await invokeAsyncFunction(
        `sneaker-api-scraper-dev-scrapeIndividual`, 
        { productHrefs, domain }
    );

    return;
};