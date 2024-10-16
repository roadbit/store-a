const mongoose = require('mongoose');

const PodcategoryPageSchema = new mongoose.Schema({
  name: { type: String, required: false },
  title: { type: String, required: true },
  podcategoryCardId: { type: mongoose.Schema.Types.ObjectId, ref: 'PodcategoryCard', required: true }
});

module.exports = mongoose.model('PodcategoryPage', PodcategoryPageSchema);