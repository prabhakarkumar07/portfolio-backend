require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
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
