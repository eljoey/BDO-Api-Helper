const apiConfig = require('../../utils/apiConifg');
const validItems = require('../../utils/validItems');

exports.itemInfo_get = (req, res, next) => {
  const region = req.query.region;
  const mainKey = req.params.itemId;

  const validRegions = validItems.regions;

  if (!validRegions.includes(region)) {
    return res.status(400).json({
      error: 'Invalid or no region given',
    });
  }

  const handleData = (err, data) => {
    if (err) throw new Error(err);

    res.send(data);
  };

  apiConfig.bdoApiCall('ItemInfo', region, { mainKey }, handleData);
};

exports.itemList_get = async (req, res, next) => {
  const region = req.query.region;
  const mainCategory = req.params.mainCategory;
  const subCategory = req.params.subCategory;

  const validRegions = validItems.regions;

  if (!validRegions.includes(region)) {
    return res.status(400).json({
      error: 'Invalid or no region given',
    });
  }

  const handleData = (err, data) => {
    if (err) throw new Error(err);

    res.send(data);
  };

  apiConfig.bdoApiCall(
    'ItemList',
    region,
    { mainCategory, subCategory },
    handleData
  );
};

exports.itemPricing_get = (req, res, next) => {
  const region = req.query.region;

  // I am assuming that keyType and isUp NEVER change. If they end up changing because of something I cant detect, add them
  const formData = {
    mainKey: req.params.mainKey,
    subKey: req.params.subKey,
    keyType: '0',
    isUp: 'True',
  };

  const validRegions = validItems.regions;

  if (!validRegions.includes(region)) {
    return res.status(400).json({
      error: 'Invalid or no region given',
    });
  }

  const handleData = (err, data) => {
    if (err) throw new Error(err);

    res.send(data);
  };

  apiConfig.bdoApiCall('ItemPricing', region, formData, handleData);
};

exports.itemSearch_get = (req, res, next) => {
  const region = req.query.region;
  const searchText = req.params.searchText.replace('+', ' ');

  const validRegions = validItems.regions;

  if (!validRegions.includes(region)) {
    return res.status(400).json({
      error: 'Invalid or no region given',
    });
  }

  const handleData = (err, data) => {
    if (err) throw new Error(err);

    res.send(data);
  };

  apiConfig.bdoApiCall('ItemSearch', region, { searchText }, handleData);
};
