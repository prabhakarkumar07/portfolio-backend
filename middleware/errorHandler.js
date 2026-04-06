/**
 * middleware/errorHandler.js - Centralized error handling middleware
 * Catches all errors and returns structured JSON responses
 */

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('🔴 Error:', err);
  }

  // ── Mongoose: Bad ObjectId ─────────────────────────────────────────────────
  if (err.name === 'CastError') {
    error.message = `Resource not found with id: ${err.value}`;
    error.statusCode = 404;
  }

  // ── Mongoose: Duplicate key ────────────────────────────────────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error.message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
    error.statusCode = 400;
  }

  // ── Mongoose: Validation error ─────────────────────────────────────────────
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    error.message = messages.join('. ');
    error.statusCode = 400;
  }

  // ── JWT Errors ─────────────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token. Please log in again.';
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Your session has expired. Please log in again.';
    error.statusCode = 401;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
    // Only include stack trace in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;