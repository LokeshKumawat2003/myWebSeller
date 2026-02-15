const Product = require('../models/Product');
const Seller = require('../models/Seller');
const Category = require('../models/Category');

exports.createProduct = async (req, res) => {
  try {
    const { title, description, category, subcategory, clothingType, basePrice, discount } = req.body;
    let { variants } = req.body;
    // If product was submitted as multipart/form-data, variants may arrive as a JSON string
    if (typeof variants === 'string') {
      try {
        variants = JSON.parse(variants);
      } catch (e) {
        variants = [];
      }
    }
    if (!title || !basePrice) return res.status(400).json({ message: 'Missing required fields' });
    
    // Find seller document for this user
    const sellerDoc = await Seller.findOne({ user: req.user._id });
    if (!sellerDoc) return res.status(400).json({ message: 'Seller profile not found. Please request a seller account.' });

    // validate category id when provided
    if (category) {
      const catExists = await Category.findById(category).lean();
      if (!catExists) return res.status(400).json({ message: 'Invalid category' });
    }

    // Get image URLs from multer/Cloudinary
    const images = req.files && req.files.length > 0 
      ? req.files.map(file => file.path) 
      : [];

    const product = new Product({
      seller: sellerDoc._id,
      title,
      description,
      category,
      subcategory,
      clothingType,
      basePrice: Number(basePrice) || 0,
      discount: Number(discount) || 0,
      variants: Array.isArray(variants) ? variants : [],
      images: images,
      // default status is 'pending' (configured in schema). Do not auto-approve seller-submitted products.
    });
    await product.save();
    res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    res.status(500).json({ message: 'Error creating product', error: err.message });
  }
};

exports.listProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, minPrice, maxPrice, sort = '-createdAt' } = req.query;
    let filter = { status: 'approved', isBlocked: false };
    if (category) filter.category = category; // expects category id
    if (minPrice || maxPrice) {
      filter.basePrice = {};
      if (minPrice) filter.basePrice.$gte = Number(minPrice);
      if (maxPrice) filter.basePrice.$lte = Number(maxPrice);
    }
    const skip = (page - 1) * limit;
    // Fetch products (without relying on populate to avoid missing sellers when product.seller stores a User id)
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    // Collect referenced seller ids and category ids
    const sellerIds = Array.from(new Set(products.map(p => p.seller).filter(Boolean).map(String)));
    const categoryIds = Array.from(new Set(products.map(p => p.category).filter(Boolean).map(String)));

    // Find seller documents either by _id or by user (some products may have been saved with user id previously)
    const sellers = await Seller.find({ $or: [ { _id: { $in: sellerIds } }, { user: { $in: sellerIds } } ] }).select('storeName approved blocked user');
    // Find categories referenced
    const categories = categoryIds.length ? await Category.find({ _id: { $in: categoryIds } }).select('name') : [];
    const categoryIdsMap = {};
    for (const c of categories) categoryIdsMap[String(c._id)] = c;
    const sellerById = {};
    const sellerByUser = {};
    for (const s of sellers) {
      sellerById[String(s._id)] = s;
      if (s.user) sellerByUser[String(s.user)] = s;
    }

    // Attach seller and category info and filter out products belonging to unapproved/blocked sellers
    const visibleProducts = products.map(p => {
      const sid = String(p.seller);
      let sellerDoc = sellerById[sid] || sellerByUser[sid] || null;
      if (sellerDoc) {
        p.seller = { _id: sellerDoc._id, storeName: sellerDoc.storeName, approved: sellerDoc.approved, blocked: sellerDoc.blocked };
      } else {
        p.seller = null;
      }
      // attach category info if available
      const cid = p.category ? String(p.category) : null;
      if (cid && categoryIds.length > 0) {
        const cat = categoryIdsMap && categoryIdsMap[cid];
        if (cat) p.category = { _id: cat._id, name: cat.name };
      }
      // Filter variants to only include those with available stock
      if (p.variants && p.variants.length > 0) {
        p.variants = p.variants.filter(variant => 
          variant.sizes && variant.sizes.some(size => size.stock > 0)
        );
      }
      return p;
    }).filter(p => p.seller && p.seller.approved && !p.seller.blocked && p.variants && p.variants.length > 0);

    const total = await Product.countDocuments(filter);
    res.json({ products: visibleProducts, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
};

exports.getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 12 } = req.query;
    const filter = {
      status: 'approved',
      isBlocked: false,
      $or: [
        { isFeatured: true },
        { isTrending: true },
        { isNew: true }
      ]
    };

    const products = await Product.find(filter)
      .populate('seller', 'storeName')
      .populate('category', 'name')
      .sort({ isFeatured: -1, isTrending: -1, isNew: -1, createdAt: -1 })
      .limit(Number(limit))
      .lean();

    // Filter products to only include those with available stock variants
    const filteredProducts = products.filter(p => {
      if (p.variants && p.variants.length > 0) {
        p.variants = p.variants.filter(variant => 
          variant.sizes && variant.sizes.some(size => size.stock > 0)
        );
        return p.variants.length > 0;
      }
      return false;
    });

    res.json({ products: filteredProducts });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching featured products', error: err.message });
  }
};

