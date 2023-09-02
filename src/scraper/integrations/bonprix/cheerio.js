const CheerioUtils = {
    scrapeProductsFromPage: ($) => {
        const products = [];
        $('div.category-product__item-container > a').each((_idx, el) => {
            const product = $(el);
            const rawLink = product.attr('href');
            const link = 'https://www.bonprix.ro' + rawLink.replace(/\/ref.*$/, '');
            products.push(link.split('?')[0]);
        });
        return products;
    },

    getModel: ($) => {
        return $('div.product-data__name').text().trim();
    },
    
    getPrice: ($) => {
        return $('span.product-card-price__current').text().trim();
    },
    
    getColor: ($) => {
        return $('p.product-data__color-text').text().trim();
    },
    
    getRating: ($) => {
        const stars = $('div.product-data__stars-wrapper > div > div > div > svg > path[fill="#A4030B"]');
        return `${stars.length}/5`; 
    },
    
    getNrOfReviews: ($) => {
        return $('div.product-data__stars-wrapper > span').text().trim().replace(/\D/g, '');
    },
    
    getDepartment: ($) => {
        return $('li.breadcrumbs__item > div > a > span').eq(1).text().trim().toLowerCase();
    },
    
    getImages: ($) => {
        const hrefs = [];
    
        $('div.product-photos-carousel > ul > li > img.bpx-img').each((index, element) => {
            const href = $(element).attr('src');
            if (href) {
                hrefs.push(href.replace('//', 'https://'));
            }
        });
        
        return hrefs;
    }
}

module.exports = CheerioUtils;