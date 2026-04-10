const express = require('express');

const { getProfile, getResumeDownload } = require('../controllers/profileController');

const router = express.Router();

router.get('/', getProfile);
router.get('/resume', getResumeDownload);

module.exports = router;
