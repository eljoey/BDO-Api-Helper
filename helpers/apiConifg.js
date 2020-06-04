const config = require('./config')

const getUrl = (route) => {
  const baseURL = 'https://marketweb-na.blackdesertonline.com/Home'
  const routeEndpoint = {
    ItemList: 'GetWorldMarketList',
    ItemInfo: 'GetWorldMarketSubList',
    ItemPricing: 'GetItemSellBuyInfo',
    ItemSearch: 'GetWorldMarketSearchList',
  }

  const url = `${baseURL}/${routeEndpoint[route]}`

  return url
}

const createConfig = (route, dataObj) => {
  const apiConfig = {
    method: 'POST',
    url: getUrl(route),
    headers: {
      Cookie: config.BDO_COOKIE,
      'User-Agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
    },
    formData: {
      __RequestVerificationToken: config.BDO_TOKEN,
      ...dataObj,
    },
  }

  return apiConfig
}

module.exports = {
  createConfig,
}
