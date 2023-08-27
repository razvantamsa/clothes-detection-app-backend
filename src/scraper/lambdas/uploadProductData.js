const { default: axios } = require('axios');
const stream = require('stream');
const { logToCloudWatch } = require("../../utils/aws/cloudwatch");
const { postItem: postDynamoDB } = require('../../utils/aws/dynamodb');
const { uploadStreamToS3: postS3 } = require('../../utils/aws/s3');
const { selectResources } = require("../../utils/middelware/verifyTypeHeader");

/**
 * --- Product Data Structure ---
 * 
 * department
 * rating
 * nrOfReviews
 * discontinued
 * itemModelNumber
 * dateFirstAvailable
 * price
 * color
 * url
//  * website
 */

const log = async (message) => logToCloudWatch(
    '/aws/lambda/clothes-detection-resources-dev-uploadProductData',
    'index',
    message
);


exports.handler = async (event) => {
    const {
        type,
        brand, 
        model,
        website, 
        productData,
        productImages
    } = JSON.parse(event.Records[0].body);

    
    try {
        await log(`${type} ${brand} ${model}`);
        const [TABLE, BUCKET] = selectResources(type);

        for(const [index, imageLink] of productImages.entries()) {
            const response = await axios({
                method: 'GET',
                url: imageLink,
                responseType: 'stream'
            });
            const uploadStream = new stream.PassThrough();
            response.data.pipe(uploadStream);
            await postS3(BUCKET, `${brand}/${model}/pic${index}.jpg`, uploadStream);
        }

        await postDynamoDB(TABLE, { brand, model, website, ...productData });
        
        await log(`Success for ${brand} ${model}`);
    } catch (error) {
        await log(error.message);
    }

    return { statusCode: 200 };
}