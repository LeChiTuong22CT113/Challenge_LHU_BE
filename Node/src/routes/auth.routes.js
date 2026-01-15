/**
 * Auth Routes - Complete Auth System
 */

const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getMe,
    updateProfile,
    uploadAvatar,
    updatePassword,
    forgotPassword,
    resetPassword
} = require('../controllers/auth.controller');

// Middleware
const { validateBody } = require('../middlewares/validate.middleware');
const { protect } = require('../middlewares/auth.middleware');
const { uploadSingleImage } = require('../middlewares/upload.middleware');
const { registerSchema, loginSchema } = require('../validations/auth.validation');

// ============ PUBLIC ROUTES ============
router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// ============ PROTECTED ROUTES ============
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/avatar', protect, uploadSingleImage, uploadAvatar);
router.put('/password', protect, updatePassword);

module.exports = router;


