const express = require('express');
const middleware = require('../../utils/middleware');
const userController = require('./controllers/userController');

const router = express.Router();


// route to get user
router.get('/:userId', middleware.validateToken, userController.user_get);

// route to create new user
router.post('/', userController.validate('post'), userController.user_post);

// route to delete user
router.put('/:userId', middleware.validateToken, userController.user_put);

// router to update user
router.delete('/:userId', middleware.validateToken, userController.user_delete);

module.exports = router;