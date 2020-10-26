const express = require('express');
const userController = require('./controllers/userController');

const router = express.Router();


// route to get user
router.get('/:userId', userController.user_get);

// route to create new user
router.post('/:userId', userController.user_post);

// route to delete user
router.put('/:userId', userController.user_put);

// router to update user
router.delete('/:userId', userController.user_delete);

module.exports = router;