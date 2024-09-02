const express = require('express');
const router = express.Router();
const category = require('./category.route');
const product = require('./product.route');
const guestInfo = require('./guest-information.route');
const resetPassword = require('./reset-password.route');
const user = require('./user.route')
const multer = require('multer');

//middleware for uploading image
const upload = multer({ storage: multer.memoryStorage() });

const api = router
  .use('/product', upload.single('fileName'), product)
  .use('/category', upload.single('fileName'), category)
  .use('/guestInfo', guestInfo)
  .use('/user', user)
  .use('/reset-password', resetPassword)
module.exports = router.use('/api', api) 