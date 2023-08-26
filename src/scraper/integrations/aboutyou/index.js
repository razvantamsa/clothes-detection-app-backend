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

    scrapeProductDetail: async (integration, type, href) => {
        const [page, closeBrowserCallback] = await loadDynamicPage();
        await page.goto(href);

        await PuppeteerUtils.scrollDownOnPage(page);
        const model = await PuppeteerUtils.getModel(page);
        const price = await PuppeteerUtils.getPrice(page);
        const color = await PuppeteerUtils.getColor(page);
        const itemModelNumber = await PuppeteerUtils.getItemModelNumber(page);
        const productImages = await PuppeteerUtils.getImages(page);
        await closeBrowserCallback();

        return {
            model,
            productData: {
                price,
                color,
                itemModelNumber,
                department: '',
                rating: '',
                nrOfReviews: '',
                discontinued: '',
                dateFirstAvailable: '',
            },
            productImages,
        }
    }
}

module.exports = Utils;