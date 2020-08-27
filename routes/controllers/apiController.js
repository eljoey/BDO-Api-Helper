const async = require('async');
const helpers = require('../../utils/helpers');
const alchMatsJSON = require('../../data/Alchemy.json');
const fishMatsJSON = require('../../data/DriedFish.json');
const cookMatsJSON = require('../../data/Cooking.json');
const upgradeIds = require('../../data/UpgradeIds.json');
const e = require('express');

exports.prices_get = (req, res, next) => {
  const region = req.query.region;
  const category = req.params.category;

  const validCategories = ['cooking', 'alchemy', 'fish'];
  const validRegions = ['na', 'eu'];
  const matInfo = {
    fish: fishMatsJSON,
    cooking: cookMatsJSON,
    alchemy: alchMatsJSON,
  };

  if (!validCategories.includes(category)) {
    return res.status(400).json({
      error: `Invalid category parameter given: ${category}`,
    });
  }
  if (!validRegions.includes(region)) {
    return res.status(400).json({
      error: 'Invalid or no region given',
    });
  }

  // Split into two searches because EU doesnt work after 100 calls.
  let ids = matInfo[category].map((item) => item.id);

  const parallelApiCalls = helpers.parallelSetup(ids, region);
  async.parallelLimit(parallelApiCalls, 50, (err, results) => {
    if (err) {
      console.log(err);
    }

    let data = helpers.formatData(results);

    res.send(data);
  });
};

exports.search_get = (req, res, next) => {
  const region = req.query.region;
  const ids = req.body.ids;

  const validRegions = ['na', 'eu'];

  if (!ids) {
    return res.status(400).json({
      error: 'No Ids given',
    });
  }
  if (!validRegions.includes(region)) {
    return res.status(400).json({
      error: 'Invalid or no region given',
    });
  }

  const parallelApiCalls = helpers.parallelSetup(ids, region);

  async.parallelLimit(parallelApiCalls, 50, (err, results) => {
    if (err) {
      console.log(err);
    }

    let data = helpers.formatData(results);
    res.send(data);
  });
};

exports.caphras_calc_get = (req, res, next) => {
  const { item, enhLevel, curLevel, desiredLevel, region } = req.query;

  const validRegions = ['na', 'eu'];
  const validItems = [
    'BossMH',
    'BossAwak',
    'BlueMH/Awak',
    'GreenMH/Awak',
    'BossOffhand',
    'GreenOffhand',
    'BossArmor',
    'DimTree',
    'BlueArmor',
    'GreenArmor',
  ];
  const validEnhLevels = ['tri', 'tet', 'pen'];

  if (!validRegions.includes(region)) {
    return res.status(400).json({
      error: 'Invalid or no region given',
    });
  }
  if (!validItems.includes(item)) {
    return res.status(400).json({
      error: 'Invalid or no item given',
    });
  }
  if (!validEnhLevels.includes(enhLevel)) {
    return res.status(400).json({
      error: 'Invalid or no enhLevel given',
    });
  }
  if (0 > Number(curLevel) || Number(curLevel) > 19) {
    console.log(curLevel);
    return res.status(400).json({
      error: 'Invalid or no curLevel given. A number 0-19 is needed',
    });
  }
  if (1 > Number(desiredLevel) || Number(desiredLevel) > 20) {
    return res.status(400).json({
      error: 'Invalid or no desiredLevel given. A number 1-20 is needed',
    });
  }
  if (Number(curLevel) >= Number(desiredLevel)) {
    return res.status(400).json({
      error: 'desiredLevel must be greater than curLevel',
    });
  }

  const getCaphrasPrice = helpers.parallelSetup([721003], region);
  async.parallel(getCaphrasPrice, (err, results) => {
    const caphrasPrice = helpers.formatData(results)[0].price;
    const caphrasNeeded = helpers.caphrasNeeded(
      item,
      enhLevel,
      Number(curLevel),
      desiredLevel
    );

    let totalCaphrasPrice = caphrasPrice * caphrasNeeded;

    res.send({
      caphrasPrice,
      caphrasNeeded,
      totalCaphrasPrice,
    });
  });
};

exports.item_upgrade_get = (req, res, next) => {
  let upgradeInfo = Object.keys(upgradeIds).map((key) => {
    if (key === 'class') {
      let infoArr = [];

      for (let x = 16; x <= 20; x++) {
        infoArr.push(
          ...upgradeIds[key].dk.mainHand.map((id) => {
            return { name: id.name, mainKey: id.id, subKey: x };
          })
        );
      }
      return infoArr;
    } else if (key === 'armor') {
      let infoArr = [];
      const keyArr = Object.keys(upgradeIds[key]);

      for (let x = 16; x <= 20; x++) {
        for (let y = 0; y <= 3; y++) {
          infoArr.push(
            ...upgradeIds[key][keyArr[y]].map((id) => {
              return { name: id.name, mainKey: id.id, subKey: x };
            })
          );
        }
      }
      return infoArr;
    } else {
      let infoArr = [];
      const keyArr = Object.keys(upgradeIds[key]);

      for (let x = 1; x <= 5; x++) {
        for (let y = 0; y <= 3; y++) {
          infoArr.push(
            ...upgradeIds[key][keyArr[y]].map((id) => {
              return { name: id.name, mainKey: id.id, subKey: x };
            })
          );
        }
      }
      return infoArr;
    }
  });
  let formattedUpgradeInfo = [
    ...upgradeInfo[0],
    ...upgradeInfo[1],
    ...upgradeInfo[2],
  ];

  const parallelApiCalls = helpers.itemUpgradeParallelSetup(
    formattedUpgradeInfo,
    'na'
  );

  async.parallelLimit(parallelApiCalls, 50, (err, results) => {
    if (err) {
      console.log(err);
    }
    let data = helpers.itemUpgradeDataFormat(results, formattedUpgradeInfo);
    res.send(data);

    // TODO: Swap to better quicker calling using item info and parse the data
    //        to sort out the unwanted items. Less calls to bdo and should be quicker.
  });
};
