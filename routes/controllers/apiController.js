const async = require('async');
const helpers = require('../../utils/helpers');
const alchMatsJSON = require('../../data/Alchemy.json');
const fishMatsJSON = require('../../data/DriedFish.json');
const cookMatsJSON = require('../../data/Cooking.json');
const upgradeIds = require('../../data/UpgradeIds.json');
const validItems = require('../../utils/validItems');

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
    const caphrasAvailable = results[0].detailList[0].count;
    const totalCaphrasPrice = caphrasPrice * caphrasNeeded;

    res.send({
      caphrasPrice,
      caphrasNeeded,
      caphrasAvailable,
      totalCaphrasPrice,
    });
  });
};

exports.item_upgrade_post = (req, res, next) => {
  const region = req.query.region;
  const gearArr = ({
    characterClass,
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

  const validRegions = ['na', 'eu'];
  const validNames = [
    'characterClass',
    'mainHand',
    'offhand',
    'awakening',
    'gloves',
    'helm',
    'armor',
    'boots',
    'ring',
    'earring',
    'necklace',
    'belt',
  ];

  if (!validRegions.includes(region)) {
    return res.status(400).json({
      error: 'Invalid or no region given',
    });
  }

  for (let i = 0; i < validNames.length; i++) {
    const name = validNames[i];

    if (!validItems[name].includes(gearArr[name].name)) {
      return res.status(400).json({
        error: `Invalid or no ${name} given`,
      });
    }
  }

  // Weapon and Armor enhLevel validation
  for (let i = 1; i < 7; i++) {
    const enhLvlInput = gearArr[validNames[i]].enhLevel;

    if (enhLvlInput < 16 || enhLvlInput > 20) {
      return res.status(400).json({
        error: `Invalid or no ${validNames[i]} enhLevel given`,
      });
    }
  }

  // Accessories enhLevel validation
  for (let i = 8; i < 11; i++) {
    const enhLvlInput = gearArr[validNames[i]].enhLevel;

    if (enhLvlInput < 1 || enhLvlInput > 5) {
      return res.status(400).json({
        error: `Invalid or no ${validNames[i]} enhLevel given`,
      });
    }
  }

  const currentGearWithStats = helpers.addCurrentGearStats(gearArr);

  let upgradeInfo = Object.keys(upgradeIds).map((key) => {
    if (key === 'class') {
      let infoArr = [];
      const weaponTypes = ['mainHand', 'offhand', 'awakening'];

      for (let i = 0; i < weaponTypes.length; i++) {
        for (let x = 16; x <= 20; x++) {
          infoArr.push(
            ...upgradeIds[key][gearArr.characterClass.name][weaponTypes[i]].map(
              (id) => {
                return { name: id.name, mainKey: id.id, subKey: x };
              }
            )
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
    region
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

exports.kutum_or_nouver_get = (req, res, next) => {
  const { baseAp, kutumLvl, nouverLvl } = req.query;
  const kutumCaphra = req.query.kutumCaphra || '0';
  const nouverCaphra = req.query.nouverCaphra || '0';
  const caphraRegex = /^[0-9]$|^0[1-9]$|^1[0-9]$|^20$/;

  // Validation
  const validLvls = ['tri', 'tet', 'pen'];

  if (!validLvls.includes(kutumLvl)) {
    return res.status(400).json({
      error: 'Invalid or no kutumLvl given',
    });
  }
  if (!validLvls.includes(nouverLvl)) {
    return res.status(400).json({
      error: 'Invalid or no nouverLvl given',
    });
  }
  if (
    Number(kutumCaphra) < 0 ||
    Number(kutumCaphra) > 20 ||
    !caphraRegex.test(kutumCaphra)
  ) {
    return res.status(400).json({
      error: 'Invalid or no kutumCaphra given',
    });
  }
  if (
    Number(nouverCaphra) < 0 ||
    Number(nouverCaphra) > 20 ||
    !caphraRegex.test(nouverCaphra)
  ) {
    return res.status(400).json({
      error: 'Invalid or no nouverCaphra given',
    });
  }
  if (baseAp < 200 || baseAp > 270) {
    return res.send({ bestOffhand: 'Kutum', effectiveApDiff: 'Alot' });
  }
  if (!Number(baseAp)) {
    return res.status(400).json({
      error: 'Invalid or no baseAp given',
    });
  }

  const kutumEffectiveAp = helpers.getEffectiveAp(
    'kutum',
    kutumLvl,
    kutumCaphra,
    baseAp
  );
  const nouverEffectiveAp = helpers.getEffectiveAp(
    'nouver',
    nouverLvl,
    nouverCaphra,
    baseAp
  );

  const effectiveApDiff = Math.abs(kutumEffectiveAp - nouverEffectiveAp);

  if (kutumEffectiveAp === nouverEffectiveAp) {
    res.send({
      bestOffhand: 'Both offhands are equal',
      effectiveApDiff,
    });
  } else if (kutumEffectiveAp > nouverEffectiveAp) {
    res.send({
      bestOffhand: 'Kutum',
      effectiveApDiff,
    });
  } else {
    res.send({
      bestOffhand: 'Nouver',
      effectiveApDiff,
    });
  }
};
