/**
 * User Routes - API Endpoints with Authorization
 * Public: None
 * User: Read own profile
 * Admin: Full CRUD access
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

// All routes below require authentication
router.use(protect);

// ============ READ (All authenticated users) ============
// GET /api/users - Get all users
router.get('/', userController.getUsers);

// GET /api/users/stats/count - Get users count
router.get('/stats/count', userController.getUsersCount);

// GET /api/users/:id - Get user by ID
router.get('/:id', userController.getUserById);

// ============ ADMIN ONLY ============
// POST /api/users - Create single user
router.post('/', authorize('admin'), userController.createUser);

// POST /api/users/many - Create multiple users
router.post('/many', authorize('admin'), userController.createManyUsers);

// PATCH /api/users/bulk/update - Bulk update
router.patch('/bulk/update', authorize('admin'), userController.bulkUpdateUsers);

// PUT /api/users/:id - Full update
router.put('/:id', authorize('admin'), userController.updateUser);

// PATCH /api/users/:id - Partial update
router.patch('/:id', authorize('admin'), userController.patchUser);

// DELETE /api/users/bulk/delete - Bulk delete
router.delete('/bulk/delete', authorize('admin'), userController.bulkDeleteUsers);

// DELETE /api/users/:id - Delete single user
router.delete('/:id', authorize('admin'), userController.deleteUser);

module.exports = router;

