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
    },

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

    getModel: async (page) => { 
        return page.$eval('h1[data-testid="productName"]', element => element.textContent.trim());
    },

    getPrice: async (page) => { 
        return page.$eval('span[data-testid="finalPrice"]', element => element.textContent.trim());
    },

    getColor: async (page) => {
        let color = '-';
        try {
            await PuppeteerUtils.scrollDownOnPage(page);
            color = await page.$eval('span[data-testid="productColorInfoSelectedOptionName"]', element => element.textContent.trim());
        } catch (error) {
            try {
                await PuppeteerUtils.scrollDownOnPage(page);
                color = await page.$eval('span[data-testid="productColorInfoSelectedOptionName"]', element => element.textContent.trim());
            } catch (error) {
                //
            }
        }
        return color;
    },

    getItemModelNumber: async (page) => {
        let itemModelNumber = '-';
        try {
            await PuppeteerUtils.scrollDownOnPage(page);
            itemModelNumber = await page.$eval('[data-testid="productDetailsArticleNumber"]', element => (element.textContent.split(' ')[2]).trim());
        } catch (error) {
            try {
                await PuppeteerUtils.scrollDownOnPage(page);
                itemModelNumber = await page.$eval('[data-testid="productDetailsArticleNumber"]', element => (element.textContent.split(' ')[2]).trim());
            } catch (error) {
                //
            }
        }
        return itemModelNumber;
    },

    getImages: async (page) => {
        const hrefs = [];
        const imageList = await page.$$('button[data-testid="productImageGridImageButton"] > div[data-testid="productImage"] > img');
        for(const image of imageList ) {
            const href = await page.evaluate((el) => el.getAttribute('src'), image);
            hrefs.push(href);
        }
        return [...new Set(hrefs)];
    }
}

module.exports = PuppeteerUtils;