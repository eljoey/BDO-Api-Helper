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

module.exports = {
  parallelSetup,
  formatData,
  caphrasNeeded,
};
