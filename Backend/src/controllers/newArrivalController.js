const NewArrival = require('../models/NewArrival');
const Product = require('../models/Product');

exports.getNewArrivals = async (req, res) => {
  try {
    const { limit = 4 } = req.query;
    const newArrivals = await NewArrival.find()
      .populate({
        path: 'product',
        match: { status: 'approved', isBlocked: false },
        populate: { path: 'seller', select: 'storeName' }
      })
      .sort({ order: 1, createdAt: -1 })
      .limit(Number(limit))
      .lean();

    // Filter out null products (if product was deleted or not approved)
    const validArrivals = newArrivals.filter(na => na.product);

    res.json({ products: validArrivals.map(na => na.product) });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching new arrivals', error: err.message });
  }
};

exports.addToNewArrivals = async (req, res) => {
  try {
    const { productId } = req.params;

    // Check if product exists and is approved
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.status !== 'approved' || product.isBlocked) {
      return res.status(400).json({ message: 'Product must be approved and not blocked' });
    }

    // Check if already in new arrivals
    const existing = await NewArrival.findOne({ product: productId });
    if (existing) return res.status(400).json({ message: 'Product already in new arrivals' });

    const newArrival = new NewArrival({ product: productId });
    await newArrival.save();

    res.json({ message: 'Product added to new arrivals', newArrival });
  } catch (err) {
    res.status(500).json({ message: 'Error adding to new arrivals', error: err.message });
  }
};

exports.removeFromNewArrivals = async (req, res) => {
  try {
    const { productId } = req.params;

    const result = await NewArrival.findOneAndDelete({ product: productId });
    if (!result) return res.status(404).json({ message: 'Product not in new arrivals' });

    res.json({ message: 'Product removed from new arrivals' });
  } catch (err) {
    res.status(500).json({ message: 'Error removing from new arrivals', error: err.message });
  }
};

exports.listNewArrivals = async (req, res) => {
  try {
    const newArrivals = await NewArrival.find()
      .populate({
        path: 'product',
        populate: { path: 'seller', select: 'storeName' }
      })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    res.json({ newArrivals });
  } catch (err) {
    res.status(500).json({ message: 'Error listing new arrivals', error: err.message });
  }
};

exports.updateNewArrivalOrder = async (req, res) => {
  try {
    const { productId } = req.params;
    const { order } = req.body;

    const result = await NewArrival.findOneAndUpdate(
      { product: productId },
      { order: order || 0 },
      { new: true }
    );

    if (!result) return res.status(404).json({ message: 'New arrival not found' });

    res.json({ message: 'Order updated', newArrival: result });
  } catch (err) {
    res.status(500).json({ message: 'Error updating order', error: err.message });
  }
};