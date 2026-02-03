/**
 * Product Model - E-commerce API
 * Complete product schema with categories, reviews, and inventory
 */

const mongoose = require('mongoose');

// Review sub-schema
const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        trim: true,
        maxlength: 500
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const productSchema = new mongoose.Schema({
    // Basic info
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [200, 'Name cannot exceed 200 characters']
    },

    slug: {
        type: String,
        unique: true,
        lowercase: true
    },

    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },

    // Pricing
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },

    salePrice: {
        type: Number,
        min: 0
    },

    // Category
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['electronics', 'clothing', 'books', 'home', 'sports', 'beauty', 'toys', 'food', 'other']
    },

    // Inventory
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },

    // Images
    images: [{
        url: { type: String, required: true },
        alt: { type: String }
    }],

    thumbnail: {
        type: String
    },

    // Status
    status: {
        type: String,
        enum: ['draft', 'active', 'inactive', 'out-of-stock'],
        default: 'draft'
    },

    featured: {
        type: Boolean,
        default: false
    },

    // Reviews
    reviews: [reviewSchema],

    // Seller
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Tags for search
    tags: [{
        type: String,
        trim: true
    }],

    // Specifications
    specifications: {
        type: Map,
        of: String
    }

}, {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ============ INDEXES ============
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ price: 1 });
productSchema.index({ seller: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ createdAt: -1 });

// ============ VIRTUALS ============
productSchema.virtual('averageRating').get(function () {
    if (!this.reviews || this.reviews.length === 0) return 0;
    const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / this.reviews.length) * 10) / 10;
});

productSchema.virtual('reviewCount').get(function () {
    return this.reviews ? this.reviews.length : 0;
});

productSchema.virtual('isOnSale').get(function () {
    return this.salePrice && this.salePrice < this.price;
});

productSchema.virtual('discount').get(function () {
    if (!this.salePrice || this.salePrice >= this.price) return 0;
    return Math.round((1 - this.salePrice / this.price) * 100);
});

// ============ PRE-SAVE HOOK ============
productSchema.pre('save', function () {
    // Generate slug from name
    if (this.isModified('name')) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    // Auto update status if out of stock
    if (this.stock === 0 && this.status === 'active') {
        this.status = 'out-of-stock';
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
