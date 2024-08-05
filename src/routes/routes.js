const express = require('express');
const router = express.Router();
const category = require('./category.route');
const product = require('./product.route');
const guestInfo = require('./guest-information.route');
const user = require('./user.route')
const multer = require('multer');

//middleware for uploading image
const upload = multer({ storage: multer.memoryStorage() });

const api = router
  .use('/product', upload.single('fileName'), product)
  .use('/category', category)
  .use('/guestInfo', guestInfo)
  .use('/user', user)

module.exports = router.use('/api', api) 