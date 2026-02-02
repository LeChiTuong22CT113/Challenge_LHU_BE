/**
 * Auth Controller - Complete Auth System (Refactored)
 * Clean code with catchAsync and AppError
 */

const crypto = require('crypto');
const User = require('../models/user.model');
const { generateUserToken } = require('../utils/jwt.util');
const catchAsync = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 */
const register = catchAsync(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
        return next(new AppError('Email already registered', 409));
    }

    const user = await User.create({ name, email, password, role });
    const token = generateUserToken(user);

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        token
    });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 */
const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Email and password are required', 400));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
        return next(new AppError('Invalid email or password', 401));
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateUserToken(user);

    res.json({
        success: true,
        message: 'Login successful',
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        token
    });
});

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 */
const getMe = catchAsync(async (req, res) => {
    res.json({ success: true, data: req.user });
});

/**
 * @desc    Update profile
 * @route   PUT /api/auth/profile
 */
const updateProfile = catchAsync(async (req, res) => {
    const { name, age, address } = req.body;

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { name, age, address },
        { new: true, runValidators: true }
    );

    res.json({
        success: true,
        message: 'Profile updated successfully',
        data: user
    });
});

/**
 * @desc    Upload avatar
 * @route   POST /api/auth/avatar
 */
const uploadAvatar = catchAsync(async (req, res, next) => {
    if (!req.file) {
        return next(new AppError('No image uploaded', 400));
    }

    const avatarUrl = `/uploads/${req.file.filename}`;

    await User.findByIdAndUpdate(req.user._id, { avatar: avatarUrl });

    res.json({
        success: true,
        message: 'Avatar uploaded successfully',
        data: { avatar: avatarUrl }
    });
});

/**
 * @desc    Update password
 * @route   PUT /api/auth/password
 */
const updatePassword = catchAsync(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    if (!(await user.comparePassword(currentPassword))) {
        return next(new AppError('Current password is incorrect', 401));
    }

    user.password = newPassword;
    await user.save();

    const token = generateUserToken(user);

    res.json({
        success: true,
        message: 'Password updated successfully',
        token
    });
});

/**
 * @desc    Forgot password - Generate reset token
 * @route   POST /api/auth/forgot-password
 */
const forgotPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return next(new AppError('No user found with this email', 404));
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Save to user (expires in 10 minutes)
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    res.json({
        success: true,
        message: 'Password reset token generated',
        resetToken,
        resetUrl: `POST /api/auth/reset-password/${resetToken}`
    });
});

/**
 * @desc    Reset password with token
 * @route   POST /api/auth/reset-password/:token
 */
const resetPassword = catchAsync(async (req, res, next) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken: resetTokenHash,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        return next(new AppError('Invalid or expired reset token', 400));
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const jwtToken = generateUserToken(user);

    res.json({
        success: true,
        message: 'Password reset successful',
        token: jwtToken
    });
});

module.exports = {
    register,
    login,
    getMe,
    updateProfile,
    uploadAvatar,
    updatePassword,
    forgotPassword,
    resetPassword
};
