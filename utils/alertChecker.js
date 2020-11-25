const Alert = require('../models/alert');
const helpers = require('./helpers');
const async = require('async');
const mailer = require('./mailer');

const alertChecker = async () => {
    try {
        // Only grab active alerts
        const alerts = await Alert.find({ active: true });

        // If no alerts exit
        if (!alerts.length) return;

        // Split for each region
        const alertByRegion = { 'na': [], 'eu': [] };
        alerts.forEach(alert => {
            if (alert.region === 'na') {
                alertByRegion.na = [...alertByRegion.na, alert];
            } else {
                alertByRegion.eu = [...alertByRegion.eu, alert];
            }
        });

        // Remove duplicate ItemIds to remove possiblity of calling BDO's api a lot of times for same itemId.
        const naNoDupes = removeDuplicateAlertsByItemId(alertByRegion.na);
        const euNoDupes = removeDuplicateAlertsByItemId(alertByRegion.eu);

        // Check alerts & email if necessary
        if (!naNoDupes.length) {
            alertHandling(naNoDupes, 'na');
        }
        if (!euNoDupes.length) {
            alertHandling(euNoDupes, 'eu');
        }

    } catch (err) {
        console.log(err);
    }
};

const removeDuplicateAlertsByItemId = (alertArr) => {
    const noDupesArray = [... new Set(alertArr.map(alert => alert.itemId))];
    return noDupesArray;
};

const isAlertFired = (alert, marketPrice) => {
    if (alert.direction === 'greater than or equal to' && marketPrice >= alert.price) {
        return true;
    }

    if (alert.direction === 'less than or equal to' && marketPrice <= alert.price) {
        return true;
    }

    // alert not met
    return false;
};

const alertHandling = (idArr, region) => {
    const parallels = helpers.parallelSetup(idArr, region);
    async.parallelLimit(parallels, 50, async (err, results) => {
        if (err) { console.log(err); }

        let data = helpers.formatData(results);

        // Get all alerts for the region
        const regionAlerts = await Alert.find({ region, active: true }).populate({ path: 'user', select: ['email', 'username'], });

        // check if alert is supposed to go
        for (let i = 0; i < regionAlerts.length; i++) {
            const checkedAlert = regionAlerts[i];
            const foundItem = data.find(item => item.id === checkedAlert.itemId);
            // true if triggered
            const sendAlert = isAlertFired(checkedAlert, foundItem.price);

            // Alert is triggered, send email
            if (sendAlert) {
                const username = checkedAlert.user.username;
                const userEmail = checkedAlert.user.userEmail;
                const alert = `${checkedAlert.direction} ${checkedAlert.price}`;
                const itemName = foundItem.name;
                mailer.sendAlert(username, userEmail, alert, itemName);

                // turn off alert
                const updatedAlert = {
                    ...checkedAlert.toObject(),
                    active: false
                };
                await Alert.findByIdAndUpdate(checkedAlert._id, updatedAlert);
            }

        }
    });
};


// 30m interval
const timeInterval = 30 * 60 * 1000;

const alertCheckerInterval = () => {
    setInterval(alertChecker, timeInterval);
};

module.exports = alertCheckerInterval;