/**
 * Product Controller - E-commerce API
 * CRUD operations with reviews, filtering, and search
 */

const Product = require('../models/product.model');
const catchAsync = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

/**
 * @desc    Create new product
 * @route   POST /api/products
 * @access  Private (Seller/Admin)
 */
const createProduct = catchAsync(async (req, res) => {
    const productData = {
        ...req.body,
        seller: req.user._id
    };

    const product = await Product.create(productData);

    res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product
    });
});

/**
 * @desc    Get all products with filtering
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = catchAsync(async (req, res) => {
    const {
        category,
        status = 'active',
        minPrice,
        maxPrice,
        search,
        sortBy = '-createdAt',
        page = 1,
        limit = 12,
        featured
    } = req.query;

    const query = {};

    // Filters
    if (category) query.category = category;
    if (status) query.status = status;
    if (featured) query.featured = featured === 'true';
    if (search) query.$text = { $search: search };

    // Price range
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseFloat(minPrice);
        if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sorting
    const sortField = sortBy.replace('-', '');
    const sortOrder = sortBy.startsWith('-') ? -1 : 1;

    const [products, total] = await Promise.all([
        Product.find(query)
            .populate('seller', 'name email avatar')
            .sort({ [sortField]: sortOrder })
            .skip(skip)
            .limit(parseInt(limit))
            .lean(),
        Product.countDocuments(query)
    ]);

    res.json({
        success: true,
        count: products.length,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        data: products
    });
});

/**
 * @desc    Get single product by ID or slug
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    // Check if id is ObjectId or slug
    const query = id.match(/^[0-9a-fA-F]{24}$/)
        ? { _id: id }
        : { slug: id };

    const product = await Product.findOne(query)
        .populate('seller', 'name email avatar')
        .populate('reviews.user', 'name avatar');

    if (!product) {
        return next(new AppError('Product not found', 404));
    }

    res.json({ success: true, data: product });
});

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private (Owner/Admin)
 */
const updateProduct = catchAsync(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new AppError('Product not found', 404));
    }

    // Check ownership
    const isOwner = product.seller.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
        return next(new AppError('Not authorized to update this product', 403));
    }

    product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    res.json({
        success: true,
        message: 'Product updated successfully',
        data: product
    });
});

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private (Owner/Admin)
 */
const deleteProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new AppError('Product not found', 404));
    }

    const isOwner = product.seller.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
        return next(new AppError('Not authorized to delete this product', 403));
    }

    await product.deleteOne();

    res.json({ success: true, message: 'Product deleted successfully' });
});

/**
 * @desc    Add product review
 * @route   POST /api/products/:id/reviews
 * @access  Private
 */
const addReview = catchAsync(async (req, res, next) => {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
        return next(new AppError('Rating must be between 1 and 5', 400));
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new AppError('Product not found', 404));
    }

    // Check if user already reviewed
    const existingReview = product.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    );

    if (existingReview) {
        return next(new AppError('You have already reviewed this product', 400));
    }

    product.reviews.push({
        user: req.user._id,
        rating,
        comment
    });

    await product.save();

    const updatedProduct = await Product.findById(req.params.id)
        .populate('reviews.user', 'name avatar');

    res.status(201).json({
        success: true,
        message: 'Review added successfully',
        data: updatedProduct.reviews
    });
});

/**
 * @desc    Delete product review
 * @route   DELETE /api/products/:id/reviews/:reviewId
 * @access  Private (Owner/Admin)
 */
const deleteReview = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new AppError('Product not found', 404));
    }

    const review = product.reviews.id(req.params.reviewId);

    if (!review) {
        return next(new AppError('Review not found', 404));
    }

    const isOwner = review.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
        return next(new AppError('Not authorized to delete this review', 403));
    }

    review.deleteOne();
    await product.save();

    res.json({ success: true, message: 'Review deleted successfully' });
});

/**
 * @desc    Get featured products
 * @route   GET /api/products/featured
 * @access  Public
 */
const getFeaturedProducts = catchAsync(async (req, res) => {
    const products = await Product.find({ featured: true, status: 'active' })
        .populate('seller', 'name')
        .limit(8)
        .lean();

    res.json({ success: true, data: products });
});

/**
 * @desc    Get products by category
 * @route   GET /api/products/category/:category
 * @access  Public
 */
const getProductsByCategory = catchAsync(async (req, res) => {
    const { category } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, total] = await Promise.all([
        Product.find({ category, status: 'active' })
            .populate('seller', 'name')
            .sort('-createdAt')
            .skip(skip)
            .limit(parseInt(limit))
            .lean(),
        Product.countDocuments({ category, status: 'active' })
    ]);

    res.json({
        success: true,
        count: products.length,
        total,
        data: products
    });
});

/**
 * @desc    Get my products (seller)
 * @route   GET /api/products/my
 * @access  Private
 */
const getMyProducts = catchAsync(async (req, res) => {
    const products = await Product.find({ seller: req.user._id })
        .sort('-createdAt')
        .lean();

    res.json({
        success: true,
        count: products.length,
        data: products
    });
});

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    addReview,
    deleteReview,
    getFeaturedProducts,
    getProductsByCategory,
    getMyProducts
};
