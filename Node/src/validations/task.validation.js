/**
 * Task Validation Schemas using Joi
 */

const Joi = require('joi');

// Create task schema
const createTaskSchema = Joi.object({
    title: Joi.string()
        .min(1)
        .max(200)
        .required()
        .messages({
            'string.empty': 'Title is required',
            'string.max': 'Title cannot exceed 200 characters'
        }),

    description: Joi.string()
        .max(1000)
        .allow('')
        .messages({
            'string.max': 'Description cannot exceed 1000 characters'
        }),

    status: Joi.string()
        .valid('pending', 'in-progress', 'completed', 'cancelled')
        .default('pending'),

    priority: Joi.string()
        .valid('low', 'medium', 'high', 'urgent')
        .default('medium'),

    dueDate: Joi.date()
        .iso()
        .greater('now')
        .messages({
            'date.greater': 'Due date must be in the future'
        }),

    assignedTo: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({
            'string.pattern.base': 'Invalid user ID format'
        }),

    category: Joi.string().max(50),

    tags: Joi.array().items(Joi.string().max(30))
});

// Update task schema
const updateTaskSchema = Joi.object({
    title: Joi.string().min(1).max(200),
    description: Joi.string().max(1000).allow(''),
    status: Joi.string().valid('pending', 'in-progress', 'completed', 'cancelled'),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent'),
    dueDate: Joi.date().iso(),
    assignedTo: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
    category: Joi.string().max(50),
    tags: Joi.array().items(Joi.string().max(30))
}).min(1);

// Update status schema
const updateStatusSchema = Joi.object({
    status: Joi.string()
        .valid('pending', 'in-progress', 'completed', 'cancelled')
        .required()
        .messages({
            'any.only': 'Status must be pending, in-progress, completed, or cancelled'
        })
});

// Add subtask schema
const subtaskSchema = Joi.object({
    title: Joi.string()
        .min(1)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Subtask title is required'
        })
});

// ID param schema
const objectIdSchema = Joi.object({
    id: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'Invalid ID format'
        })
});

module.exports = {
    createTaskSchema,
    updateTaskSchema,
    updateStatusSchema,
    subtaskSchema,
    objectIdSchema
};
