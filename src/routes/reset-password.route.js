const express = require('express');
const userController = require('../controllers/user.controller');
const router = express.Router();

router.get('/:email', userController.getPasswordResetToken)
router.post('/', userController.resetPassword)

module.exports = router;