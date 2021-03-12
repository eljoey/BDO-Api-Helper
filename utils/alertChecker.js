const Alert = require('../models/alert');
const NaItem = require('../models/NaItem');
const EuItem = require('../models/EuItem');
const helpers = require('./helpers');
const async = require('async');
const mailer = require('./mailer');

// TODO: Add enhLevel option for alerts
const alertChecker = async () => {
    console.log('Starting Alert Check...');
    try {
        // Only grab active alerts
        const alerts = await Alert.find({ active: true }).populate({ path: 'user', select: ['email', 'username'], });

        // If no alerts exit
        if (!alerts.length) {
            console.log('No Alerts Exiting...');
            return;
        };

        // loop through alerts. Get price, check if triggered.  If triggered email alert and update alert to inactive.
        for (let i = 0; i < alerts.length; i++) {
            let alert = alerts[i];
            let region = alert.region === 'na' ? NaItem : EuItem;
            let item = await region.findOne({ itemId: alert.itemId });
            let itemPrice = item.getEnhLevel(0).price;
            const sendAlert = isAlertFired(alert, itemPrice);

            // Alert is triggered, send email
            if (sendAlert) {
                const username = alert.user.username;
                const userEmail = alert.user.email;
                const userAlert = `${alert.direction} ${alert.price}`;
                const itemName = item.name;
                mailer.sendAlert(username, userEmail, userAlert, itemName);

                // turn off alert
                const updatedAlert = {
                    ...alert.toObject(),
                    active: false
                };
                await Alert.findByIdAndUpdate(alert._id, updatedAlert);
            }


        }
    } catch (err) {
        console.log(err);
    }
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

// 30m interval
const timeInterval = 30 * 60 * 1000;

const alertCheckerInterval = () => {
    setInterval(alertChecker, timeInterval);
};

module.exports = alertCheckerInterval;