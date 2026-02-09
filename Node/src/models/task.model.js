/**
 * Task Model - Task Manager API
 * Complete task schema with all necessary fields
 */

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    // Task title
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },

    // Task description
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },

    // Task status
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'cancelled'],
        default: 'pending'
    },

    // Priority level
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },

    // Due date
    dueDate: {
        type: Date
    },

    // Assigned user (reference)
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    // Created by user (reference)
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    // Category/Project
    category: {
        type: String,
        trim: true
    },

    // Tags
    tags: [{
        type: String,
        trim: true
    }],

    // Subtasks
    subtasks: [{
        title: { type: String, required: true },
        completed: { type: Boolean, default: false }
    }],

    // Completion date
    completedAt: {
        type: Date
    },

    // Notes/Comments
    notes: [{
        content: { type: String },
        createdAt: { type: Date, default: Date.now }
    }]

}, {
    timestamps: true,
    versionKey: false
});

// Index for better search performance
taskSchema.index({ title: 'text', description: 'text' });
taskSchema.index({ status: 1, priority: 1 });
taskSchema.index({ dueDate: 1 });

// Virtual for checking if overdue
taskSchema.virtual('isOverdue').get(function () {
    return this.dueDate && this.dueDate < new Date() && this.status !== 'completed';
});

// Pre-save hook to set completedAt (Mongoose 9 async pattern)
taskSchema.pre('save', async function () {
    if (this.status === 'completed' && !this.completedAt) {
        this.completedAt = new Date();
    }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
