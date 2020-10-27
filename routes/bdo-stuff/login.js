const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const config = require('../../utils/config');

const router = express.Router();

router.post('/', async (req, res, next) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username }, '+passwordHash');
    const passCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash);

    if (!(user && passCorrect)) {
        return res.status(401).json({
            error: 'Invalid Username or Password'
        });
    }

    const tokenUserObj = {
        username: user.username,
        id: user._id
    };

    const token = jwt.sign(tokenUserObj, config.SECRET);

    res.status(200).send({
        token,
        id: user._id,
        username: user.username,
        email: user.email,
        alerts: user.alerts
    });

});

module.exports = router;