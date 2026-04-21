require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');
const { validateEnv } = require('./config/env');

const PORT = process.env.PORT || 5000;
app.set('trust proxy', 1);
const startServer = async () => {
  validateEnv(['MONGO_URI', 'JWT_SECRET']);
  await connectDB();

  return app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`API Docs: http://localhost:${PORT}/api/docs`);
    console.log(`Health: http://localhost:${PORT}/api/health`);
  });
};

if (require.main === module) {
  startServer().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}

module.exports = { app, startServer };
