const express = require('express');
const guestInfoController = require('../controllers/guest-information.controller');
const router = express.Router();

router.post('/', guestInfoController.createGuestInfo)
router.get('/', guestInfoController.getGuestInfos)
router.delete('/:id', guestInfoController.deleteGuestInfo)

module.exports = router;