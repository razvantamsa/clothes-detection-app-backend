const { invokeAsyncFunction, createLambdaFromEcr, checkLambdaState } = require('../../utils/aws/lambda');
const { getCallerIdentity } = require('../../utils/aws/securitytokenservice');
const utils = require('../../utils/scraping/cheerio/catalog.utils');
const { loadHtml } = require('../../utils/scraping/cheerio/init');
const { getLambdaRole, getBaseImageUri, getEnvironmentVariables } = require('../../utils/scraping/parse');
const { splitArray } = require('../../utils/scraping/splitArray');

const { APP_MAX_PRODUCT_LIMIT, APP_WORKER_PRODUCT_LIMIT } = process.env;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

exports.handler = async (event, context) => {
    console.log('Event payload: ', event);

    const { type, brand, baseUrl } = event, products = [];
    let url = baseUrl;

    try {
        while(products.length <= APP_MAX_PRODUCT_LIMIT && url) {
            const $ = await loadHtml(url);
            const foundProducts = utils.scrapeProductsFromPage($);
            url = utils.scrapeNextPageHref($);
            products.push(...foundProducts);
            console.log(products.length, url);
        }
    } catch (error) {
        throw error.message;
    }

    console.log(products.length);

    const splitProducts = splitArray(products, APP_WORKER_PRODUCT_LIMIT);
    console.log(splitProducts);

    const unixTimestamp = Math.floor(Date.now() / 1000);
    const { Account: accountId } = await getCallerIdentity();
    const role = getLambdaRole(accountId);
    const imageUri = getBaseImageUri(accountId);
    const envVars = getEnvironmentVariables('/aws/lambda/scrape-detail');

    for (const [index, element] of splitProducts.entries()) {
        const functionName = `scrape-detail-worker-${index}-${unixTimestamp}`;
        await createLambdaFromEcr(functionName, role, imageUri, envVars);

        let functionState = '';
        while(functionState !== 'Active') {
            await delay(5000);
            functionState = await checkLambdaState(functionName);
        }
        await invokeAsyncFunction(functionName, { type, hrefs: element, brand });
    };
};