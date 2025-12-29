const Seller = require('../models/Seller');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const Category = require('../models/Category');
const bcrypt = require('bcrypt');

exports.listSellers = async (req, res) => {
  try {
    const sellers = await Seller.find()
      .populate('user', 'name email role')
      .lean();
    return res.json(sellers);
  } catch (err) {
    console.error('listSellers error', err);
    return res.status(500).json({ message: 'Error fetching sellers', error: err.message });
  }
};

exports.approveSeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) return res.status(404).json({ message: 'Seller not found' });
    seller.approved = true;
    await seller.save();
    res.json({ message: 'Seller approved', seller });
  } catch (err) {
    res.status(500).json({ message: 'Error approving seller' });
  }
};

exports.blockSeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) return res.status(404).json({ message: 'Seller not found' });
    seller.blocked = true;
    await seller.save();
    return res.json({ message: 'Seller blocked', seller });
  } catch (err) {
    console.error('blockSeller error', err);
    return res.status(500).json({ message: 'Error blocking seller', error: err.message });
  }
};

exports.unblockSeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) return res.status(404).json({ message: 'Seller not found' });
    seller.blocked = false;
    await seller.save();
    return res.json({ message: 'Seller unblocked', seller });
  } catch (err) {
    console.error('unblockSeller error', err);
    return res.status(500).json({ message: 'Error unblocking seller', error: err.message });
  }
};

exports.approveProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.status = 'approved';
    await product.save();
    res.json({ message: 'Product approved', product });
  } catch (err) {
    res.status(500).json({ message: 'Error approving product' });
  }
};

exports.listProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('seller', 'storeName');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
};

exports.listOrders = async (req, res) => {
  try {
    let orders = await Order.find()
      .populate('user', 'name email phone addresses')
      .populate('items.product', 'title basePrice discount images')
      .sort({ createdAt: -1 })
      .lean();

    // Normalize seller references for items (support legacy where items.seller might be a User id)
    const sellerIds = Array.from(new Set(orders.flatMap(o => o.items.map(i => i.seller)).filter(Boolean).map(String)));
    const sellers = await Seller.find({ $or: [ { _id: { $in: sellerIds } }, { user: { $in: sellerIds } } ] }).select('storeName user approved blocked');
    const byId = {};
    const byUser = {};
    for (const s of sellers) {
      byId[String(s._id)] = s;
      if (s.user) byUser[String(s.user)] = s;
    }

    for (const order of orders) {
      for (const item of order.items) {
        const sid = String(item.seller || '');
        const s = byId[sid] || byUser[sid] || null;
        if (s) item.seller = { _id: s._id, storeName: s.storeName, approved: s.approved, blocked: s.blocked };
        else item.seller = null;
      }
    }

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders', error: err.message });
  }
};

// Admin-only helper to seed a test seller for development/testing.
exports.seedSeller = async (req, res) => {
  try {
    const ts = Date.now()
    const email = `test-seller-${ts}@example.com`
    const name = `Test Seller ${ts}`
    const password = 'Password123'
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = new User({ name, email, passwordHash, role: 'seller' })
    await user.save()

    const seller = new Seller({ user: user._id, storeName: `Store ${ts}`, approved: false })
    await seller.save()

    return res.status(201).json({ message: 'Seeded test seller', seller, credentials: { email, password } })
  } catch (err) {
    console.error('seedSeller error', err)
    return res.status(500).json({ message: 'Error seeding seller', error: err.message })
  }
}

// Admin: Mark order as delivered (makes earnings available for payout)
exports.markOrderDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    order.status = 'delivered';
    await order.save();
    res.json({ message: 'Order marked as delivered', order });
  } catch (err) {
    res.status(500).json({ message: 'Error marking order as delivered', error: err.message });
  }
};

// Admin-only helper to seed basic categories for development/testing
exports.listAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' })
      .select('name email _id')
      .lean();
    return res.json(admins);
  } catch (err) {
    console.error('listAdmins error', err);
    return res.status(500).json({ message: 'Error fetching admins', error: err.message });
  }
};

