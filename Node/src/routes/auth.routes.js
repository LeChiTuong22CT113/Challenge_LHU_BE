/**
 * Auth Routes - Register, Login with JWT
 */

const express = require('express');
const router = express.Router();
const { register, login, getMe, updatePassword } = require('../controllers/auth.controller');

// Middleware
const { validateBody } = require('../middlewares/validate.middleware');
const { protect } = require('../middlewares/auth.middleware');
const { registerSchema, loginSchema } = require('../validations/auth.validation');

// Public routes
router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);

// Protected routes (require token)
router.get('/me', protect, getMe);
router.put('/password', protect, updatePassword);

module.exports = router;

