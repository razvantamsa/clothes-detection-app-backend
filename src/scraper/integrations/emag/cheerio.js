const CheerioUtils = {
    nextPageUrl: (url) => {
        const paramPattern = /\/p(\d+)/;
        const paramMatch = url.match(paramPattern);
        console.log(paramMatch);
        
        if (paramMatch) {
            const currentNumber = parseInt(paramMatch[1], 10);
            const modifiedNumber = currentNumber + 1;
            const modifiedURL = url.replace(paramPattern, `/p${modifiedNumber}`);
            return modifiedURL;
        }
    
        const insertionPoint = url.search(/\/c(?=\/|$)/);
        if (insertionPoint !== -1) {
            const modifiedURL = url.slice(0, insertionPoint) + '/p1' + url.slice(insertionPoint);
            return modifiedURL;
        }

        return `${url}/p1`;
    },

    scrapeProductsFromPage: ($) => {
        const products = [];
        $('div.card-v2-info > a.card-v2-thumb.mrg-btm-xs.js-product-url.card-v2-thumb-overlay').each((_idx, el) => {
            const product = $(el);
            const rawLink = product.attr('href');
            const link = rawLink.replace(/\/ref.*$/, '');
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

    guardForError: (func) => {
        try {
            return func();
        } catch (error) {
            return '-';
        }
    },

    getModel: ($) => {
        return $('h1.page-title').text().trim();
    },
    
    getPrice: ($) => {
        return $('p.product-new-price').text();
    },
    
    getColor: ($) => {
        const targetRowText = 'Culoare';
        return $('table.table-striped.specifications-table > tbody > tr')
            .filter((index, element) => $(element).find('td:first-child').text() === targetRowText)
            .find('td:last-child')
            .text().trim();
    },
    
    getRatingAndNrReviews: ($) => {
        const rating = CheerioUtils.guardForError(() => $('a.rating-text').contents().first().text().trim());
        const nrOfReviews = CheerioUtils.guardForError(() => $('a.rating-text span').text().match(/\d+/)[0]);
        return { rating, nrOfReviews };
    }
}

module.exports = CheerioUtils;