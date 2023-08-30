const { loadHtml } = require("./src/utils/scraping/cheerio/init");

const urls = [
    'https://www.bonprix.ro/geaca-usoara-tip-bluzon-croi-confort/p-2507866458/918880/',
]

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

        // const model = CheerioUtils.getModel($);
        // const color = CheerioUtils.getColor($);
        // const price = CheerioUtils.getPrice($);
        // const itemModelNumber = getItemModelNumber($);
        // const department = CheerioUtils.getDepartment($);
        const productImages = getImages($);

        return {
            // model,
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