function scrapeProductsFromPage($) {
    const products = [];
    $('div.sg-col-4-of-12.s-result-item.s-asin.sg-col-4-of-16.sg-col.sg-col-4-of-20').each((_idx, el) => {
        const product = $(el);
        const rawLink = product.find('a.a-link-normal.a-text-normal').attr('href');
        const link = 'https://amazon.com' + rawLink.replace(/\/ref.*$/, '');
        products.push(link);
    });
    return products;
}

function scrapeNextPageHref($) {
    const nextButton = $('a.s-pagination-item.s-pagination-next.s-pagination-button.s-pagination-separator');
    const nextButtonHref = nextButton.attr('href');
    return nextButtonHref ? 'https://amazon.com' + nextButtonHref : undefined;
}

module.exports = {
    scrapeProductsFromPage,
    scrapeNextPageHref
}