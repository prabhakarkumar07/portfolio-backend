const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
  if (file.fieldname === 'profileImage') {
    if (!file.mimetype.startsWith('image/')) {
      callback(new Error('profileImage must be an image file.'));
      return;
    }
  }

  if (file.fieldname === 'resume') {
    if (file.mimetype !== 'application/pdf') {
      callback(new Error('resume must be a PDF file.'));
      return;
    }
  }

  callback(null, true);
};

const uploadProfileAssets = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
}).fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'resume', maxCount: 1 },
]);

module.exports = {
  uploadProfileAssets,
};
