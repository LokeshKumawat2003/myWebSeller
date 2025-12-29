const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

exports.getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate('items.product', 'title basePrice baseDiscount images seller')
      .populate('items.product.seller', 'storeName');

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, items: [] });
      await wishlist.save();
    }

    // Transform the data to include discount field for frontend compatibility
    const transformedItems = wishlist.items.map(item => ({
      ...item.toObject(),
      product: {
        ...item.product.toObject(),
        discount: item.product.baseDiscount || 0
      }
    }));

    res.json(transformedItems);
  } catch (err) {
    console.error('Error fetching wishlist:', err);
    res.status(500).json({ message: 'Error fetching wishlist' });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { product, variant } = req.body;

    // Validate product exists
    const productDoc = await Product.findById(product);
    if (!productDoc) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, items: [] });
    }

    // Check if item already exists in wishlist
    const existing = wishlist.items.find(item =>
      item.product.toString() === product &&
      JSON.stringify(item.variant) === JSON.stringify(variant)
    );

    if (existing) {
      return res.status(400).json({ message: 'Item already in wishlist' });
    }

    // Add new item
    wishlist.items.push({
      product,
      variant,
      seller: productDoc.seller
    });

    await wishlist.save();

    // Populate and return the added item
    await wishlist.populate('items.product', 'title basePrice discount images seller');
    await wishlist.populate('items.product.seller', 'storeName');

    const addedItem = wishlist.items[wishlist.items.length - 1];
    res.status(201).json(addedItem);
  } catch (err) {
    console.error('Error adding to wishlist:', err);
    res.status(500).json({ message: 'Error adding to wishlist' });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { itemId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    const itemIndex = wishlist.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in wishlist' });
    }

    wishlist.items.splice(itemIndex, 1);
    await wishlist.save();

    res.json({ message: 'Item removed from wishlist' });
  } catch (err) {
    console.error('Error removing from wishlist:', err);
    res.status(500).json({ message: 'Error removing from wishlist' });
  }
};

exports.checkWishlistStatus = async (req, res) => {
  try {
    const { product, variant } = req.query;

    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return res.json({ isWishlisted: false });
    }

    const isWishlisted = wishlist.items.some(item =>
      item.product.toString() === product &&
      JSON.stringify(item.variant) === JSON.stringify(variant)
    );

    res.json({ isWishlisted });
  } catch (err) {
    console.error('Error checking wishlist status:', err);
    res.status(500).json({ message: 'Error checking wishlist status' });
  }
};