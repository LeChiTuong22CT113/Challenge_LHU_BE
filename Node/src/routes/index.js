/**
 * Routes Index - Central Route Aggregator
 */

const express = require('express');
const router = express.Router();

const userRoutes = require('./user.routes');
const todoRoutes = require('./todo.routes');
const taskRoutes = require('./task.routes');

// Mount routes
router.use('/users', userRoutes);
router.use('/todos', todoRoutes);
router.use('/tasks', taskRoutes);

module.exports = router;

