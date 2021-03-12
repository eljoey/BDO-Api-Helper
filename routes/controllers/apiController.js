const helpers = require('../../utils/helpers');
const alchMatsJSON = require('../../data/Alchemy.json');
const fishMatsJSON = require('../../data/DriedFish.json');
const cookMatsJSON = require('../../data/Cooking.json');
const alchMatsJSONTest = require('../../data/alchemyTestId.json');
const fishMatsJSONTest = require('../../data/driedFishTestId.json');
const cookMatsJSONTest = require('../../data/cookingTestId.json');
const validItems = require('../../utils/validItems');
const NaItem = require('../../models/NaItem');
const EuItem = require('../../models/EuItem');

exports.prices_get = async (req, res, next) => {
  const region = req.query.region;
  const category = req.params.category;

  const validCategories = ['cooking', 'alchemy', 'fish'];
  const validRegions = validItems.regions;
  const matInfoLive = {
    fish: fishMatsJSON,
    cooking: cookMatsJSON,
    alchemy: alchMatsJSON,
  };
  const matInfoTest = {
    fish: fishMatsJSONTest,
    cooking: cookMatsJSONTest,
    alchemy: alchMatsJSONTest,
  };
  // TODO: check if this is bad practice for tests.
  const matInfo = process.env.NODE_ENV === 'test' ? matInfoTest : matInfoLive;

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

  let regionItem = region === 'na' ? NaItem : EuItem;
  let ids = matInfo[category].map((item) => item.id);
  let results = [];

  for (let i = 0; i < ids.length; i++) {
    let id = ids[i];
    const item = await regionItem.findOne({ itemId: id });
    const info = item.getEnhLevel(0);

    results.push(info);
  }

  res.send(results);
};

exports.single_item_search_get = async (req, res, next) => {
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

  // Gets Item depending on region
  let regionItem = region === 'na' ? NaItem : EuItem;
  let foundItem = await regionItem.findOne({ itemId: id });
  let desiredData = foundItem.getEnhLevel(enhLevel);

  // Sends error for invalid enhLevel
  if (!desiredData) {
    return res.status(400).json({
      error: `Invalid enhLevel: ${enhLevel} given for id: ${id}.  Accessories use 0-5.  Armor and Weapons use 0, 8, 11, 13, 16-20. Any other item uses 0`
    });
  }

  res.send(desiredData);
};

exports.search_get = async (req, res, next) => {
  const region = req.query.region;
  const ids = req.body.ids;

  const validRegions = validItems.regions;

  // Validation
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

  let results = [];
  let regionItem = region === 'na' ? NaItem : EuItem;
  let itemIdCache = {};

  for (let i = 0; i < ids.length; i++) {
    let id = ids[i];

    // Don't add info for id that is already been added
    if (itemIdCache[id]) {
      continue;
    } else {
      itemIdCache[id] = true;
    }

    let foundItem = await regionItem.findOne({ itemId: id });
    let info = foundItem.formatAllPrices;

    results = [...results, ...info];
  }
  res.send(results);
};

exports.caphras_calc_get = async (req, res, next) => {
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
  if (0 > Number(curLevel) || Number(curLevel) > 19 || isNaN(Number(curLevel))) {
    return res.status(400).json({
      error: 'Invalid or no curLevel given. A number 0-19 is needed',
    });
  }
  if (1 > Number(desiredLevel) || Number(desiredLevel) > 20 || isNaN(Number(desiredLevel))) {
    return res.status(400).json({
      error: 'Invalid or no desiredLevel given. A number 1-20 is needed',
    });
  }
  if (Number(curLevel) >= Number(desiredLevel)) {
    return res.status(400).json({
      error: 'desiredLevel must be greater than curLevel',
    });
  }

  const caphrasId = 721003;
  const regionItem = region === 'na' ? NaItem : EuItem;
  const caphrasDB = await regionItem.findOne({ itemId: caphrasId });
  const caphrasInfo = caphrasDB.getEnhLevel(0);
  const caphrasNeeded = helpers.caphrasNeeded(
    item,
    enhLevel,
    Number(curLevel),
    Number(desiredLevel)
  );
  const totalCaphrasPrice = caphrasInfo.price * caphrasNeeded;
  const stats = helpers.getStats(
    item,
    enhLevel,
    Number(curLevel),
    Number(desiredLevel)
  );

  res.send({
    caphrasPrice: caphrasInfo.price,
    caphrasNeeded,
    caphrasAvailable: caphrasInfo.count,
    totalCaphrasPrice,
    stats
  });

};

exports.item_upgrade_post = async (req, res, next) => {
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
    if (enhLvlInput < 16 || enhLvlInput > 20 || enhLvlInput === undefined) {
      return res.status(400).json({
        error: `Invalid or no ${validNames[i]} enhLevel given`,
      });
    }
  }

  // Accessories enhLevel validation
  for (let i = 8; i < 11; i++) {
    const enhLvlInput = gearArr[validNames[i]].enhLevel;

    if (enhLvlInput < 1 || enhLvlInput > 5 || enhLvlInput === undefined) {
      return res.status(400).json({
        error: `Invalid or no ${validNames[i]} enhLevel given`,
      });
    }
  }

  const currentGearWithStats = helpers.addCurrentGearStats(gearArr);

  const possibleUpgradeIds = helpers.getCharacterGearPossibilities(
    gearArr.characterClass.name
  );

  let gearInfo = [];
  let regionItem = region === 'na' ? NaItem : EuItem;

  for (let i = 0; i < possibleUpgradeIds.length; i++) {
    let id = possibleUpgradeIds[i];
    let item = await regionItem.findOne({ itemId: id });
    let itemInfo = item.formatAllPrices;

    // 11 length === Armor/Weapon, 6 length === Accessory
    let itemType = itemInfo.length === 6 ? 'accessories' : 'weapAndArmor';
    let enhLevelsWanted = {
      accessories: [1, 2, 3, 4, 5],
      weapAndArmor: [16, 17, 18, 19, 20]
    };

    let filteredGear = itemInfo.filter(item => enhLevelsWanted[itemType].includes(item.enhLevel));

    gearInfo = [...gearInfo, ...filteredGear];
  }

  const gearWithStats = helpers.addStats(gearInfo);
  const gearWithUpgradeCost = helpers.calcCostPerStat(currentGearWithStats, gearWithStats);

  res.send(gearWithUpgradeCost);
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
      error: 'Invalid kutumCaphra given',
    });
  }
  if (
    Number(nouverCaphra) < 0 ||
    Number(nouverCaphra) > 20 ||
    !caphraRegex.test(nouverCaphra)
  ) {
    return res.status(400).json({
      error: 'Invalid nouverCaphra given',
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
