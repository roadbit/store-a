const mongoose = require('mongoose');

const ReplySchema = new mongoose.Schema({
  name: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const ReviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pros: { type: String, required: true },
  cons: { type: String, required: true },
  reviewText: { type: String, required: true },
  rating: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  replies: [ReplySchema],
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductPage', required: true, },
});

module.exports = mongoose.model('Review', ReviewSchema);