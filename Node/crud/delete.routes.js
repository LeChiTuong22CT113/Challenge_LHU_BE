// CRUD - DELETE Operations
// DELETE endpoints for removing users

const express = require('express');
const router = express.Router();
const User = require('../models/user.model');

// DELETE /api/users/:id - Delete one user
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User deleted successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE /api/users/bulk/delete - Delete many users
router.delete('/bulk/delete', async (req, res) => {
    try {
        const { filter } = req.body;

        if (!filter) {
            return res.status(400).json({
                success: false,
                message: 'Filter is required'
            });
        }

        const result = await User.deleteMany(filter);

        res.json({
            success: true,
            message: `${result.deletedCount} users deleted`,
            data: result
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
