/**
 * User Model - Mongoose Schema
 * With password hashing using bcrypt
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema({

    // ============ STRING ============
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },

    // ============ PASSWORD ============
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false  // Don't include in queries by default
    },

    // ============ STRING WITH ENUM ============
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator'],
        default: 'user'
    },

    // ============ NUMBER ============
    age: {
        type: Number,
        min: [0, 'Age cannot be negative'],
        max: [150, 'Age cannot exceed 150']
    },

    // ============ BOOLEAN ============
    isActive: {
        type: Boolean,
        default: true
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    // ============ DATE ============
    lastLogin: {
        type: Date,
        default: Date.now
    },

    // ============ AVATAR ============
    avatar: {
        type: String,
        default: null
    },

    // ============ PASSWORD RESET ============
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    // ============ NESTED OBJECT ============
    address: {
        street: { type: String },
        city: { type: String },
        country: { type: String, default: 'Vietnam' }
    }

}, {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ============ INDEXES FOR QUERY OPTIMIZATION ============
userSchema.index({ email: 1 }); // Already unique, but explicit
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ name: 'text', email: 'text' }); // Text search

// ============ VIRTUAL POPULATE ============
// Get all posts by this user (reverse populate)
userSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'author'
});

// ============ PRE-SAVE HOOK - Hash password ============
userSchema.pre('save', async function () {
    // Only hash if password is modified
    if (!this.isModified('password')) return;

    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
});

// ============ METHODS ============

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Hide password in JSON
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

