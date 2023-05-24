const axios = require('axios');
const stream = require('stream');

const { postItem: postDynamoDB } = require("../aws/dynamodb");
const { uploadStreamToS3 } = require('../aws/s3');

const { DYNAMODB_SNEAKERS_TABLE, S3_SNEAKERS_BUCKET } = process.env;

async function scrollToBottomOfPage(page) {
    async function isPageScrolledToBottom() {
        const result = await page.evaluate(() => {
          const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
          return scrollHeight - (scrollTop + clientHeight) <= 1; // Set a small tolerance for accurate scrolling detection
        });
        return result;
    }

    // Scroll to the bottom of the page until it reaches the bottom
    while (!(await isPageScrolledToBottom())) {
        await page.evaluate(() => {
            window.scrollBy(0, window.innerHeight); // Scroll down by the height of the viewport
        });
        await page.waitForTimeout(2000); // Wait for some time after each scroll to give the page time to load additional content
    }
}

async function uploadShoeDataToDatabase(brand, model, price, imageLinks) {
    await postDynamoDB(DYNAMODB_SNEAKERS_TABLE, {brand, model, price});

    for(const [index, imageLink] of imageLinks.entries()) {
        const response = await axios({
            method: 'GET',
            url: imageLink,
            responseType: 'stream'
          });
        const uploadStream = new stream.PassThrough();
        response.data.pipe(uploadStream);

        await uploadStreamToS3(
            S3_SNEAKERS_BUCKET, 
            `${brand}/${model}/pic${index+1}`, 
            uploadStream,
        );
    }
}

module.exports = {
    scrollToBottomOfPage,
    uploadShoeDataToDatabase,
}