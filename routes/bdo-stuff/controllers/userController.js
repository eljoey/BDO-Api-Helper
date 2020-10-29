const bcrypt = require('bcrypt');
const User = require('../../../models/user');
const Alert = require('../../../models/alert');
const { body, validationResult } = require('express-validator');
const config = require('../../../utils/config');
const jwt = require('jsonwebtoken');

exports.user_get = async (req, res, next) => {
    const tokenUserId = req.decodedToken.id;

    try {
        const foundUser = await User.findById(tokenUserId);

        if (!foundUser) return res.status(404).json({ error: 'user not found' });

        res.json(foundUser);
    } catch (err) {
        next(err);
    }


};
exports.user_post = async (req, res, next) => {
    try {
        // validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { username, password, email } = req.body;

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            username,
            passwordHash,
            email,
            alerts: []
        });
        const savedUser = await newUser.save();

        // Issue a token
        const userTokenObj = {
            username: savedUser.username,
            id: savedUser._id
        };
        const token = jwt.sign(userTokenObj, config.SECRET);

        const userWithToken = {
            token,
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            alerts: []
        };

        res.send(userWithToken);

    } catch (err) {
        next(err);
    }

};
exports.user_put = (req, res, next) => {
    res.send('USER INFO UPDATED');
};
exports.user_delete = async (req, res, next) => {
    const tokenUserId = req.decodedToken.id;

    try {
        const userToDelete = await User.findById(tokenUserId);

        if (!userToDelete) return res.status(404).json({ error: 'user not found' });

        // removes all users alerts followed by the
        await Alert.deleteMany({
            _id: {
                $in: [
                    ...userToDelete.alerts
                ]
            }
        });
        await User.findByIdAndRemove(tokenUserId);

        res.status(204).end();

    } catch (err) {
        next(err);
    }
};

exports.validate = (method) => {
    switch (method) {
        case 'post':
            return [
                body('username', 'Username must be 5 characters or longer').trim().isLength({ min: 5 }).escape(),
                body('password', 'Password must be 7 characters or longer').trim().isLength({ min: 7 }).escape(),
                body('email', 'Invalid email').exists().isEmail().normalizeEmail()
            ];

        default:
            break;
    }
};