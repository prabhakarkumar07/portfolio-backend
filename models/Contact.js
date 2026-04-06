/**
 * models/Contact.js - Mongoose schema for contact form messages
 */

const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxlength: [200, 'Subject cannot exceed 200 characters']
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters'],
      maxlength: [2000, 'Message cannot exceed 2000 characters']
    },
    isRead: {
      type: Boolean,
      default: false // Admin can mark messages as read
    },
    ipAddress: {
      type: String // Store for spam prevention
    }
  },
  {
    timestamps: true
  }
);

// Index for admin queries
contactSchema.index({ isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Contact', contactSchema);