// Middleware = functions that run between request and response

const express = require('express');
const app = express();
const PORT = 3000;

// ========== WHAT IS MIDDLEWARE? ==========
// Middleware is a function with access to: req, res, next
// It can: execute code, modify req/res, end request, call next()

// ========== CUSTOM MIDDLEWARE ==========

// 1. Logging middleware - logs every request
const loggerMiddleware = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next(); // Call next middleware
};

// 2. Request time middleware - adds timestamp to req
const requestTimeMiddleware = (req, res, next) => {
    req.requestTime = Date.now();
    next();
};

// 3. Auth middleware - checks authorization
const authMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (apiKey === 'secret123') {
        req.isAuthenticated = true;
        next();
    } else {
        res.status(401).json({
            success: false,
            message: 'Unauthorized - Invalid API key'
        });
    }
};

// ========== APPLY MIDDLEWARE ==========

// Global middleware (runs for ALL routes)
app.use(loggerMiddleware);
app.use(requestTimeMiddleware);

// Built-in middleware
app.use(express.json());        // Parse JSON body
app.use(express.urlencoded({ extended: true })); // Parse form data

// ========== ROUTES ==========

// Public route (no auth needed)
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Middleware Demo',
        requestTime: new Date(req.requestTime).toISOString()
    });
});

// Protected route (auth middleware applied)
app.get('/protected', authMiddleware, (req, res) => {
    res.json({
        message: 'You have access!',
        authenticated: req.isAuthenticated
    });
});

// Route with inline middleware
app.get('/inline', (req, res, next) => {
    console.log('Inline middleware executed');
    next();
}, (req, res) => {
    res.json({ message: 'Inline middleware demo' });
});

// ========== ERROR HANDLING MIDDLEWARE ==========
// Must have 4 parameters: err, req, res, next

app.get('/error', (req, res, next) => {
    const error = new Error('Something went wrong!');
    error.status = 500;
    next(error); // Pass error to error handler
});

// Error handling middleware (must be last)
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(err.status || 500).json({
        success: false,
        message: err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Middleware Demo at http://localhost:${PORT}`);
    console.log('\n=== ROUTES ===');
    console.log('GET /           - Public route');
    console.log('GET /protected  - Need header: x-api-key: secret123');
    console.log('GET /error      - Test error handling');
});
