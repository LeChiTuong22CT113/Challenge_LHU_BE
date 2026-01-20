/**
 * Centralized Configuration
 * All environment variables and config settings
 */

// Ensure dotenv is loaded first
require('dotenv').config();

const config = {
    // ============ SERVER ============
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 3000,

    // ============ DATABASE ============
    db: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/mvc_api',
        options: {
            // Mongoose options (most are deprecated in newer versions)
        }
    },

    // ============ JWT ============
    jwt: {
        secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        cookieExpiresIn: parseInt(process.env.JWT_COOKIE_EXPIRES_IN, 10) || 7
    },

    // ============ BCRYPT ============
    bcrypt: {
        saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10
    },

    // ============ UPLOAD ============
    upload: {
        maxImageSize: parseInt(process.env.MAX_IMAGE_SIZE, 10) || 5 * 1024 * 1024,  // 5MB
        maxDocSize: parseInt(process.env.MAX_DOC_SIZE, 10) || 10 * 1024 * 1024,     // 10MB
        allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        allowedDocTypes: [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ],
        uploadPath: process.env.UPLOAD_PATH || 'uploads/'
    },

    // ============ CORS ============
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true
    },

    // ============ RATE LIMIT ============
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW, 10) || 15 * 60 * 1000, // 15 minutes
        max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100
    },

    // ============ PAGINATION ============
    pagination: {
        defaultLimit: parseInt(process.env.DEFAULT_PAGE_LIMIT, 10) || 10,
        maxLimit: parseInt(process.env.MAX_PAGE_LIMIT, 10) || 100
    },

    // ============ EMAIL (future) ============
    email: {
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT, 10) || 587,
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
        from: process.env.EMAIL_FROM || 'noreply@example.com'
    }
};

// Validate required config in production
if (config.env === 'production') {
    const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI'];
    const missing = requiredEnvVars.filter(key => !process.env[key]);

    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
}

module.exports = config;
