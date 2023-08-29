const UserAgent = require('user-agents');
const cheerio = require('cheerio');
const axios = require('axios');

async function loadHtml(url) {
    const headers = {
        'User-Agent': new UserAgent({ deviceCategory: 'desktop' }).toString(),
        'Accept-Language': 'en-US,en;q=0.9',
    }

    try {
        const response = await axios.get(url, { headers });
        const html = response.data;
        return cheerio.load(html);
    } catch (err) {
        console.log(err.message);
        return;
    }
}

module.exports = { loadHtml };