const mongoose = require('mongoose');

const blogPageSchema = new mongoose.Schema({
  title: String,
  description: String,
  images: [String],
});

module.exports = mongoose.model('BlogPage', blogPageSchema);