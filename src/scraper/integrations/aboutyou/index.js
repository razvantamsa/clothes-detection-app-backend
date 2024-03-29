const { loadDynamicPage } = require("../../../utils/scraping/puppeteer/init");
const PuppeteerUtils = require("./puppeteer");
const { APP_MAX_PRODUCT_LIMIT, MAX_ATTEMPTS } = process.env;

const Utils = {
    scrapeProductCatalog: async (integration, type, sendToWorker) => {
        const [page, closeBrowserCallback] = await loadDynamicPage();
        await page.goto(integration.types[type]);
        
        let products = [], attempts = 0;
        try {
            while(products.length <= APP_MAX_PRODUCT_LIMIT && attempts <= MAX_ATTEMPTS) {
                console.log(products.length);
        
                const foundProducts = await PuppeteerUtils.scrapeProductsFromPage(page);
                products.push(...foundProducts);
                products = [ ...new Set(products)];
                await PuppeteerUtils.scrollDownOnPage(page);
                attempts+=1;
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
        try {
            await page.goto(href, { timeout: 120000 });
    
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
        } catch (error) {
            await closeBrowserCallback();
            throw new Error(error.message);
        }
    }
}

module.exports = Utils;