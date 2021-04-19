const axios = require('axios');
const { JSDOM } = require('jsdom');

const getProductUrl = (product_id) =>
  ` https://www.amazon.com/gp/aod/ajax/?asin=${product_id}&m=&smid=&sourcecustomerorglistid=&sourcecustomerorglistitemid=&sr=8-5&pc=dp`;

async function getPrices(product_id) {
  const productUrl = getProductUrl(product_id);
  const data = await axios.get(productUrl, {
    headers: {
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      Host: 'www.amazon.com',
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:88.0) Gecko/20100101 Firefox/88.0',
      Pragma: 'no-cache',
      TE: 'Trailers',
      'Upgrade-Insecure-Requests': 1,
    },
  });
  const { data: htmlData } = data;
  const dom = new JSDOM(htmlData);
  const $ = (selector) => dom.window.document.querySelector(selector);
}

getPrices('B07CSKGLMM');
