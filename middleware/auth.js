/**
 * middleware/auth.js - JWT authentication middleware
 * Protects routes that require admin access
 */

const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  try {
    // 1. Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find admin user (token might be valid but user deleted)
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Token is valid but user no longer exists.'
      });
    }

    // 4. Attach admin to request object for use in controllers
    req.admin = admin;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token has expired. Please log in again.' });
    }
    next(error);
  }
};

// Optional: Role-based access (for future superadmin features)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.admin.role}' is not authorized to access this route.`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };