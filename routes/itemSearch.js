const express = require('express')
const apiConfig = require('../utils/apiConifg')

const router = express.Router()

router.get('/:searchText', (req, res, next) => {
  const searchText = req.params.searchText.replace('+', ' ')

  const handleData = (err, data) => {
    if (err) throw new Error(err)

    res.send(data)
  }

  apiConfig.bdoApiCall('ItemSearch', { searchText }, handleData)
})

module.exports = router
