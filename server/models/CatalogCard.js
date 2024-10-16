const mongoose = require('mongoose');

const catalogCardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  categoryPageId: { type: mongoose.Schema.Types.ObjectId, ref: 'CategoryPage', default: null },
});

module.exports = mongoose.model('CatalogCard', catalogCardSchema);