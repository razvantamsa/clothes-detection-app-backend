const nike = require('../../utils/scraping/nike');

const urlList = {
    nike: {
        url: 'https://www.nike.com/w/shoes-3rauvz5e1x6znik1zy7ok',
        extractShoeListFunction: nike.extractShoeListFunction,
        extractShoeDataFunction: nike.extractShoeDataFunction,
    }
}

module.exports = {
    urlList
};

