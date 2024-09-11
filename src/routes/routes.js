const express = require('express');
const router = express.Router();
const category = require('./category.route');
const foodAndDrinkCategory = require('./food-drink-category.route');
const product = require('./product.route');
const foodAndDrink = require('./food-drink.route');
const guestInfo = require('./guest-information.route');
const resetPassword = require('./reset-password.route');
const user = require('./user.route')
const multer = require('multer');
const { HttpException } = require('../exceptions/exception');

//middleware for uploading image
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype?.includes("image")) {
      cb(null, true);
    } else {
      cb(null, false);
      const err = new Error('Only image format (jpg, png...) allowed!')
      err.name = 'ExtensionError'
      err.status = 400
      return cb(err);
    }
  }
});

const api = router
  .use('/product', upload.fields([
    {name: 'fileName', maxCount: 20},
    {name: 'mainImage', maxCount: 1}
  ]), product)
  .use('/food-drink', upload.array('fileName', 20), foodAndDrink)
  .use('/category', upload.single('fileName'), category)
  .use('/food-drink-category', upload.single('fileName'), foodAndDrinkCategory)
  .use('/guestInfo', guestInfo)
  .use('/user', user)
  .use('/reset-password', resetPassword)
module.exports = router.use('/api', api) 