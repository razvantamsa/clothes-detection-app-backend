const { getNumberOfReviews } = require("./src/utils/scraping/cheerio/detail.utils");
const { loadHtml } = require("./src/utils/scraping/cheerio/init");

const urls = [
    'https://www.bonprix.ro/geaca-usoara-tip-bluzon-croi-confort/p-2507866458/918880/',
]

const getModel = ($) => {
    return $('div.product-data__name').text().trim();
};

const getPrice = ($) => {
    return $('span.product-card-price__current').text().trim();
};

const getColor = ($) => {
    return $('p.product-data__color-text').text().trim();
}

const getRating = ($) => {
    const stars = $('div.product-data__stars-wrapper > div > div > div > svg > path[fill="#A4030B"]');
    return `${stars.length}/5`; 
}

const getNrOfReviews = ($) => {
    return $('div.product-data__stars-wrapper > span').text().trim().replace(/\D/g, '');
}

const getDepartment = ($) => {
    return $('li.breadcrumbs__item > div > a > span').eq(1).text().trim().toLowerCase();
}

const getImages = ($) => {
    const hrefs = [];

    $('div.product-photos-carousel > ul > li > img.bpx-img').each((index, element) => {
        const href = $(element).attr('src');
        if (href) {
            hrefs.push(href.replace('//', 'https://'));
        }
    });
    
    return hrefs;
}

const scrapeProductDetail = async (integration, type, href) => {
    const $ = await loadHtml(href);
    try {
        const model = getModel($);
        const color = getColor($);
        const price = getPrice($);
        const rating = getRating($);
        const nrOfReviews = getNrOfReviews($);
        const department = getDepartment($);
        const productImages = getImages($);

        return {
            model,
            productData: {
                price,
                color,
                itemModelNumber: '',
                department,
                rating,
                nrOfReviews,
                discontinued: '',
                dateFirstAvailable: '',
            },
            productImages,
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

(async () => {
    const result = await scrapeProductDetail('', '', urls[0]);
    console.log(result);
})()