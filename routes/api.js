const express = require('express');
const apiController = require('./controllers/apiController');
const middleware = require('../utils/middleware');

const router = express.Router();

router.get('/prices', (req, res) => {
  res.status(400).json({
    error: 'Categories are cooking, alchemy, and fish'
  });
});

router.get(
  '/prices/:category/',
  middleware.cache(300),
  apiController.prices_get
);

router.get('/item-search', (req, res) => {
  res.status(400).json({
    error: 'Need a item id'
  });
});

router.get('/item-search/:id', apiController.single_item_search_get);

router.post('/search', apiController.search_post);

router.get('/caphras-calc', apiController.caphras_calc_get);

router.post('/item-upgrade', apiController.item_upgrade_post);

router.get('/kutum-or-nouver', apiController.kutum_or_nouver_get);

router.get('/orders', apiController.get_order);

module.exports = router;
