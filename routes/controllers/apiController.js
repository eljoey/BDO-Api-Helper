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
  const gearArr = ({
    character,
    mainHand,
    offhand,
    awakening,
    gloves,
    helm,
    armor,
    boots,
    ring,
    earring,
    necklace,
    belt,
  } = req.body);

  const currentGearWithStats = helpers.addCurrentGearStats(gearArr);

  let upgradeInfo = Object.keys(upgradeIds).map((key) => {
    if (key === 'class') {
      let infoArr = [];
      const weaponTypes = ['mainHand', 'offhand', 'awakening'];

      for (let i = 0; i < weaponTypes.length; i++) {
        for (let x = 16; x <= 20; x++) {
          infoArr.push(
            ...upgradeIds[key][gearArr.character][weaponTypes[i]].map((id) => {
              return { name: id.name, mainKey: id.id, subKey: x };
            })
          );
        }
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

    const data = helpers.itemUpgradeDataFormat(results, formattedUpgradeInfo);
    const dataWithStats = helpers.addStats(data);
    const dataWithEverything = helpers.calcCostPerStat(
      currentGearWithStats,
      dataWithStats
    );

    res.send(dataWithEverything);

    // TODO: Swap to better quicker calling using item info and parse the data
    //        to sort out the unwanted items. Less calls to bdo, but need to figure out how to determine btwn types.
  });
};
