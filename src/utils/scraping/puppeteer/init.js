const UserAgent = require('user-agents');
const { default: puppeteer } = require("puppeteer-core");
const chromium = require('@sparticuz/chromium');

async function loadDynamicPage() {
    const browser = await puppeteer.launch({
        args: [...chromium.args],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
        timeout: 120000,
    });
    const page = await browser.newPage();
    const userAgent = new UserAgent({ deviceCategory: 'desktop' }).toString();
    await page.setUserAgent(userAgent);

    const closeBrowserCallback = () => {
        const browserPid = browser.process()?.pid;
        if (browserPid) {
            process.kill(browserPid);
        }
    };

    return [page, closeBrowserCallback];
}

module.exports = { loadDynamicPage };