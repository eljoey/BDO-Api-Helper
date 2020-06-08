const mcache = require('memory-cache')

const cache = (duration) => {
  return (req, res, next) => {
    const key = 'BDO' + req.originalUrl || req.url
    const cachedBody = mcache.get(key)

    if (cachedBody) {
      return res.json(cachedBody)
    } else {
      res.sendResponse = res.json
      res.json = (body) => {
        mcache.put(key, body, duration * 1000)
        res.sendResponse(body)
      }
      next()
    }
  }
}

module.exports = {
  cache,
}
