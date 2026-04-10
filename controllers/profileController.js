const Profile = require('../models/Profile');
const fs = require('fs');
const path = require('path');
const {
  uploadBufferToCloudinary,
  deleteFromCloudinary,
  getSignedAssetUrl,
  getPrivateDownloadUrl,
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
      siteTitle,
      logoLetter,
      footerTagline,
      availabilityBadge,
      availabilityStatus,
      availabilityDetails,
      heroDescription,
      homeCtaTitle,
      homeCtaDescription,
      homePrimaryCtaText,
      homeSecondaryCtaText,
      contactIntro,
      githubUrl,
      linkedinUrl,
      twitterUrl,
      projectsPageTag,
      projectsPageTitle,
      projectsPageSubtitle,
      stats,
      skillCategories,
      experiences,
      resumeHighlights,
    } = req.body;

    if (fullName !== undefined) profile.fullName = fullName;
    if (headline !== undefined) profile.headline = headline;
    if (bio !== undefined) profile.bio = bio;
    if (location !== undefined) profile.location = location;
    if (email !== undefined) profile.email = email;
    if (siteTitle !== undefined) profile.siteTitle = siteTitle;
    if (logoLetter !== undefined) profile.logoLetter = logoLetter;
    if (footerTagline !== undefined) profile.footerTagline = footerTagline;
    if (availabilityBadge !== undefined) profile.availabilityBadge = availabilityBadge;
    if (availabilityStatus !== undefined) profile.availabilityStatus = availabilityStatus;
    if (availabilityDetails !== undefined) profile.availabilityDetails = availabilityDetails;
    if (heroDescription !== undefined) profile.heroDescription = heroDescription;
    if (homeCtaTitle !== undefined) profile.homeCtaTitle = homeCtaTitle;
    if (homeCtaDescription !== undefined) profile.homeCtaDescription = homeCtaDescription;
    if (homePrimaryCtaText !== undefined) profile.homePrimaryCtaText = homePrimaryCtaText;
    if (homeSecondaryCtaText !== undefined) profile.homeSecondaryCtaText = homeSecondaryCtaText;
    if (contactIntro !== undefined) profile.contactIntro = contactIntro;
    if (githubUrl !== undefined) profile.githubUrl = githubUrl;
    if (linkedinUrl !== undefined) profile.linkedinUrl = linkedinUrl;
    if (twitterUrl !== undefined) profile.twitterUrl = twitterUrl;
    if (projectsPageTag !== undefined) profile.projectsPageTag = projectsPageTag;
    if (projectsPageTitle !== undefined) profile.projectsPageTitle = projectsPageTitle;
    if (projectsPageSubtitle !== undefined) profile.projectsPageSubtitle = projectsPageSubtitle;
    if (stats !== undefined) {
      profile.stats = Array.isArray(stats)
        ? stats
            .filter((item) => item && (item.label || item.value))
            .map((item) => ({
              label: item.label || '',
              value: item.value || '',
            }))
        : [];
    }
    if (skillCategories !== undefined) {
      profile.skillCategories = Array.isArray(skillCategories)
        ? skillCategories
            .filter((item) => item && item.name)
            .map((item) => ({
              name: item.name || '',
              icon: item.icon || '',
              skills: Array.isArray(item.skills)
                ? item.skills
                    .filter((skill) => skill && skill.name)
                    .map((skill) => ({
                      name: skill.name || '',
                      level: Number(skill.level || 0),
                    }))
                : [],
            }))
        : [];
    }
    if (experiences !== undefined) {
      profile.experiences = Array.isArray(experiences)
        ? experiences
            .filter((item) => item && (item.title || item.company))
            .map((item) => ({
              title: item.title || '',
              company: item.company || '',
              period: item.period || '',
              description: item.description || '',
              tech: Array.isArray(item.tech)
                ? item.tech.filter(Boolean)
                : typeof item.tech === 'string'
                  ? item.tech.split(',').map((part) => part.trim()).filter(Boolean)
                  : [],
            }))
        : [];
    }
    if (resumeHighlights !== undefined) {
      profile.resumeHighlights = Array.isArray(resumeHighlights)
        ? resumeHighlights
            .filter((item) => item && (item.label || item.value))
            .map((item) => ({
              icon: item.icon || '',
              label: item.label || '',
              value: item.value || '',
              sub: item.sub || '',
            }))
        : [];
    }
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
        accessMode: uploadedImage.access_mode || '',
        deliveryType: uploadedImage.type || '',
      };
    }

    if (resume) {
      if (profile.resume?.publicId) {
        await deleteFromCloudinary(profile.resume.publicId, 'raw');
      }

      if (profile.resume?.localPath) {
        try {
          await fs.promises.unlink(profile.resume.localPath);
        } catch (error) {
          if (error.code !== 'ENOENT') {
            throw error;
          }
        }
      }

      const uploadsDir = path.join(__dirname, '..', 'uploads', 'resume');
      await fs.promises.mkdir(uploadsDir, { recursive: true });
      const filename = `resume-${Date.now()}.pdf`;
      const filePath = path.join(uploadsDir, filename);

      await fs.promises.writeFile(filePath, resume.buffer);

      profile.resume = {
        url: '',
        publicId: '',
        originalName: resume.originalname,
        resourceType: 'raw',
        accessMode: '',
        deliveryType: '',
        localPath: filePath,
        localFilename: filename,
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

const deleteProfileAsset = async (req, res, next) => {
  try {
    const profile = await getOrCreateProfile();
    const { type } = req.params;

    if (type !== 'profileImage' && type !== 'resume') {
      return res.status(400).json({
        success: false,
        message: 'Invalid asset type',
      });
    }

    const asset = profile[type];

    if (!asset?.publicId) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found',
      });
    }

    await deleteFromCloudinary(asset.publicId, type === 'resume' ? 'raw' : 'image');

    if (asset.localPath) {
      try {
        await fs.promises.unlink(asset.localPath);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          throw error;
        }
      }
    }

    profile[type] = {
      url: '',
      publicId: '',
      originalName: '',
      resourceType: '',
      accessMode: '',
      deliveryType: '',
      localPath: '',
      localFilename: '',
    };

    await profile.save();

    res.json({
      success: true,
      message: `${type} deleted successfully`,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

const getResumeDownload = async (req, res, next) => {
  try {
    const profile = await getOrCreateProfile();
    const resume = profile.resume;

    if (!resume?.localPath) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    const absolutePath = path.resolve(resume.localPath);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${resume.localFilename || 'resume.pdf'}"`);
    res.sendFile(absolutePath);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadProfileFiles,
  deleteProfileAsset,
  getResumeDownload,
};
