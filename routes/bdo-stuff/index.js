const express = require('express');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const refreshTokenRouter = require('./routes/refreshToken');
const userRouter = require('./routes/user');
const alertRouter = require('./routes/alert');

const router = express.Router();

router.use('/login', loginRouter);

router.use('/logout', logoutRouter);

router.use('/refresh_token', refreshTokenRouter);

router.use('/user', userRouter);

router.use('/alert', alertRouter);


module.exports = router;