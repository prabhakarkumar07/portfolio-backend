const express = require('express');

const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const {
  getAllMessages,
  markAsRead,
  deleteMessage,
} = require('../controllers/contactController');
const {
  updateProfile,
  uploadProfileFiles,
  deleteProfileAsset,
} = require('../controllers/profileController');
const {
  getAllBlogsAdmin,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  uploadBlogImageHandler,
} = require('../controllers/blogController');
const { protect } = require('../middleware/auth');
const { projectValidation, blogValidation } = require('../middleware/validate');
const { uploadProfileAssets, uploadBlogImage } = require('../middleware/upload');

const router = express.Router();

router.use(protect);

router.get('/messages', getAllMessages);
router.patch('/messages/:id/read', markAsRead);
router.delete('/messages/:id', deleteMessage);

router.put('/profile', updateProfile);
router.post('/profile/assets', uploadProfileAssets, uploadProfileFiles);
router.delete('/profile/assets/:type', deleteProfileAsset);

router
  .route('/projects')
  .get(getAllProjects)
  .post(projectValidation, createProject);

router
  .route('/projects/:id')
  .get(getProjectById)
  .put(projectValidation, updateProject)
  .delete(deleteProject);

router.get('/blogs', getAllBlogsAdmin);
router.post('/blogs', blogValidation, createBlog);
router.post('/blogs/image', uploadBlogImage, uploadBlogImageHandler);

router
  .route('/blogs/:id')
  .get(getBlogById)
  .put(blogValidation, updateBlog)
  .delete(deleteBlog);

module.exports = router;
