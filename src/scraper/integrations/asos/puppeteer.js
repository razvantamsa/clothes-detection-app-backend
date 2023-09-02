const PuppeteerUtils = {
    getPrice: async (page) => {
        return page.$eval('span[data-testid="current-price"]', (element) => element.textContent);
    },

    getColor: async (page) => {
        return page.$eval('div.a3gFz > div > p', (element) => element.textContent.toLowerCase());
    },
};

module.exports = PuppeteerUtils;