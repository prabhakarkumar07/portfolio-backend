const mongoose = require('mongoose');

const blogImageSchema = new mongoose.Schema(
  {
    url: { type: String, trim: true, default: '' },
    publicId: { type: String, trim: true, default: '' },
  },
  { _id: false },
);

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, required: true, maxlength: 140 },
    slug: { type: String, trim: true, unique: true, index: true },
    excerpt: { type: String, trim: true, default: '', maxlength: 280 },
    content: { type: String, trim: true, required: true },
    tags: { type: [String], default: [] },
    coverImage: { type: blogImageSchema, default: () => ({}) },
    authorName: { type: String, trim: true, default: '' },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    featured: { type: Boolean, default: false },
    publishedAt: { type: Date },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Blog', blogSchema);
