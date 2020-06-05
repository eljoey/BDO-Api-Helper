const express = require('express')
const driedFishJson = require('../Ingredients/DriedFish.json')
const helpers = require('../utils/helpers')
const async = require('async')

const router = express.Router()

router.get('/', (req, res, next) => {
  const driedFishIds = driedFishJson.map((fish) => fish.id)

  const parallelApiCalls = helpers.parallelSetup(driedFishIds)

  async.parallel(parallelApiCalls, (err, results) => {
    if (err) {
      console.log(err)
    }

    let data = []

    for (let i = 0; i < results.length; i++) {
      for (let j = 0; j < results[i].detailList.length; j++) {
        const dataObj = results[i].detailList[j]

        const formatedData = {
          name: dataObj.name,
          price: dataObj.pricePerOne,
          count: dataObj.count,
        }

        data.push(formatedData)
      }
    }

    res.send(data)
  })
})

module.exports = router