exports.seedCategories = async (req, res) => {
  try {
    const categories = [
      {
        name: 'Men',
        description: 'Men\'s fashion and clothing',
        attributes: [
          { name: 'Size', values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
          { name: 'Color', values: ['Black', 'White', 'Blue', 'Gray', 'Red', 'Green', 'Navy'] },
          { name: 'Material', values: ['Cotton', 'Polyester', 'Denim', 'Linen', 'Wool'] },
          { name: 'Fit', values: ['Slim', 'Regular', 'Loose', 'Oversized'] }
        ]
      },
      {
        name: 'Women',
        description: 'Women\'s fashion and clothing',
        attributes: [
          { name: 'Size', values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
          { name: 'Color', values: ['Black', 'White', 'Pink', 'Red', 'Blue', 'Green', 'Purple'] },
          { name: 'Material', values: ['Cotton', 'Polyester', 'Silk', 'Chiffon', 'Denim', 'Lace'] },
          { name: 'Fit', values: ['Slim', 'Regular', 'Loose', 'Bodycon', 'Oversized'] }
        ]
      },
      {
        name: 'Sneakers',
        description: 'Athletic and casual sneakers',
        attributes: [
          { name: 'Size', values: ['6', '7', '8', '9', '10', '11', '12', '13'] },
          { name: 'Color', values: ['Black', 'White', 'Gray', 'Blue', 'Red', 'Green', 'Multi'] },
          { name: 'Material', values: ['Synthetic', 'Leather', 'Canvas', 'Mesh', 'Rubber'] },
          { name: 'Type', values: ['Running', 'Basketball', 'Casual', 'Training', 'Walking'] }
        ]
      }
    ];

    const createdCategories = [];
    const existingCategories = [];

    for (const catData of categories) {
      try {
        // Check if category already exists
        const existing = await Category.findOne({ name: catData.name });
        if (existing) {
          existingCategories.push(existing);
          continue;
        }

        // Create new category
        const category = new Category({
          name: catData.name,
          slug: catData.name.toLowerCase(),
          description: catData.description,
          attributes: catData.attributes
        });

        await category.save();
        createdCategories.push(category);
      } catch (err) {
        console.error(`Error creating category ${catData.name}:`, err.message);
      }
    }

    return res.status(201).json({
      message: 'Categories seeded successfully',
      created: createdCategories,
      existing: existingCategories,
      totalCreated: createdCategories.length,
      totalExisting: existingCategories.length
    });
  } catch (err) {
    console.error('seedCategories error', err);
    return res.status(500).json({ message: 'Error seeding categories', error: err.message });
  }
};

// Admin-only helper to seed basic products for development/testing
exports.seedProducts = async (req, res) => {
  try {
    const seller = await Seller.findOne({ approved: true });
    if (!seller) return res.status(400).json({ message: 'No approved seller found. Seed a seller first and approve it.' });

    const category = await Category.findOne();
    if (!category) return res.status(400).json({ message: 'No category found. Seed categories first.' });

    const products = [
      {
        seller: seller._id,
        title: "Premium Cotton Shirt",
        description: "Experience ultimate comfort with our premium cotton shirt. Made from 100% organic cotton, this shirt offers breathability and style that lasts. Perfect for casual outings or office wear.",
        basePrice: 2300,
        discount: 10,
        images: [
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop",
          "https://images.unsplash.com/photo-1506629905607-0b5ab9a9e21a?w=600&h=600&fit=crop"
        ],
        category: category._id,
        variants: [
          { color: "White", sizes: [{ size: "S", price: 2300, stock: 10, discount: 0, sku: "PCS-W-S" }, { size: "M", price: 2300, stock: 15, discount: 0, sku: "PCS-W-M" }, { size: "L", price: 2300, stock: 8, discount: 0, sku: "PCS-W-L" }, { size: "XL", price: 2300, stock: 5, discount: 0, sku: "PCS-W-XL" }] }
        ],
        status: "approved",
        isBlocked: false,
        isFeatured: true,
        isNew: true,
        isTrending: false,
        createdAt: new Date()
      }
    ];

    const createdProducts = [];
    for (const p of products) {
      const product = new Product(p);
      await product.save();
      createdProducts.push(product);
    }

    return res.status(201).json({
      message: 'Products seeded successfully',
      products: createdProducts
    });
  } catch (err) {
    console.error('seedProducts error', err);
    return res.status(500).json({ message: 'Error seeding products', error: err.message });
  }
};

