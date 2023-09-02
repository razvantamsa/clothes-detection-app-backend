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

    getModel: (page) => {
        return page.$eval('span.EKabf7.R_QwOV', (el) => el.textContent);
    },

    getPrice: (page) => {
      return page.$eval('span.sDq_FX._4sa1cA.FxZV-M', (el) => el.textContent);
    },

    getColor: (page) => {
      return page.$eval('p.sDq_FX.lystZ1.dgII7d.HlZ_Tf.zN9KaA', (el) => el.textContent);
    },

    getDepartment: (page) => {
      return page.$eval('a.h14nQ_.EKabf7.CKDt_l > span', (el) => el.textContent.toLowerCase());
    },


    getImages: async (page) => {
      const hrefs = [];
      const imageList = await page.$$('button > div > div > img.sDq_FX.lystZ1.FxZV-M._2Pvyxl');
      for(const image of imageList ) {
          const href = await page.evaluate((el) => el.getAttribute('src').split('?')[0], image);
          hrefs.push(href);
      }
  
      return [...new Set(hrefs)];
    }
};

module.exports = PuppeteerUtils;