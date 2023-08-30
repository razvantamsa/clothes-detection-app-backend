const { loadDynamicPage } = require("./src/utils/scraping/puppeteer/init");

const urls = [
    'https://www.bonprix.ro/geaca-usoara-tip-bluzon-croi-confort/p-2507866458/918880/',
]

const getImages = async (page) => {
    const hrefs = [];

    const imageList = await page.$$('div.product-photos-carousel > ul > li > img.bpx-img');
    for(const image of imageList ) {
        const href = await page.evaluate((el) => el.getAttribute('src'), image);
        hrefs.push(href.replace('//', 'https://'));
    }

    return [... new Set(hrefs)];
}

const scrapeProductDetail = async (integration, type, href) => {
    const [page, closeBrowserCallback] = await loadDynamicPage();
    // const $ = await loadHtml(href);
    try {
        await page.goto(href, { timeout: 120000 });

        // const model = CheerioUtils.getModel($);
        // const color = CheerioUtils.getColor($);
        // const price = CheerioUtils.getPrice($);
        // const itemModelNumber = getItemModelNumber($);
        // const department = CheerioUtils.getDepartment($);
        const productImages = await getImages(page);
        await closeBrowserCallback();

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
        await closeBrowserCallback();
        throw new Error(error.message);
    }
}

(async () => {
    const result = await scrapeProductDetail('', '', urls[0]);
    console.log(result);
})()