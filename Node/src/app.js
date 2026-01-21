/**
 * Express App Configuration
 * Middleware, routes, error handling, Swagger docs
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const routes = require('./routes');
const globalErrorHandler = require('./middlewares/error.middleware');
const { AppError } = require('./utils/appError');

const app = express();

// ============ MIDDLEWARE ============
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============ STATIC FILES ============
app.use('/uploads', express.static('uploads'));

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
            upload: '/api/upload'
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


