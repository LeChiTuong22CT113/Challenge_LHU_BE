// CRUD - CREATE Operations
// POST endpoints for creating users

const express = require('express');
const router = express.Router();
const User = require('../models/user.model');

// POST /api/users - Create one user
router.post('/', async (req, res) => {
    try {
        const { name, email, age, role } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: 'Name and email are required'
            });
        }

        const user = await User.create({ name, email, age, role });

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: user
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Email already exists'
            });
        }
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/users/many - Create multiple users
router.post('/many', async (req, res) => {
    try {
        const { users } = req.body;

        if (!users || !Array.isArray(users)) {
            return res.status(400).json({
                success: false,
                message: 'Users array is required'
            });
        }

        const result = await User.insertMany(users);

        res.status(201).json({
            success: true,
            message: `${result.length} users created`,
            data: result
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
