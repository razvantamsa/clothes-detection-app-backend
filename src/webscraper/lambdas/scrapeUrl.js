const { invokeAsyncFunction } = require('../../utils/aws/lambda');
const { urlList } = require('../../utils/scraping/constants');
const { extractShoeList } = require('../../utils/scraping/extractShoeList');

exports.handler = async (event, context) => {
    console.log('Event payload:', event);
    const { brand } = event;

    const menUrl = urlList[`${brand}Men`];
    const womenUrl = urlList[`${brand}Women`];

    const hrefsForMen = await extractShoeList(menUrl);
    const hrefsForWomen = await extractShoeList(womenUrl);
    const hrefs = [ ...new Set([...hrefsForMen, ...hrefsForWomen]) ];
    console.log('Products found: ', hrefs.length);

    let successfullyInvokedLambdas = 0;
    for(const href of hrefs) {
        const invocation = await invokeAsyncFunction(
            `sneaker-api-scraper-dev-scrapeIndividual`, 
            { href, brand }
        );
        if(invocation.StatusCode === 202);
        successfullyInvokedLambdas++;
    }

    console.log('Lambdas invoked: ', successfullyInvokedLambdas);
    return;
};