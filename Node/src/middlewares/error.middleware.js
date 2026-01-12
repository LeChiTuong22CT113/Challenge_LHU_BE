/**
 * Global Error Handler Middleware
 * Centralized error handling for the entire application
 */

const { AppError } = require('../utils/appError');

// Handle specific error types
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists: ${err.keyValue[field]}`;
    return new AppError(message, 409);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map(el => ({
        field: el.path,
        message: el.message
    }));
    return new AppError('Validation failed', 400);
};

const handleJWTError = () => {
    return new AppError('Invalid token. Please log in again.', 401);
};

const handleJWTExpiredError = () => {
    return new AppError('Your token has expired. Please log in again.', 401);
};

// Send error in development
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        success: false,
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    });
};

// Send error in production
const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            success: false,
            status: err.status,
            message: err.message,
            ...(err.errors && { errors: err.errors })
        });
    } else {
        // Programming or unknown error: don't leak error details
        console.error('ERROR 💥', err);
        res.status(500).json({
            success: false,
            status: 'error',
            message: 'Something went wrong!'
        });
    }
};

// Global Error Handler
const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    const nodeEnv = process.env.NODE_ENV || 'development';

    if (nodeEnv === 'development') {
        sendErrorDev(err, res);
    } else {
        let error = { ...err, message: err.message };

        // Handle specific Mongoose errors
        if (err.name === 'CastError') error = handleCastErrorDB(err);
        if (err.code === 11000) error = handleDuplicateFieldsDB(err);
        if (err.name === 'ValidationError') error = handleValidationErrorDB(err);

        // Handle JWT errors
        if (err.name === 'JsonWebTokenError') error = handleJWTError();
        if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

        sendErrorProd(error, res);
    }
};

module.exports = globalErrorHandler;
