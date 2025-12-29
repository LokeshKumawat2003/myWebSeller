const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
  try {
    let { name, description, attributes, parent } = req.body;
    if (!name) return res.status(400).json({ message: 'Category name is required' });

    // Auto-generate slug from name
    const slug = String(name).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

    // Normalize attributes: accept array or JSON string, ensure each attribute has name and values array
    if (attributes && typeof attributes === 'string') {
      try {
        attributes = JSON.parse(attributes);
      } catch (e) {
        // if it's a comma-separated name/value pair string, ignore and set to empty
        attributes = [];
      }
    }
    if (!Array.isArray(attributes)) attributes = [];
    attributes = attributes.map(a => {
      if (!a) return null;
      const nameAttr = a.name || a.attrName || '';
      let values = a.values || a.vals || [];
      if (typeof values === 'string') values = values.split(',').map(v => v.trim()).filter(Boolean);
      if (!Array.isArray(values)) values = [];
      return { name: String(nameAttr).trim(), values };
    }).filter(Boolean);

    const cat = new Category({ name, slug, description, attributes, parent });
    await cat.save();
    res.status(201).json(cat);
  } catch (err) {
    // Handle duplicate key (unique name/slug) more clearly
    if (err && err.code === 11000) {
      return res.status(400).json({ message: 'Category name or slug already exists', error: err.message });
    }
    res.status(500).json({ message: 'Error creating category', error: err.message });
  }
};

exports.listCategories = async (req, res) => {
  try {
    const cats = await Category.find().lean();
    res.json(cats);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: 'Not found' });
    res.json(cat);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching category' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    let update = Object.assign({}, req.body);
    const name = update.name;
    // Auto-generate slug if name is being changed
    if (name) {
      update.slug = String(name).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    }

    // Normalize attributes if present in update
    if (update.attributes && typeof update.attributes === 'string') {
      try { update.attributes = JSON.parse(update.attributes); } catch (e) { update.attributes = []; }
    }
    if (update.attributes && Array.isArray(update.attributes)) {
      update.attributes = update.attributes.map(a => {
        if (!a) return null;
        const nameAttr = a.name || a.attrName || '';
        let values = a.values || a.vals || [];
        if (typeof values === 'string') values = values.split(',').map(v => v.trim()).filter(Boolean);
        if (!Array.isArray(values)) values = [];
        return { name: String(nameAttr).trim(), values };
      }).filter(Boolean);
    }

    const cat = await Category.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(cat);
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(400).json({ message: 'Duplicate key error updating category', error: err.message });
    }
    res.status(500).json({ message: 'Error updating category', error: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting category' });
  }
};
