/**
 * config/seed.js - Seed the database with initial admin user and sample projects
 * Run: node config/seed.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Admin = require('../models/Admin');
const Project = require('../models/Project');
const Profile = require('../models/Profile');

const sampleProjects = [];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Admin.deleteMany({});
    await Project.deleteMany({});
    await Profile.deleteMany({});
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

    // Create profile
    const profileData = {};

    await Profile.create(profileData);
    console.log('✅ Profile created for Prabhaakar Kumar');
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
