const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    if (!name || !email || !password || !phone) return res.status(400).json({ message: 'Missing fields' });
    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({ message: 'Email already registered' });
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) return res.status(400).json({ message: 'Phone number already registered' });
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const user = new User({ name, email, passwordHash, phone, role: role || 'user' });
    await user.save();
    return res.status(201).json({ message: 'User created' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) return res.status(400).json({ message: 'Missing fields' });
    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Google OAuth callback handler
exports.googleCallback = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(400).json({ message: 'Authentication failed' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    const redirectUrl = (process.env.CLIENT_URL || 'http://localhost:3000') + '/auth/success?token=' + token;
    return res.redirect(redirectUrl);
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Address Management
exports.getUserAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('addresses');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ addresses: user.addresses || [] });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.addUserAddress = async (req, res) => {
  try {
    const { name, phone, line1, line2, city, state, country, pincode, isDefault } = req.body;
    if (!name || !phone || !line1 || !city || !state || !pincode) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // If this is the default address, unset other defaults
    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    const newAddress = {
      name,
      phone,
      line1,
      line2,
      city,
      state,
      country: country || 'India',
      pincode,
      isDefault: isDefault || false
    };

    user.addresses.push(newAddress);
    await user.save();

    return res.status(201).json({ message: 'Address added successfully', address: newAddress });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateUserAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { name, phone, line1, line2, city, state, country, pincode, isDefault } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    if (addressIndex === -1) return res.status(404).json({ message: 'Address not found' });

    // If this is the default address, unset other defaults
    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses[addressIndex] = {
      ...user.addresses[addressIndex],
      name,
      phone,
      line1,
      line2,
      city,
      state,
      country: country || 'India',
      pincode,
      isDefault: isDefault || false
    };

    await user.save();

    return res.json({ message: 'Address updated successfully', address: user.addresses[addressIndex] });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteUserAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);
    await user.save();

    return res.json({ message: 'Address deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
