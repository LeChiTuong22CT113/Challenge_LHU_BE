/**
 * User Controller - Business Logic
 * Handles all user-related operations
 */

const User = require('../models/user.model');
const { sendSuccess, sendError } = require('../utils/response.util');

/**
 * @desc    Create a new user
 * @route   POST /api/users
 */
exports.createUser = async (req, res) => {
    try {
        const { name, email, age, role } = req.body;

        // Validation
        if (!name || !email) {
            return sendError(res, 'Name and email are required', 400);
        }

        const user = await User.create({ name, email, age, role });

        sendSuccess(res, user, 'User created successfully', 201);
    } catch (error) {
        if (error.code === 11000) {
            return sendError(res, 'Email already exists', 409);
        }
        sendError(res, error.message, 500);
    }
};

/**
 * @desc    Create multiple users
 * @route   POST /api/users/many
 */
exports.createManyUsers = async (req, res) => {
    try {
        const { users } = req.body;

        if (!users || !Array.isArray(users)) {
            return sendError(res, 'Users array is required', 400);
        }

        const result = await User.insertMany(users);

        sendSuccess(res, result, `${result.length} users created`, 201);
    } catch (error) {
        sendError(res, error.message, 500);
    }
};

/**
 * @desc    Get all users with filters
 * @route   GET /api/users
 */
exports.getUsers = async (req, res) => {
    try {
        const { role, isActive, minAge, maxAge, sort, limit, skip } = req.query;

        let query = {};

        if (role) query.role = role;
        if (isActive !== undefined) query.isActive = isActive === 'true';

        if (minAge || maxAge) {
            query.age = {};
            if (minAge) query.age.$gte = parseInt(minAge);
            if (maxAge) query.age.$lte = parseInt(maxAge);
        }

        let result = User.find(query);

        if (sort) {
            const sortOrder = sort.startsWith('-') ? -1 : 1;
            const sortField = sort.replace('-', '');
            result = result.sort({ [sortField]: sortOrder });
        }

        if (skip) result = result.skip(parseInt(skip));
        if (limit) result = result.limit(parseInt(limit));

        const users = await result;

        sendSuccess(res, { count: users.length, users });
    } catch (error) {
        sendError(res, error.message, 500);
    }
};

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 */
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return sendError(res, 'User not found', 404);
        }

        sendSuccess(res, user);
    } catch (error) {
        sendError(res, error.message, 500);
    }
};

/**
 * @desc    Get users count
 * @route   GET /api/users/stats/count
 */
exports.getUsersCount = async (req, res) => {
    try {
        const { role, isActive } = req.query;
        let query = {};

        if (role) query.role = role;
        if (isActive !== undefined) query.isActive = isActive === 'true';

        const count = await User.countDocuments(query);

        sendSuccess(res, { count });
    } catch (error) {
        sendError(res, error.message, 500);
    }
};

/**
 * @desc    Full update user (PUT)
 * @route   PUT /api/users/:id
 */
exports.updateUser = async (req, res) => {
    try {
        const { name, email, age, role, isActive } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, age, role, isActive },
            { new: true, runValidators: true }
        );

        if (!user) {
            return sendError(res, 'User not found', 404);
        }

        sendSuccess(res, user, 'User updated successfully');
    } catch (error) {
        sendError(res, error.message, 500);
    }
};

/**
 * @desc    Partial update user (PATCH)
 * @route   PATCH /api/users/:id
 */
exports.patchUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!user) {
            return sendError(res, 'User not found', 404);
        }

        sendSuccess(res, user, 'User patched successfully');
    } catch (error) {
        sendError(res, error.message, 500);
    }
};

/**
 * @desc    Bulk update users
 * @route   PATCH /api/users/bulk/update
 */
exports.bulkUpdateUsers = async (req, res) => {
    try {
        const { filter, update } = req.body;

        if (!filter || !update) {
            return sendError(res, 'Filter and update are required', 400);
        }

        const result = await User.updateMany(filter, { $set: update });

        sendSuccess(res, result, `${result.modifiedCount} users updated`);
    } catch (error) {
        sendError(res, error.message, 500);
    }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 */
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return sendError(res, 'User not found', 404);
        }

        sendSuccess(res, user, 'User deleted successfully');
    } catch (error) {
        sendError(res, error.message, 500);
    }
};

/**
 * @desc    Bulk delete users
 * @route   DELETE /api/users/bulk/delete
 */
exports.bulkDeleteUsers = async (req, res) => {
    try {
        const { filter } = req.body;

        if (!filter) {
            return sendError(res, 'Filter is required', 400);
        }

        const result = await User.deleteMany(filter);

        sendSuccess(res, result, `${result.deletedCount} users deleted`);
    } catch (error) {
        sendError(res, error.message, 500);
    }
};
