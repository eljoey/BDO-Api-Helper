const express = require('express')
const apiConfig = require('../utils/apiConifg')

const router = express.Router()

router.get('/:mainKey/:subKey', (req, res, next) => {
  // I am assuming that keyType and isUp NEVER change. If they end up changing because of something I cant detect, add them
  const formData = {
    mainKey: req.params.mainKey,
    subKey: req.params.subKey,
    keyType: '0',
    isUp: 'True',
  }

  const handleData = (err, data) => {
    if (err) throw new Error(err)

    res.send(data)
  }

  apiConfig.bdoApiCall('ItemPricing', formData, handleData)
})

module.exports = router
