/**
 * controllers/projectController.js - Business logic for projects
 * Follows MVC pattern: Controller handles logic, Model handles data
 */

const Project = require('../models/Project');

// ─── Public Routes ───────────────────────────────────────────────────────────

/**
 * @desc    Get all projects (with optional filtering)
 * @route   GET /api/projects
 * @access  Public
 */
const getAllProjects = async (req, res, next) => {
  try {
    const { category, featured, status, limit = 20, page = 1 } = req.query;

    // Build filter object dynamically
    const filter = {};
    if (category) filter.category = category;
    if (featured !== undefined) filter.featured = featured === 'true';
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [projects, total] = await Promise.all([
      Project.find(filter)
        .sort({ featured: -1, order: 1, createdAt: -1 }) // Featured first, then by order
        .skip(skip)
        .limit(Number(limit)),
      Project.countDocuments(filter)
    ]);

    res.json({
      success: true,
      count: projects.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: projects
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single project by ID
 * @route   GET /api/projects/:id
 * @access  Public
 */
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// ─── Admin-Only Routes ───────────────────────────────────────────────────────

/**
 * @desc    Create a new project
 * @route   POST /api/admin/projects
 * @access  Private (Admin)
 */
const createProject = async (req, res, next) => {
  try {
    const project = await Project.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing project
 * @route   PUT /api/admin/projects/:id
 * @access  Private (Admin)
 */
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,           // Return updated document
        runValidators: true  // Run schema validations on update
      }
    );

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a project
 * @route   DELETE /api/admin/projects/:id
 * @access  Private (Admin)
 */
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllProjects, getProjectById, createProject, updateProject, deleteProject };