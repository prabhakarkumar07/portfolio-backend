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

const sampleProjects = [
  {
    title: 'Cheque Truncation System (CTS)',
    shortDescription: 'Banking system for secure interbank cheque processing',
    description: 'Developed CTS modules using Java, Spring Boot, React, and ZK Framework. Implemented OCR/MICR extraction improving accuracy by 35%, role-based verification improving approval efficiency by 30%, and optimized NPCI file processing reducing batch time by 40%. Increased system throughput by 50% using multi-threaded processing.',
    technologies: ['Java', 'Spring Boot', 'React', 'ZK Framework', 'JDBC', 'Hibernate', 'Oracle DB', 'AWS ECS', 'Tomcat'],
    category: 'API',
    githubUrl: 'https://github.com/prabhakarkumar07/cts-system',
    featured: true,
    status: 'completed',
    order: 1
  },
  {
    title: 'AIChat Application',
    shortDescription: 'Real-time AI chat app with multiple LLM integration',
    description: 'Built React + Express application with real-time text streaming, improving UX by 40%. Added context-aware responses increasing accuracy by 35%. Integrated multiple LLMs via APIs, boosting engagement by 30%.',
    technologies: ['React', 'Express', 'Node.js', 'WebSocket', 'MongoDB', 'Tailwind CSS'],
    category: 'Web',
    githubUrl: 'https://github.com/prabhakarkumar07/aichat-app',
    liveUrl: 'https://aichat-demo.vercel.app',
    featured: true,
    status: 'completed',
    order: 2
  },
  {
    title: 'Pro Manage: Task Scheduler & Productivity Manager',
    shortDescription: 'Full-stack productivity platform with Spring Boot + React',
    description: 'Developing a full-stack productivity platform using Spring Boot + React, improving task organization efficiency by 40%. Implementing Spring Security with OAuth 2.0 and JWT for secure role-based access control. Containerizing services with Docker and setting up CI/CD pipelines using Jenkins and GitHub Actions.',
    technologies: ['Spring Boot', 'React', 'Tailwind CSS', 'OAuth 2.0', 'JWT', 'Docker', 'Jenkins', 'PostgreSQL'],
    category: 'Web',
    githubUrl: 'https://github.com/prabhakarkumar07/pro-manage',
    featured: true,
    status: 'in-progress',
    order: 3
  }
];

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
    const profileData = {
      fullName: 'PRABHAKAR KUMAR',
      headline: 'Full Stack Java Developer',
      bio: `Full Stack Java Developer with 1+ years of experience in building scalable, high-performance web applications using Java, Spring Boot, Spring Framework, Hibernate, JDBC, and ZK Framework. Skilled in front-end development with React, Tailwind CSS, and JavaScript, and experienced in creating RESTful and SOAP APIs, Node.js backend services, and working with SQL (Oracle, PostgreSQL, MySQL, SQL Server) and NoSQL (MongoDB) databases. Proficient in Microservices and SOA architecture, writing optimized SQL queries, debugging complex issues, and improving system performance. Knowledgeable in STLC with a strong focus on software quality, and recognized for effective communication, cross-team collaboration, and delivering client-focused solutions across the full SDLC.`,
      location: 'New Delhi, India',
      email: 'prabhakarkumarcs2023@gmail.com',
      githubUrl: 'https://github.com/prabhakarkumar07',
      linkedinUrl: 'https://linkedin.com/in/prabhakar-kumar-040644214/',
      availabilityStatus: 'Open to work',
      stats: [
        { label: 'Years Experience', value: '1+' },
        { label: 'Projects Completed', value: '3+' },
        { label: 'Technologies', value: '15+' },
        { label: 'Certifications', value: '1' }
      ],
      skillCategories: [
        {
          name: 'Languages',
          icon: '💻',
          skills: [
            { name: 'Java (Core, OOP)', level: 90 },
            { name: 'JavaScript (ES6+)', level: 85 },
            { name: 'C++', level: 70 }
          ]
        },
        {
          name: 'Frontend',
          icon: '🎨',
          skills: [
            { name: 'React.js', level: 88 },
            { name: 'ZK Framework', level: 85 },
            { name: 'Tailwind CSS', level: 90 },
            { name: 'HTML5/CSS3', level: 92 },
            { name: 'Redux Toolkit', level: 80 }
          ]
        },
        {
          name: 'Backend & Frameworks',
          icon: '⚙️',
          skills: [
            { name: 'Spring Boot', level: 88 },
            { name: 'Spring Framework', level: 85 },
            { name: 'Hibernate ORM', level: 82 },
            { name: 'Node.js', level: 80 },
            { name: 'JPA/JDBC', level: 85 }
          ]
        },
        {
          name: 'Databases',
          icon: '🗄️',
          skills: [
            { name: 'Oracle DB', level: 85 },
            { name: 'PostgreSQL', level: 82 },
            { name: 'MySQL', level: 80 },
            { name: 'MongoDB', level: 78 },
            { name: 'SQL Server', level: 75 }
          ]
        },
        {
          name: 'Cloud & DevOps',
          icon: '☁️',
          skills: [
            { name: 'AWS (ECS, Lambda, RDS)', level: 75 },
            { name: 'Docker', level: 80 },
            { name: 'Jenkins', level: 70 },
            { name: 'GitHub Actions', level: 75 },
            { name: 'CI/CD', level: 78 }
          ]
        },
        {
          name: 'Tools & Technologies',
          icon: '🛠️',
          skills: [
            { name: 'Git/GitHub', level: 90 },
            { name: 'Maven', level: 85 },
            { name: 'Postman/SoapUI', level: 88 },
            { name: 'IntelliJ IDEA', level: 85 },
            { name: 'JIRA', level: 80 }
          ]
        }
      ],
      experiences: [
        {
          title: 'Software Developer',
          company: 'Image InfoSystems',
          period: 'Oct 2024 - Present',
          description: 'Developed CTS modules using Java (JDBC, Hibernate), Spring Boot / Spring Framework, React, and ZK, delivering responsive UIs and improving user engagement by 20%. Optimized backend services, SQL queries, and frontend rendering, achieving 40% performance improvement, and modernized the stack by migrating from Java 8 to Java 21. Built SOAP/REST APIs, microservices, and multi-threaded, high-throughput services for secure, real-time interbank cheque processing. Collaborated with banking clients across SDLC/STLC to deliver customized solutions, improving processing speed by 30%, and deployed applications on AWS (ECS, Lambda, RDS) with Tomcat, JBoss, WildFly, and WebLogic.',
          tech: ['Java', 'Spring Boot', 'React', 'ZK Framework', 'JDBC', 'Hibernate', 'Oracle DB', 'AWS', 'Tomcat', 'JBoss']
        }
      ],
      resumeHighlights: [
        { icon: '🎓', label: 'Education', value: 'B.E. Computer Science', sub: 'VTU · CGPA: 8.47 · 2019-2023' },
        { icon: '🏆', label: 'Certification', value: 'AWS Certified Developer', sub: 'Amazon Web Services · 2023' },
        { icon: '💼', label: 'Experience', value: '1+ Years Professional', sub: 'Full-Stack Development' },
        { icon: '🌍', label: 'Languages', value: 'English & Hindi', sub: 'Professional proficiency' }
      ],
      careerJourney: [
        { year: '2019', title: 'Beginning the Journey', subtitle: 'Learning fundamentals', description: 'Started B.E. in Computer Science at VTU, learning programming fundamentals and software development basics.', accent: 'from-primary-500 to-sky-400' },
        { year: '2023', title: 'Graduation & First Role', subtitle: 'Professional development', description: 'Completed engineering degree with 8.47 CGPA and joined Image InfoSystems as Software Developer, starting professional career in full-stack development.', accent: 'from-sky-500 to-emerald-400' },
        { year: '2024', title: 'Building Enterprise Solutions', subtitle: 'Banking & microservices', description: 'Working on critical banking systems, implementing microservices architecture, and modernizing legacy applications with latest Java technologies.', accent: 'from-emerald-500 to-lime-400' },
        { year: 'Now', title: 'Career Growth', subtitle: 'Full-stack expertise', description: 'Continuing to expand skills in modern web technologies, cloud platforms, and DevOps practices while delivering high-impact solutions.', accent: 'from-amber-400 to-orange-500' }
      ]
    };

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