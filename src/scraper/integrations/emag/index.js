const { loadDynamicPage } = require("../../../utils/scraping/puppeteer/init");
const PuppeteerUtils = require("./puppeteer");
const CheerioUtils = require("./cheerio");
const { loadHtml } = require("../../../utils/scraping/cheerio/init");
const { APP_MAX_PRODUCT_LIMIT, MAX_ATTEMPTS } = process.env;

const Utils = {
    scrapeProductCatalog: async (integration, type, sendToWorker) => {
        let url = integration.types[type];
        
        let products = [], attempts = 0;
        try {
            while(products.length <= APP_MAX_PRODUCT_LIMIT && attempts <= MAX_ATTEMPTS) {
                console.log(products.length);

                const $ = await loadHtml(url);
                const foundProducts = CheerioUtils.scrapeProductsFromPage($); 
                products.push(...foundProducts);
                products = [ ...new Set(products)];
                url = CheerioUtils.nextPageUrl(url);
                console.log(url);
                attempts+=1;                
            }
        } catch (error) {
            throw error.message;
        }

        console.log(products, products.length);
    
        for (const product of products) {
            await sendToWorker({ integration, type, href: product });
        }

        return products;
    },

    scrapeProductDetail: async (integration, type, href) => {
        const [page, closeBrowserCallback] = await loadDynamicPage();
        const $ = await loadHtml(href);
        try {
            await page.goto(href, { timeout: 120000 });
    
            const model = CheerioUtils.getModel($);
            const price = CheerioUtils.getPrice($);
            const color = CheerioUtils.getColor($);
            const { rating, nrOfReviews } = CheerioUtils.getRatingAndNrReviews($);
            const productImages = await PuppeteerUtils.getImages(page);
            await closeBrowserCallback();
    
            return {
                model,
                productData: {
                    price,
                    color,
                    itemModelNumber: '',
                    department: '',
                    rating,
                    nrOfReviews,
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