function scrapeProductsFromPage($) {
    const shoes = [];
    $('div.sg-col-4-of-12.s-result-item.s-asin.sg-col-4-of-16.sg-col.sg-col-4-of-20').each((_idx, el) => {
        const shoe = $(el);
        const rawModel = shoe.find('span.a-size-base-plus.a-color-base.a-text-normal').text();
        const model = rawModel.toLowerCase().replace(/[\W\s]+/g, '-')
        const rawLink = shoe.find('a.a-link-normal.a-text-normal').attr('href');
        const link = 'https://amazon.com' + rawLink.replace(/\/ref.*$/, '');
        shoes.push({model, link});
    });
    return shoes;
}

function scrapeNextPageHref($) {
    const nextButton = $('a.s-pagination-item.s-pagination-next.s-pagination-button.s-pagination-separator');
    const nextPageHref = 'https://amazon.com' + nextButton.attr('href');
    return nextPageHref;
}

module.exports = {
    scrapeProductsFromPage,
    scrapeNextPageHref
}