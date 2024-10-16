const mongoose = require('mongoose');

const FooterLinksSchema = new mongoose.Schema({
  facebook: { type: String, default: '' },
  instagram: { type: String, default: '' },
  telegram: { type: String, default: '' },
  tiktok: { type: String, default: '' },
  phone1: { type: String, default: '' },
  phone2: { type: String, default: '' }
});

module.exports = mongoose.model('FooterLinks', FooterLinksSchema);