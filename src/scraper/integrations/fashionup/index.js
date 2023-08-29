const { loadHtml } = require("../../../utils/scraping/cheerio/init");
const CheerioUtils = require("./cheerio");
const { APP_MAX_PRODUCT_LIMIT, MAX_ATTEMPTS } = process.env;

const Utils = {
    scrapeProductCatalog: async (integration, type, sendToWorker) => {
        let url = integration.types[type];
        
        let products = [], attempts = 0;
        try {
            while(products.length <= APP_MAX_PRODUCT_LIMIT && attempts <= MAX_ATTEMPTS) {
                console.log(products.length);
    
                const $ = await loadHtml(url);
                if(!$) { break; }
    
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
        const $ = await loadHtml(href);
        try {
            const model = CheerioUtils.getModel($);
            const price = CheerioUtils.getPrice($);
            const itemModelNumber = CheerioUtils.getItemModelNumber($);
            const discontinued = CheerioUtils.getDiscontinued($);
            const department = CheerioUtils.getDepartment($);
            const productImages = CheerioUtils.getImages($);
    
            return {
                model,
                productData: {
                    price,
                    color: '',
                    itemModelNumber,
                    department,
                    rating: '',
                    nrOfReviews: '',
                    discontinued,
                    dateFirstAvailable: '',
                },
                productImages,
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }
};

module.exports = Utils;