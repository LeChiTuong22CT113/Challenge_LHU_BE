/**
 * Swagger Configuration
 */

const swaggerJsdoc = require('swagger-jsdoc');
const config = require('./index');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Task Manager API',
        version: '1.0.0',
        description: 'Complete REST API with Authentication, CRUD, File Upload',
        contact: {
            name: 'Le Chi Tuong',
            email: 'tuong@example.com'
        }
    },
    servers: [
        {
            url: `http://localhost:${config.port}`,
            description: 'Development server'
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        },
        schemas: {
            User: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
                    name: { type: 'string', example: 'Le Chi Tuong' },
                    email: { type: 'string', example: 'tuong@example.com' },
                    role: { type: 'string', enum: ['user', 'admin', 'moderator'] },
                    isActive: { type: 'boolean', default: true },
                    createdAt: { type: 'string', format: 'date-time' }
                }
            },
            Task: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    title: { type: 'string', example: 'Complete API' },
                    description: { type: 'string' },
                    status: { type: 'string', enum: ['pending', 'in-progress', 'completed', 'cancelled'] },
                    priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
                    dueDate: { type: 'string', format: 'date-time' }
                }
            },
            Post: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    title: { type: 'string' },
                    content: { type: 'string' },
                    author: { $ref: '#/components/schemas/User' },
                    status: { type: 'string', enum: ['draft', 'published', 'archived'] }
                }
            },
            Error: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string' }
                }
            },
            Success: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string' },
                    data: { type: 'object' }
                }
            }
        }
    },
    tags: [
        { name: 'Auth', description: 'Authentication endpoints' },
        { name: 'Users', description: 'User management' },
        { name: 'Tasks', description: 'Task management' },
        { name: 'Posts', description: 'Post management' },
        { name: 'Upload', description: 'File upload' }
    ]
};

const options = {
    swaggerDefinition,
    apis: ['./src/docs/*.js']  // Path to API docs
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
