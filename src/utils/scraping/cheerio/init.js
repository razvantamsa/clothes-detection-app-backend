const cheerio = require('cheerio');
const axios = require('axios');

async function loadHtml(url) {
    const response = await axios.get(url);
    const html = response.data;
    return cheerio.load(html);
}

module.exports = { loadHtml };