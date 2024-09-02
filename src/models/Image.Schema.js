const mongoose = require('mongoose');

ImageSchema = mongoose.Schema({
    name: String,
    type: String,
    url: String,
  });

  module.exports = ImageSchema