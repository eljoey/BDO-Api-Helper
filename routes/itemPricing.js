const express = require('express')
const request = require('request')
const getApiConfig = require('../helpers/getApiConifg')

const router = express.Router()

router.get('/:mainKey/:subKey', (req, res, next) => {
  // I am assuming that keyType and isUp NEVER change. If they end up changing because of something I cant detect, add them
  const mainKey = req.params.mainKey
  const subKey = req.params.subKey

  const config = getApiConfig.ItemPricing(mainKey, subKey)

  request(config, function (err, response) {
    if (err) throw new Error(err)
    res.send(JSON.parse(response.body))
  })
})

module.exports = router
