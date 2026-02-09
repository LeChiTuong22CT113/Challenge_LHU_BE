/**
 * Todo Controller - Refactored with Clean Code
 * catchAsync, AppError, lean() for queries
 */

const Todo = require('../models/todo.model');
const catchAsync = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

/**
 * @desc    Create a new todo
 * @route   POST /api/todos
 */
exports.createTodo = catchAsync(async (req, res, next) => {
    const { title, description, priority, dueDate, user, tags } = req.body;

    if (!title) {
        return next(new AppError('Title is required', 400));
    }

    // Use provided user or get first user from database as default
    let todoUser = user;
    if (!todoUser) {
        const User = require('../models/user.model');
        const defaultUser = await User.findOne().select('_id');
        if (defaultUser) {
            todoUser = defaultUser._id;
        } else {
            return next(new AppError('No user found. Please create a user first.', 400));
        }
    }

    const todo = await Todo.create({
        title,
        description,
        priority,
        dueDate,
        user: todoUser,
        tags
    });

    res.status(201).json({
        success: true,
        message: 'Todo created successfully',
        data: todo
    });
});

/**
 * @desc    Get all todos
 * @route   GET /api/todos
 */
exports.getTodos = catchAsync(async (req, res) => {
    const { user, completed, priority, sort, limit, skip } = req.query;

    const query = {};
    if (user) query.user = user;
    if (completed !== undefined) query.completed = completed === 'true';
    if (priority) query.priority = priority;

    let result = Todo.find(query).populate('user', 'name email');

    if (sort) {
        const sortOrder = sort.startsWith('-') ? -1 : 1;
        const sortField = sort.replace('-', '');
        result = result.sort({ [sortField]: sortOrder });
    }

    if (skip) result = result.skip(parseInt(skip));
    if (limit) result = result.limit(parseInt(limit));

    const todos = await result.lean();

    res.json({
        success: true,
        count: todos.length,
        data: todos
    });
});

/**
 * @desc    Get todo by ID
 * @route   GET /api/todos/:id
 */
exports.getTodoById = catchAsync(async (req, res, next) => {
    const todo = await Todo.findById(req.params.id)
        .populate('user', 'name email')
        .lean();

    if (!todo) {
        return next(new AppError('Todo not found', 404));
    }

    res.json({ success: true, data: todo });
});

/**
 * @desc    Update todo
 * @route   PUT /api/todos/:id
 */
exports.updateTodo = catchAsync(async (req, res, next) => {
    const todo = await Todo.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!todo) {
        return next(new AppError('Todo not found', 404));
    }

    res.json({
        success: true,
        message: 'Todo updated successfully',
        data: todo
    });
});

/**
 * @desc    Toggle todo completed status
 * @route   PATCH /api/todos/:id/toggle
 */
exports.toggleTodo = catchAsync(async (req, res, next) => {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
        return next(new AppError('Todo not found', 404));
    }

    todo.completed = !todo.completed;
    await todo.save();

    res.json({
        success: true,
        message: `Todo marked as ${todo.completed ? 'completed' : 'incomplete'}`,
        data: todo
    });
});

/**
 * @desc    Delete todo
 * @route   DELETE /api/todos/:id
 */
exports.deleteTodo = catchAsync(async (req, res, next) => {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
        return next(new AppError('Todo not found', 404));
    }

    res.json({
        success: true,
        message: 'Todo deleted successfully',
        data: todo
    });
});

/**
 * @desc    Get todos by user
 * @route   GET /api/users/:userId/todos
 */
exports.getTodosByUser = catchAsync(async (req, res) => {
    const todos = await Todo.find({ user: req.params.userId }).lean();

    res.json({
        success: true,
        count: todos.length,
        data: todos
    });
});
