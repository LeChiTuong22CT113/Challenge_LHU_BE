/**
 * Task Routes - API endpoints for Task Manager
 * With Joi validation
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

// Validation
const { validateBody, validateParams } = require('../middlewares/validate.middleware');
const {
    createTaskSchema,
    updateTaskSchema,
    updateStatusSchema,
    subtaskSchema,
    objectIdSchema
} = require('../validations/task.validation');

// Stats route (must be before :id)
router.get('/stats', getTaskStats);

// Main routes
router.route('/')
    .get(getTasks)
    .post(validateBody(createTaskSchema), createTask);

router.route('/:id')
    .get(validateParams(objectIdSchema), getTaskById)
    .put(validateParams(objectIdSchema), validateBody(updateTaskSchema), updateTask)
    .delete(validateParams(objectIdSchema), deleteTask);

// Status update
router.patch('/:id/status',
    validateParams(objectIdSchema),
    validateBody(updateStatusSchema),
    updateTaskStatus
);

// Subtask routes
router.post('/:id/subtasks',
    validateParams(objectIdSchema),
    validateBody(subtaskSchema),
    addSubtask
);

router.patch('/:id/subtasks/:subtaskId', toggleSubtask);

module.exports = router;

