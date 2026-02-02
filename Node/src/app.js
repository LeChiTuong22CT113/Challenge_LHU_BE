/**
 * Express App Configuration
 * Middleware, routes, error handling, security, Swagger docs
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const routes = require('./routes');
const globalErrorHandler = require('./middlewares/error.middleware');
const { AppError } = require('./utils/appError');

const app = express();

// ============ SECURITY MIDDLEWARE ============
// Set security HTTP headers
app.use(helmet({
    contentSecurityPolicy: false, // Disable for API
    crossOriginEmbedderPolicy: false
}));

// Rate limiting - 100 requests per 15 minutes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: 'Too many requests, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false
});
app.use('/api', limiter);

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Prevent parameter pollution
app.use(hpp({
    whitelist: ['status', 'priority', 'sort', 'page', 'limit']
}));

// ============ CORE MIDDLEWARE ============
app.use(cors());
app.use(compression()); // Gzip compression
app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' })); // Body limit
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ============ STATIC FILES ============
app.use('/uploads', express.static('uploads'));
app.use(express.static('public'));

// ============ SWAGGER DOCS ============
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Task Manager API Docs'
}));

// ============ API ROUTES ============
app.use('/api', routes);

// ============ HOME ROUTE ============
app.get('/', (req, res) => {
    res.json({
        message: 'Task Manager API',
        version: '1.0.0',
        documentation: '/api-docs',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            tasks: '/api/tasks',
            posts: '/api/posts',
            upload: '/api/upload',
            proxy: '/api/proxy'
        }
    });
});

// ============ 404 HANDLER ============
app.use((req, res, next) => {
    next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404));
});

// ============ GLOBAL ERROR HANDLER ============
app.use(globalErrorHandler);

module.exports = app;
