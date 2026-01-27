/**
 * Basic Unit Tests
 * Testing utility functions
 */

const path = require('path');

// ============ APPERROR TESTS ============
describe('AppError Utility', () => {
    const appErrorPath = path.join(__dirname, '../utils/appError');
    const { AppError, BadRequestError, NotFoundError, UnauthorizedError } = require(appErrorPath);

    test('AppError creates error with message and status code', () => {
        const error = new AppError('Test error', 400);
        expect(error.message).toBe('Test error');
        expect(error.statusCode).toBe(400);
        expect(error.status).toBe('fail');
        expect(error.isOperational).toBe(true);
    });

    test('AppError sets status to "error" for 500 codes', () => {
        const error = new AppError('Server error', 500);
        expect(error.status).toBe('error');
    });

    test('BadRequestError creates a 400 error', () => {
        const error = new BadRequestError('Invalid input');
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe('Invalid input');
    });

    test('NotFoundError creates a 404 error', () => {
        const error = new NotFoundError('Resource not found');
        expect(error.statusCode).toBe(404);
    });

    test('UnauthorizedError creates a 401 error', () => {
        const error = new UnauthorizedError('Not authenticated');
        expect(error.statusCode).toBe(401);
    });
});

// ============ JWT TESTS ============
describe('JWT Utility', () => {
    const jwtPath = path.join(__dirname, '../utils/jwt.util');
    const { generateToken, verifyToken, generateUserToken } = require(jwtPath);

    test('generateToken creates a valid JWT', () => {
        const payload = { id: '123', email: 'test@example.com' };
        const token = generateToken(payload);
        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
        expect(token.split('.')).toHaveLength(3);
    });

    test('verifyToken decodes a valid token', () => {
        const payload = { id: '123', email: 'test@example.com' };
        const token = generateToken(payload);
        const decoded = verifyToken(token);
        expect(decoded.id).toBe('123');
        expect(decoded.email).toBe('test@example.com');
    });

    test('verifyToken throws for invalid token', () => {
        expect(() => verifyToken('invalid-token')).toThrow();
    });

    test('generateUserToken works with user object', () => {
        const user = { _id: '507f1f77bcf86cd799439011', email: 'user@test.com', role: 'user' };
        const token = generateUserToken(user);
        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
    });
});
