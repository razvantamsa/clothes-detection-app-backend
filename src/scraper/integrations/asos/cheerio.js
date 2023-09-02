const CheerioUtils = {
    
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