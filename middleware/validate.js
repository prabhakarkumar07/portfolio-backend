/**
 * middleware/validate.js - Request validation using express-validator
 */

const { body, validationResult } = require('express-validator');

// Run validation and return errors if any
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg }))
    });
  }
  next();
};

// Validation rules for contact form
const contactValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required')
    .isLength({ max: 200 }).withMessage('Subject cannot exceed 200 characters'),

  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 2000 }).withMessage('Message must be 10-2000 characters'),

  validate
];

// Validation rules for project creation/update
const projectValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),

  body('shortDescription')
    .trim()
    .notEmpty().withMessage('Short description is required')
    .isLength({ max: 200 }).withMessage('Short description cannot exceed 200 characters'),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required'),

  body('technologies')
    .isArray({ min: 1 }).withMessage('At least one technology is required'),

  body('category')
    .isIn(['Web', 'Mobile', 'API', 'ML/AI', 'DevOps', 'Other'])
    .withMessage('Invalid category'),

  body('githubUrl')
    .optional({ nullable: true, checkFalsy: true })
    .isURL().withMessage('Please provide a valid GitHub URL'),

  body('liveUrl')
    .optional({ nullable: true, checkFalsy: true })
    .isURL().withMessage('Please provide a valid live URL'),

  validate
];

// Validation rules for login
const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),

  body('password')
    .notEmpty().withMessage('Password is required'),

  validate
];

module.exports = { contactValidation, projectValidation, loginValidation };