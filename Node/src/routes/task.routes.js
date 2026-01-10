/**
 * Task Routes - API endpoints for Task Manager
 * With Joi validation and Authorization
 */

const express = require('express');
const router = express.Router();

// Controllers
const {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    updateTaskStatus,
    addSubtask,
    toggleSubtask,
    deleteTask,
    getTaskStats
} = require('../controllers/task.controller');

// Middleware
const { validateBody, validateParams } = require('../middlewares/validate.middleware');
const { protect, authorize } = require('../middlewares/auth.middleware');
const {
    createTaskSchema,
    updateTaskSchema,
    updateStatusSchema,
    subtaskSchema,
    objectIdSchema
} = require('../validations/task.validation');

// All routes require authentication
router.use(protect);

// ============ READ (All authenticated users) ============
router.get('/stats', getTaskStats);
router.get('/', getTasks);
router.get('/:id', validateParams(objectIdSchema), getTaskById);

// ============ CREATE/UPDATE (All authenticated users) ============
router.post('/', validateBody(createTaskSchema), createTask);
router.put('/:id', validateParams(objectIdSchema), validateBody(updateTaskSchema), updateTask);
router.patch('/:id/status', validateParams(objectIdSchema), validateBody(updateStatusSchema), updateTaskStatus);

// Subtasks
router.post('/:id/subtasks', validateParams(objectIdSchema), validateBody(subtaskSchema), addSubtask);
router.patch('/:id/subtasks/:subtaskId', toggleSubtask);

// ============ DELETE (Admin or Task Owner) ============
router.delete('/:id', validateParams(objectIdSchema), deleteTask);

module.exports = router;


