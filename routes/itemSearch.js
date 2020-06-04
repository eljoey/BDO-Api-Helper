const express = require('express')
const request = require('request')
const apiConfig = require('../helpers/apiConifg')

const router = express.Router()

router.get('/:searchText', (req, res, next) => {
  const searchText = req.params.searchText.replace('+', ' ')

  const config = apiConfig.createConfig('ItemSearch', { searchText })

  request(config, (err, response) => {
    if (err) throw new Error(err)

    res.send(JSON.parse(response.body))
  })
})

module.exports = router
