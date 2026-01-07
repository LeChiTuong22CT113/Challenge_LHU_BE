// CRUD - READ Operations
// GET endpoints for querying users

const express = require('express');
const router = express.Router();
const User = require('../models/user.model');

// GET /api/users - Get all users (with filters)
router.get('/', async (req, res) => {
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

        res.json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/users/:id - Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/users/count - Count users
router.get('/stats/count', async (req, res) => {
    try {
        const { role, isActive } = req.query;
        let query = {};

        if (role) query.role = role;
        if (isActive !== undefined) query.isActive = isActive === 'true';

        const count = await User.countDocuments(query);

        res.json({ success: true, count });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