exports.getNewArrivals = async (req, res) => {
  try {
    const { limit = 4 } = req.query;
    const products = await Product.find({
      status: 'approved',
      isBlocked: false,
      isNew: true
    })
      .populate('seller', 'storeName')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .lean();

    // Filter products to only include those with available stock variants
    const filteredProducts = products.filter(p => {
      if (p.variants && p.variants.length > 0) {
        p.variants = p.variants.filter(variant => 
          variant.sizes && variant.sizes.some(size => size.stock > 0)
        );
        return p.variants.length > 0;
      }
      return false;
    });

    res.json({ products: filteredProducts });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching new arrivals', error: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    // Load product and try to resolve seller whether product.seller stores Seller._id or User._id
    const product = await Product.findOne({ _id: req.params.id, status: 'approved', isBlocked: false }).lean();
    if (!product) return res.status(404).json({ message: 'Product not found' });
    let sellerDoc = null;
    if (product.seller) {
      sellerDoc = await Seller.findOne({ $or: [ { _id: product.seller }, { user: product.seller } ] }).select('storeName approved blocked');
    }
    if (sellerDoc) {
      product.seller = { _id: sellerDoc._id, storeName: sellerDoc.storeName, approved: sellerDoc.approved, blocked: sellerDoc.blocked };
    } else {
      product.seller = null;
    }
    // Attach category info if present
    if (product.category) {
      try {
        const cat = await Category.findById(product.category).select('name');
        if (cat) product.category = { _id: cat._id, name: cat.name };
      } catch (e) {}
    }
    // Filter variants to only include those with available stock
    if (product.variants && product.variants.length > 0) {
      product.variants = product.variants.filter(variant => 
        variant.sizes && variant.sizes.some(size => size.stock > 0)
      );
      if (product.variants.length === 0) {
        return res.status(404).json({ message: 'Product not available' });
      }
    } else {
      return res.status(404).json({ message: 'Product not available' });
    }
    // Transform _id to id for frontend compatibility
    product.id = product._id.toString();
    delete product._id;
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching product' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    // Allow seller to update own product or admin to update any
    if (req.user.role !== 'admin') {
      const sellerDoc = await Seller.findOne({ user: req.user._id });
      if (!sellerDoc) return res.status(403).json({ message: 'Unauthorized' });
      if (product.seller.toString() !== sellerDoc._id.toString()) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
    }
    // Prevent non-admins (sellers) from changing approval status directly
    if (req.user.role !== 'admin' && 'status' in req.body) {
      delete req.body.status;
    }
    
    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path);
      req.body.images = newImages;
      // build a map of original filename -> uploaded url so we can map variant files
      const nameToUrl = {};
      req.files.forEach(f => {
        if (f.originalname) nameToUrl[f.originalname] = f.path;
      });
      // If client sent variantFiles mapping, attach uploaded files to corresponding variants
      if (req.body.variantFiles) {
        try {
          const variantFiles = typeof req.body.variantFiles === 'string' ? JSON.parse(req.body.variantFiles) : req.body.variantFiles;
          // ensure variants array exists
          req.body.variants = req.body.variants || [];
          for (const [variantIdx, fileNames] of Object.entries(variantFiles)) {
            const idx = Number(variantIdx);
            if (Number.isNaN(idx)) continue;
            const urls = (fileNames || []).map(fname => nameToUrl[fname]).filter(Boolean);
            if (!req.body.variants[idx]) req.body.variants[idx] = {};
            // merge with existing images for variant
            req.body.variants[idx].images = Array.isArray(req.body.variants[idx].images) ? req.body.variants[idx].images.concat(urls) : urls;
          }
        } catch (e) {
          // ignore mapping errors
        }
      }
    }
    // If variants or other complex fields were submitted as JSON strings (FormData), parse them
    if (req.body.variants && typeof req.body.variants === 'string') {
      try {
        req.body.variants = JSON.parse(req.body.variants);
      } catch (e) {
        req.body.variants = [];
      }
    }
    // Ensure numeric fields are cast
    if (req.body.basePrice) req.body.basePrice = Number(req.body.basePrice);
    if (req.body.discount) req.body.discount = Number(req.body.discount);

    // Prevent overwriting the product.seller with malformed input from the client
    const updates = { ...req.body };
    if ('seller' in updates) delete updates.seller;

    Object.assign(product, updates);
    await product.save();
    res.json({ message: 'Product updated', product });
  } catch (err) {
    res.status(500).json({ message: 'Error updating product', error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (req.user.role !== 'admin') {
      const sellerDoc = await Seller.findOne({ user: req.user._id });
      if (!sellerDoc) return res.status(403).json({ message: 'Unauthorized' });
      if (product.seller.toString() !== sellerDoc._id.toString()) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product' });
  }
};

exports.getSellerProducts = async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user._id });
    if (!seller) return res.status(404).json({ message: 'Seller profile not found' });

    // Find products where product.seller is either the Seller._id or (legacy) the User._id
    let products = await Product.find({ $or: [ { seller: seller._id }, { seller: seller.user } ] })
      .sort({ createdAt: -1 })
      .lean();

    // Normalize attached seller info for each product
    for (const p of products) {
      p.seller = { _id: seller._id, storeName: seller.storeName, approved: seller.approved, blocked: seller.blocked };
    }

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching seller products' });
  }
};

