const express = require('express')
const apiConfig = require('../utils/apiConifg')

const router = express.Router()

router.get('/:itemKey', (req, res, next) => {
  const mainKey = req.params.itemKey

  const handleData = (err, data) => {
    if (err) throw new Error(err)

    res.send(data)
  }

  apiConfig.bdoApiCall('ItemInfo', { mainKey }, handleData)
})

module.exports = router
