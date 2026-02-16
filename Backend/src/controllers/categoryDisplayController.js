const CategoryDisplay = require('../models/CategoryDisplay');

exports.listCategoryDisplays = async (req, res) => {
  try {
    const categories = await CategoryDisplay.find({ active: true }).sort({ position: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching categories', error: err.message });
  }
};

exports.createCategoryDisplay = async (req, res) => {
  try {
    const { name, active, position } = req.body;

    // Get image URL from multer/Cloudinary or from request body
    let image = req.file ? req.file.path : req.body.image;

    // Validate required fields
    if (!name || !image) {
      return res.status(400).json({ message: 'Category name and image are required' });
    }

    // Auto-generate slug from name
    const slug = String(name).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

    const category = new CategoryDisplay({
      name,
      slug,
      image,
      active: active !== undefined ? active : true,
      position: position || 0
    });

    await category.save();
    res.status(201).json(category);
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(400).json({ message: 'Category name already exists', error: err.message });
    }
    console.error('Error creating category display:', err);
    res.status(500).json({ message: 'Error creating category display', error: err.message });
  }
};

exports.getCategoryDisplay = async (req, res) => {
  try {
    const category = await CategoryDisplay.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching category', error: err.message });
  }
};

exports.updateCategoryDisplay = async (req, res) => {
  try {
    const { name, active, position } = req.body;

    // Get image URL from multer/Cloudinary if provided, otherwise keep existing
    const image = req.file ? req.file.path : req.body.image;

    const updateData = {
      active: active !== undefined ? active : true,
      position: position || 0
    };

    // Only update name if provided
    if (name) {
      updateData.name = name;
      // Auto-generate slug if name is being changed
      updateData.slug = String(name).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    }

    // Only update image if provided
    if (image) {
      updateData.image = image;
    }

    const category = await CategoryDisplay.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(400).json({ message: 'Category name already exists', error: err.message });
    }
    console.error('Error updating category display:', err);
    res.status(500).json({ message: 'Error updating category display', error: err.message });
  }
};

exports.deleteCategoryDisplay = async (req, res) => {
  try {
    const category = await CategoryDisplay.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting category', error: err.message });
  }
};

exports.getAllCategoryDisplays = async (req, res) => {
  try {
    const categories = await CategoryDisplay.find().sort({ position: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching categories', error: err.message });
  }
};
