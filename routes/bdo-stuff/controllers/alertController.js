const Alert = require('../../../models/alert');
const User = require('../../../models/user');

exports.alerts_get = async (req, res, next) => {
    const userId = req.decodedToken.id;

    try {
        const user = await User.findById(userId).populate('alerts');

        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({
            alerts: user.alerts
        });
    } catch (err) {
        next(err);
    }
};

exports.alert_get = async (req, res, next) => {
    const { alert } = req.params;

    try {
        const alert = Alert.findById(alert);

        if (!alert) return res.status(404).json({ error: 'Alert not found' });

        res.json(alert);
    } catch (err) {
        next(err);
    }
};

exports.alert_create = async (req, res, next) => {
    const userId = req.decodedToken.id;
    const { itemId, name, region, price, direction, enhLevel } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ error: 'User not found' });

        // create and save new alert
        const alert = new Alert({
            itemId,
            name,
            region,
            enhLevel,
            price,
            direction,
            user: user._id
        });
        const newAlert = await alert.save();

        // update user with new alert
        user.alerts = user.alerts.concat(newAlert._id);
        await user.save();

        res.json(newAlert);
    } catch (err) {
        next(err);
    }
};

exports.alert_update = async (req, res, next) => {
    const { alertId } = req.params;
    const { itemId, name, price, direction, active } = req.body;
    const userId = req.decodedToken.id;
    const alert = {
        itemId,
        name,
        price,
        direction,
        user: userId,
        active
    };

    try {
        const userInfo = await User.findById(userId);
        const alertInfo = await Alert.findById(alertId);
        if (!userInfo) return res.status(404).json({ error: 'User not found' });
        if (!alertInfo) return res.status(404).json({ error: 'Alert not found' });
        if (userId !== alertInfo.user._id.toString()) return res.status(403).json({ error: 'Access denied' });

        const updatedAlert = await Alert.findByIdAndUpdate(alertId, alert, { new: true });

        res.json(updatedAlert);
    } catch (err) {
        next(err);
    }
};

exports.alert_delete = async (req, res, next) => {
    const { alertId } = req.params;
    const userId = req.decodedToken.id;

    try {
        const alert = await Alert.findById(alertId);
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        if (!alert) return res.status(404).json({ error: 'Alert not found' });
        if (alert.user.toString() !== userId) return res.status(403).json({ error: 'Access denied' });

        // remove alert from user alert array
        const filteredAlerts = user.alerts.filter(alert => alert.toString() !== alertId);
        user.alerts = filteredAlerts;
        await user.save();

        await Alert.findByIdAndRemove(alertId);

        res.status(204).end();
    } catch (err) {
        next(err);
    }
};