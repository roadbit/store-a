const mongoose = require('mongoose');

const PhoneNumberSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true
  }
});

const PhoneNumber = mongoose.model('PhoneNumber', PhoneNumberSchema);

module.exports = PhoneNumber;