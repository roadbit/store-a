const mongoose = require('mongoose');

const heroSlideSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  categoryPageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PodcategoryPage',
    required: true
  }
}, {
  timestamps: true
});

const HeroSlide = mongoose.model('HeroSlide', heroSlideSchema);

module.exports = HeroSlide;