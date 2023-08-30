const CheerioUtils = {
    scrapeProductsFromPage: ($) => {
        const products = [];
        $('div.product-list-block-new > div.inner_product > a').each((_idx, el) => {
            const product = $(el);
            const rawLink = product.attr('href');
            const link = rawLink.replace(/\/ref.*$/, '');
            products.push(link);
        });
        return products;
    },
    
    nextPageUrl: (url) => {
        const regex = /pagina_(\d+)\.html/;
        const matches = url.match(regex);
    
        if (matches) {
            const pageNumber = parseInt(matches[1]);
            const newPageNumber = pageNumber + 1;
            return url.replace(regex, `pagina_${newPageNumber}.html`);
        }
        return url.replace(/\.html$/, "/pagina_2.html");
    },

    /**
    * department - none
    * rating - none
    * nrOfReviews - none
    * discontinued - none
    * itemModelNumber
    * dateFirstAvailable - none
    * price
    * color
    * url
    */


    getModel: ($) => {
        return $('h1#denumire_produs').text().trim();
    },

    getPrice: ($) => {
        let price = $('div#pret_produs > span.pret_redus').text().trim();
        if(!price) {
            price = $('div#pret_produs > span.pret_block').text().trim();
        }
        return price;
    },

    getItemModelNumber: ($) => {
        return $('div.product-code > span#cod_produs').first().text().trim();
    },

    getDiscontinued: ($) => {
        return !$('div.product-code > span#cod_produs').eq(1).text().trim();
    },

    getDepartment: ($) => {
        return $('div.cat-breadcrumb > a.nivel > span[itemprop="name"]').first().text().trim().toLowerCase();
    },

    getImages: ($) => {
        const hrefs = [];

        $('ul.jcarousel > li.poze_galerie > img').each((index, element) => {
        const href = $(element).attr('src');
        if (href) {
            hrefs.push(href);
        }
        });
        
        return hrefs;
    }
};

module.exports = CheerioUtils;