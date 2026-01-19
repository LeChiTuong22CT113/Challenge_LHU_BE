/**
 * Post Controller - CRUD with Relationships
 */

const Post = require('../models/post.model');
const { APIFeatures, paginateResponse } = require('../utils/apiFeatures');

// @desc    Create post
// @route   POST /api/posts
const createPost = async (req, res) => {
    try {
        const { title, content, tags, status } = req.body;

        const post = await Post.create({
            title,
            content,
            tags,
            status,
            author: req.user._id  // Current logged-in user
        });

        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            data: post
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all posts with populate
// @route   GET /api/posts
const getPosts = async (req, res) => {
    try {
        const features = new APIFeatures(Post.find(), req.query)
            .filter()
            .search(['title', 'content'])
            .sort()
            .paginate();

        // Populate author info (only name and email)
        const posts = await features.query
            .populate('author', 'name email avatar')
            .populate('comments.user', 'name avatar');

        const pagination = await paginateResponse(Post, features);

        res.json({
            success: true,
            data: {
                count: posts.length,
                pagination,
                posts
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single post with full populate
// @route   GET /api/posts/:id
const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'name email avatar')
            .populate('comments.user', 'name avatar')
            .populate('likes', 'name avatar');

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Increase view count
        post.views += 1;
        await post.save();

        res.json({ success: true, data: post });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get posts by user
// @route   GET /api/posts/user/:userId
const getPostsByUser = async (req, res) => {
    try {
        const posts = await Post.find({ author: req.params.userId })
            .populate('author', 'name email avatar')
            .sort('-createdAt');

        res.json({
            success: true,
            data: {
                count: posts.length,
                posts
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get my posts
// @route   GET /api/posts/me
const getMyPosts = async (req, res) => {
    try {
        const posts = await Post.find({ author: req.user._id })
            .sort('-createdAt');

        res.json({
            success: true,
            data: {
                count: posts.length,
                posts
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update post
// @route   PUT /api/posts/:id
const updatePost = async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Check ownership
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this post'
            });
        }

        post = await Post.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('author', 'name email avatar');

        res.json({
            success: true,
            message: 'Post updated successfully',
            data: post
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Check ownership or admin
        if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this post'
            });
        }

        await post.deleteOne();

        res.json({
            success: true,
            message: 'Post deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add comment to post
// @route   POST /api/posts/:id/comments
const addComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        post.comments.push({
            user: req.user._id,
            text: req.body.text
        });

        await post.save();

        // Re-fetch with populated comments
        const updatedPost = await Post.findById(req.params.id)
            .populate('comments.user', 'name avatar');

        res.status(201).json({
            success: true,
            message: 'Comment added successfully',
            data: updatedPost.comments
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Like/Unlike post
// @route   POST /api/posts/:id/like
const toggleLike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        const userId = req.user._id;
        const likeIndex = post.likes.indexOf(userId);

        if (likeIndex === -1) {
            // Like
            post.likes.push(userId);
        } else {
            // Unlike
            post.likes.splice(likeIndex, 1);
        }

        await post.save();

        res.json({
            success: true,
            message: likeIndex === -1 ? 'Post liked' : 'Post unliked',
            data: { likesCount: post.likes.length }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createPost,
    getPosts,
    getPostById,
    getPostsByUser,
    getMyPosts,
    updatePost,
    deletePost,
    addComment,
    toggleLike
};
