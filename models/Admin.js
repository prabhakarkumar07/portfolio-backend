/**
 * models/Admin.js - Mongoose schema for admin users
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false // Never return password in queries by default
    },
    role: {
      type: String,
      enum: ['admin', 'superadmin'],
      default: 'admin'
    },
    lastLogin: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Instance method: compare entered password with stored hash
adminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);