// Admin: list all products (with all statuses)
exports.adminListProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
    const skip = (page - 1) * limit;
    
    const products = await Product.find()
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    // Normalize seller and category info
    const sellerIds = Array.from(new Set(products.map(p => p.seller).filter(Boolean).map(String)));
    const categoryIds = Array.from(new Set(products.map(p => p.category).filter(Boolean).map(String)));

    const sellers = await Seller.find({ $or: [ { _id: { $in: sellerIds } }, { user: { $in: sellerIds } } ] }).select('storeName approved blocked user');
    const categories = categoryIds.length ? await Category.find({ _id: { $in: categoryIds } }).select('name') : [];
    
    const sellerById = {}, sellerByUser = {}, categoryById = {};
    for (const s of sellers) {
      sellerById[String(s._id)] = s;
      if (s.user) sellerByUser[String(s.user)] = s;
    }
    for (const c of categories) categoryById[String(c._id)] = c;

    const enrichedProducts = products.map(p => {
      const sid = String(p.seller);
      const sellerDoc = sellerById[sid] || sellerByUser[sid];
      if (sellerDoc) {
        p.seller = { _id: sellerDoc._id, storeName: sellerDoc.storeName, approved: sellerDoc.approved, blocked: sellerDoc.blocked };
      }
      const cid = p.category ? String(p.category) : null;
      if (cid && categoryById[cid]) {
        p.category = { _id: categoryById[cid]._id, name: categoryById[cid].name };
      }
      return p;
    });

    const total = await Product.countDocuments();
    res.json({ products: enrichedProducts, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
};

// Admin: update product status (draft, pending, approved, rejected)
exports.adminUpdateProductStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !['draft', 'pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const product = await Product.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product status updated', product });
  } catch (err) {
    res.status(500).json({ message: 'Error updating product status', error: err.message });
  }
};

// Admin: block/unblock product (hide from public listing)
exports.adminBlockProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isBlocked: true }, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product blocked', product });
  } catch (err) {
    res.status(500).json({ message: 'Error blocking product', error: err.message });
  }
};

exports.adminUnblockProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isBlocked: false }, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product unblocked', product });
  } catch (err) {
    res.status(500).json({ message: 'Error unblocking product', error: err.message });
  }
};

// Admin: delete product
exports.adminDeleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted', product });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product', error: err.message });
  }
};

// Admin: toggle featured status
exports.adminToggleFeatured = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.isFeatured = !product.isFeatured;
    await product.save();

    res.json({
      message: `Product ${product.isFeatured ? 'marked as' : 'unmarked as'} featured`,
      product
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating featured status', error: err.message });
  }
};

// Admin: toggle trending status
exports.adminToggleTrending = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.isTrending = !product.isTrending;
    await product.save();

    res.json({
      message: `Product ${product.isTrending ? 'marked as' : 'unmarked as'} trending`,
      product
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating trending status', error: err.message });
  }
};

// Admin: toggle new status
exports.adminToggleNew = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.isNew = !product.isNew;
    await product.save();

    res.json({
      message: `Product ${product.isNew ? 'marked as' : 'unmarked as'} new`,
      product
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating new status', error: err.message });
  }
};
