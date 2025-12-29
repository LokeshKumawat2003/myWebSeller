const mongoose = require("mongoose");

const SizeSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
  },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 }, // size-based discount
  stock: { type: Number, default: 0 },
  sku: { type: String, required: true },
});

const ColorVariantSchema = new mongoose.Schema({
  color: { type: String, required: true },
  images: [String], // images specific to this color
  material: String,
  fit: {
    type: String,
   
  },
  sizes: [SizeSchema],
});

const ProductSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" },
    title: { type: String, required: true },
    description: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    subcategory: String,
    clothingType: {
      type: String,
      // enum: ["men", "women", "kids", null],
      default: null
    },
    basePrice: { type: Number, required: true }, // default price
    baseDiscount: { type: Number, default: 0 },
    images: [String], // product images
    variants: [ColorVariantSchema], // 🔥 flipkart-style
    status: {
      type: String,
      enum: ["draft", "pending", "approved", "rejected"],
      default: "pending",
    },
    isBlocked: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isNew: { type: Boolean, default: true },
    isTrending: { type: Boolean, default: false },
    seasonalTag: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
