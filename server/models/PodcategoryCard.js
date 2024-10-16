const mongoose = require('mongoose');

const PodcategoryCardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: false },
  categoryPageId: { type: mongoose.Schema.Types.ObjectId, ref: 'CategoryPage', required: true }
});

module.exports = mongoose.model('PodcategoryCard', PodcategoryCardSchema);