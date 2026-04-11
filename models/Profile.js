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
    accessMode: {
      type: String,
      trim: true,
      default: '',
    },
    deliveryType: {
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

const statSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      trim: true,
      default: '',
    },
    value: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: false },
);

const skillItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: '',
    },
    level: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
  },
  { _id: false },
);

const skillCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: '',
    },
    icon: {
      type: String,
      trim: true,
      default: '',
    },
    skills: {
      type: [skillItemSchema],
      default: [],
    },
  },
  { _id: false },
);

const experienceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: '',
    },
    company: {
      type: String,
      trim: true,
      default: '',
    },
    period: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    tech: {
      type: [String],
      default: [],
    },
  },
  { _id: false },
);

const resumeHighlightSchema = new mongoose.Schema(
  {
    icon: {
      type: String,
      trim: true,
      default: '',
    },
    label: {
      type: String,
      trim: true,
      default: '',
    },
    value: {
      type: String,
      trim: true,
      default: '',
    },
    sub: {
      type: String,
      trim: true,
      default: '',
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
    siteTitle: {
      type: String,
      trim: true,
      default: 'Portfolio',
    },
    logoLetter: {
      type: String,
      trim: true,
      default: 'P',
    },
    footerTagline: {
      type: String,
      trim: true,
      default: '',
    },
    availabilityBadge: {
      type: String,
      trim: true,
      default: '',
    },
    availabilityStatus: {
      type: String,
      trim: true,
      default: '',
    },
    availabilityDetails: {
      type: String,
      trim: true,
      default: '',
    },
    heroDescription: {
      type: String,
      trim: true,
      default: '',
    },
    homeCtaTitle: {
      type: String,
      trim: true,
      default: '',
    },
    homeCtaDescription: {
      type: String,
      trim: true,
      default: '',
    },
    homePrimaryCtaText: {
      type: String,
      trim: true,
      default: '',
    },
    homeSecondaryCtaText: {
      type: String,
      trim: true,
      default: '',
    },
    contactIntro: {
      type: String,
      trim: true,
      default: '',
    },
    githubUrl: {
      type: String,
      trim: true,
      default: '',
    },
    linkedinUrl: {
      type: String,
      trim: true,
      default: '',
    },
    twitterUrl: {
      type: String,
      trim: true,
      default: '',
    },
    projectsPageTag: {
      type: String,
      trim: true,
      default: '',
    },
    projectsPageTitle: {
      type: String,
      trim: true,
      default: '',
    },
    projectsPageSubtitle: {
      type: String,
      trim: true,
      default: '',
    },
    stats: {
      type: [statSchema],
      default: [],
    },
    skillCategories: {
      type: [skillCategorySchema],
      default: [],
    },
    experiences: {
      type: [experienceSchema],
      default: [],
    },
    resumeHighlights: {
      type: [resumeHighlightSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Profile', profileSchema);
