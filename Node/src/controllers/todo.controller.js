/**
 * Todo Controller - Business Logic
 * Handles all todo-related operations
 */

const Todo = require('../models/todo.model');
const { sendSuccess, sendError } = require('../utils/response.util');

/**
 * @desc    Create a new todo
 * @route   POST /api/todos
 */
exports.createTodo = async (req, res) => {
    try {
        const { title, description, priority, dueDate, user, tags } = req.body;

        if (!title || !user) {
            return sendError(res, 'Title and user are required', 400);
        }

        const todo = await Todo.create({
            title,
            description,
            priority,
            dueDate,
            user,
            tags
        });

        sendSuccess(res, todo, 'Todo created successfully', 201);
    } catch (error) {
        sendError(res, error.message, 500);
    }
};

/**
 * @desc    Get all todos
 * @route   GET /api/todos
 */
exports.getTodos = async (req, res) => {
    try {
        const { user, completed, priority, sort, limit, skip } = req.query;

        let query = {};

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

        const todos = await result;

        sendSuccess(res, { count: todos.length, todos });
    } catch (error) {
        sendError(res, error.message, 500);
    }
};

/**
 * @desc    Get todo by ID
 * @route   GET /api/todos/:id
 */
exports.getTodoById = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id).populate('user', 'name email');

        if (!todo) {
            return sendError(res, 'Todo not found', 404);
        }

        sendSuccess(res, todo);
    } catch (error) {
        sendError(res, error.message, 500);
    }
};

/**
 * @desc    Update todo
 * @route   PUT /api/todos/:id
 */
exports.updateTodo = async (req, res) => {
    try {
        const todo = await Todo.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!todo) {
            return sendError(res, 'Todo not found', 404);
        }

        sendSuccess(res, todo, 'Todo updated successfully');
    } catch (error) {
        sendError(res, error.message, 500);
    }
};

/**
 * @desc    Toggle todo completed status
 * @route   PATCH /api/todos/:id/toggle
 */
exports.toggleTodo = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return sendError(res, 'Todo not found', 404);
        }

        todo.completed = !todo.completed;
        await todo.save();

        sendSuccess(res, todo, `Todo marked as ${todo.completed ? 'completed' : 'incomplete'}`);
    } catch (error) {
        sendError(res, error.message, 500);
    }
};

/**
 * @desc    Delete todo
 * @route   DELETE /api/todos/:id
 */
exports.deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);

        if (!todo) {
            return sendError(res, 'Todo not found', 404);
        }

        sendSuccess(res, todo, 'Todo deleted successfully');
    } catch (error) {
        sendError(res, error.message, 500);
    }
};

/**
 * @desc    Get todos by user
 * @route   GET /api/users/:userId/todos
 */
exports.getTodosByUser = async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.params.userId });

        sendSuccess(res, { count: todos.length, todos });
    } catch (error) {
        sendError(res, error.message, 500);
    }
};
