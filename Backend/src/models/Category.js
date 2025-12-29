const mongoose = require('mongoose');

const AttributeSchema = new mongoose.Schema({
  name: String,
  values: [String],
});

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
  attributes: [AttributeSchema],
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);
