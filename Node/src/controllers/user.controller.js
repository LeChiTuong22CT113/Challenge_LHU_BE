/**
 * User Controller - Clean Code Refactored
 * Handles all user-related operations with async error handling
 */

const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');
const { APIFeatures, paginateResponse } = require('../utils/apiFeatures');

/**
 * @desc    Create a new user
 * @route   POST /api/users
 */
exports.createUser = catchAsync(async (req, res, next) => {
    const { name, email, age, role } = req.body;

    if (!name || !email) {
        return next(new AppError('Name and email are required', 400));
    }

    const user = await User.create({ name, email, age, role });

    res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user
    });
});

/**
 * @desc    Create multiple users
 * @route   POST /api/users/many
 */
exports.createManyUsers = catchAsync(async (req, res, next) => {
    const { users } = req.body;

    if (!users || !Array.isArray(users)) {
        return next(new AppError('Users array is required', 400));
    }

    const result = await User.insertMany(users, { ordered: false });

    res.status(201).json({
        success: true,
        message: `${result.length} users created`,
        data: result
    });
});

/**
 * @desc    Get all users with advanced query
 * @route   GET /api/users
 */
exports.getUsers = catchAsync(async (req, res) => {
    const features = new APIFeatures(User.find(), req.query)
        .filter()
        .search(['name', 'email'])
        .sort()
        .select()
        .paginate();

    // Use lean() for read-only queries - faster performance
    const users = await features.query.lean();
    const pagination = await paginateResponse(User, features);

    res.json({
        success: true,
        count: users.length,
        pagination,
        data: users
    });
});

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 */
exports.getUserById = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id).lean();

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    res.json({ success: true, data: user });
});

/**
 * @desc    Get users count
 * @route   GET /api/users/stats/count
 */
exports.getUsersCount = catchAsync(async (req, res) => {
    const { role, isActive } = req.query;
    const query = {};

    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const count = await User.countDocuments(query);

    res.json({ success: true, data: { count } });
});

/**
 * @desc    Full update user (PUT)
 * @route   PUT /api/users/:id
 */
exports.updateUser = catchAsync(async (req, res, next) => {
    const { name, email, age, role, isActive } = req.body;

    const user = await User.findByIdAndUpdate(
        req.params.id,
        { name, email, age, role, isActive },
        { new: true, runValidators: true }
    );

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    res.json({
        success: true,
        message: 'User updated successfully',
        data: user
    });
});

/**
 * @desc    Partial update user (PATCH)
 * @route   PATCH /api/users/:id
 */
exports.patchUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
    );

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    res.json({
        success: true,
        message: 'User patched successfully',
        data: user
    });
});

/**
 * @desc    Bulk update users
 * @route   PATCH /api/users/bulk/update
 */
exports.bulkUpdateUsers = catchAsync(async (req, res, next) => {
    const { filter, update } = req.body;

    if (!filter || !update) {
        return next(new AppError('Filter and update are required', 400));
    }

    const result = await User.updateMany(filter, { $set: update });

    res.json({
        success: true,
        message: `${result.modifiedCount} users updated`,
        data: result
    });
});

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 */
exports.deleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    res.json({
        success: true,
        message: 'User deleted successfully',
        data: user
    });
});

/**
 * @desc    Bulk delete users
 * @route   DELETE /api/users/bulk/delete
 */
exports.bulkDeleteUsers = catchAsync(async (req, res, next) => {
    const { filter } = req.body;

    if (!filter) {
        return next(new AppError('Filter is required', 400));
    }

    const result = await User.deleteMany(filter);

    res.json({
        success: true,
        message: `${result.deletedCount} users deleted`,
        data: result
    });
});
