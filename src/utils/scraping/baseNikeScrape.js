const puppeteer = require('puppeteer');

const baseNikeScrape = async (url) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('.product-card__link-overlay');

    const hrefs = await page.$$eval('.product-card__link-overlay', links => links.map(link => link.href));
    await browser.close();

    return hrefs;

};

module.exports = {
    baseNikeScrape
};