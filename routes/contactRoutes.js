/**
 * routes/contactRoutes.js - Public contact form route
 */

const express = require('express');
const router = express.Router();
const { submitContact } = require('../controllers/contactController');
const { contactValidation } = require('../middleware/validate');

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Submit a contact message
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactMessage'
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       400:
 *         description: Validation error
 */
router.post('/', contactValidation, submitContact);

module.exports = router;