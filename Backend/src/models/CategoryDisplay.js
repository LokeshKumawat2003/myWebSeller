const mongoose = require('mongoose');

const CategoryDisplaySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String, default: '' },
  position: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('CategoryDisplay', CategoryDisplaySchema);
