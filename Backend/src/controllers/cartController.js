const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'title basePrice discount images seller');
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
      await cart.save();
    }
    // Populate seller info for each product
    await cart.populate('items.product.seller', 'storeName');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart' });
  }
};

exports.addItem = async (req, res) => {
  try {
    const { product, variant, qty, price } = req.body;
    console.log('Add to cart - Product ID:', product);
    console.log('Variant:', variant);
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });
    
    // Fetch product to get seller info
    const Product = require('../models/Product');
    const productDoc = await Product.findById(product);
    console.log('Product Doc found:', !!productDoc);
    if (productDoc) {
      console.log('Product status:', productDoc.status, 'isBlocked:', productDoc.isBlocked);
    }
    if (!productDoc) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const existing = cart.items.find(i => i.product.toString() === product && JSON.stringify(i.variant) === JSON.stringify(variant));
    if (existing) {
      existing.qty += qty || 1;
    } else {
      cart.items.push({ 
        product, 
        variant, 
        qty: qty || 1, 
        price,
        seller: productDoc.seller 
      });
    }
    await cart.save();
    // Populate before sending response
    await cart.populate('items.product', 'title basePrice discount images seller');
    await cart.populate('items.product.seller', 'storeName');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Error updating cart', error: err.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { qty } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    item.qty = qty;
    await cart.save();

    // Return populated cart for frontend
    const populatedCart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'title basePrice discount images seller')
      .populate('items.product.seller', 'storeName');
    res.json(populatedCart);
  } catch (err) {
    res.status(500).json({ message: 'Error updating item' });
  }
};

exports.removeItem = async (req, res) => {
  try {
    // Find cart without population to avoid issues with populated documents
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    // Use pull method instead of id().remove() for more reliable removal
    const itemIndex = cart.items.findIndex(item => item._id.toString() === req.params.itemId);
    if (itemIndex === -1) return res.status(404).json({ message: 'Item not found in cart' });

    cart.items.splice(itemIndex, 1);
    await cart.save();

    // Return populated cart for frontend
    const populatedCart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'title basePrice discount images seller')
      .populate('items.product.seller', 'storeName');
    res.json(populatedCart);
  } catch (err) {
    console.error('Error removing cart item:', err);
    res.status(500).json({ message: 'Error removing item', error: err.message });
  }
};