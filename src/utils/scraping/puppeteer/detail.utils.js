const delay = () => new Promise((resolve) => setTimeout(resolve, Math.random() * 5000));

async function getProductImageLinks(page, closeBrowserCallback, url) {
    await delay();
    await page.goto(url);
    await delay();
    await page.waitForSelector('#productTitle');

    const thumbnails = await page.$$('li.a-spacing-small.item.imageThumbnail.a-declarative');
    const imageLinks = [];

    for(const thumbnail of thumbnails) {
        await thumbnail.click()
        await delay();

        imageLinks.push(await page.$eval('li.selected > span > span > div.imgTagWrapper > img.a-dynamic-image', 
        element => element.getAttribute('src')));

    }
    await delay();
    await closeBrowserCallback();
    return imageLinks;
}

module.exports = {
    getProductImageLinks
}