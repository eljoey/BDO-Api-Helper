const async = require('async')
const helpers = require('../../utils/helpers')
const alchMatsJSON = require('../../Ingredients/Alchemy.json')
const fishMatsJSON = require('../../Ingredients/DriedFish.json')
const cookMatsJSON = require('../../Ingredients/Cooking.json')

exports.prices_get = async (req, res, next) => {
  const category = req.params.category

  const validCategories = ['cooking', 'alchemy', 'fish']
  const matInfo = {
    fish: fishMatsJSON,
    cooking: cookMatsJSON,
    alchemy: alchMatsJSON,
  }

  // Validate
  if (!validCategories.includes(category)) {
    return res.status(400).json({
      error: `Invalid category parameter given: ${category}`,
    })
  }

  let ids = matInfo[category].map((item) => item.id)

  const parallelApiCalls = helpers.parallelSetup(ids)

  async.parallel(parallelApiCalls, (err, results) => {
    if (err) {
      console.log(err)
    }

    let data = helpers.formatData(results)

    res.send(data)
  })
}

exports.search_get = (req, res, next) => {
  const ids = req.body.ids

  if (!ids) {
    res.status(400).json({
      error: 'No Ids given',
    })
  }

  const parallelApiCalls = helpers.parallelSetup(ids)

  async.parallel(parallelApiCalls, (err, results) => {
    if (err) {
      console.log(err)
    }

    let data = helpers.formatData(results)
    res.send(data)
  })
}
