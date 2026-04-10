const express = require('express');

const { getAllBlogs, getBlogBySlug } = require('../controllers/blogController');

const router = express.Router();

router.get('/', getAllBlogs);
router.get('/:slug', getBlogBySlug);

module.exports = router;
