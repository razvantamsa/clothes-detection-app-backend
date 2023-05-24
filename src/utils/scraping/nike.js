const puppeteer = require("puppeteer-core");
const { getChromiumParams } = require("./chromium");
const { scrollToBottomOfPage } = require("./common");

async function extractShoeListFunction(url) {
    const chromiumParams = await getChromiumParams();
    const browser = await puppeteer.launch(chromiumParams);
    const page = await browser.newPage();
    await page.goto(url);

    const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 10 * 60 * 1000));
    const scrapingPromise = scrollToBottomOfPage(page);
    await Promise.race([timeoutPromise, scrapingPromise]);

    await page.waitForSelector('.product-card__link-overlay');

    const productHrefs = await page.$$eval('.product-card__link-overlay', links => links.map(link => link.href));
    await browser.close();
    
    return productHrefs;
}

async function launchPuppeteer(url) {
    const chromiumParams = await getChromiumParams();
    const browser = await puppeteer.launch(chromiumParams);
    const page = await browser.newPage();
    page.setDefaultTimeout(300000);
    await page.goto(url);
    return { browser, page };
}

async function extractShoeDataFunction(url) {
    let browser, page;
    try {
        ({ browser, page } = await launchPuppeteer(url));
    } catch (err) {
        try {
            ({ browser, page } = await launchPuppeteer(url));
        } catch (err) {
            console.log(err.message);
            return;
        }
    }
    await page.waitForSelector('#pdp_product_title');

    const productName = await page.$eval('#pdp_product_title', element => element.innerText);
    const productPrice = await page.$eval('.product-price', element => element.innerText);

    
    let sources = await page.$$eval('picture source:first-of-type', sources => {
        return sources.map(source => source.getAttribute('srcset'));
        });
    sources = [...new Set(sources.filter(srcset => !srcset.includes('video')))] 
    await browser.close();
    
    return { productName, productPrice, sources };
}


module.exports = {
    extractShoeListFunction,
    extractShoeDataFunction,
}