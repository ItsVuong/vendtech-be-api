const express = require('express');
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const router = express.Router();

router.get('/', userController.getUsers)
router.get('/:username', userController.getUserByUsername)
router.post('/', authenticate, userController.createUser)
router.post('/authenticate', userController.authenticateUser)
router.post("/update", authenticate, userController.updateUser)

module.exports = router;