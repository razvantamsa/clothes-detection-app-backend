const { loadHtml } = require("./src/utils/scraping/cheerio/init");

const urls = [
    'https://www.bonprix.ro/geaca-usoara-tip-bluzon-croi-confort/p-2507866458/918880/',
]

const getModel = ($) => {
    return $('div.product-data__name').text().trim();
};

// getPrice: ($) => {
//     let price = $('div#pret_produs > span.pret_redus').text().trim();
//     if(!price) {
//         price = $('div#pret_produs > span.pret_block').text().trim();
//     }
//     return price;
// },

// getItemModelNumber: ($) => {
//     return $('div.product-code > span#cod_produs').first().text().trim();
// },

// getDiscontinued: ($) => {
//     return !$('div.product-code > span#cod_produs').eq(1).text().trim();
// },

// getDepartment: ($) => {
//     return $('div.cat-breadcrumb > a.nivel > span[itemprop="name"]').first().text().trim().toLowerCase();
// },

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
        // await page.goto(href, { timeout: 120000 });

        const model = getModel($);
        // const color = CheerioUtils.getColor($);
        // const price = CheerioUtils.getPrice($);
        // const itemModelNumber = getItemModelNumber($);
        // const department = CheerioUtils.getDepartment($);
        const productImages = getImages($);

        return {
            model,
            // productData: {
            //     price,
            //     color,
                // itemModelNumber, - TODO
            //     department,
            // },
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