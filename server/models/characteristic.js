const mongoose = require('mongoose');

const characteristicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: String, required: true }
});

module.exports = mongoose.model('Characteristic', characteristicSchema);