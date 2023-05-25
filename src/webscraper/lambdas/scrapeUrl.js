const { invokeAsyncFunction } = require('../../utils/aws/lambda');
const { urlList } = require('../../utils/scraping/constants');

exports.handler = async (event, context) => {
    console.log('Event payload:', event);
    const { domain } = event;

    if(!Object.keys(urlList).includes(domain)) {
        console.log('Not implemented');
        return;
    }

    const scrapingConfig = urlList[domain];
    console.log(scrapingConfig.url);

    const productHrefs = await scrapingConfig.extractShoeListFunction(scrapingConfig.url);
    console.log(productHrefs.length);
    
    await invokeAsyncFunction(
        `sneaker-api-scraper-dev-scrapeIndividual`, 
        { productHrefs, domain }
    );
    return;
};