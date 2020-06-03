const express = require('express')
const request = require('request')
const getApiConfig = require('../helpers/getApiConifg')

const router = express.Router()

router.get('/:itemKey', (req, res, next) => {
  const itemKey = req.params.itemKey

  const config = getApiConfig.ItemInfo(itemKey)

  request(config, function (err, response) {
    if (err) throw new Error(err)
    res.send(JSON.parse(response.body))
  })
})

module.exports = router
