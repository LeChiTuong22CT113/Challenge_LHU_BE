// Database Connection with Mongoose
// Mongoose provides schema-based solution for MongoDB

const mongoose = require('mongoose');
require('dotenv').config();

// Connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/challenge_lhu';

// Connection options
const options = {
    // These options are recommended for production
};

// Connect to MongoDB
async function connectDB() {
    try {
        console.log('Connecting to MongoDB...');

        await mongoose.connect(MONGODB_URI, options);

        console.log('MongoDB connected successfully!');
        console.log(`Database: ${mongoose.connection.name}`);
        console.log(`Host: ${mongoose.connection.host}`);

        return mongoose.connection;
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
}

// Connection events
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed due to app termination');
    process.exit(0);
});

// Export connection function
module.exports = { connectDB, mongoose };

// Run if executed directly (for testing)
if (require.main === module) {
    connectDB().then(() => {
        console.log('\n✅ Connection test successful!');
        console.log('Press Ctrl+C to exit');
    });
}
