/**
 * Express App Configuration
 * Middleware, routes, error handling setup
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const routes = require('./routes');
const { sendError } = require('./utils/response.util');

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
        message: 'MVC Pattern API',
        version: '1.0.0',
        structure: {
            models: 'src/models/ - Data layer (Mongoose schemas)',
            controllers: 'src/controllers/ - Business logic',
            routes: 'src/routes/ - API endpoints',
            utils: 'src/utils/ - Helper functions'
        },
        endpoints: {
            users: {
                'GET /api/users': 'Get all users',
                'GET /api/users/:id': 'Get user by ID',
                'GET /api/users/stats/count': 'Count users',
                'POST /api/users': 'Create user',
                'POST /api/users/many': 'Create multiple users',
                'PUT /api/users/:id': 'Full update user',
                'PATCH /api/users/:id': 'Partial update user',
                'PATCH /api/users/bulk/update': 'Bulk update users',
                'DELETE /api/users/:id': 'Delete user',
                'DELETE /api/users/bulk/delete': 'Bulk delete users'
            },
            todos: {
                'GET /api/todos': 'Get all todos',
                'GET /api/todos/:id': 'Get todo by ID',
                'POST /api/todos': 'Create todo',
                'PUT /api/todos/:id': 'Update todo',
                'PATCH /api/todos/:id/toggle': 'Toggle todo status',
                'DELETE /api/todos/:id': 'Delete todo'
            }
        }
    });
});

// ============ 404 HANDLER ============
app.use((req, res) => {
    sendError(res, `Route ${req.method} ${req.url} not found`, 404);
});

// ============ ERROR HANDLER ============
app.use((err, req, res, next) => {
    console.error(err.stack);
    sendError(res, err.message || 'Internal Server Error', err.status || 500);
});

module.exports = app;
