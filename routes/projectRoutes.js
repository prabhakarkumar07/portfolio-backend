/**
 * routes/projectRoutes.js - Public project API routes
 */

const express = require('express');
const router = express.Router();
const { getAllProjects, getProjectById } = require('../controllers/projectController');

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Web, Mobile, API, ML/AI, DevOps, Other]
 *         description: Filter by category
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Filter featured projects
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [completed, in-progress, planned]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: List of projects
 */
router.get('/', getAllProjects);

/**
 * @swagger
 * /projects/{slugOrId}:
 *   get:
 *     summary: Get a project by slug or ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: slugOrId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project found
 *       404:
 *         description: Project not found
 */
router.get('/:slugOrId', getProjectById);

module.exports = router;
