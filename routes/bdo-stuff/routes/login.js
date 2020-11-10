const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../../../models/user');
const jwt = require('jsonwebtoken');
const config = require('../../../utils/config');

const router = express.Router();

router.post('/', async (req, res, next) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username }, '+passwordHash +refreshToken');
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

    // Create refresh token and save to db (no expiration)
    const refreshToken = jwt.sign(tokenUserObj, config.REFRESH_TOKEN_SECRET);
    const updatedUser = {
        ...user.toObject(),
        refreshToken
    };
    await User.findByIdAndUpdate(user._id, updatedUser);


    // Create access token (30 minute expiration)
    const token = jwt.sign(tokenUserObj, config.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
    const tokenExpires = new Date();
    tokenExpires.setMinutes(tokenExpires.getMinutes() + 30);

    // Set cookie header to refresh token and send info
    res.cookie('refresh_token', refreshToken, { httpOnly: true })
        .status(200)
        .send({
            token,
            tokenExpires: tokenExpires.toUTCString(),
            id: user._id,
            username: user.username,
            email: user.email,
            alerts: user.alerts
        });

});

module.exports = router;