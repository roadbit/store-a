const mongoose = require('mongoose');

const filterGroupSchema = new mongoose.Schema({
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true },
  groupName: { type: String, required: true },
  checkboxes: [{ type: String }]
});

module.exports = mongoose.model('FilterGroup', filterGroupSchema);