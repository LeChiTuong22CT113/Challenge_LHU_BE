/**
 * Jest Setup - Runs before tests
 */

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-for-jest';
process.env.JWT_EXPIRES_IN = '1d';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
