const express = require('express')
const apiController = require('./controllers/apiController')
const middleware = require('../utils/middleware')

const router = express.Router()

router.get('/prices', (req, res, next) =>
  res.status(400).json({
    error: `Incomplete route, add a category to request (cooking, alchemy or fish)`,
  })
)

router.get('/prices/:category', middleware.cache(300), apiController.prices_get)

router.get('/search', apiController.search_get)

module.exports = router
