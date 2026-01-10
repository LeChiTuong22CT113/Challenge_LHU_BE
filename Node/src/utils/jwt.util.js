/**
 * JWT Utility - Token generation and verification
 */

const jwt = require('jsonwebtoken');

// Secret key (should be in .env in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generate JWT token
 * @param {Object} payload - Data to encode in token
 * @returns {String} JWT token
 */
const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    });
};

/**
 * Verify JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded payload
 */
const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};

/**
 * Generate token for user
 * @param {Object} user - User document
 * @returns {String} JWT token
 */
const generateUserToken = (user) => {
    return generateToken({
        id: user._id,
        email: user.email,
        role: user.role
    });
};

module.exports = {
    generateToken,
    verifyToken,
    generateUserToken,
    JWT_SECRET,
    JWT_EXPIRES_IN
};
