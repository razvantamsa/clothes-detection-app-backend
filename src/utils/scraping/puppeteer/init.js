const UserAgent = require('user-agents');
const { default: puppeteer } = require("puppeteer-core");
const { getChromiumParams } = require("../chromium");

async function loadDynamicPage() {
    const chromiumParams = await getChromiumParams();
    const browser = await puppeteer.launch(chromiumParams);
    const page = await browser.newPage();
    const userAgent = new UserAgent({ deviceCategory: 'desktop' }).toString();
    await page.setUserAgent(userAgent);
    const closeBrowserCallback = async () => browser.close();

    return [page, closeBrowserCallback];
}

module.exports = { loadDynamicPage };