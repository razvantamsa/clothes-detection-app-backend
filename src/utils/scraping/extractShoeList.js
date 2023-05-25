const puppeteer = require("puppeteer-core");
const { getChromiumParams } = require("./chromium");

const MIN_HREFS_TO_FIND = 500;

async function extractShoeList(url) {
    const chromiumParams = await getChromiumParams();
    const browser = await puppeteer.launch(chromiumParams);
    const page = await browser.newPage();
    await page.goto(url);
    console.log(url);
    
    let hrefs = []
    while(hrefs.length < MIN_HREFS_TO_FIND) {

        await page.waitForSelector('.s-product-image-container');
        await new Promise((resolve) => {
            setTimeout(resolve, 5000);
        });
        const foundHrefs = await page.$$eval('.s-product-image-container > span > a.a-link-normal.s-no-outline', links => links.map(link => link.href));
        hrefs.push(...foundHrefs);
        console.log(`${hrefs.length}/${MIN_HREFS_TO_FIND}`);

        try {
            await page.waitForSelector('.s-pagination-container');
            await page.click('div.s-pagination-container > span > a.s-pagination-next');
        } catch (err) {
            console.log('Reached the end');
            break;
        }
    }

    await browser.close();
    return hrefs;
}

module.exports = {
    extractShoeList
}