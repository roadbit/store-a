const mongoose = require('mongoose');

const ProductPageSchema = new mongoose.Schema({
    title: { type: String, required: true },
    code: { type: String, required: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    images: [{ type: String }],
    descrTitle: { type: String },
    descrText: { type: String },
    promo: { type: String },
    warranty: { 
      value: { type: Number }, 
      unit: { type: String } 
    },
    characteristics: [
      {
        name: { type: String, required: true },
        value: { type: String, required: true }
      }
    ]
  });
  
  module.exports = mongoose.model('ProductPage', ProductPageSchema);