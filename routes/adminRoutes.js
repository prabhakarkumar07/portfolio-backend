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
} = require('../controllers/profileController');
const { protect } = require('../middleware/auth');
const { projectValidation } = require('../middleware/validate');
const { uploadProfileAssets } = require('../middleware/upload');

const router = express.Router();

router.use(protect);

router.get('/messages', getAllMessages);
router.patch('/messages/:id/read', markAsRead);
router.delete('/messages/:id', deleteMessage);

router.put('/profile', updateProfile);
router.post('/profile/assets', uploadProfileAssets, uploadProfileFiles);

router
  .route('/projects')
  .get(getAllProjects)
  .post(projectValidation, createProject);

router
  .route('/projects/:id')
  .get(getProjectById)
  .put(projectValidation, updateProject)
  .delete(deleteProject);

module.exports = router;
