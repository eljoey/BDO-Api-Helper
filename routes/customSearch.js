const express = require('express')
const helpers = require('../utils/helpers')
const async = require('async')

const router = express.Router()

router.get('/', (req, res, next) => {
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
})

module.exports = router
