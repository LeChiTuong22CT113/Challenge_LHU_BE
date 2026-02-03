/**
 * Category Controller - E-commerce API
 * CRUD operations for product categories
 */

const Category = require('../models/category.model');
const catchAsync = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

/**
 * @desc    Create new category
 * @route   POST /api/categories
 * @access  Private (Admin)
 */
const createCategory = catchAsync(async (req, res) => {
    const category = await Category.create(req.body);

    res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category
    });
});

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
const getCategories = catchAsync(async (req, res) => {
    const { parent, active } = req.query;

    const query = {};
    if (parent === 'null') query.parent = null;
    else if (parent) query.parent = parent;
    if (active !== undefined) query.isActive = active === 'true';

    const categories = await Category.find(query)
        .populate('children')
        .sort('order name')
        .lean();

    res.json({
        success: true,
        count: categories.length,
        data: categories
    });
});

/**
 * @desc    Get category by ID or slug
 * @route   GET /api/categories/:id
 * @access  Public
 */
const getCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const query = id.match(/^[0-9a-fA-F]{24}$/)
        ? { _id: id }
        : { slug: id };

    const category = await Category.findOne(query)
        .populate('children')
        .populate('parent', 'name slug');

    if (!category) {
        return next(new AppError('Category not found', 404));
    }

    res.json({ success: true, data: category });
});

/**
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Private (Admin)
 */
const updateCategory = catchAsync(async (req, res, next) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!category) {
        return next(new AppError('Category not found', 404));
    }

    res.json({
        success: true,
        message: 'Category updated successfully',
        data: category
    });
});

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 * @access  Private (Admin)
 */
const deleteCategory = catchAsync(async (req, res, next) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        return next(new AppError('Category not found', 404));
    }

    // Check for child categories
    const hasChildren = await Category.exists({ parent: req.params.id });
    if (hasChildren) {
        return next(new AppError('Cannot delete category with subcategories', 400));
    }

    await category.deleteOne();

    res.json({ success: true, message: 'Category deleted successfully' });
});

/**
 * @desc    Get category tree
 * @route   GET /api/categories/tree
 * @access  Public
 */
const getCategoryTree = catchAsync(async (req, res) => {
    const categories = await Category.find({ parent: null, isActive: true })
        .populate({
            path: 'children',
            match: { isActive: true },
            populate: {
                path: 'children',
                match: { isActive: true }
            }
        })
        .sort('order name')
        .lean();

    res.json({ success: true, data: categories });
});

module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory,
    getCategoryTree
};
