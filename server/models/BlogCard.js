const mongoose = require('mongoose');

const BlogCardSchema = new mongoose.Schema({
  text: { type: String, required: true },
  pageId: { type: mongoose.Schema.Types.ObjectId, ref: 'BlogPage', required: true },
  image: { type: String, required: true },
});

module.exports = mongoose.model('BlogCard', BlogCardSchema);