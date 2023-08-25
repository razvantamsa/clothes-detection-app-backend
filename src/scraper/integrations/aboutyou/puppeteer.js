const PuppeteerUtils = {
    scrapeProductsFromPage: async (page) => {
        await page.waitForSelector('a > div[data-testid="productImage"]');
        return page.evaluate(() => {
            const products = [];
            const elements = document.querySelectorAll('div[data-testid="enhancedGridMeasure"] > ul > li > a');
    
            elements.forEach((el) => {
                    const rawLink = el.getAttribute('href');
                    const link = 'https://www.aboutyou.ro' + rawLink.replace(/\/ref.*$/, '');
                    products.push(link);
            });
    
            return products;
        });
    },

    scrollDownOnPage: async (page) => {
        const viewportHeight = await page.evaluate(() => window.innerHeight);
        await page.evaluate((height) => {
            window.scrollBy(0, height);
        }, viewportHeight);
    
        await page.waitForTimeout(1000);
    }
}

module.exports = PuppeteerUtils;