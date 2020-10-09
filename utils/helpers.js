const apiConfig = require('./apiConifg');
const caphrasData = require('../data/caphras.json');
const itemStats = require('../data/ItemStats.json');
const apBracket = require('../data/ApBracket.json');
const offhandStats = require('../data/OffhandStats.json');
const caphraAp = require('../data/CaphrasAp.json');
const upgradeIds = require('../data/UpgradeIds.json');

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

const getStats = (item, enhLevel, curLevel, desiredLevel) => {
  const currentItemStats = caphrasData[enhLevel][item][curLevel].stats;
  const desiredItemStats = caphrasData[enhLevel][item][desiredLevel].stats;

  const itemStatKeys = Object.keys(desiredItemStats);
  const stats = {};

  for (let i = 0; i < itemStatKeys.length; i++) {
    const key = itemStatKeys[i];
    const statDiff = desiredItemStats[key] - currentItemStats[key];
    const formattedDiff = statDiff === 0 ? '' : `(+${statDiff})`;

    stats[[key]] = `${desiredItemStats[key]} ${formattedDiff}`;
  }

  return stats;
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
    const formatedData = {
      name: itemArr[i].name,
      id: itemArr[i].mainKey,
      enhLevel: itemArr[i].subKey,
      grade: itemArr[i].grade,
    };

    dataHolder.push(formatedData);
  }

  for (let i = 0; i < data.length; i++) {
    dataHolder[i].price = data[i].basePrice;
  }

  return dataHolder;
};

const addStats = (data) => {
  const mainhandNames = ['Kzarka', 'Offin', 'Blackstar'];
  const awakeningNames = ['Dandelion', 'Dragon'];
  const offhandNames = ['Kutum', 'Nouver'];
  const gloveNames = ["Bheg's", "Leebur's"];
  const helmNames = ["Griffon's", "Giath's"];
  const armorNames = ['Dim', 'Red', 'Blackstar'];
  const bootNames = ["Muskan's", "Urugon's"];

  const addStatInfo = data.map((item) => {
    const itemBaseName = item.name.split(' ')[0];
    const itemTypeName = item.name.split(' ')[1];

    // TODO: Clean this up.

    //Mainhand Weapon
    if (mainhandNames.includes(itemBaseName) && itemTypeName !== 'Armor') {
      const itemWithStats = {
        ...item,
        type: 'mainHand',
        stats: {
          ap: itemStats.mainHand[itemBaseName].enhanceLevel[item.enhLevel].ap,
          dp: itemStats.mainHand[itemBaseName].enhanceLevel[item.enhLevel].dp,
        },
      };

      return itemWithStats;
    }

    //Awakening Weapon
    if (awakeningNames.includes(itemBaseName)) {
      const itemWithStats = {
        ...item,
        type: 'awakening',
        stats: {
          ap: itemStats.awakening[itemBaseName].enhanceLevel[item.enhLevel].ap,
          dp: itemStats.awakening[itemBaseName].enhanceLevel[item.enhLevel].dp,
        },
      };

      return itemWithStats;
    }

    //Offhand Weapon
    if (offhandNames.includes(itemBaseName)) {
      const itemWithStats = {
        ...item,
        type: 'offhand',
        stats: {
          ap: itemStats.offhand[itemBaseName].enhanceLevel[item.enhLevel].ap,
          dp: itemStats.offhand[itemBaseName].enhanceLevel[item.enhLevel].dp,
        },
      };

      return itemWithStats;
    }

    //Gloves
    if (gloveNames.includes(itemBaseName)) {
      const itemWithStats = {
        ...item,
        type: 'gloves',
        stats: {
          ap: itemStats.gloves[itemBaseName].enhanceLevel[item.enhLevel].ap,
          dp: itemStats.gloves[itemBaseName].enhanceLevel[item.enhLevel].dp,
        },
      };

      return itemWithStats;
    }

    //Helm
    if (helmNames.includes(itemBaseName)) {
      const itemWithStats = {
        ...item,
        type: 'helm',
        stats: {
          ap: itemStats.helm[itemBaseName].enhanceLevel[item.enhLevel].ap,
          dp: itemStats.helm[itemBaseName].enhanceLevel[item.enhLevel].dp,
        },
      };

      return itemWithStats;
    }

    //Armor
    if (armorNames.includes(itemBaseName)) {
      const itemWithStats = {
        ...item,
        type: 'armor',
        stats: {
          ap: itemStats.armor[itemBaseName].enhanceLevel[item.enhLevel].ap,
          dp: itemStats.armor[itemBaseName].enhanceLevel[item.enhLevel].dp,
        },
      };

      return itemWithStats;
    }

    //Boots
    if (bootNames.includes(itemBaseName)) {
      const itemWithStats = {
        ...item,
        type: 'boots',
        stats: {
          ap: itemStats.boots[itemBaseName].enhanceLevel[item.enhLevel].ap,
          dp: itemStats.boots[itemBaseName].enhanceLevel[item.enhLevel].dp,
        },
      };

      return itemWithStats;
    }

    //Rings
    if (itemStats.ring[item.name]) {
      const itemWithStats = {
        ...item,
        type: 'ring',
        stats: {
          ap: itemStats.ring[item.name].enhanceLevel[item.enhLevel].ap,
          dp: itemStats.ring[item.name].enhanceLevel[item.enhLevel].dp,
        },
      };

      return itemWithStats;
    }

    //Earrings
    if (itemStats.earring[item.name]) {
      const itemWithStats = {
        ...item,
        type: 'earring',
        stats: {
          ap: itemStats.earring[item.name].enhanceLevel[item.enhLevel].ap,
          dp: itemStats.earring[item.name].enhanceLevel[item.enhLevel].dp,
        },
      };

      return itemWithStats;
    }

    //Necklace
    if (itemStats.necklace[item.name]) {
      const itemWithStats = {
        ...item,
        type: 'necklace',
        stats: {
          ap: itemStats.necklace[item.name].enhanceLevel[item.enhLevel].ap,
          dp: itemStats.necklace[item.name].enhanceLevel[item.enhLevel].dp,
        },
      };

      return itemWithStats;
    }

    //Belts
    if (itemStats.belt[item.name]) {
      const itemWithStats = {
        ...item,
        type: 'belt',
        stats: {
          ap: itemStats.belt[item.name].enhanceLevel[item.enhLevel].ap,
          dp: itemStats.belt[item.name].enhanceLevel[item.enhLevel].dp,
        },
      };

      return itemWithStats;
    }
  });

  return addStatInfo;
};

