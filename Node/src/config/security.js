/**
 * Security Configuration
 * Centralized security settings
 */

module.exports = {
    // Rate Limiting
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // requests per window
        message: {
            success: false,
            message: 'Too many requests, please try again later'
        }
    },

    // Auth Rate Limiting (stricter)
    authRateLimit: {
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 10, // 10 login attempts per hour
        message: {
            success: false,
            message: 'Too many login attempts, please try again after an hour'
        }
    },

    // Helmet options
    helmet: {
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false
    },

    // HPP whitelist - allowed duplicate params
    hppWhitelist: ['status', 'priority', 'sort', 'page', 'limit', 'fields'],

    // Body parser limits
    bodyLimit: '10kb',

    // Allowed origins for CORS
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['*'],

    // Trusted proxies
    trustProxy: process.env.NODE_ENV === 'production' ? 1 : false
};
