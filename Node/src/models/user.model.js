/**
 * User Model - Mongoose Schema
 * Demonstrates common Mongoose data types
 */

const mongoose = require('mongoose');

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

    salary: {
        type: Number,
        default: 0
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
    dateOfBirth: {
        type: Date
    },

    lastLogin: {
        type: Date,
        default: Date.now
    },

    // ============ ARRAY OF STRINGS ============
    hobbies: [{
        type: String,
        trim: true
    }],

    // ============ ARRAY OF NUMBERS ============
    scores: [{
        type: Number
    }],

    // ============ NESTED OBJECT (EMBEDDED) ============
    address: {
        street: { type: String },
        city: { type: String },
        zipCode: { type: String },
        country: { type: String, default: 'Vietnam' }
    },

    // ============ ARRAY OF OBJECTS ============
    education: [{
        school: { type: String },
        degree: { type: String },
        year: { type: Number }
    }],

    // ============ OBJECTID (REFERENCE) ============
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    // ============ ARRAY OF OBJECTID ============
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    // ============ BUFFER (Binary Data) ============
    avatar: {
        type: Buffer
    },

    // ============ MIXED (Any Type) ============
    metadata: {
        type: mongoose.Schema.Types.Mixed
    },

    // ============ MAP ============
    socialLinks: {
        type: Map,
        of: String
    },

    // ============ DECIMAL128 (High Precision) ============
    balance: {
        type: mongoose.Schema.Types.Decimal128
    }

}, {
    timestamps: true,
    versionKey: false
});

const User = mongoose.model('User', userSchema);

module.exports = User;
