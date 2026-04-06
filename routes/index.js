const express = require('express');

const healthRoutes = require('./healthRoutes');

const router = express.Router();

router.use(healthRoutes);

router.get('/', (req, res) => {
  res.json({ message: 'Backend API is running' });
});

module.exports = router;
