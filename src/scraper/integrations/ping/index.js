function generateRandomHref() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 10;
    let randomHref = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomHref += characters.charAt(randomIndex);
    }
  
    return `https://ping.com/${randomHref}`;
  }

const Utils = {
    scrapeProductCatalog: async (integration, type, sendToWorker) => { 
        console.log(integration.website, type);
        for (let i = 0; i < 50; i++) {
            await sendToWorker({ integration, type, href: generateRandomHref() });
        }
    },

    scrapeProductDetail: async (integration, type, href) => {
      let unixTimestamp = Math.floor(Date.now() / 1000);
      unixTimestamp = unixTimestamp.toString();

      return {
          model: `ping-${unixTimestamp}`,
          productData: {},
          productImages: [],
      }
    }
}

module.exports = Utils;