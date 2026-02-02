/**
 * Post Controller - Refactored with Clean Code
 * catchAsync, AppError, lean() for queries
 */

const Post = require('../models/post.model');
const catchAsync = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');
const { APIFeatures, paginateResponse } = require('../utils/apiFeatures');

/**
 * @desc    Create post
 * @route   POST /api/posts
 */
const createPost = catchAsync(async (req, res) => {
    const { title, content, tags, status } = req.body;

    const post = await Post.create({
        title,
        content,
        tags,
        status,
        author: req.user._id
    });

    res.status(201).json({
        success: true,
        message: 'Post created successfully',
        data: post
    });
});

/**
 * @desc    Get all posts with populate
 * @route   GET /api/posts
 */
const getPosts = catchAsync(async (req, res) => {
    const features = new APIFeatures(Post.find(), req.query)
        .filter()
        .search(['title', 'content'])
        .sort()
        .paginate();

    const posts = await features.query
        .populate('author', 'name email avatar')
        .populate('comments.user', 'name avatar')
        .lean();

    const pagination = await paginateResponse(Post, features);

    res.json({
        success: true,
        count: posts.length,
        pagination,
        data: posts
    });
});

/**
 * @desc    Get single post with full populate
 * @route   GET /api/posts/:id
 */
const getPostById = catchAsync(async (req, res, next) => {
    const post = await Post.findByIdAndUpdate(
        req.params.id,
        { $inc: { views: 1 } },
        { new: true }
    )
        .populate('author', 'name email avatar')
        .populate('comments.user', 'name avatar')
        .populate('likes', 'name avatar');

    if (!post) {
        return next(new AppError('Post not found', 404));
    }

    res.json({ success: true, data: post });
});

/**
 * @desc    Get posts by user
 * @route   GET /api/posts/user/:userId
 */
const getPostsByUser = catchAsync(async (req, res) => {
    const posts = await Post.find({ author: req.params.userId })
        .populate('author', 'name email avatar')
        .sort('-createdAt')
        .lean();

    res.json({
        success: true,
        count: posts.length,
        data: posts
    });
});

/**
 * @desc    Get my posts
 * @route   GET /api/posts/me
 */
const getMyPosts = catchAsync(async (req, res) => {
    const posts = await Post.find({ author: req.user._id })
        .sort('-createdAt')
        .lean();

    res.json({
        success: true,
        count: posts.length,
        data: posts
    });
});

/**
 * @desc    Update post
 * @route   PUT /api/posts/:id
 */
const updatePost = catchAsync(async (req, res, next) => {
    let post = await Post.findById(req.params.id);

    if (!post) {
        return next(new AppError('Post not found', 404));
    }

    if (post.author.toString() !== req.user._id.toString()) {
        return next(new AppError('Not authorized to update this post', 403));
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
});

/**
 * @desc    Delete post
 * @route   DELETE /api/posts/:id
 */
const deletePost = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return next(new AppError('Post not found', 404));
    }

    const isOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
        return next(new AppError('Not authorized to delete this post', 403));
    }

    await post.deleteOne();

    res.json({ success: true, message: 'Post deleted successfully' });
});

/**
 * @desc    Add comment to post
 * @route   POST /api/posts/:id/comments
 */
const addComment = catchAsync(async (req, res, next) => {
    const post = await Post.findByIdAndUpdate(
        req.params.id,
        { $push: { comments: { user: req.user._id, text: req.body.text } } },
        { new: true }
    ).populate('comments.user', 'name avatar');

    if (!post) {
        return next(new AppError('Post not found', 404));
    }

    res.status(201).json({
        success: true,
        message: 'Comment added successfully',
        data: post.comments
    });
});

/**
 * @desc    Like/Unlike post
 * @route   POST /api/posts/:id/like
 */
const toggleLike = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return next(new AppError('Post not found', 404));
    }

    const userId = req.user._id;
    const likeIndex = post.likes.indexOf(userId);
    const isLiked = likeIndex === -1;

    if (isLiked) {
        post.likes.push(userId);
    } else {
        post.likes.splice(likeIndex, 1);
    }

    await post.save();

    res.json({
        success: true,
        message: isLiked ? 'Post liked' : 'Post unliked',
        data: { likesCount: post.likes.length }
    });
});

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
