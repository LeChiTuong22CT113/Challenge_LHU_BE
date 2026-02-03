/**
 * Category Model - E-commerce API
 * Product categories with hierarchy support
 */

const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        trim: true,
        unique: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },

    slug: {
        type: String,
        unique: true,
        lowercase: true
    },

    description: {
        type: String,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },

    // Parent category for hierarchy
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },

    image: {
        type: String
    },

    isActive: {
        type: Boolean,
        default: true
    },

    order: {
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
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ isActive: 1, order: 1 });

// ============ VIRTUALS ============
categorySchema.virtual('children', {
    ref: 'Category',
    localField: '_id',
    foreignField: 'parent'
});

// ============ PRE-SAVE HOOK ============
categorySchema.pre('save', function () {
    if (this.isModified('name')) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
