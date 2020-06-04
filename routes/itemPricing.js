const express = require('express')
const request = require('request')
const apiConfig = require('../helpers/apiConifg')

const router = express.Router()

router.get('/:mainKey/:subKey', (req, res, next) => {
  // I am assuming that keyType and isUp NEVER change. If they end up changing because of something I cant detect, add them
  const formData = {
    mainKey: req.params.mainKey,
    subKey: req.params.subKey,
    keyType: '0',
    isUp: 'True',
  }

  const config = apiConfig.createConfig('ItemPricing', formData)

  request(config, function (err, response) {
    if (err) throw new Error(err)
    res.send(JSON.parse(response.body))
  })
})

module.exports = router
