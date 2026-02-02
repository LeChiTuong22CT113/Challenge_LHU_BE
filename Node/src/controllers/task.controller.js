/**
 * Task Controller - Refactored with Clean Code
 * catchAsync, AppError, lean() for queries
 */

const Task = require('../models/task.model');
const catchAsync = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

/**
 * @desc    Get all tasks with filtering, sorting, pagination
 * @route   GET /api/tasks
 */
const getTasks = catchAsync(async (req, res) => {
    const { status, priority, category, search, sortBy, limit = 10, page = 1 } = req.query;

    const query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (search) query.$text = { $search: search };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [tasks, total] = await Promise.all([
        Task.find(query)
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email')
            .sort(sortBy ? { [sortBy.replace('-', '')]: sortBy.startsWith('-') ? -1 : 1 } : { createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean(),
        Task.countDocuments(query)
    ]);

    res.json({
        success: true,
        count: tasks.length,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        data: tasks
    });
});

/**
 * @desc    Get task by ID
 * @route   GET /api/tasks/:id
 */
const getTaskById = catchAsync(async (req, res, next) => {
    const task = await Task.findById(req.params.id)
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email')
        .lean();

    if (!task) {
        return next(new AppError('Task not found', 404));
    }

    res.json({ success: true, data: task });
});

/**
 * @desc    Create new task
 * @route   POST /api/tasks
 */
const createTask = catchAsync(async (req, res, next) => {
    const { title } = req.body;

    if (!title) {
        return next(new AppError('Title is required', 400));
    }

    const task = await Task.create(req.body);

    res.status(201).json({
        success: true,
        message: 'Task created',
        data: task
    });
});

/**
 * @desc    Update task
 * @route   PUT /api/tasks/:id
 */
const updateTask = catchAsync(async (req, res, next) => {
    const task = await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!task) {
        return next(new AppError('Task not found', 404));
    }

    res.json({ success: true, message: 'Task updated', data: task });
});

/**
 * @desc    Update task status
 * @route   PATCH /api/tasks/:id/status
 */
const updateTaskStatus = catchAsync(async (req, res, next) => {
    const { status } = req.body;
    const validStatuses = ['pending', 'in-progress', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
        return next(new AppError('Invalid status', 400));
    }

    const updateData = { status };
    if (status === 'completed') {
        updateData.completedAt = new Date();
    }

    const task = await Task.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!task) {
        return next(new AppError('Task not found', 404));
    }

    res.json({ success: true, message: `Task marked as ${status}`, data: task });
});

/**
 * @desc    Add subtask
 * @route   POST /api/tasks/:id/subtasks
 */
const addSubtask = catchAsync(async (req, res, next) => {
    const { title } = req.body;

    if (!title) {
        return next(new AppError('Subtask title is required', 400));
    }

    const task = await Task.findByIdAndUpdate(
        req.params.id,
        { $push: { subtasks: { title, completed: false } } },
        { new: true }
    );

    if (!task) {
        return next(new AppError('Task not found', 404));
    }

    res.json({ success: true, message: 'Subtask added', data: task });
});

/**
 * @desc    Toggle subtask
 * @route   PATCH /api/tasks/:id/subtasks/:subtaskId
 */
const toggleSubtask = catchAsync(async (req, res, next) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        return next(new AppError('Task not found', 404));
    }

    const subtask = task.subtasks.id(req.params.subtaskId);
    if (!subtask) {
        return next(new AppError('Subtask not found', 404));
    }

    subtask.completed = !subtask.completed;
    await task.save();

    res.json({ success: true, message: 'Subtask toggled', data: task });
});

/**
 * @desc    Delete task
 * @route   DELETE /api/tasks/:id
 */
const deleteTask = catchAsync(async (req, res, next) => {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
        return next(new AppError('Task not found', 404));
    }

    res.json({ success: true, message: 'Task deleted', data: task });
});

/**
 * @desc    Get task statistics
 * @route   GET /api/tasks/stats
 */
const getTaskStats = catchAsync(async (req, res) => {
    const [stats, priorityStats, total, overdue] = await Promise.all([
        Task.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
        Task.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]),
        Task.countDocuments(),
        Task.countDocuments({
            dueDate: { $lt: new Date() },
            status: { $ne: 'completed' }
        })
    ]);

    res.json({
        success: true,
        data: { total, overdue, byStatus: stats, byPriority: priorityStats }
    });
});

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    updateTaskStatus,
    addSubtask,
    toggleSubtask,
    deleteTask,
    getTaskStats
};
