// Using morgan (logging) and cors

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const PORT = 3000;

// ========== MORGAN - HTTP REQUEST LOGGER ==========
// Formats: 'tiny', 'dev', 'common', 'combined', 'short'

app.use(morgan('dev')); // Colored output: :method :url :status :response-time ms

// Custom morgan format
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

// ========== CORS - CROSS-ORIGIN RESOURCE SHARING ==========

// Option 1: Allow all origins
app.use(cors());

// Option 2: Custom configuration
/*
app.use(cors({
    origin: 'http://localhost:5173',     // Allow specific origin
    methods: ['GET', 'POST', 'PUT'],     // Allowed methods
    allowedHeaders: ['Content-Type'],     // Allowed headers
    credentials: true                     // Allow cookies
}));
*/

// Option 3: Multiple origins
/*
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));
*/

// ========== BODY PARSER (Built-in Express) ==========

// Parse JSON body
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded body (form data)
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ========== ROUTES ==========

app.get('/', (req, res) => {
    res.json({
        message: 'Third-party Middleware Demo',
        middleware: ['morgan', 'cors', 'body-parser']
    });
});

// Test JSON body parsing
app.post('/json', (req, res) => {
    console.log('Body received:', req.body);
    res.json({
        message: 'JSON body received',
        data: req.body
    });
});

// Test form data parsing
app.post('/form', (req, res) => {
    console.log('Form data received:', req.body);
    res.json({
        message: 'Form data received',
        data: req.body
    });
});

// Test CORS with preflight
app.options('/cors-test', cors()); // Enable preflight for this route
app.post('/cors-test', (req, res) => {
    res.json({
        message: 'CORS is working!',
        origin: req.headers.origin
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server at http://localhost:${PORT}`);
    console.log('\n=== MIDDLEWARE ACTIVE ===');
    console.log('- morgan: Logging requests (dev format)');
    console.log('- cors: Allowing cross-origin requests');
    console.log('- express.json: Parsing JSON body');
    console.log('- express.urlencoded: Parsing form data');
    console.log('\n=== TEST ROUTES ===');
    console.log('POST /json - Send JSON body');
    console.log('POST /form - Send form data');
});
