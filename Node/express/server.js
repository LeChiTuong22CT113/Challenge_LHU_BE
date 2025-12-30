// Setup Express server with basic configuration

const express = require('express');

// Create Express app
const app = express();
const PORT = 3000;

// Middleware to parse JSON body
app.use(express.json());

// Middleware to parse URL-encoded body
app.use(express.urlencoded({ extended: true }));

// Basic route - Home
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Express Server!',
        server: 'Express.js',
        version: '4.x',
        time: new Date().toISOString()
    });
});

// About route
app.get('/about', (req, res) => {
    res.json({
        name: 'Challenge LHU Backend',
        author: 'Le Chi Tuong',
        class: '22CT113'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop');
});
