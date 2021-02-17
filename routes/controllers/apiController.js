const async = require('async');
const helpers = require('../../utils/helpers');
const alchMatsJSON = require('../../data/Alchemy.json');
const fishMatsJSON = require('../../data/DriedFish.json');
const cookMatsJSON = require('../../data/Cooking.json');
const validItems = require('../../utils/validItems');
const apiConfig = require('../../utils/apiConifg');

exports.prices_get = (req, res, next) => {
  const region = req.query.region;
  const category = req.params.category;

  const validCategories = ['cooking', 'alchemy', 'fish'];
  const validRegions = validItems.regions;
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

exports.single_item_search_get = (req, res, next) => {
  const region = req.query.region;
  const id = req.params.id;
  const enhLevel = req.query.enhLevel || 0;

  // Validation
  const validRegions = validItems.regions;
  if (!id) {
    return res.status(400).json({
      error: 'No id given',
    });
  }
  if (isNaN(Number(id))) {
    return res.status(400).json({
      error: 'Invalid id given'
    });
  }
  if (!validRegions.includes(region)) {
    return res.status(400).json({
      error: 'Invalid or no region given',
    });
  }
  if (isNaN(Number(enhLevel))) {
    return res.status(400).json({
      error: 'Invalid enhLevel given'
    });
  }
  if (enhLevel < 0 || enhLevel > 20) {
    return res.status(400).json({
      error: 'Invalid enhLevel.  Only valid from 0-20',
    });
  }

  const handleDataCallback = (err, data) => {
    if (err) throw new Error(err);

    const dataFormatted = helpers.formatData([data], enhLevel);

    res.send(dataFormatted);
  };

  apiConfig.bdoApiCall('ItemInfo', region, { mainKey: id }, handleDataCallback);
};

exports.search_get = (req, res, next) => {
  const region = req.query.region;
  const ids = req.body.ids;

  const validRegions = validItems.regions;

  // Validation
  if (!ids) {
    return res.status(400).json({
      error: 'No Ids given',
    });
  }
  if (isNaN(Number(id))) {
    return res.status(400).json({
      error: 'Invalid id given'
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

  const validRegions = validItems.regions;
  const validItemEntry = [
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
  if (!validItemEntry.includes(item)) {
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
      Number(desiredLevel)
    );
    const caphrasAvailable = results[0].detailList[0].count;
    const totalCaphrasPrice = caphrasPrice * caphrasNeeded;
    const stats = helpers.getStats(
      item,
      enhLevel,
      Number(curLevel),
      Number(desiredLevel)
    );

    res.send({
      caphrasPrice,
      caphrasNeeded,
      caphrasAvailable,
      totalCaphrasPrice,
      stats,
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

  const validRegions = validItems.regions;
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

  // Body validation
  const gearArrKeys = Object.keys(gearArr);
  for (let i = 0; i < validNames.length; i++) {
    if (!validNames.includes(gearArrKeys[i])) {
      return res.status(400).json({
        error: `Invalid, missing, or misspelled key in body`,
      });
    }
  }

  // Character class validation
  const name = validNames[0];
  if (!validItems[name].includes(gearArr[name].name)) {
    return res.status(400).json({
      error: `Invalid or no ${name} given`,
    });
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

  const possibleUpgradesInfo = helpers.getCharacterGearPossibilities(
    gearArr.characterClass.name
  );

  const parallelApiCalls = helpers.itemUpgradeParallelSetup(
    possibleUpgradesInfo,
    region
  );

  async.parallelLimit(parallelApiCalls, 50, (err, results) => {
    if (err) {
      console.log(err);
    }

    const data = helpers.itemUpgradeDataFormat(results, possibleUpgradesInfo);
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
  if (baseAp < 200 || baseAp > 300) {
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
