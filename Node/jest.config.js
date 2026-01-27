/**
 * Jest Configuration
 */

module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.js'],
    verbose: true,
    testTimeout: 10000,
    setupFiles: ['<rootDir>/jest.setup.js']
};
