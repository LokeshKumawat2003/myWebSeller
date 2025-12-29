const Order = require('../models/Order');

exports.checkout = async (req, res) => {
  try {
    const { items, shippingAddress, payment } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ message: 'Cart is empty' });
    
    // Calculate totals
    let subtotal = 0;
    items.forEach(item => {
      subtotal += item.price * item.qty;
    });
    const tax = Math.round(subtotal * 0.18); // 18% GST
    const shipping = subtotal > 500 ? 0 : 50; // Free shipping over 500
    const total = subtotal + tax + shipping;
    
    // Normalize seller references in items: ensure each item.seller stores a Seller._id
    const Seller = require('../models/Seller');
    const normalizedItems = [];
    for (const item of items) {
      let sellerId = item.seller;
      let sellerDoc = null;
      if (!sellerId) {
        // try to resolve from product if possible
        if (item.product) {
          const Product = require('../models/Product');
          const pd = await Product.findById(item.product).lean();
          if (pd && pd.seller) sellerId = pd.seller;
        }
      }
      if (sellerId) {
        // Try as Seller._id
        sellerDoc = await Seller.findById(sellerId);
        if (!sellerDoc) {
          // Try resolving by user id
          sellerDoc = await Seller.findOne({ user: sellerId });
        }
      }
      if (!sellerDoc) {
        return res.status(400).json({ message: 'Seller for one of the items could not be resolved' });
      }
      normalizedItems.push({ ...item, seller: sellerDoc._id });
    }

    const order = new Order({
      user: req.user._id,
      items: normalizedItems,
      shippingAddress,
      payment,
      status: 'pending',
      totals: { subtotal, tax, shipping, total }
    });
    await order.save();
    res.status(201).json({ message: 'Order placed', order });
  } catch (err) {
    res.status(500).json({ message: 'Error placing order', error: err.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    let order = await Order.findById(req.params.id)
      .populate('user', 'name email phone addresses')
      .populate('items.product', 'title basePrice discount images')
      .lean();
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (String(order.user) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Normalize seller info for items
    const Seller = require('../models/Seller');
    for (const item of order.items) {
      if (item.seller) {
        const s = await Seller.findOne({ $or: [ { _id: item.seller }, { user: item.seller } ] }).select('storeName approved blocked');
        if (s) item.seller = { _id: s._id, storeName: s.storeName, approved: s.approved, blocked: s.blocked };
        else item.seller = null;
      }
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching order' });
  }
};

exports.listUserOrders = async (req, res) => {
  try {
    let orders = await Order.find({ user: req.user._id })
      .populate('user', 'name email phone addresses')
      .populate('items.product', 'title basePrice discount images')
      .sort({ createdAt: -1 })
      .lean();

    const Seller = require('../models/Seller');
    for (const order of orders) {
      for (const item of order.items) {
        if (item.seller) {
          const s = await Seller.findOne({ $or: [ { _id: item.seller }, { user: item.seller } ] }).select('storeName approved blocked');
          if (s) item.seller = { _id: s._id, storeName: s.storeName, approved: s.approved, blocked: s.blocked };
          else item.seller = null;
        }
      }
    }

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id).populate({
      path: 'items.seller',
      populate: { path: 'user' }
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Check authorization: admin can update any order, seller can update orders with their items
    if (req.user.role !== 'admin') {
      if (req.user.role !== 'seller') {
        return res.status(403).json({ message: 'Unauthorized - not a seller' });
      }
      
      // Prevent sellers from updating delivered orders
      if (order.status === 'delivered') {
        return res.status(403).json({ message: 'Cannot update status of delivered orders' });
      }
      
      // Check if seller has items in this order by comparing seller.user._id with req.user._id
      const Seller = require('../models/Seller');
      const sellerDoc = await Seller.findOne({ user: req.user._id });
      if (!sellerDoc) {
        return res.status(403).json({ message: 'Seller profile not found' });
      }
      // item.seller may be stored as Seller._id, User._id, or populated object. Compare multiple ways.
      const sellerHasItems = order.items.some(item => {
        if (!item.seller) return false;
        // populated object with _id
        if (item.seller._id) {
          return item.seller._id.toString() === sellerDoc._id.toString();
        }
        // raw id equal to seller._id
        if (String(item.seller) === String(sellerDoc._id)) return true;
        // raw id equal to seller.user
        if (String(item.seller) === String(sellerDoc.user)) return true;
        return false;
      });
      if (!sellerHasItems) {
        return res.status(403).json({ message: 'You do not have items in this order' });
      }
    }
    
    order.status = status;
    
    // Set delivery date and shipped timestamp when status changes to shipped
    if (status === 'shipped') {
      order.shippedAt = new Date();
      // Calculate delivery date as 7 days from shipped date
      const deliveryDate = new Date(order.shippedAt);
      deliveryDate.setDate(deliveryDate.getDate() + 7);
      order.deliveryDate = deliveryDate;
    }
    
    await order.save();
    res.json({ message: 'Order status updated', order });
  } catch (err) {
    res.status(500).json({ message: 'Error updating order status', error: err.message });
  }
};
