const { loadHtml } = require("../../../utils/scraping/cheerio/init");
const { loadDynamicPage } = require("../../../utils/scraping/puppeteer/init");
const CheerioUtils = require("./cheerio");
const PuppeteerUtils = require("./puppeteer");

const Utils = {
    scrapeProductDetail: async (integration, type, href) => {
        const [page, closeBrowserCallback] = await loadDynamicPage();
        const $ = await loadHtml(href);
        try {
            await page.goto(href);

            const model = CheerioUtils.getModel($);
            const color = await PuppeteerUtils.getColor(page);
            const price = await PuppeteerUtils.getPrice(page);
            const itemModelNumber = CheerioUtils.getItemModelNumber($);
            const department = CheerioUtils.getDepartment($);
            const productImages = CheerioUtils.getImages($);
            await closeBrowserCallback();
            return {
                model,
                productData: {
                    price,
                    color,
                    itemModelNumber,
                    department,
                    rating: '',
                    nrOfReviews: '',
                    discontinued: '',
                    dateFirstAvailable: '',
                },
                productImages,
            }
        } catch (error) {
            await closeBrowserCallback();
            throw new Error(error.message);
        }
    }
}

module.exports = Utils;