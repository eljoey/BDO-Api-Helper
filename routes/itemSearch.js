const express = require('express')
const request = require('request')
const getApiConfig = require('../helpers/getApiConifg')

const router = express.Router()

router.get('/:searchText', (req, res, next) => {
  const searchText = req.params.searchText

  const config = getApiConfig.ItemSearch(searchText)

  request(config, (err, response) => {
    if (err) throw new Error(err)

    res.send(JSON.parse(response.body))
  })
})

module.exports = router
