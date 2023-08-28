const PuppeteerUtils = {
    getImages: async (page) => {
        const hrefs = [];
        const imageList = await page.$$('div.thumbnail-wrapper.ph-card > a.thumbnail.product-gallery-image');
        for(const image of imageList ) {
            const href = await page.evaluate((el) => el.getAttribute('href'), image);
            hrefs.push(href);
        }
    
        return [...new Set(hrefs)];        
    }
}

module.exports = PuppeteerUtils;