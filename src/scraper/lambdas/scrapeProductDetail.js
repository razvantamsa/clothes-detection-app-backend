const stream = require('stream');
const { loadHtml } = require("../../utils/scraping/cheerio/init");
const { loadDynamicPage } = require("../../utils/scraping/puppeteer/init");
const staticUtils = require("../../utils/scraping/cheerio/detail.utils");
const dynamicUtils = require("../../utils/scraping/puppeteer/detail.utils");
const { invokeAsyncFunction } = require("../../utils/aws/lambda");
const { uploadStreamToS3 } = require('../../utils/aws/s3');
const { postItem: postDynamoDB } = require("../../utils/aws/dynamodb");
const { default: axios } = require('axios');
const { selectResources } = require('../../utils/middelware/verifyTypeHeader');

exports.handler = async (event, context) => {
    console.log('Event payload:', event);
    let { type, hrefs, brand } = event;
    const [DYNAMODB_TABLE, S3_BUCKET] = selectResources(type);

    if(!hrefs.length) {
        console.log('Finished scraping');
        return;
    }

    const url = hrefs.shift();

    try {
        const $ = await loadHtml(url);
        const name = staticUtils.getProductName($);
        const price = staticUtils.getProductPrice($);
        const color = staticUtils.getProductColor($);
        const rating = staticUtils.getProductRating($);
        const nrOfReviews = staticUtils.getNumberOfReviews($);
        const data = staticUtils.getProductData($);

        const [page, closeBrowserCallback] = await loadDynamicPage();
        const imageLinks = await dynamicUtils.getProductImageLinks(page, closeBrowserCallback, url);

        
        for(const [index, imageLink] of imageLinks.entries()) {
            const response = await axios({
                method: 'GET',
                url: imageLink,
                responseType: 'stream'
            });
            const uploadStream = new stream.PassThrough();
            response.data.pipe(uploadStream);
            const key = `${brand}/${name}/pic${index}`;
            console.log({ key });
            const result = await uploadStreamToS3(S3_BUCKET, key, uploadStream);
            console.log(result);
        }
        
        const uploadObject = { brand, model: name, color, rating, nrOfReviews, price, ...data };
        const result = await postDynamoDB(DYNAMODB_TABLE, uploadObject);
        console.log(result);

    } catch (err) {
        console.error(err);
    }

    await invokeAsyncFunction(
        'clothes-detection-scraper-dev-scrapeProductDetail',
        { type, hrefs, brand },
    );
};