const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../../../models/user');
const config = require('../../../utils/config');

const router = express.Router();

router.post('/', async (req, res) => {
    const refreshToken = req.cookies.refresh_token;

    // No refresh token in header
    if (!refreshToken) return res.status(401).end();

    const decodedToken = jwt.decode(refreshToken);

    // Get user refresh token from db and check if it matches
    const user = await User.findById(decodedToken.id, '+refreshToken');

    // Refresh tokens dont match
    if (refreshToken !== user.refreshToken) return res.status(403).end();

    // Create access token (1 minute expiration)
    const tokenUserObj = {
        username: user.username,
        id: user._id
    };
    const token = jwt.sign(tokenUserObj, config.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
    const tokenExpires = new Date();
    tokenExpires.setMinutes(tokenExpires.getMinutes() + 1);

    res.send({
        token,
        tokenExpires: tokenExpires.toUTCString(),
        id: user._id,
        username: user.username,
        email: user.email,
        alerts: user.alerts
    });
});

module.exports = router;