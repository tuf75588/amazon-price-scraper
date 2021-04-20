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
  const title = $('#aod-asin-title-text').textContent.trim();
  const getOffer = (element) => {
    const price = element.querySelector('.a-price .a-offscreen').textContent;
    const offer_id = element
      .querySelector('input[name="offeringID.1"]')
      .getAttribute('value');
    const ships_from = element
      .querySelector('#aod-offer-shipsFrom .a-col-right .a-size-small')
      .textContent.trim();
    const sold_by = element
      .querySelector('#aod-offer-soldBy .a-col-right .a-size-small')
      .textContent.trim();
    const delivery_message = element
      .querySelector('#delivery-message')
      .textContent.trim();
    return {
      price,
      offer_id,
      ships_from,
      sold_by,
    };
  };
  const pinnedElement = $('#pinned-de-id');
  return getOffer(pinnedElement);
}

const a = getPrices('B082TXR61K');

a.then((data) => console.log(data));