const calcCostPerStat = (currentGear, potentialGear) => {
  const addCostPerStat = potentialGear
    .map((item) => {
      const currentGearAp = currentGear[item.type].stats.ap;
      const currentGearDp = currentGear[item.type].stats.dp;
      const potentialGearAp = item.stats.ap;
      const potentialGearDp = item.stats.dp;
      const apDiff = potentialGearAp - currentGearAp;
      const dpDiff = potentialGearDp - currentGearDp;
      const pricePerBillion = item.price / 1000000000;
      const apPerBillion = apDiff === 0 ? 0 : pricePerBillion / apDiff;
      const dpPerBillion = dpDiff === 0 ? 0 : pricePerBillion / dpDiff;

      const newItem = {
        ...item,
        perStatCost: {
          ap: apPerBillion,
          dp: dpPerBillion,
          total: pricePerBillion / (apDiff + dpDiff),
        },
        statChange: {
          ap: apDiff,
          dp: dpDiff,
          total: apDiff + dpDiff,
        },
      };

      // Remove items that are worse overall than the currently equipped item.
      if (
        newItem.perStatCost.total <= 0 ||
        newItem.perStatCost.total === Infinity ||
        newItem.perStatCost.total === null
      ) {
        return;
      }

      return newItem;
    })
    .filter((x) => x);

  return addCostPerStat;
};

const addCurrentGearStats = (data) => {
  const gearKeys = Object.keys(data).filter((key) => key !== 'characterClass');

  const updatedGear = {};

  for (let i = 0; i < gearKeys.length; i++) {
    updatedGear[gearKeys[i]] = {
      ...data[gearKeys[i]],
      stats: {
        ap:
          itemStats[gearKeys[i]][data[gearKeys[i]].name].enhanceLevel[
            data[gearKeys[i]].enhLevel
          ].ap,
        dp:
          itemStats[gearKeys[i]][data[gearKeys[i]].name].enhanceLevel[
            data[gearKeys[i]].enhLevel
          ].dp,
      },
    };
  }

  return updatedGear;
};

const getEffectiveAp = (item, itemLvl, caphrasLvl, baseAp) => {
  const itemAp =
    offhandStats[item][itemLvl].ap +
    caphraAp[itemLvl].caphrasLvl[caphrasLvl].bonusAp +
    Number(baseAp);

  const itemMonsterAp = offhandStats[item][itemLvl].monsterAp;

  const itemBonusAp = apBracket[itemAp];

  const itemEffectiveAp = itemAp + itemMonsterAp + itemBonusAp;

  return itemEffectiveAp;
};

const getCharacterGearPossibilities = (characterClass) => {
  const upgradeInfo = Object.keys(upgradeIds).map((key) => {
    let infoArr = [];
    const weaponTypes = ['mainHand', 'offhand', 'awakening'];
    const priEnhLevel = 16;
    const penEnhLevel = 20;
    const accpriEnhLevel = 1;
    const accPenEnhLevel = 5;

    if (key === 'class') {
      for (let i = 0; i < weaponTypes.length; i++) {
        for (let j = priEnhLevel; j <= penEnhLevel; j++) {
          infoArr.push(
            ...upgradeIds[key][characterClass][weaponTypes[i]].map((id) => {
              return {
                name: id.name,
                grade: id.grade,
                mainKey: id.id,
                subKey: j,
              };
            })
          );
        }
      }

      return infoArr;
    }

    if (key === 'armor') {
      const armorTypeKeys = Object.keys(upgradeIds[key]);

      for (let i = priEnhLevel; i <= penEnhLevel; i++) {
        for (let j = 0; j < armorTypeKeys.length; j++) {
          infoArr.push(
            ...upgradeIds[key][armorTypeKeys[j]].map((id) => {
              return {
                name: id.name,
                grade: id.grade,
                mainKey: id.id,
                subKey: i,
              };
            })
          );
        }
      }

      return infoArr;
    }

    if (key === 'accessories') {
      const accTypeKeys = Object.keys(upgradeIds[key]);

      for (let i = accpriEnhLevel; i <= accPenEnhLevel; i++) {
        for (let j = 0; j < accTypeKeys.length; j++) {
          infoArr.push(
            ...upgradeIds[key][accTypeKeys[j]].map((id) => {
              return {
                name: id.name,
                grade: id.grade,
                mainKey: id.id,
                subKey: i,
              };
            })
          );
        }
      }

      return infoArr;
    }
  });

  const formatUpgradeInfo = [
    ...upgradeInfo[0],
    ...upgradeInfo[1],
    ...upgradeInfo[2],
  ];

  return formatUpgradeInfo;
};

module.exports = {
  parallelSetup,
  formatData,
  caphrasNeeded,
  getStats,
  itemUpgradeParallelSetup,
  itemUpgradeDataFormat,
  addStats,
  addCurrentGearStats,
  calcCostPerStat,
  getEffectiveAp,
  getCharacterGearPossibilities,
};
