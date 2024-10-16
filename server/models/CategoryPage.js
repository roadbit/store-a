const mongoose = require('mongoose');

const categoryPageSchema = new mongoose.Schema({
  title: { type: String, required: true },
});

module.exports = mongoose.model('CategoryPage', categoryPageSchema);