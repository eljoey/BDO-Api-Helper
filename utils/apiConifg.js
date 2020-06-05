const config = require('./config')
const request = require('request')

let BDOApiConfig

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
    json: true,
  }

  BDOApiConfig = apiConfig
}

const bdoApiCall = (route, dataObj, callback) => {
  createConfig(route, dataObj)

  request(BDOApiConfig, (err, res) => {
    callback(err, res.body)
  })
}

module.exports = {
  bdoApiCall,
}
