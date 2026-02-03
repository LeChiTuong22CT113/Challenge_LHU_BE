/**
 * Routes Index - Central Route Aggregator
 */

const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const todoRoutes = require('./todo.routes');
const taskRoutes = require('./task.routes');
const uploadRoutes = require('./upload.routes');
const postRoutes = require('./post.routes');
const proxyRoutes = require('./proxy.routes');
const productRoutes = require('./product.routes');
const categoryRoutes = require('./category.routes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/todos', todoRoutes);
router.use('/tasks', taskRoutes);
router.use('/upload', uploadRoutes);
router.use('/posts', postRoutes);
router.use('/proxy', proxyRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);

module.exports = router;




