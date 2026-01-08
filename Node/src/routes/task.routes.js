/**
 * Task Routes - API endpoints for Task Manager
 */

const express = require('express');
const router = express.Router();
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

// Stats route (must be before :id)
router.get('/stats', getTaskStats);

// Main routes
router.route('/')
    .get(getTasks)
    .post(createTask);

router.route('/:id')
    .get(getTaskById)
    .put(updateTask)
    .delete(deleteTask);

// Status update
router.patch('/:id/status', updateTaskStatus);

// Subtask routes
router.post('/:id/subtasks', addSubtask);
router.patch('/:id/subtasks/:subtaskId', toggleSubtask);

module.exports = router;
