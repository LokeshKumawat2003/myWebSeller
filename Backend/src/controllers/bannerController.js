const Banner = require('../models/Banner');
const mongoose = require('mongoose');

exports.listBanners = async (req, res) => {
  const banners = await Banner.find({ active: true }).sort({ position: 1 });
  res.json(banners);
};

exports.createBanner = async (req, res) => {
  try {
    const { title, imageUrl, active, position } = req.body;

    // Validate required fields
    if (!title || !imageUrl) {
      return res.status(400).json({ message: 'Title and imageUrl are required' });
    }

    const banner = new Banner({
      title,
      imageUrl,
      active: active !== undefined ? active : true,
      position: position || 0
    });

    await banner.save();
    res.status(201).json(banner);
  } catch (err) {
    console.error('Error creating banner:', err);
    res.status(500).json({ message: 'Error creating banner', error: err.message });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const { title, imageUrl, active, position } = req.body;

    const updateData = {
      title,
      imageUrl,
      active: active !== undefined ? active : true,
      position: position || 0
    };

    const banner = await Banner.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    res.json(banner);
  } catch (err) {
    console.error('Error updating banner:', err);
    res.status(500).json({ message: 'Error updating banner', error: err.message });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting banner' });
  }
};
