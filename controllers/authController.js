/**
 * controllers/authController.js - Admin authentication
 */

const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Helper: generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

/**
 * @desc    Admin login
 * @route   POST /api/admin/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find admin by email (explicitly select password since it's set to select: false)
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login timestamp
    admin.lastLogin = new Date();
    await admin.save({ validateBeforeSave: false });

    const token = generateToken(admin._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged-in admin profile
 * @route   GET /api/admin/me
 * @access  Private
 */
const getMe = async (req, res) => {
  res.json({
    success: true,
    data: req.admin // Attached by auth middleware
  });
};

module.exports = { login, getMe };