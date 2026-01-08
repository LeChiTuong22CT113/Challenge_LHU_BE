/**
 * User Routes - API Endpoints
 * Clean separation: Routes only define endpoints, controllers handle logic
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// ============ CREATE ============
// POST /api/users - Create single user
router.post('/', userController.createUser);

// POST /api/users/many - Create multiple users
router.post('/many', userController.createManyUsers);

// ============ READ ============
// GET /api/users/stats/count - Get users count (must be before /:id)
router.get('/stats/count', userController.getUsersCount);

// GET /api/users - Get all users
router.get('/', userController.getUsers);

// GET /api/users/:id - Get user by ID
router.get('/:id', userController.getUserById);

// ============ UPDATE ============
// PATCH /api/users/bulk/update - Bulk update (must be before /:id)
router.patch('/bulk/update', userController.bulkUpdateUsers);

// PUT /api/users/:id - Full update
router.put('/:id', userController.updateUser);

// PATCH /api/users/:id - Partial update
router.patch('/:id', userController.patchUser);

// ============ DELETE ============
// DELETE /api/users/bulk/delete - Bulk delete (must be before /:id)
router.delete('/bulk/delete', userController.bulkDeleteUsers);

// DELETE /api/users/:id - Delete single user
router.delete('/:id', userController.deleteUser);

module.exports = router;
