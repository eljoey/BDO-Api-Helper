const config = require('./config')

const baseURL = 'https://marketweb-na.blackdesertonline.com/Home'
const headers = {
  Cookie: config.BDO_COOKIE,
  'User-Agent':
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
}

// Broad Search = itemList = GetWorldMarketList
// Single Item = itemInfo = GetWorldMarketSubList
// Sngle Item Details = itemPricing = GetItemSellBuyInfo
// Search = itemSearch = GetWorldMarketSearchList

const ItemList = (mainCategory, subCategory) => {
  const endRoute = 'GetWorldMarketList'

  const options = {
    method: 'POST',
    url: `${baseURL}/${endRoute}`,
    headers,
    formData: {
      __RequestVerificationToken: config.BDO_TOKEN,
      mainCategory,
      subCategory,
    },
  }

  return options
}

const ItemInfo = (itemKey) => {
  const endRoute = 'GetWorldMarketSubList'

  const options = {
    method: 'POST',
    url: `${baseURL}/${endRoute}`,
    headers,
    formData: {
      __RequestVerificationToken: config.BDO_TOKEN,
      itemKey,
    },
  }

  return options
}

const ItemPricing = (mainKey, subKey) => {
  const endRoute = 'GetItemSellBuyInfo'

  const options = {
    method: 'POST',
    url: `${baseURL}/${endRoute}`,
    headers,
    formData: {
      __RequestVerificationToken: config.BDO_TOKEN,
      keyType: 0,
      mainKey,
      subKey,
      isUp: true,
    },
  }

  return options
}

const ItemSearch = (searchText) => {
  const endRoute = 'GetWorldMarketSearchList'

  const options = {
    method: 'POST',
    url: `${baseURL}/${endRoute}`,
    headers,
    formData: {
      __RequestVerificationToken: config.BDO_TOKEN,
      searchText,
    },
  }

  return options
}

module.exports = {
  ItemList,
  ItemInfo,
  ItemPricing,
  ItemSearch,
}
