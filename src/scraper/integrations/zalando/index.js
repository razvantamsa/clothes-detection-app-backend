const { loadDynamicPage } = require("../../../utils/scraping/puppeteer/init");
const PuppeteerUtils = require('./puppeteer');
const { APP_MAX_PRODUCT_LIMIT, MAX_ATTEMPTS } = process.env;

const Utils = {
    scrapeProductCatalog: async (integration, type, sendToWorker) => {
        let url = integration.types[type];

        const [page, closeBrowserCallback] = await loadDynamicPage();

        let products = [], attempts = 0;
        try {
            while(products.length <= APP_MAX_PRODUCT_LIMIT && attempts <= MAX_ATTEMPTS) {
                console.log(products.length);
                await page.goto(url);

                const foundProducts = await PuppeteerUtils.scrapeProductsFromPage(page); 
                products.push(...foundProducts);
                products = [ ...new Set(products)];
                url = PuppeteerUtils.nextPageUrl(url);
                console.log(url);
                attempts+=1;                
            }
        } catch (error) {
            //
        }

        await closeBrowserCallback();
        console.log(products, products.length);
    
        for (const product of products) {
            await sendToWorker({ integration, type, href: product });
        }

        return products;
    },

    scrapeProductDetail: async (integration, type, href) => {
        const [page, closeBrowserCallback] = await loadDynamicPage();
        await page.goto(href);

        try {
            const model = await PuppeteerUtils.getModel(page);
            const color = await PuppeteerUtils.getColor(page);
            const price = await PuppeteerUtils.getPrice(page);
            const department = await PuppeteerUtils.getDepartment(page);
            const productImages = await PuppeteerUtils.getImages(page);
    
            await closeBrowserCallback();

            return {
                model,
                productData: {
                    price,
                    color,
                    itemModelNumber: '',
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