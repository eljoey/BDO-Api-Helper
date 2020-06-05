const apiConfig = require('./apiConifg')

const parallelSetup = (idArr) => {
  const parallelCalls = idArr.map((id) => {
    return (callback) =>
      apiConfig.bdoApiCall('ItemInfo', { mainKey: id }, callback)
  })

  return parallelCalls
}

module.exports = {
  parallelSetup,
}
