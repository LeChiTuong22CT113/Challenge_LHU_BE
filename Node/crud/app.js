// CRUD API - Main Server
// Combines all CRUD routes

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const createRoutes = require('./create.routes');
const readRoutes = require('./read.routes');
const updateRoutes = require('./update.routes');
const deleteRoutes = require('./delete.routes');

const app = express();
const PORT = 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/challenge_lhu';

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Use routes
app.use('/api/users', createRoutes);  // POST
app.use('/api/users', readRoutes);    // GET
app.use('/api/users', updateRoutes);  // PUT, PATCH
app.use('/api/users', deleteRoutes);  // DELETE

// Home route
app.get('/', (req, res) => {
    res.json({
        message: 'CRUD API',
        endpoints: {
            create: 'POST /api/users, POST /api/users/many',
            read: 'GET /api/users, GET /api/users/:id, GET /api/users/stats/count',
            update: 'PUT /api/users/:id, PATCH /api/users/:id, PATCH /api/users/bulk/update',
            delete: 'DELETE /api/users/:id, DELETE /api/users/bulk/delete'
        }
    });
});

// Start server
async function startServer() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB connected!');

        app.listen(PORT, () => {
            console.log(`\nServer: http://localhost:${PORT}`);
            console.log('\n=== ENDPOINTS ===');
            console.log('CREATE: POST /api/users, POST /api/users/many');
            console.log('READ:   GET /api/users, GET /api/users/:id');
            console.log('UPDATE: PUT /api/users/:id, PATCH /api/users/:id');
            console.log('DELETE: DELETE /api/users/:id');
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
}

startServer();
