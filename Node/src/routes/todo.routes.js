/**
 * Todo Routes - API Endpoints
 */

const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todo.controller');

// ============ CREATE ============
// POST /api/todos - Create todo
router.post('/', todoController.createTodo);

// ============ READ ============
// GET /api/todos - Get all todos
router.get('/', todoController.getTodos);

// GET /api/todos/:id - Get todo by ID
router.get('/:id', todoController.getTodoById);

// ============ UPDATE ============
// PUT /api/todos/:id - Update todo
router.put('/:id', todoController.updateTodo);

// PATCH /api/todos/:id/toggle - Toggle completed status
router.patch('/:id/toggle', todoController.toggleTodo);

// ============ DELETE ============
// DELETE /api/todos/:id - Delete todo
router.delete('/:id', todoController.deleteTodo);

module.exports = router;
