const express = require('express')
const apiController = require('./controllers/apiController')

const router = express.Router()

router.get('/prices', apiController.prices_get)

router.get('/search', apiController.search_get)

module.exports = router
