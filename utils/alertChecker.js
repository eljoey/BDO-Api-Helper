const User = require('../models/user');
const Alert = require('../models/alert');
const apiConfig = require('./apiConifg');
const helpers = require('./helpers');
const async = require('async');

const alertChecker = async () => {
    console.log("CHECKING ACTIVE ALERTS...");
    try {
        // Only grab active alerts
        const alerts = await Alert.find({ active: true });

        // If no alerts exit
        if (!alerts.length) {
            console.log('NO ACTIVE ALERTS!');
            return;
        };

        // Split for each region
        const alertByRegion = { 'na': [], 'eu': [] };
        alerts.forEach(alert => {
            if (alert.region === 'na') {
                alertByRegion.na = [...alertByRegion.na, alert];
            } else {
                alertByRegion.eu = [...alertByRegion.eu, alert];
            }
        });

        // Remove duplicate ItemIds
        const naNoDupes = removeDuplicateAlertsByItemId(alertByRegion.na);
        const euNoDupes = removeDuplicateAlertsByItemId(alertByRegion.eu);

        // Check alerts & email if necessary
        alertHandling(naNoDupes, 'na');
        alertHandling(euNoDupes, 'eu');

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

    // no alerts met
    return false;
};

const alertHandling = (idArr, region) => {
    const parallels = helpers.parallelSetup(idArr, region);
    async.parallelLimit(parallels, 50, async (err, results) => {
        if (err) { console.log(err); }

        let data = helpers.formatData(results);

        // Get all alerts for the region
        const regionAlerts = await Alert.find({ region, active: true }).populate({ path: 'user', select: 'email' });

        // check if alert is supposed to go
        for (let i = 0; i < regionAlerts.length; i++) {
            const triggeredAlert = regionAlerts[i];
            const priceOfItemId = data.find(item => item.id === triggeredAlert.itemId).price;
            const sendAlert = isAlertFired(triggeredAlert, priceOfItemId);

            // Alert is triggered, send email
            if (sendAlert) {
                console.log(`THIS IS A PRETEND EMAIL SENT TO: ${triggeredAlert.user.email}`);

                // turn off alert
                const updatedAlert = {
                    ...triggeredAlert.toObject(),
                    active: false
                };
                await Alert.findByIdAndUpdate(triggeredAlert._id, updatedAlert);
            }

        }
    });
};


// Currently 10s. change to 30m when finished testing.
const timeInterval = 10 * 1000;

const alertCheckerInterval = () => {
    setInterval(alertChecker, timeInterval);
};

module.exports = alertCheckerInterval;