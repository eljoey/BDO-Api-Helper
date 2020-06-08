const express = require('express')
const alchMats = require('../Ingredients/Alchemy.json')
const helpers = require('../utils/helpers')
const async = require('async')

const router = express.Router()

router.get('/', (req, res, next) => {
  const alchMatIds = alchMats.map((item) => item.id)

  const parallelApiCalls = helpers.parallelSetup(alchMatIds)

  async.parallel(parallelApiCalls, (err, results) => {
    if (err) {
      console.log(err)
    }

    let data = helpers.formatData(results)

    res.send(data)
  })
})

module.exports = router
