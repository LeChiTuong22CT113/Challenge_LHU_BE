// CRUD - UPDATE Operations
// PUT/PATCH endpoints for updating users

const express = require('express');
const router = express.Router();
const User = require('../models/user.model');

// PUT /api/users/:id - Full update
router.put('/:id', async (req, res) => {
    try {
        const { name, email, age, role, isActive } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, age, role, isActive },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User updated successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// PATCH /api/users/:id - Partial update
router.patch('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User patched successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// PATCH /api/users/bulk/update - Update many users
router.patch('/bulk/update', async (req, res) => {
    try {
        const { filter, update } = req.body;

        if (!filter || !update) {
            return res.status(400).json({
                success: false,
                message: 'Filter and update are required'
            });
        }

        const result = await User.updateMany(filter, { $set: update });

        res.json({
            success: true,
            message: `${result.modifiedCount} users updated`,
            data: result
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
