const { v2: cloudinary } = require('cloudinary');
const streamifier = require('streamifier');

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

    const uploadOptions = {
      folder: options.folder || 'portfolio',
      overwrite: true,
      resource_type: options.resource_type || 'auto',
      ...options,
      type: 'upload',
      access_mode: 'public',
    };

    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });

const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  if (!publicId) return;
  ensureCloudinaryConfig();
  await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
    type: 'upload',
  });
};

const getSignedAssetUrl = (publicId, resourceType = 'raw', options = {}) => {
  if (!publicId) return '';
  ensureCloudinaryConfig();
  const expiresAt = options.expiresAt || Math.floor(Date.now() / 1000) + 60 * 60;

  return cloudinary.url(publicId, {
    resource_type: resourceType,
    type: 'upload',
    secure: true,
    sign_url: true,
    expires_at: expiresAt,
  });
};

const getPrivateDownloadUrl = (publicId, options = {}) => {
  if (!publicId) return '';
  ensureCloudinaryConfig();
  const expiresAt = options.expiresAt || Math.floor(Date.now() / 1000) + 60 * 60;

  return cloudinary.utils.private_download_url(publicId, 'pdf', {
    resource_type: 'raw',
    type: 'upload',
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