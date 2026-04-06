const { v2: cloudinary } = require('cloudinary');

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

module.exports = {
  uploadBufferToCloudinary,
  deleteFromCloudinary,
};
