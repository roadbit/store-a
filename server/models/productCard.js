const mongoose = require('mongoose');

const productCardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  oldPrice: { type: Number },
  image: { type: String, required: true },
  podcategoryPageId: { type: mongoose.Schema.Types.ObjectId, ref: 'PodcategoryPage', required: true },
  promoLabel: { type: String, enum: ['АКЦІЯ', 'ТОП ПРОДАЖУ', 'ХІТ ПРОДАЖУ', 'НОВИНКА'], required: false },
  productPageId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductPage' },
  characteristics: [
    {
      name: { type: String, required: true },
      value: { type: String, required: true }
    }
  ]
});

module.exports = mongoose.model('ProductCard', productCardSchema);