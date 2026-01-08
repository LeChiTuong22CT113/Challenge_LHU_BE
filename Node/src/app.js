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
        message: 'Task Manager API',
        version: '1.0.0',
        endpoints: {
            users: {
                'GET /api/users': 'Get all users',
                'GET /api/users/:id': 'Get user by ID',
                'POST /api/users': 'Create user',
                'PUT /api/users/:id': 'Update user',
                'PATCH /api/users/:id': 'Partial update',
                'DELETE /api/users/:id': 'Delete user'
            },
            todos: {
                'GET /api/todos': 'Get all todos',
                'GET /api/todos/:id': 'Get todo by ID',
                'POST /api/todos': 'Create todo',
                'PUT /api/todos/:id': 'Update todo',
                'DELETE /api/todos/:id': 'Delete todo'
            },
            tasks: {
                'GET /api/tasks': 'Get all tasks',
                'GET /api/tasks/stats': 'Statistics',
                'GET /api/tasks/:id': 'Get task by ID',
                'POST /api/tasks': 'Create task',
                'PUT /api/tasks/:id': 'Update task',
                'PATCH /api/tasks/:id/status': 'Update status',
                'POST /api/tasks/:id/subtasks': 'Add subtask',
                'DELETE /api/tasks/:id': 'Delete task'
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
