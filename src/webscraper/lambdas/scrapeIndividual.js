const { extractShoeData } = require("../../utils/scraping/extractShoeData");
const axios = require('axios');
const stream = require('stream');
const { postItem: postDynamoDB } = require("../../utils/aws/dynamodb");
const { uploadStreamToS3 } = require("../../utils/aws/s3");
const { DYNAMODB_SNEAKERS_TABLE, S3_SNEAKERS_BUCKET } = process.env;

exports.handler = async (event, context) => {
    console.log('Event payload:', event);

    const { href, brand } = event;

    const { name, data, color, rating, nrOfReviews, price, imageLinks } = await extractShoeData(href);
    console.log({ name, data, color, rating, nrOfReviews, price, imageLinks });
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
        const result = await uploadStreamToS3(S3_SNEAKERS_BUCKET, key, uploadStream);
        console.log(result);
    }

    const uploadObject = { brand, model: name, color, rating, nrOfReviews, price, ...data };
    const result = await postDynamoDB(DYNAMODB_SNEAKERS_TABLE, uploadObject);
    console.log(result);
    
    return 'Success';
};