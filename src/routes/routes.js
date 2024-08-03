const product = require('./product.route')
const express = require('express');
const router = express.Router();
const upload = require('../controllers/product.controller')

const api = router
  .use('/product', product)
  .use('/upload', upload)

module.exports = router.use('/api', api) 