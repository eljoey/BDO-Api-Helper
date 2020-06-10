const async = require('async')
const helpers = require('../../utils/helpers')
const alchMatsJSON = require('../../Ingredients/Alchemy.json')
const fishMatsJSON = require('../../Ingredients/DriedFish.json')
const cookMatsJSON = require('../../Ingredients/Cooking.json')

exports.prices_get = (req, res, next) => {
  const validTags = ['cooking', 'alchemy', 'fish']
  const matInfo = {
    fish: fishMatsJSON,
    cooking: cookMatsJSON,
    alchemy: alchMatsJSON,
  }

  // Grab queries
  const tags = !req.query.tags
    ? undefined
    : req.query.tags.toLowerCase().split(',')

  // Remove duplicates
  const formattedTags = [...new Set(tags)]

  // Validate Tags
  if (!tags) {
    return res.status(400).json({
      error: 'No tags given',
    })
  } else if (tags) {
    for (let i = 0; i < tags.length; i++) {
      if (!validTags.includes(tags[i])) {
        return res.status(400).json({
          error: `Invalid tags parameter given: ${tags[i]}`,
        })
      }
    }
  }

  let combinedInfo = []
  for (let i = 0; i < formattedTags.length; i++) {
    combinedInfo = [...combinedInfo, ...matInfo[formattedTags[i]]]
  }

  let ids = combinedInfo.map((item) => item.id)

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
