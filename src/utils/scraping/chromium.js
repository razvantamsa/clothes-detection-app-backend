const chromium = require("@sparticuz/chromium");

async function getChromiumParams() {
    const executablePath = await chromium.executablePath();
    return {
        executablePath,
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
        defaultViewport: chromium.defaultViewport,
        args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
        timeout: 300000,
    }
}

module.exports = {
    getChromiumParams
};