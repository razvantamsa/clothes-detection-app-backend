const { loadDynamicPage } = require("../../../utils/scraping/puppeteer/init");
const PuppeteerUtils = require("./puppeteer");
const { APP_MAX_PRODUCT_LIMIT } = process.env;

const Utils = {
    scrapeProductCatalog: async (integration, type, sendToWorker) => {
        const [page, closeBrowserCallback] = await loadDynamicPage();
        await page.goto(integration.types[type]);
        
        const products = [];
        try {
            while(products.length <= APP_MAX_PRODUCT_LIMIT) {
        
                const foundProducts = await PuppeteerUtils.scrapeProductsFromPage(page);
                products.push(...foundProducts);
                await PuppeteerUtils.scrollDownOnPage(page);
            }
        } catch (error) {
            throw error.message;
        }

        console.log(products, products.length);
        await closeBrowserCallback();
    
        for (const product of products) {
            await sendToWorker({ integration, type, href: product });
        }
    },

//     scrapeProductDetail: async (integration, type, href) => {
//       let unixTimestamp = Math.floor(Date.now() / 1000);
//       unixTimestamp = unixTimestamp.toString();

//       return {
//           model: `ping-${unixTimestamp}`,
//           productData: {},
//           productImages: [],
//       }
//     }
}

module.exports = Utils;