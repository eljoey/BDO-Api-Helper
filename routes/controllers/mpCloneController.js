const apiConfig = require('../../utils/apiConifg')

exports.itemInfo_get = (req, res, next) => {
  const mainKey = req.params.itemId

  const handleData = (err, data) => {
    if (err) throw new Error(err)

    res.send(data)
  }

  apiConfig.bdoApiCall('ItemInfo', { mainKey }, handleData)
}

exports.itemList_get = async (req, res, next) => {
  const mainCategory = req.params.mainCategory
  const subCategory = req.params.subCategory

  const handleData = (err, data) => {
    if (err) throw new Error(err)

    res.send(data)
  }

  apiConfig.bdoApiCall('ItemList', { mainCategory, subCategory }, handleData)
}

exports.itemPricing_get = (req, res, next) => {
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
}

exports.itemSearch_get = (req, res, next) => {
  const searchText = req.params.searchText.replace('+', ' ')

  const handleData = (err, data) => {
    if (err) throw new Error(err)

    res.send(data)
  }

  apiConfig.bdoApiCall('ItemSearch', { searchText }, handleData)
}
