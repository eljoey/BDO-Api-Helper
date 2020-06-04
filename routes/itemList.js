const express = require('express')
const apiConfig = require('../helpers/apiConifg')
const request = require('request')

const router = express.Router()

router.get('/:category/:categoryNumber', async (req, res, next) => {
  const category = req.params.category
  const categoryNumber = req.params.categoryNumber

  let config = apiConfig.createConfig('ItemList', { category, categoryNumber })

  request(config, function (err, response) {
    if (err) throw new Error(err)
    res.send(JSON.parse(response.body))
  })
})

module.exports = router
