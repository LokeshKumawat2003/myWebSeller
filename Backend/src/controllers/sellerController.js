const Seller = require("../models/Seller");
const User = require("../models/User");
const Order = require("../models/Order");

exports.requestSeller = async (req, res) => {
  try {
    const { storeName, logoUrl, bannerUrl } = req.body;
    // Create seller entry linked to the user; set approved=false until admin approves
    const existing = await Seller.findOne({ user: req.user._id });
    if (existing)
      return res
        .status(400)
        .json({ message: "Seller account already requested" });
    const seller = new Seller({
      user: req.user._id,
      storeName,
      logoUrl,
      bannerUrl,
      approved: false,
    });
    await seller.save();
    // update user role to seller (soft) - actual access limited until approved
    const user = await User.findById(req.user._id);
    user.role = "seller";
    await user.save();
    res.status(201).json({ message: "Seller request submitted", seller });
  } catch (err) {
    res.status(500).json({ message: "Error requesting seller account" });
  }
};

exports.getSeller = async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user._id }).populate('user', 'email name phone');
    res.json(seller);
  } catch (err) {
    res.status(500).json({ message: "Error fetching seller" });
  }
};

exports.getSellerOrders = async (req, res) => {
  try {
    // Find seller record for this user
    const seller = await Seller.findOne({ user: req.user._id });
    if (!seller) {
      return res.status(404).json({ message: "Seller profile not found" });
    }

    // Find all orders that have items from this seller. Support legacy orders where items.seller may store user id.
    let orders = await Order.find({
      $or: [{ "items.seller": seller._id }, { "items.seller": seller.user }],
    })
      .populate("user", "name email phone addresses")
      .populate("items.product", "title basePrice discount images")
      .sort({ createdAt: -1 })
      .lean();

    // For each order, keep only items that belong to this seller (match by Seller._id or Seller.user)
    for (const order of orders) {
      const sellerItems = [];
      for (const item of order.items) {
        // Try to resolve item.seller to a Seller doc (support legacy user id)
        const s = await Seller.findOne({
          $or: [{ _id: item.seller }, { user: item.seller }],
        }).select("storeName approved blocked user _id");
        if (
          s &&
          (String(s._id) === String(seller._id) ||
            String(s.user) === String(seller.user))
        ) {
          // attach normalized seller info and include the item
          sellerItems.push({
            ...item,
            seller: {
              _id: s._id,
              storeName: s.storeName,
              approved: s.approved,
              blocked: s.blocked,
            },
          });
        }
      }

      // Replace items with only seller's items
      order.items = sellerItems;

      // Compute seller-specific totals (pro-rate tax/shipping based on subtotal ratio)
      const sellerSubtotal = sellerItems.reduce(
        (sum, it) => sum + it.price * (it.qty || 1),
        0
      );
      const fullSubtotal = order.totals?.subtotal || 0;
      const ratio = fullSubtotal > 0 ? sellerSubtotal / fullSubtotal : 0;
      const sellerTax = Math.round((order.totals?.tax || 0) * ratio);
      const sellerShipping = Math.round((order.totals?.shipping || 0) * ratio);
      const sellerTotal = sellerSubtotal + sellerTax + sellerShipping;
      order.totals = {
        subtotal: sellerSubtotal,
        tax: sellerTax,
        shipping: sellerShipping,
        total: sellerTotal,
      };
    }

    // Return only orders where seller had items (should be true given query, but double-check)
    orders = orders.filter((o) => Array.isArray(o.items) && o.items.length > 0);

    res.json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching seller orders", error: err.message });
  }
};
