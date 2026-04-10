/**
 * models/Project.js - Mongoose schema for portfolio projects
 */

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
      maxlength: [200, 'Short description cannot exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    technologies: {
      type: [String],
      required: [true, 'At least one technology is required'],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'Please add at least one technology'
      }
    },
    category: {
      type: String,
      enum: {
        values: ['Web', 'Mobile', 'API', 'ML/AI', 'DevOps', 'Other'],
        message: '{VALUE} is not a valid category'
      },
      default: 'Web'
    },
    githubUrl: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, 'Please provide a valid URL']
    },
    liveUrl: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, 'Please provide a valid URL']
    },
    imageUrl: {
      type: String,
      trim: true,
      default: ''
    },
    featured: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['completed', 'in-progress', 'planned'],
      default: 'completed'
    },
    order: {
      type: Number,
      default: 0  // Used for custom sorting
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt automatically
  }
);

// Index for faster queries
projectSchema.index({ featured: 1, order: 1 });
projectSchema.index({ category: 1 });
projectSchema.index({ technologies: 1 });

// Virtual field: formatted date
projectSchema.virtual('formattedDate').get(function () {
  return this.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
});

// Ensure virtuals are included in JSON output
projectSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Project', projectSchema);
