const config = require('./config');
const request = require('request');
const mcache = require('memory-cache');

let BDOApiConfig;

const getUrl = (route, region) => {
  const baseURL = `https://marketweb-${region}.blackdesertonline.com/Home`;
  const routeEndpoint = {
    ItemList: 'GetWorldMarketList',
    ItemInfo: 'GetWorldMarketSubList',
    ItemPricing: 'GetItemSellBuyInfo',
    ItemSearch: 'GetWorldMarketSearchList',
  };

  const url = `${baseURL}/${routeEndpoint[route]}`;
  return url;
};

const createConfig = (route, region, dataObj) => {
  regionConfigs = {
    cookie: {
      na: config.NA_COOKIE,
      eu: config.EU_COOKIE,
    },
    token: {
      na: config.NA_TOKEN,
      eu: config.EU_TOKEN,
    },
  };

  const apiConfig = {
    method: 'POST',
    url: getUrl(route, region),
    headers: {
      Cookie: regionConfigs.cookie[region],
      'User-Agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36',
    },
    formData: {
      __RequestVerificationToken: regionConfigs.token[region],
      ...dataObj,
    },
    json: true,
  };

  BDOApiConfig = apiConfig;
};

const bdoApiCall = (route, region, dataObj, callback) => {
  createConfig(route, region, dataObj);

  // Cache Check to prevent clogging bdo's api and getting banned.  Works for all calls
  const dataEntries = Object.entries(dataObj);
  let cacheKey = `${region}/`;
  for (const [key, value] of dataEntries) {
    cacheKey = cacheKey + key + value;
  }

  const cachedBody = mcache.get(cacheKey);

  if (cachedBody) {
    callback(null, cachedBody);
  } else {
    request(BDOApiConfig, (err, res) => {
      cacheStorageTime = 60 * 1000;
      mcache.put(cacheKey, res.body, cacheStorageTime);
      callback(err, res.body);
    });
  }
};

module.exports = {
  bdoApiCall,
};
