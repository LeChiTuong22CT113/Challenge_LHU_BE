/**
 * Task Controller - Business logic for Task Manager
 */

const Task = require('../models/task.model');

// @desc    Get all tasks
// @route   GET /api/tasks
const getTasks = async (req, res) => {
    try {
        const { status, priority, category, search, sortBy, limit = 10, page = 1 } = req.query;

        let query = {};

        // Filter by status
        if (status) query.status = status;

        // Filter by priority
        if (priority) query.priority = priority;

        // Filter by category
        if (category) query.category = category;

        // Text search
        if (search) {
            query.$text = { $search: search };
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Build query
        let result = Task.find(query)
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email')
            .skip(skip)
            .limit(parseInt(limit));

        // Sorting
        if (sortBy) {
            const sortOrder = sortBy.startsWith('-') ? -1 : 1;
            const sortField = sortBy.replace('-', '');
            result = result.sort({ [sortField]: sortOrder });
        } else {
            result = result.sort({ createdAt: -1 });
        }

        const tasks = await result;
        const total = await Task.countDocuments(query);

        res.json({
            success: true,
            count: tasks.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            data: tasks
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email');

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        res.json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create new task
// @route   POST /api/tasks
const createTask = async (req, res) => {
    try {
        const { title, description, status, priority, dueDate, assignedTo, category, tags } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: 'Title is required' });
        }

        const task = await Task.create({
            title,
            description,
            status,
            priority,
            dueDate,
            assignedTo,
            category,
            tags
        });

        res.status(201).json({ success: true, message: 'Task created', data: task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
const updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        res.json({ success: true, message: 'Task updated', data: task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update task status
// @route   PATCH /api/tasks/:id/status
const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['pending', 'in-progress', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const updateData = { status };
        if (status === 'completed') {
            updateData.completedAt = new Date();
        }

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        res.json({ success: true, message: `Task marked as ${status}`, data: task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add subtask
// @route   POST /api/tasks/:id/subtasks
const addSubtask = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: 'Subtask title is required' });
        }

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { $push: { subtasks: { title, completed: false } } },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        res.json({ success: true, message: 'Subtask added', data: task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Toggle subtask
// @route   PATCH /api/tasks/:id/subtasks/:subtaskId
const toggleSubtask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        const subtask = task.subtasks.id(req.params.subtaskId);
        if (!subtask) {
            return res.status(404).json({ success: false, message: 'Subtask not found' });
        }

        subtask.completed = !subtask.completed;
        await task.save();

        res.json({ success: true, message: 'Subtask toggled', data: task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        res.json({ success: true, message: 'Task deleted', data: task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get task statistics
// @route   GET /api/tasks/stats
const getTaskStats = async (req, res) => {
    try {
        const stats = await Task.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const priorityStats = await Task.aggregate([
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 }
                }
            }
        ]);

        const total = await Task.countDocuments();
        const overdue = await Task.countDocuments({
            dueDate: { $lt: new Date() },
            status: { $ne: 'completed' }
        });

        res.json({
            success: true,
            data: {
                total,
                overdue,
                byStatus: stats,
                byPriority: priorityStats
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

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
