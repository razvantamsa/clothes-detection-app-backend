const PuppeteerUtils = {
    getPrice: async (page) => {
        return page.$eval('span[data-testid="current-price"]', (element) => element.textContent);
    },

    getColor: async (page) => {
        return page.$eval('div[data-testid="productColour"] > p', (element) => element.textContent.toLowerCase());
    },
};

module.exports = PuppeteerUtils;