const chromium = require("@sparticuz/chromium");

async function getChromiumParams() {

    return {
        args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
        timeout: 120000,
    }
}

module.exports = {
    getChromiumParams
};