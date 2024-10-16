const mongoose = require('mongoose');

const cardlineProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    page: { type: mongoose.Schema.Types.ObjectId, ref: 'PodcategoryPage', required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CardlineProduct', cardlineProductSchema);