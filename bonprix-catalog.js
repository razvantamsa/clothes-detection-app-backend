const { loadHtml } = require("./src/utils/scraping/cheerio/init");

const url = 'https://www.bonprix.ro/geci-barbati/c-385/?page=see-more';

const sendToWorker = () => {};

const scrapeProductsFromPage = ($) => {
    const products = [];
    $('div.category-product__item-container > a').each((_idx, el) => {
        const product = $(el);
        const rawLink = product.attr('href');
        const link = 'https://www.bonprix.ro' + rawLink.replace(/\/ref.*$/, '');
        products.push(link.split('?')[0]);
    });
    return products;
}

const scrapeProductCatalog = async (integration, type, sendToWorker) => {
    let url = integration.types[type];
    const $ = await loadHtml(url);
    
    let products = [], attempts = 0;
    try {
        while(products.length <= 400 && attempts <= 20) {
            console.log(products.length);

            const foundProducts = scrapeProductsFromPage($); 
            products.push(...foundProducts);
            products = [ ...new Set(products)];
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
}

scrapeProductCatalog({types: { shirts: url }}, 'shirts', sendToWorker)
