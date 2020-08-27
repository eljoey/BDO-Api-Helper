const apiConfig = require('./apiConifg');
const caphrasData = require('../data/caphras.json');

const parallelSetup = (idArr, region) => {
  const parallelCalls = idArr.map((id) => {
    return (callback) =>
      apiConfig.bdoApiCall('ItemInfo', region, { mainKey: id }, callback);
  });

  return parallelCalls;
};

const formatData = (data) => {
  let dataHolder = [];

  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].detailList.length; j++) {
      const dataObj = data[i].detailList[j];

      const formatedData = {
        name: dataObj.name,
        price: dataObj.pricePerOne,
        count: dataObj.count,
        enhanceGrade: dataObj.subKey,
      };

      dataHolder.push(formatedData);
    }
  }
  return dataHolder;
};

const caphrasNeeded = (item, enhLevel, curLevel, desiredLevel) => {
  let total = 0;
  for (let i = curLevel + 1; i <= desiredLevel; i++) {
    total += caphrasData[enhLevel][item][i].required;
  }
  return total;
};

const itemUpgradeParallelSetup = (itemArr, region) => {
  const itemUpgradeParallelCalls = itemArr.map((id) => {
    return (callback) =>
      apiConfig.bdoApiCall(
        'ItemPricing',
        region,
        { mainKey: id.mainKey, subKey: id.subKey, keyType: '0', isUp: 'True' },
        callback
      );
  });

  return itemUpgradeParallelCalls;
};

const itemUpgradeDataFormat = (data, itemArr) => {
  let dataHolder = [];

  for (let i = 0; i < itemArr.length; i++) {
    const itemObj = itemArr[i];

    const formatedData = {
      name: itemArr[i].name,
      id: itemArr[i].mainKey,
      enhLevel: itemArr[i].subKey,
    };

    dataHolder.push(formatedData);
  }

  for (let i = 0; i < data.length; i++) {
    console.log(dataHolder);
    dataHolder[i].price = data[i].basePrice;
  }

  return dataHolder;
};

module.exports = {
  parallelSetup,
  formatData,
  caphrasNeeded,
  itemUpgradeParallelSetup,
  itemUpgradeDataFormat,
};
