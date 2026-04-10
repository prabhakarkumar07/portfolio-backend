const { v2: cloudinary } = require('cloudinary');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ensureCloudinaryConfig = () => {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error(
      'Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your .env file.',
    );
  }
};

const uploadBufferToCloudinary = (file, options = {}) =>
  new Promise((resolve, reject) => {
    ensureCloudinaryConfig();

    const base64 = file.buffer.toString('base64');
    const dataUri = `data:${file.mimetype};base64,${base64}`;

    cloudinary.uploader.upload(
      dataUri,
      {
        folder: 'portfolio',
        overwrite: true,
        resource_type: 'auto',
        ...options,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      },
    );
  });

const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  if (!publicId) {
    return;
  }

  ensureCloudinaryConfig();
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};

const getSignedAssetUrl = (publicId, resourceType = 'raw', options = {}) => {
  if (!publicId) {
    return '';
  }

  ensureCloudinaryConfig();
  const expiresAt = options.expiresAt || Math.floor(Date.now() / 1000) + 60 * 60;
  const deliveryType = options.deliveryType || (resourceType === 'raw' ? 'authenticated' : 'upload');

  return cloudinary.url(publicId, {
    resource_type: resourceType,
    type: deliveryType,
    secure: true,
    sign_url: true,
    expires_at: expiresAt,
  });
};

const getPrivateDownloadUrl = (publicId, options = {}) => {
  if (!publicId) {
    return '';
  }

  ensureCloudinaryConfig();
  const expiresAt = options.expiresAt || Math.floor(Date.now() / 1000) + 60 * 60;
  const parsed = path.parse(publicId);
  const safePublicId = parsed.ext ? path.join(parsed.dir, parsed.name).replace(/\\/g, '/') : publicId;
  const format = parsed.ext ? parsed.ext.replace('.', '') : (options.format || 'pdf');

  return cloudinary.utils.private_download_url(safePublicId, format, {
    resource_type: 'raw',
    type: 'authenticated',
    expires_at: expiresAt,
    secure: true,
  });
};

module.exports = {
  uploadBufferToCloudinary,
  deleteFromCloudinary,
  getSignedAssetUrl,
  getPrivateDownloadUrl,
};
