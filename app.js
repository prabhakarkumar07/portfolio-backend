const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');

const { env, allowedOrigins, isProduction } = require('./config/env');
const swaggerSpec = require('./config/swagger');
const profileRoutes = require('./routes/profileRoutes');
const projectRoutes = require('./routes/projectRoutes');
const blogRoutes = require('./routes/blogRoutes');
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.disable('x-powered-by');

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

app.use(
  helmet({
    crossOriginResourcePolicy: isProduction ? undefined : false,
  }),
);
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(isProduction ? 'combined' : 'dev'));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many login attempts, please try again later.' },
});

app.use('/api', apiLimiter);
app.use('/api/admin/login', authLimiter);

app.get('/', (req, res) => {
  res.json({
    name: env.APP_NAME,
    status: 'ok',
    message: 'API server is running',
  });
});

app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Portfolio API Docs',
  }),
);

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Portfolio API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

app.use('/api/profile', profileRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', authRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use(errorHandler);

module.exports = app;
