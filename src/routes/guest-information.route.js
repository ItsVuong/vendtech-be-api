const express = require('express');
const guestInfoController = require('../controllers/guest-information.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/', guestInfoController.createGuestInfo)
router.get('/', authenticate, guestInfoController.getGuestInfos)
router.delete('/:id', authenticate, guestInfoController.deleteGuestInfo)

module.exports = router;