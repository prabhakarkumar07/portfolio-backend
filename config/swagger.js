/**
 * config/swagger.js - Swagger/OpenAPI documentation setup
 */

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Portfolio API',
      version: '1.0.0',
      description: 'RESTful API for a professional developer portfolio',
      contact: {
        name: 'API Support',
        email: 'admin@portfolio.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development Server'
      },
      {
        url: 'https://yourdomain.com/api',
        description: 'Production Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token obtained from /admin/login'
        }
      },
      schemas: {
        Project: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d1' },
            title: { type: 'string', example: 'E-Commerce Platform' },
            description: { type: 'string', example: 'A full-stack shopping platform' },
            shortDescription: { type: 'string', example: 'Full-stack e-commerce' },
            technologies: { type: 'array', items: { type: 'string' }, example: ['React', 'Node.js'] },
            category: { type: 'string', enum: ['Web', 'Mobile', 'API', 'ML/AI', 'DevOps', 'Other'] },
            githubUrl: { type: 'string', example: 'https://github.com/user/repo' },
            liveUrl: { type: 'string', example: 'https://project.com' },
            imageUrl: { type: 'string', example: 'https://images.unsplash.com/...' },
            featured: { type: 'boolean', example: true },
            status: { type: 'string', enum: ['completed', 'in-progress', 'planned'] },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        ContactMessage: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
            subject: { type: 'string', example: 'Project Inquiry' },
            message: { type: 'string', example: 'I would love to work with you!' }
          },
          required: ['name', 'email', 'subject', 'message']
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error description' }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'] // Files with JSDoc comments for routes
};

module.exports = swaggerJsdoc(options);