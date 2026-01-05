// Demonstrates REST principles and proper API design

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = 3000;

//MIDDLEWARE
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

//REST PRINCIPLES
/*
  REST = Representational State Transfer

  6 REST Constraints:
  1. Client-Server: Separation of concerns
  2. Stateless: Each request contains all info needed
  3. Cacheable: Responses can be cached
  4. Uniform Interface: Consistent API design
  5. Layered System: Client doesn't know if connected directly
  6. Code on Demand (optional): Server can send executable code

  Key Concepts:
  - Resources: Nouns (users, products, orders)
  - HTTP Methods: Verbs (GET, POST, PUT, DELETE)
  - Status Codes: Result of operation
  - HATEOAS: Hypermedia as the Engine of Application State
*/

//MOCK DATABASE
let users = [
    { id: 1, name: 'Le Chi Tuong', email: 'tuong@example.com', role: 'admin' },
    { id: 2, name: 'Nguyen Van A', email: 'a@example.com', role: 'user' },
    { id: 3, name: 'Tran Thi B', email: 'b@example.com', role: 'user' }
];

let posts = [
    { id: 1, userId: 1, title: 'First Post', content: 'Hello World', createdAt: '2026-01-01' },
    { id: 2, userId: 1, title: 'Second Post', content: 'Learning REST', createdAt: '2026-01-02' },
    { id: 3, userId: 2, title: 'My Post', content: 'REST is cool', createdAt: '2026-01-03' }
];

let nextUserId = 4;
let nextPostId = 4;

//HELPER FUNCTIONS
const sendResponse = (res, status, data, message = null) => {
    res.status(status).json({
        success: status < 400,
        message,
        data,
        timestamp: new Date().toISOString()
    });
};

//API INFO
app.get('/', (req, res) => {
    sendResponse(res, 200, {
        name: 'RESTful API Demo',
        version: '1.0.0',
        principles: [
            'Use nouns for resources (not verbs)',
            'Use HTTP methods correctly',
            'Use proper status codes',
            'Use plural nouns (/users not /user)',
            'Use nested resources for relations'
        ],
        endpoints: {
            users: '/api/users',
            posts: '/api/posts',
            userPosts: '/api/users/:id/posts'
        }
    });
});

// ==========================================================
// USERS RESOURCE - /api/users
// ==========================================================

// GET /api/users - Get all users (with optional filtering)
app.get('/api/users', (req, res) => {
    const { role, limit } = req.query;
    let result = [...users];

    // Filter by role
    if (role) {
        result = result.filter(u => u.role === role);
    }

    // Limit results
    if (limit) {
        result = result.slice(0, parseInt(limit));
    }

    sendResponse(res, 200, result);
});

// GET /api/users/:id - Get single user
app.get('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);

    if (!user) {
        return sendResponse(res, 404, null, 'User not found');
    }

    // HATEOAS: Include related links
    sendResponse(res, 200, {
        ...user,
        links: {
            self: `/api/users/${id}`,
            posts: `/api/users/${id}/posts`
        }
    });
});

// POST /api/users - Create new user
app.post('/api/users', (req, res) => {
    const { name, email, role = 'user' } = req.body;

    // Validation
    if (!name || !email) {
        return sendResponse(res, 400, null, 'Name and email are required');
    }

    // Check duplicate email
    if (users.find(u => u.email === email)) {
        return sendResponse(res, 409, null, 'Email already exists');
    }

    const newUser = {
        id: nextUserId++,
        name,
        email,
        role,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);

    // 201 Created with Location header
    res.setHeader('Location', `/api/users/${newUser.id}`);
    sendResponse(res, 201, newUser, 'User created successfully');
});

// PUT /api/users/:id - Full update (replace)
app.put('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
        return sendResponse(res, 404, null, 'User not found');
    }

    const { name, email, role } = req.body;

    // PUT requires all fields
    if (!name || !email || !role) {
        return sendResponse(res, 400, null, 'All fields required for PUT (name, email, role)');
    }

    users[index] = {
        id,
        name,
        email,
        role,
        updatedAt: new Date().toISOString()
    };

    sendResponse(res, 200, users[index], 'User updated successfully');
});

