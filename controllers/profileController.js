const Profile = require('../models/Profile');
const {
  uploadBufferToCloudinary,
  deleteFromCloudinary,
} = require('../config/cloudinary');

const getOrCreateProfile = async () => {
  let profile = await Profile.findOne().sort({ createdAt: 1 });

  if (!profile) {
    profile = await Profile.create({});
  }

  return profile;
};

const getProfile = async (req, res, next) => {
  try {
    const profile = await getOrCreateProfile();

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const profile = await getOrCreateProfile();
    const {
      fullName,
      headline,
      bio,
      location,
      email,
      careerJourney,
    } = req.body;

    if (fullName !== undefined) profile.fullName = fullName;
    if (headline !== undefined) profile.headline = headline;
    if (bio !== undefined) profile.bio = bio;
    if (location !== undefined) profile.location = location;
    if (email !== undefined) profile.email = email;
    if (careerJourney !== undefined) {
      profile.careerJourney = Array.isArray(careerJourney)
        ? careerJourney
            .filter((item) => item && (item.year || item.title || item.description))
            .map((item) => ({
              year: item.year || '',
              title: item.title || '',
              subtitle: item.subtitle || '',
              description: item.description || '',
              accent: item.accent || 'from-primary-500 to-sky-400',
            }))
        : [];
    }

    await profile.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

const uploadProfileFiles = async (req, res, next) => {
  try {
    const profile = await getOrCreateProfile();
    const profileImage = req.files?.profileImage?.[0];
    const resume = req.files?.resume?.[0];

    if (!profileImage && !resume) {
      return res.status(400).json({
        success: false,
        message: 'Upload at least one file: profileImage or resume.',
      });
    }

    if (profileImage) {
      if (profile.profileImage?.publicId) {
        await deleteFromCloudinary(profile.profileImage.publicId, 'image');
      }

      const uploadedImage = await uploadBufferToCloudinary(profileImage, {
        folder: 'portfolio/profile',
        resource_type: 'image',
      });

      profile.profileImage = {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
        originalName: profileImage.originalname,
        resourceType: uploadedImage.resource_type,
      };
    }

    if (resume) {
      if (profile.resume?.publicId) {
        await deleteFromCloudinary(profile.resume.publicId, 'raw');
      }

      const uploadedResume = await uploadBufferToCloudinary(resume, {
        folder: 'portfolio/resume',
        resource_type: 'raw',
        public_id: `resume-${Date.now()}`,
      });

      profile.resume = {
        url: uploadedResume.secure_url,
        publicId: uploadedResume.public_id,
        originalName: resume.originalname,
        resourceType: uploadedResume.resource_type,
      };
    }

    await profile.save();

    res.json({
      success: true,
      message: 'Profile assets uploaded successfully',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadProfileFiles,
};
