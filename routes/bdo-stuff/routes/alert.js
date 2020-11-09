const express = require('express');
const alertController = require('../controllers/alertController');
const middleware = require('../../../utils/middleware');

const router = express.Router();

router.use(middleware.validateToken);

// get all alerts
router.get('/', alertController.alerts_get);

// get single alert
router.get('/:alertId', alertController.alert_get);

// create alert
router.post('/', alertController.alert_create);

// update alert
router.put('/:alertId', alertController.alert_update);

// delete alert
router.delete('/:alertId', alertController.alert_delete);

module.exports = router;