// PATCH /api/users/:id - Partial update
app.patch('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
        return sendResponse(res, 404, null, 'User not found');
    }

    // PATCH allows partial updates
    const { name, email, role } = req.body;

    if (name) users[index].name = name;
    if (email) users[index].email = email;
    if (role) users[index].role = role;
    users[index].updatedAt = new Date().toISOString();

    sendResponse(res, 200, users[index], 'User patched successfully');
});

// DELETE /api/users/:id - Delete user
app.delete('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
        return sendResponse(res, 404, null, 'User not found');
    }

    const deletedUser = users.splice(index, 1)[0];

    // Also delete user's posts
    posts = posts.filter(p => p.userId !== id);

    sendResponse(res, 200, deletedUser, 'User deleted successfully');
});

// ==========================================================
// NESTED RESOURCE - /api/users/:id/posts
// ==========================================================

// GET /api/users/:id/posts - Get all posts by user
app.get('/api/users/:id/posts', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);

    if (!user) {
        return sendResponse(res, 404, null, 'User not found');
    }

    const userPosts = posts.filter(p => p.userId === userId);
    sendResponse(res, 200, {
        user: { id: user.id, name: user.name },
        posts: userPosts
    });
});

// POST /api/users/:id/posts - Create post for user
app.post('/api/users/:id/posts', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);

    if (!user) {
        return sendResponse(res, 404, null, 'User not found');
    }

    const { title, content } = req.body;

    if (!title || !content) {
        return sendResponse(res, 400, null, 'Title and content are required');
    }

    const newPost = {
        id: nextPostId++,
        userId,
        title,
        content,
        createdAt: new Date().toISOString()
    };

    posts.push(newPost);

    res.setHeader('Location', `/api/posts/${newPost.id}`);
    sendResponse(res, 201, newPost, 'Post created successfully');
});

// ==========================================================
// POSTS RESOURCE - /api/posts
// ==========================================================

// GET /api/posts - Get all posts
app.get('/api/posts', (req, res) => {
    const enrichedPosts = posts.map(post => {
        const user = users.find(u => u.id === post.userId);
        return {
            ...post,
            author: user ? user.name : 'Unknown'
        };
    });

    sendResponse(res, 200, enrichedPosts);
});

// GET /api/posts/:id - Get single post
app.get('/api/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const post = posts.find(p => p.id === id);

    if (!post) {
        return sendResponse(res, 404, null, 'Post not found');
    }

    const user = users.find(u => u.id === post.userId);

    sendResponse(res, 200, {
        ...post,
        author: user ? user.name : 'Unknown',
        links: {
            self: `/api/posts/${id}`,
            author: `/api/users/${post.userId}`
        }
    });
});

// DELETE /api/posts/:id - Delete post
app.delete('/api/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = posts.findIndex(p => p.id === id);

    if (index === -1) {
        return sendResponse(res, 404, null, 'Post not found');
    }

    const deletedPost = posts.splice(index, 1)[0];
    sendResponse(res, 200, deletedPost, 'Post deleted successfully');
});

// ========== 404 HANDLER ==========
app.use((req, res) => {
    sendResponse(res, 404, null, `Route ${req.method} ${req.url} not found`);
});

// ========== START SERVER ==========
app.listen(PORT, () => {
    console.log(`\n=== RESTful API Design Demo ===`);
    console.log(`Server: http://localhost:${PORT}`);
    console.log(`\n=== HTTP METHODS ===`);
    console.log(`GET    - Read resource(s)`);
    console.log(`POST   - Create new resource`);
    console.log(`PUT    - Full update (replace)`);
    console.log(`PATCH  - Partial update`);
    console.log(`DELETE - Remove resource`);
    console.log(`\n=== ENDPOINTS ===`);
    console.log(`GET    /api/users`);
    console.log(`GET    /api/users/:id`);
    console.log(`POST   /api/users`);
    console.log(`PUT    /api/users/:id`);
    console.log(`PATCH  /api/users/:id`);
    console.log(`DELETE /api/users/:id`);
    console.log(`GET    /api/users/:id/posts`);
    console.log(`POST   /api/users/:id/posts`);
    console.log(`GET    /api/posts`);
    console.log(`GET    /api/posts/:id`);
    console.log(`DELETE /api/posts/:id`);
});
