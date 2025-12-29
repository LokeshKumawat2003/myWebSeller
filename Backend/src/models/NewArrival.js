const mongoose = require("mongoose");

const NewArrivalSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    order: { type: Number, default: 0 }, // for ordering
  },
  { timestamps: true }
);

// Ensure one product per new arrival
NewArrivalSchema.index({ product: 1 }, { unique: true });

module.exports = mongoose.model("NewArrival", NewArrivalSchema);