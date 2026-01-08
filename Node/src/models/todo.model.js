/**
 * Todo Model - Mongoose Schema
 */

const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },

    description: {
        type: String,
        trim: true
    },

    completed: {
        type: Boolean,
        default: false
    },

    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },

    dueDate: {
        type: Date
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    tags: [{
        type: String,
        trim: true
    }]

}, {
    timestamps: true,
    versionKey: false
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
