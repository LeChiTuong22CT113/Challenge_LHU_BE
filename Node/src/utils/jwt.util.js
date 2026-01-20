/**
 * JWT Utility - Token generation and verification
 */

const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Generate JWT token
 * @param {Object} payload - Data to encode in token
 * @returns {String} JWT token
 */
const generateToken = (payload) => {
    return jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn
    });
};

/**
 * Verify JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded payload
 */
const verifyToken = (token) => {
    return jwt.verify(token, config.jwt.secret);
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
    generateUserToken
};

