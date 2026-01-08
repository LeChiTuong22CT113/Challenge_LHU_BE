/**
 * Server Entry Point
 * Database connection and server startup
 */

const mongoose = require('mongoose');
require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/challenge_lhu';

/**
 * Start the server
 */
async function startServer() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✓ MongoDB connected!');

        // Start Express server
        app.listen(PORT, () => {
            console.log(`\n========================================`);
            console.log(`  MVC Pattern API Server`);
            console.log(`========================================`);
            console.log(`  URL: http://localhost:${PORT}`);
            console.log(`  ENV: ${process.env.NODE_ENV || 'development'}`);
            console.log(`========================================`);
            console.log(`\n=== STRUCTURE ===`);
            console.log(`  Models:      src/models/`);
            console.log(`  Controllers: src/controllers/`);
            console.log(`  Routes:      src/routes/`);
            console.log(`  Utils:       src/utils/`);
            console.log(`\n=== ENDPOINTS ===`);
            console.log(`  Users: /api/users`);
            console.log(`  Todos: /api/todos`);
            console.log(`========================================\n`);
        });
    } catch (error) {
        console.error('✗ Server Error:', error.message);
        process.exit(1);
    }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err.message);
    process.exit(1);
});

startServer();
