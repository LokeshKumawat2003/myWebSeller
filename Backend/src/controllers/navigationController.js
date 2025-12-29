const Navigation = require('../models/Navigation');

exports.createNavigation = async (req, res) => {
  try {
    let { name, slug, order, isActive } = req.body;
    if (!name) return res.status(400).json({ message: 'Navigation name is required' });

    // Auto-generate slug from name if not provided
    if (!slug) {
      slug = String(name).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    }

    const nav = new Navigation({ name, slug, order, isActive });
    await nav.save();
    res.status(201).json(nav);
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(400).json({ message: 'Navigation slug already exists', error: err.message });
    }
    res.status(500).json({ message: 'Error creating navigation item', error: err.message });
  }
};

exports.listNavigations = async (req, res) => {
  try {
    const navs = await Navigation.find({ isActive: true }).sort({ order: 1 }).lean();
    res.json(navs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching navigation items' });
  }
};

exports.getNavigation = async (req, res) => {
  try {
    const nav = await Navigation.findById(req.params.id);
    if (!nav) return res.status(404).json({ message: 'Not found' });
    res.json(nav);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching navigation item' });
  }
};

exports.updateNavigation = async (req, res) => {
  try {
    let update = Object.assign({}, req.body);
    const name = update.name;
    // Auto-generate slug if name is being changed
    if (name) {
      update.slug = String(name).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    }

    const nav = await Navigation.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(nav);
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(400).json({ message: 'Duplicate key error updating navigation', error: err.message });
    }
    res.status(500).json({ message: 'Error updating navigation item', error: err.message });
  }
};

exports.deleteNavigation = async (req, res) => {
  try {
    await Navigation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting navigation item' });
  }
};