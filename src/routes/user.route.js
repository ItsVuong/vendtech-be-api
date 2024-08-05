const express = require('express');
const userController = require('../controllers/user.controller');
const router = express.Router();

router.post('/', userController.createUser)
router.post('/authenticate', userController.authenticateUser)

module.exports = router;