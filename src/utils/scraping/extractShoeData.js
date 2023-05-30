const puppeteer = require("puppeteer-core");
const { getChromiumParams } = require("./chromium");

async function getProductTitle(page) {
    const rawTitle = await page.$eval('#productTitle', element => element.innerText);
    return rawTitle.toLowerCase().replace(/[\W\s]+/g, '-');
}

async function getProductData(page) {
    let discontinued = 'unknown', itemModelNumber = 'none', department = 'any', dateFirstAvailable = '-';
    const result = await page.$$eval(
        '#detailBullets_feature_div > ul > li > span.a-list-item', 
        elements => elements.map(element => element.innerText) 
    );

    if(result.find(entry => entry.includes('Discontinued'))) {
        discontinued = result.find(entry => entry.includes('Discontinued')).split(' : ')[1].substring(2).toLowerCase();
    }
    
    if(result.find(entry => entry.includes('Item model number'))) {
        itemModelNumber = result.find(entry => entry.includes('Item model number')).split(' : ')[1].substring(2);
    }

    if(result.find(entry => entry.includes('Department'))) {
        department = result.find(entry => entry.includes('Department')).split(' : ')[1].substring(2).toLowerCase().slice(0, -1);
    }

    if(result.find(entry => entry.includes('Date First Available'))) {
        dateFirstAvailable = result.find(entry => entry.includes('Date First Available')).split(' : ')[1].substring(2);
    }
    return { discontinued, itemModelNumber, department, dateFirstAvailable };
}

async function getProductRating(page) {
    const rating = await page.$eval(
        '.reviewCountTextLinkedHistogram.noUnderline', 
        element => element.getAttribute('title')
    );
    return parseFloat(rating.replace(' out of 5 stars', ''));
}

async function getNumberOfReviews(page) {
    const nrOfReviews = await page.$eval('#acrCustomerReviewText', element => element.innerText);
    return parseFloat(nrOfReviews.split(' ')[0]);
}

async function getProductColor(page) {
    try {
        const color = await page.$eval('#variation_color_name > div > .selection', element => element.innerText);
        return color;
    } catch (err) {
        console.log(err.message);
        return '-';
    }
}

async function getProductPrice(page) {
    const priceRange = await page.$$eval('.a-price.a-text-price > .a-offscreen', elements => elements.map(element => element.innerText));
    if(!priceRange.length) {
        const priceWhole = await page.$eval('.a-price > .a-offscreen', element => element.innerText);
        return [ priceWhole ];
    }
    return priceRange;
}

async function getProductImageLinks(page) {
    const thumbnails = await page.$$('li.a-spacing-small.item.imageThumbnail.a-declarative');
    const imageLinks = [];

    for(const thumbnail of thumbnails) {
        await thumbnail.click()
        imageLinks.push(await page.$eval('li.selected > span > span > div.imgTagWrapper > img.a-dynamic-image', element => element.getAttribute('src')));

    }
    return imageLinks;
}

async function extractShoeData(url) {
    const chromiumParams = await getChromiumParams();
    const browser = await puppeteer.launch(chromiumParams);
    const page = await browser.newPage();
    page.setDefaultTimeout(300000);
    await page.goto(url);

    await page.waitForSelector('#productTitle');

    const name = await getProductTitle(page);
    const imageLinks = await getProductImageLinks(page);
    const price = await getProductPrice(page);
    const rating = await getProductRating(page);
    const nrOfReviews = await getNumberOfReviews(page);
    const data = await getProductData(page);
    const color = await getProductColor(page);

    await browser.close();

    return {
        name, data, color, rating, nrOfReviews, price, imageLinks
    }
}

module.exports = {
    extractShoeData
}