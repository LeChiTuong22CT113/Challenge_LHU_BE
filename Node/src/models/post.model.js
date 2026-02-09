/**
 * Post Model - Demonstrates Relationships
 * One-to-Many: User has many Posts
 */

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },

    content: {
        type: String,
        required: [true, 'Content is required']
    },

    // ============ RELATIONSHIP: Many-to-One ============
    // Each post belongs to ONE user (author)
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is required']
    },

    // ============ RELATIONSHIP: Many-to-Many ============
    // Post can have multiple tags, tag can be in multiple posts
    tags: [{
        type: String,
        trim: true
    }],

    // ============ RELATIONSHIP: One-to-Many (Embedded) ============
    // Comments embedded in post
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        text: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],

    // ============ RELATIONSHIP: Many-to-Many ============
    // Users who liked this post
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },

    publishedAt: Date,

    views: {
        type: Number,
        default: 0
    }

}, {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ============ INDEXES ============
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ status: 1 });
postSchema.index({ tags: 1 });

// ============ VIRTUALS ============
// Virtual for likes count
postSchema.virtual('likesCount').get(function () {
    return this.likes ? this.likes.length : 0;
});

// Virtual for comments count
postSchema.virtual('commentsCount').get(function () {
    return this.comments ? this.comments.length : 0;
});

// ============ PRE-SAVE HOOK (Mongoose 9 async pattern) ============
postSchema.pre('save', async function () {
    if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
        this.publishedAt = new Date();
    }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
