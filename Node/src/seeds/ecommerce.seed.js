/**
 * Seed Script - Sample Data for E-commerce API
 * Run: node src/seeds/ecommerce.seed.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/challenge_lhu';

const User = require('../models/user.model');
const Product = require('../models/product.model');
const Category = require('../models/category.model');

// Sample Categories
const categories = [
    { name: 'Electronics', description: 'Electronic devices and gadgets', order: 1 },
    { name: 'Clothing', description: 'Fashion and apparel', order: 2 },
    { name: 'Books', description: 'Books and magazines', order: 3 },
    { name: 'Home & Garden', description: 'Home decoration and garden tools', order: 4 },
    { name: 'Sports', description: 'Sports equipment and accessories', order: 5 }
];

// Sample Products
const products = [
    {
        name: 'iPhone 15 Pro Max',
        description: 'Apple iPhone 15 Pro Max 256GB - Titanium Blue.',
        price: 29990000,
        salePrice: 27990000,
        category: 'electronics',
        stock: 50,
        status: 'active',
        featured: true,
        tags: ['apple', 'iphone', 'smartphone']
    },
    {
        name: 'MacBook Pro 14 M3',
        description: 'Apple MacBook Pro 14 inch with M3 Pro chip.',
        price: 49990000,
        category: 'electronics',
        stock: 25,
        status: 'active',
        featured: true,
        tags: ['apple', 'macbook', 'laptop']
    },
    {
        name: 'Sony WH-1000XM5',
        description: 'Premium wireless noise-canceling headphones.',
        price: 8990000,
        salePrice: 7490000,
        category: 'electronics',
        stock: 100,
        status: 'active',
        tags: ['sony', 'headphones', 'wireless']
    },
    {
        name: 'Nike Air Jordan 1',
        description: 'Classic Nike Air Jordan 1 Retro sneakers.',
        price: 4500000,
        category: 'clothing',
        stock: 30,
        status: 'active',
        featured: true,
        tags: ['nike', 'jordan', 'sneakers']
    },
    {
        name: 'Clean Code Book',
        description: 'A Handbook of Agile Software Craftsmanship.',
        price: 350000,
        category: 'books',
        stock: 50,
        status: 'active',
        featured: true,
        tags: ['programming', 'software', 'bestseller']
    }
];

async function seedData() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Get or create seller
        let seller = await User.findOne({ role: 'admin' });
        if (!seller) {
            seller = await User.create({
                name: 'Admin Shop',
                email: 'admin@shop.com',
                password: 'admin123',
                role: 'admin'
            });
            console.log('Created admin user');
        }

        // Clear data
        await Category.deleteMany({});
        await Product.deleteMany({});
        console.log('Cleared existing data');

        // Seed Categories
        for (const cat of categories) {
            await Category.create(cat);
        }
        console.log('Created 5 categories');

        // Seed Products
        for (const p of products) {
            await Product.create({ ...p, seller: seller._id });
        }
        console.log('Created 5 products');

        console.log('\nSeed completed!');
        console.log('Admin: admin@shop.com / admin123');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

seedData();
