const express = require('express')
const apiConfig = require('../utils/apiConifg')

const router = express.Router()

router.get('/:mainCategory/:subCategory', async (req, res, next) => {
  const mainCategory = req.params.mainCategory
  const subCategory = req.params.subCategory

  const handleData = (err, data) => {
    if (err) throw new Error(err)

    res.send(data)
  }

  apiConfig.bdoApiCall('ItemList', { mainCategory, subCategory }, handleData)
})

module.exports = router
