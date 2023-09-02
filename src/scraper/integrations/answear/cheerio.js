const { default: axios } = require("axios");

function splitImageUrl(url) {
    const parts = url.split('/');
    const baseUrl = parts.slice(0, -1).join('/') + '/';
  
    const filenameWithExtension = parts[parts.length - 1];
    const [filename, extension] = filenameWithExtension.split('.');
  
    return {
      baseUrl,
      filename,
      extension,
    };
}

function incrementFileNumber(filename) {
    const [prefix, fileNumber] = filename.split('_');

    const match = fileNumber.match(/\d+/);
    const newFileNumber = fileNumber.replace(/\d+/, parseInt(match[0]) + 1)

    return `${prefix}_${newFileNumber}`;
}

async function checkLinkValidity(url) {
    try {
      const response = await axios.head(url);
  
      // Check if the status code is in the 2xx range (valid link)
      if (response.status >= 200 && response.status < 300) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
        return false;
    }
  }

const CheerioUtils = {
    scrapeProductsFromPage: ($) => {
        const products = [];
        $('div > div > div > a').each((_idx, el) => {
            const product = $(el);
            const rawLink = product.attr('href');
            const link = 'https://answear.ro' + rawLink.replace(/\/ref.*$/, '');
            products.push(link);
        });
        return products;
    },
    
    nextPageUrl: (url) => {
        const urlObject = new URL(url);
        const existingPage = urlObject.searchParams.get('page');
      
        if (!existingPage) {
          urlObject.searchParams.set('page', '2');
        } else {
          const pageNumber = parseInt(existingPage) + 1;
          urlObject.searchParams.set('page', pageNumber.toString());
        }
      
        return urlObject.toString();
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

    getModel: ($) => {
        return $('div > h1 > span').first().text().trim()
    },
    
    getColor: ($) => {
        return $('div > h1 > span').eq(1).text().trim()
    },
    
    getPrice: ($) => {
        let price =  $('div.ProductCard__priceRegular__sFepg').text().trim();
        if(!price) {
            price = $('div.ProductCard__priceSale__qUu34').text().trim();
        }
        return price;
    },
    
    getDepartment: ($) => {
        return $('li.Breadcrumbs__breadcrumbsItem__9SLNT > a > span').eq(1).text().trim().toLowerCase();
    },

    getImages: async ($) => {
        const imageLink = $('div.Gallery__galleryWrapperSlide__7v35w > div > div > div > picture > img')
            .first()
            .attr('src')
            .split('@')[0];
        const {
            baseUrl,
            filename,
            extension,
        } = splitImageUrl(imageLink);

        const hrefs = [imageLink];

        let latestFileName = filename, attempts = 0;
        while(attempts <= 10) {
            latestFileName = incrementFileNumber(latestFileName);
            const url = baseUrl + latestFileName + '.' + extension;
            
            const isValid = await checkLinkValidity(url); 
            if(!isValid) { break; }
            
            hrefs.push(url);
        }

        return hrefs;
    }

};

module.exports = CheerioUtils;