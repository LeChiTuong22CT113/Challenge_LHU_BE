/**
 * User Validation Schemas using Joi
 */

const Joi = require('joi');

// Create user schema
const createUserSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.empty': 'Name is required',
            'string.min': 'Name must be at least 2 characters',
            'string.max': 'Name cannot exceed 50 characters'
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email',
            'string.empty': 'Email is required'
        }),

    age: Joi.number()
        .integer()
        .min(0)
        .max(150)
        .messages({
            'number.min': 'Age cannot be negative',
            'number.max': 'Age cannot exceed 150'
        }),

    role: Joi.string()
        .valid('user', 'admin', 'moderator')
        .default('user')
        .messages({
            'any.only': 'Role must be user, admin, or moderator'
        }),

    isActive: Joi.boolean().default(true)
});

// Update user schema (all fields optional)
const updateUserSchema = Joi.object({
    name: Joi.string().min(2).max(50),
    email: Joi.string().email(),
    age: Joi.number().integer().min(0).max(150),
    role: Joi.string().valid('user', 'admin', 'moderator'),
    isActive: Joi.boolean()
}).min(1).messages({
    'object.min': 'At least one field is required for update'
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
    createUserSchema,
    updateUserSchema,
    objectIdSchema
};
