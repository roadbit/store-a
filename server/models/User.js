const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  city: { type: String },
  deliveryMethod: { type: String },
  deliveryAddress: { type: String },
  deliveryIndex: { type: String },
  paymentMethod: { type: String },
  departmentNumber: { type: String }
});

module.exports = mongoose.model('User', UserSchema);