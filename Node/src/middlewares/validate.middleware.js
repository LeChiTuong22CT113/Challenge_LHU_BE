/**
 * Validation Middleware
 * Generic middleware to validate request data using Joi schemas
 */

/**
 * Validate request body
 * @param {Joi.Schema} schema - Joi validation schema
 */
const validateBody = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,  // Return all errors
            stripUnknown: true  // Remove unknown fields
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        req.body = value;  // Use sanitized value
        next();
    };
};

/**
 * Validate request params (e.g., :id)
 * @param {Joi.Schema} schema - Joi validation schema
 */
const validateParams = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.params);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        next();
    };
};

/**
 * Validate request query
 * @param {Joi.Schema} schema - Joi validation schema
 */
const validateQuery = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.query, {
            stripUnknown: true
        });

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        req.query = value;
        next();
    };
};

module.exports = {
    validateBody,
    validateParams,
    validateQuery
};
