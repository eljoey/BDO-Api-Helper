const async = require('async');
const helpers = require('../../utils/helpers');
const alchMatsJSON = require('../../data/Alchemy.json');
const fishMatsJSON = require('../../data/DriedFish.json');
const cookMatsJSON = require('../../data/Cooking.json');

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

// TODO: More validation
// TODO: Update Docs for Caphras Calc

exports.caphras_calc_get = (req, res, next) => {
  const { item, enhLevel, curLevel, desiredLevel, region } = req.query;

  const validRegions = ['na', 'eu'];

  if (!item || !enhLevel || !curLevel || !desiredLevel) {
    return res.status(400).json({
      error: 'Missing query.  Please verify that you have all required queries',
    });
  }
  if (!validRegions.includes(region)) {
    return res.status(400).json({
      error: 'Invalid or no region given',
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
