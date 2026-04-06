/**
 * config/seed.js - Seed the database with initial admin user and sample projects
 * Run: node config/seed.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Admin = require('../models/Admin');
const Project = require('../models/Project');

const sampleProjects = [
  {
    title: 'E-Commerce Platform',
    shortDescription: 'Full-stack shopping platform with real-time inventory',
    description: 'A comprehensive e-commerce solution with product management, cart functionality, payment integration via Stripe, and an admin dashboard. Built with React frontend and Node.js backend.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe', 'Redux', 'Tailwind CSS'],
    category: 'Web',
    githubUrl: 'https://github.com/yourname/ecommerce',
    liveUrl: 'https://ecommerce-demo.com',
    imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80',
    featured: true,
    status: 'completed',
    order: 1
  },
  {
    title: 'Task Management App',
    shortDescription: 'Kanban-style project tracker with real-time collaboration',
    description: 'A Trello-inspired task management application featuring drag-and-drop boards, real-time updates via Socket.io, team collaboration, and deadline tracking.',
    technologies: ['React', 'Socket.io', 'Node.js', 'PostgreSQL', 'Docker', 'TypeScript'],
    category: 'Web',
    githubUrl: 'https://github.com/yourname/taskmanager',
    liveUrl: 'https://taskapp-demo.com',
    imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80',
    featured: true,
    status: 'completed',
    order: 2
  },
  {
    title: 'Weather Dashboard',
    shortDescription: 'Real-time weather app with 7-day forecast and maps',
    description: 'A beautiful weather dashboard consuming OpenWeatherMap API. Features geolocation, interactive maps, hourly/weekly forecasts, and animated weather icons.',
    technologies: ['React', 'OpenWeatherMap API', 'Chart.js', 'Leaflet.js', 'CSS Animations'],
    category: 'Web',
    githubUrl: 'https://github.com/yourname/weather-app',
    liveUrl: 'https://weather-demo.com',
    imageUrl: 'https://images.unsplash.com/photo-1504608524841-42584120d693?w=800&q=80',
    featured: false,
    status: 'completed',
    order: 3
  },
  {
    title: 'RESTful Blog API',
    shortDescription: 'Scalable blog API with auth, pagination & search',
    description: 'A production-ready RESTful API for a blogging platform. Includes JWT authentication, role-based access control, full-text search, pagination, and comprehensive Swagger documentation.',
    technologies: ['Node.js', 'Express', 'MongoDB', 'JWT', 'Swagger', 'Jest'],
    category: 'API',
    githubUrl: 'https://github.com/yourname/blog-api',
    imageUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80',
    featured: true,
    status: 'completed',
    order: 4
  },
  {
    title: 'AI Chat Assistant',
    shortDescription: 'GPT-powered chatbot with conversation memory',
    description: 'An intelligent chat assistant powered by OpenAI GPT API. Features conversation history, context-aware responses, code highlighting, and a beautiful chat UI.',
    technologies: ['React', 'OpenAI API', 'Node.js', 'WebSocket', 'Framer Motion'],
    category: 'ML/AI',
    githubUrl: 'https://github.com/yourname/ai-chat',
    liveUrl: 'https://ai-chat-demo.com',
    imageUrl: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
    featured: false,
    status: 'in-progress',
    order: 5
  },
  {
    title: 'DevOps Pipeline Toolkit',
    shortDescription: 'CI/CD automation scripts and Docker configurations',
    description: 'A collection of reusable DevOps tools including Docker Compose templates, GitHub Actions workflows, Nginx configurations, and deployment scripts for various tech stacks.',
    technologies: ['Docker', 'Nginx', 'GitHub Actions', 'Bash', 'Kubernetes', 'Terraform'],
    category: 'DevOps',
    githubUrl: 'https://github.com/yourname/devops-toolkit',
    imageUrl: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80',
    featured: false,
    status: 'completed',
    order: 6
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Admin.deleteMany({});
    await Project.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', 12);
    await Admin.create({
      email: process.env.ADMIN_EMAIL || 'admin@portfolio.com',
      password: hashedPassword,
      name: 'Portfolio Admin',
      role: 'admin'
    });
    console.log(`✅ Admin created: ${process.env.ADMIN_EMAIL || 'admin@portfolio.com'}`);

    // Insert sample projects
    await Project.insertMany(sampleProjects);
    console.log(`✅ Inserted ${sampleProjects.length} sample projects`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('─'.repeat(40));
    console.log(`Admin Email:    ${process.env.ADMIN_EMAIL || 'admin@portfolio.com'}`);
    console.log(`Admin Password: ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
    console.log('─'.repeat(40));

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDB();