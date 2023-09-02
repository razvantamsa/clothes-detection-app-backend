const CheerioUtils = require('./cheerio');
const { loadHtml } = require("../../../utils/scraping/cheerio/init");
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
        // const $ = await loadHtml(href);
        // try {
        //     const model = CheerioUtils.getModel($);
        //     const color = CheerioUtils.getColor($);
        //     const price = CheerioUtils.getPrice($);
        //     const rating = CheerioUtils.getRating($);
        //     const nrOfReviews = CheerioUtils.getNrOfReviews($);
        //     const department = CheerioUtils.getDepartment($);
        //     const productImages = CheerioUtils.getImages($);
    
        //     return {
        //         model,
        //         productData: {
        //             price,
        //             color,
        //             itemModelNumber: '',
        //             department,
        //             rating,
        //             nrOfReviews,
        //             discontinued: '',
        //             dateFirstAvailable: '',
        //         },
        //         productImages,
        //     }
        // } catch (error) {
        //     throw new Error(error.message);
        // }
    }
}

module.exports = Utils;