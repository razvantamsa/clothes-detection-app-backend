function getProductName($) {
    const rawName = $('#productTitle').text().trim();
    return rawName.toLowerCase().replace(/[\W\s]+/g, '-');
}

function getProductData($) {
    let discontinued = '-', itemModelNumber = '-', department = '-', dateFirstAvailable = '-';
    $('#detailBullets_feature_div > ul > li > span.a-list-item').each((_idx, el) => {
        const label = $(el).find('span').first().text().replace(/:/g, '').replace(/\s+/g, ' ').trim();
        const value = $(el).find('span').eq(1).text().trim();

        if(label.includes('Discontinued')) {
            discontinued = value.toLowerCase();
        }

        if(label.includes('Item model number')) {
            itemModelNumber = value;
        }

        if(label.includes('Department')) {
            department = value.toLowerCase().replace(/s$/, "");
        }

        if(label.includes('Date First Available')) {
            dateFirstAvailable = value;
        }
    }); 
    return { discontinued, itemModelNumber, department, dateFirstAvailable };
}

function getProductRating($) {
    const ratingElement = $('.reviewCountTextLinkedHistogram.noUnderline');
    const rating = ratingElement.attr('title');
    return parseFloat(rating.replace(' out of 5 stars', ''));
}

function getNumberOfReviews($) {
    const nrOfReviewsElement = $('#acrCustomerReviewText');
    const nrOfReviews = nrOfReviewsElement.text().trim();
    return parseFloat(nrOfReviews.split(' ')[0]);
}

function getProductColor($) {
    try {
        const colorElement = $('#variation_color_name > div > .selection');
        return colorElement.text().trim();
    } catch (err) {
        return '-';
    }
}

function getProductPrice($) {
    const price = [];
    $('.a-price.a-text-price > .a-offscreen').each((_idx, el) => {
        const element = $(el);
        price.push(element.text().trim());
    });
    return price;
}

module.exports = {
    getProductName,
    getProductPrice,
    getProductColor,
    getProductRating,
    getNumberOfReviews,
    getProductData
}