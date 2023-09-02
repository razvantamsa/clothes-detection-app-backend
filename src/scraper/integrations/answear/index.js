const { loadHtml } = require("../../../utils/scraping/cheerio/init");
const CheerioUtils = require("./cheerio");

const Utils = {
    scrapeProductCatalog: async (integration, type, sendToWorker) => {
        let url = integration.types[type];
        
        let products = [], attempts = 0;
        try {
            while(products.length <= 400 && attempts <= 20) {
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
            const color = CheerioUtils.getColor($);
            const price = CheerioUtils.getPrice($);
            const department = CheerioUtils.getDepartment($);
            const productImages = await CheerioUtils.getImages($);
    
            return {
                model: `${model} ${color}`.toLowerCase(),
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
            throw new Error(error.message);
        }
    }
};

module.exports = Utils;