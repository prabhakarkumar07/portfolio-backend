const Blog = require('../models/Blog');
const { uploadBufferToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

const ensureUniqueSlug = async (base, excludeId = null) => {
  let slug = base || `post-${Date.now()}`;
  let suffix = 1;
  let exists = await Blog.findOne(excludeId ? { slug, _id: { $ne: excludeId } } : { slug });

  while (exists) {
    slug = `${base}-${suffix}`;
    suffix += 1;
    exists = await Blog.findOne(excludeId ? { slug, _id: { $ne: excludeId } } : { slug });
  }

  return slug;
};

const buildFilter = (query, includeDrafts = false) => {
  const { status, featured, tag, search } = query;
  const filter = {};

  if (!includeDrafts) {
    filter.status = 'published';
  } else if (status) {
    filter.status = status;
  }

  if (featured !== undefined) filter.featured = featured === 'true';
  if (tag) filter.tags = tag;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }

  return filter;
};

const getAllBlogs = async (req, res, next) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const filter = buildFilter(req.query, false);
    const skip = (Number(page) - 1) * Number(limit);

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .sort({ featured: -1, publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Blog.countDocuments(filter),
    ]);

    res.json({
      success: true,
      count: blogs.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};

const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, status: 'published' });
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    res.json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

const getAllBlogsAdmin = async (req, res, next) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const filter = buildFilter(req.query, true);
    const skip = (Number(page) - 1) * Number(limit);

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .sort({ updatedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Blog.countDocuments(filter),
    ]);

    res.json({
      success: true,
      count: blogs.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};

const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

const createBlog = async (req, res, next) => {
  try {
    const {
      title,
      excerpt,
      content,
      tags = [],
      coverImage,
      authorName,
      status,
      featured,
      publishedAt,
    } = req.body;

    const baseSlug = slugify(title);
    const slug = await ensureUniqueSlug(baseSlug);

    const blog = await Blog.create({
      title,
      slug,
      excerpt,
      content,
      tags,
      coverImage,
      authorName,
      status,
      featured,
      publishedAt: status === 'published' ? (publishedAt ? new Date(publishedAt) : new Date()) : null,
    });

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

const updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const {
      title,
      excerpt,
      content,
      tags,
      coverImage,
      authorName,
      status,
      featured,
      publishedAt,
    } = req.body;

    if (title !== undefined && title !== blog.title) {
      const baseSlug = slugify(title);
      blog.slug = await ensureUniqueSlug(baseSlug, blog._id);
      blog.title = title;
    }
    if (excerpt !== undefined) blog.excerpt = excerpt;
    if (content !== undefined) blog.content = content;
    if (tags !== undefined) blog.tags = tags;
    if (coverImage !== undefined) {
      const incomingPublicId = coverImage?.publicId || '';
      if (blog.coverImage?.publicId && blog.coverImage.publicId !== incomingPublicId) {
        await deleteFromCloudinary(blog.coverImage.publicId, 'image');
      }
      blog.coverImage = coverImage;
    }
    if (authorName !== undefined) blog.authorName = authorName;
    if (status !== undefined) blog.status = status;
    if (featured !== undefined) blog.featured = featured;

    if (blog.status === 'published') {
      blog.publishedAt = publishedAt ? new Date(publishedAt) : (blog.publishedAt || new Date());
    } else {
      blog.publishedAt = null;
    }

    await blog.save();

    res.json({
      success: true,
      message: 'Blog updated successfully',
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    if (blog.coverImage?.publicId) {
      await deleteFromCloudinary(blog.coverImage.publicId, 'image');
    }

    await blog.deleteOne();

    res.json({
      success: true,
      message: 'Blog deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

const uploadBlogImageHandler = async (req, res, next) => {
  try {
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ success: false, message: 'Image file is required' });
    }

    const uploadedImage = await uploadBufferToCloudinary(imageFile, {
      folder: 'portfolio/blog',
      resource_type: 'image',
    });

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBlogs,
  getBlogBySlug,
  getAllBlogsAdmin,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  uploadBlogImageHandler,
};
