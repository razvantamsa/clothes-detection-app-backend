const CheerioUtils = {
    nextPageUrl: (url) => {
        const regex = /&page=(\d+)\b/;
        const match = url.match(regex);

        if (match) {
            const currentPage = parseInt(match[1], 10);
            url = url.replace(regex, `&page=${currentPage + 1}`);
        } else {
            url +=  '&page=2';
        }

        return url;
    },

    scrapeProductsFromPage: ($) => {
        const products = [];
        $('a.productLink_c18pi').each((_idx, el) => {
            const link = $(el).attr('href');
            products.push(link);
        });
        return products;
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
        return $('h1.jcdpl').text().trim();
    },

    getItemModelNumber: ($) => {
        const itemModelNumber = $('p.Jk9Oz').text().trim();
        return itemModelNumber.replace(/\D/g, '');;
    },

    getDepartment: ($) => {
        return $('nav.ojIeyOc > ol > li:nth-child(2) > a').text().trim().toLowerCase();
    },

    getImages: ($) => {
        const hrefs = [];
    
        $('img').each((index, element) => {
            const href = $(element).attr('src');
            if (href?.includes('products')) {
                hrefs.push(href.split('?')[0]);
            }
        });
        
        return [...new Set(hrefs)];
    }
}

module.exports = CheerioUtils;