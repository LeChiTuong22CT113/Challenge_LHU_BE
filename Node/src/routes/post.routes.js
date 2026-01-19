/**
 * Post Routes - CRUD with Relationships
 */

const express = require('express');
const router = express.Router();

const {
    createPost,
    getPosts,
    getPostById,
    getPostsByUser,
    getMyPosts,
    updatePost,
    deletePost,
    addComment,
    toggleLike
} = require('../controllers/post.controller');

const { protect } = require('../middlewares/auth.middleware');

// Public routes
router.get('/', getPosts);
router.get('/:id', getPostById);
router.get('/user/:userId', getPostsByUser);

// Protected routes
router.use(protect);

router.post('/', createPost);
router.get('/me/posts', getMyPosts);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

// Interactions
router.post('/:id/comments', addComment);
router.post('/:id/like', toggleLike);

module.exports = router;
