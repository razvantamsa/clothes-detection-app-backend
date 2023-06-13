const UserAgent = require('user-agents');
const cheerio = require('cheerio');
const axios = require('axios');

async function loadHtml(url) {
    const headers = {
        'User-Agent': new UserAgent({ deviceCategory: 'desktop' }).toString(),
        'Accept-Language': 'en-US,en;q=0.9',
    }

    const response = await axios.get(url, { headers });
    const html = response.data;
    return cheerio.load(html);
}

module.exports = { loadHtml };