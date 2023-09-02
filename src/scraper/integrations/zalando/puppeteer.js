const PuppeteerUtils = {
    nextPageUrl: (url) => {
      const [root, query] = url.split('?');

      if(query) {
        const match = query.match(/\d+/);
        const newQuery = query.replace(/\d+/, parseInt(match[0]) + 1);
        return `${root}?${newQuery}`;
      }
      return `${root}?p=2`;
    },

    scrapeProductsFromPage: async (page) => {
        return page.$$eval('a._LM.JT3_zV.CKDt_l.LyRfpJ', (links) => {
            console.log('here');
            return links.map((link) => {
              return link.getAttribute('href');
            });
          });
    },
};

module.exports = PuppeteerUtils;