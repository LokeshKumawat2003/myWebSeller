const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
  active: { type: Boolean, default: true },
  position: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Banner', BannerSchema);
