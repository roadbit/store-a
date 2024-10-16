const mongoose = require('mongoose');

const sliderCardIntSchema = new mongoose.Schema({
  productPage: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductPage', required: true },
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  promo: { type: String },
});

module.exports = mongoose.model('SliderCardInt', sliderCardIntSchema);