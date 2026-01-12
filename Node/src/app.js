/**
 * Express App Configuration
 * Middleware, routes, error handling setup
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const routes = require('./routes');
const globalErrorHandler = require('./middlewares/error.middleware');
const { AppError } = require('./utils/appError');

const app = express();

// ============ MIDDLEWARE ============
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============ API ROUTES ============
app.use('/api', routes);

// ============ HOME ROUTE ============
app.get('/', (req, res) => {
    res.json({
        message: 'Task Manager API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth (register, login, me)',
            users: '/api/users (CRUD)',
            tasks: '/api/tasks (CRUD)',
            todos: '/api/todos (CRUD)'
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

