const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../../../models/user');

const router = express.Router();

router.post('/', async (req, res) => {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) return res.status(401).end();

    const decodedToken = jwt.decode(refreshToken);
    const user = await User.findById(decodedToken.id, '+refreshToken');

    // Remove refresh token
    user.refreshToken = undefined;
    await user.save();

    res.clearCookie('refresh_token')
        .status(204)
        .end();
});

module.exports = router;