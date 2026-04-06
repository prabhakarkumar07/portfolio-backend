const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      trim: true,
      default: '',
    },
    publicId: {
      type: String,
      trim: true,
      default: '',
    },
    originalName: {
      type: String,
      trim: true,
      default: '',
    },
    resourceType: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: false },
);

const careerJourneySchema = new mongoose.Schema(
  {
    year: {
      type: String,
      trim: true,
      default: '',
    },
    title: {
      type: String,
      trim: true,
      default: '',
    },
    subtitle: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    accent: {
      type: String,
      trim: true,
      default: 'from-primary-500 to-sky-400',
    },
  },
  { _id: false },
);

const profileSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      default: '',
    },
    headline: {
      type: String,
      trim: true,
      default: '',
    },
    bio: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    profileImage: {
      type: assetSchema,
      default: () => ({}),
    },
    resume: {
      type: assetSchema,
      default: () => ({}),
    },
    careerJourney: {
      type: [careerJourneySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Profile', profileSchema);
