const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { sendOTP } = require('../services/twilioService');

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
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '5y' });
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
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET , { expiresIn: '5y' });
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

// OTP-based Authentication
exports.sendOTPRegister = async (req, res) => {
  try {
    const { phone, name, email } = req.body;
    
    if (!phone) return res.status(400).json({ message: 'Phone number is required' });
    
    // Check if phone already registered
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) return res.status(400).json({ message: 'Phone number already registered' });
    
    // Delete any existing OTP for this phone
    await OTP.deleteOne({ phone });
    
    // Send OTP via Twilio
    const otp = await sendOTP(phone);
    
    // Store OTP in database
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry
    const otpDoc = new OTP({ 
      phone, 
      otp, 
      email, 
      name, 
      expiresAt, 
      type: 'register',
      attempts: 0 
    });
    await otpDoc.save();
    
    return res.status(200).json({ message: 'OTP sent successfully', phone });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to send OTP', error: err.message });
  }
};

exports.sendOTPLogin = async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone) return res.status(400).json({ message: 'Phone number is required' });
    
    // Check if phone exists
    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ message: 'Phone number not registered' });
    
    // Delete any existing OTP for this phone
    await OTP.deleteOne({ phone });
    
    // Send OTP via Twilio
    const otp = await sendOTP(phone);
    
    // Store OTP in database
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry
    const otpDoc = new OTP({ 
      phone, 
      otp, 
      expiresAt, 
      type: 'login',
      attempts: 0 
    });
    await otpDoc.save();
    
    return res.status(200).json({ message: 'OTP sent successfully', phone });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to send OTP', error: err.message });
  }
};

exports.verifyOTPRegister = async (req, res) => {
  try {
    const { phone, otp, name, email, password } = req.body;
    
    if (!phone || !otp) return res.status(400).json({ message: 'Phone and OTP are required' });
    
    // Find OTP record
    const otpRecord = await OTP.findOne({ phone, type: 'register' });
    
    if (!otpRecord) return res.status(400).json({ message: 'OTP expired or not found' });
    
    // Check if OTP has expired
    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ phone });
      return res.status(400).json({ message: 'OTP has expired' });
    }
    
    // Check OTP attempts
    if (otpRecord.attempts >= 5) {
      await OTP.deleteOne({ phone });
      return res.status(400).json({ message: 'Maximum OTP attempts exceeded' });
    }
    
    // Verify OTP
    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({ message: 'Invalid OTP', attempts: otpRecord.attempts });
    }
    
    // Check if phone already registered
    let user = await User.findOne({ phone });
    
    if (user) {
      // User exists, just mark OTP as verified
      await OTP.deleteOne({ phone });
      return res.status(400).json({ message: 'Phone already registered' });
    }
    
    // Create new user
    const salt = await bcrypt.genSalt(10);
    const passwordHash = password ? await bcrypt.hash(password, salt) : null;
    
    user = new User({
      name: name || otpRecord.name,
      email: email || otpRecord.email,
      phone,
      passwordHash,
      role: 'user'
    });
    
    await user.save();
    
    // Delete OTP record
    await OTP.deleteOne({ phone });
    
    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET , { expiresIn: '5y' });
    
    return res.status(201).json({ 
      message: 'User registered successfully',
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        phone: user.phone, 
        role: user.role 
      }
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.verifyOTPLogin = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    
    if (!phone || !otp) return res.status(400).json({ message: 'Phone and OTP are required' });
    
    // Find OTP record
    const otpRecord = await OTP.findOne({ phone, type: 'login' });
    
    if (!otpRecord) return res.status(400).json({ message: 'OTP expired or not found' });
    
    // Check if OTP has expired
    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ phone });
      return res.status(400).json({ message: 'OTP has expired' });
    }
    
    // Check OTP attempts
    if (otpRecord.attempts >= 5) {
      await OTP.deleteOne({ phone });
      return res.status(400).json({ message: 'Maximum OTP attempts exceeded' });
    }
    
    // Verify OTP
    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({ message: 'Invalid OTP', attempts: otpRecord.attempts });
    }
    
    // Find user
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    
    // Delete OTP record
    await OTP.deleteOne({ phone });
    
    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET , { expiresIn: '5y' });
    
    return res.json({ 
      message: 'Login successful',
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        phone: user.phone, 
        role: user.role 
      }
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
