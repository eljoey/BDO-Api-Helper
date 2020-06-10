const express = require('express')
const mpCloneController = require('./controllers/mpCloneController')

const router = express.Router()

router.get('/item-info/:itemId', mpCloneController.itemInfo_get)

router.get(
  '/item-list/:mainCategory/:subCategory',
  mpCloneController.itemList_get
)

router.get('/item-pricing/:mainKey/:subKey', mpCloneController.itemPricing_get)

router.get('/item-search/:searchText', mpCloneController.itemSearch_get)

module.exports = router
