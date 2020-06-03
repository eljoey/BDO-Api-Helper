const express = require('express')
const getApiConfig = require('../helpers/getApiConifg')
const request = require('request')

const router = express.Router()

router.get('/:category/:categoryNumber', async (req, res, next) => {
  const category = req.params.category
  const categoryNumber = req.params.categoryNumber

  let options = getApiConfig.ItemList(category, categoryNumber)

  request(options, function (err, response) {
    if (err) throw new Error(err)
    res.send(JSON.parse(response.body))
  })
})

module.exports = router
