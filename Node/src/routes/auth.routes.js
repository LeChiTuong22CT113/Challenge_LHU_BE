/**
 * Auth Routes - Register and Login
 */

const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/auth.controller');

// Validation
const { validateBody } = require('../middlewares/validate.middleware');
const { registerSchema, loginSchema } = require('../validations/auth.validation');

// Routes
router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.get('/me', getMe);

module.exports = router;
