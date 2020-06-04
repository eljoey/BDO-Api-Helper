const express = require('express')
const request = require('request')
const apiConfig = require('../helpers/apiConifg')

const router = express.Router()

router.get('/:itemKey', (req, res, next) => {
  const mainKey = req.params.itemKey

  const config = apiConfig.createConfig('ItemInfo', { mainKey })

  console.log(config)
  request(config, function (err, response) {
    if (err) throw new Error(err)
    res.send(JSON.parse(response.body))
  })
})

module.exports = router
