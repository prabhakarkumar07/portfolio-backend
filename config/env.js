const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT || 5000),
  APP_NAME: process.env.APP_NAME || 'portfolio-backend',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  CORS_ORIGIN:
    process.env.CORS_ORIGIN ||
    process.env.CLIENT_URL ||
    'http://localhost:5173',
  MONGO_URI: process.env.MONGO_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
  EMAIL_PORT: Number(process.env.EMAIL_PORT || 587),
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASS: process.env.EMAIL_PASS || '',
  EMAIL_FROM: process.env.EMAIL_FROM || '',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@portfolio.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'Admin@123',
};

const allowedOrigins = env.CORS_ORIGIN
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const isProduction = env.NODE_ENV === 'production';

const getMissingEnvVars = (keys = []) =>
  keys.filter((key) => {
    const value = env[key];

    if (typeof value === 'number') {
      return Number.isNaN(value);
    }

    return !value;
  });

const validateEnv = (keys = [], options = {}) => {
  const missing = getMissingEnvVars(keys);

  if (missing.length === 0) {
    return;
  }

  const message = `Missing required environment variables: ${missing.join(', ')}`;

  if (options.throwOnMissing !== false) {
    throw new Error(message);
  }

  console.warn(message);
};

module.exports = {
  env,
  allowedOrigins,
  isProduction,
  getMissingEnvVars,
  validateEnv,
};
