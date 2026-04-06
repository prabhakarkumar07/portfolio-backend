function getHealth(req, res) {
  res.json({
    status: 'ok',
    message: 'Backend API is healthy',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
}

module.exports = {
  getHealth,
};
