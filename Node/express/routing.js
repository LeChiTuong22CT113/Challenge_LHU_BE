// Different HTTP methods and route patterns

const express = require('express');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Mock database
const users = [
    { id: 1, name: 'Le Chi Tuong', email: 'tuong@example.com' },
    { id: 2, name: 'Nguyen Van A', email: 'a@example.com' },
    { id: 3, name: 'Tran Thi B', email: 'b@example.com' }
];

// BASIC ROUTES

// GET - Get all users
app.get('/users', (req, res) => {
    res.json({
        success: true,
        count: users.length,
        data: users
    });
});

// GET - Get user by ID (route parameter)
app.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);

    if (user) {
        res.json({ success: true, data: user });
    } else {
        res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
});

// POST - Create new user
app.post('/users', (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            success: false,
            message: 'Name and email are required'
        });
    }

    const newUser = {
        id: users.length + 1,
        name,
        email
    };
    users.push(newUser);

    res.status(201).json({
        success: true,
        message: 'User created',
        data: newUser
    });
});

// PUT - Update user
app.put('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    const { name, email } = req.body;
    users[userIndex] = { ...users[userIndex], name, email };

    res.json({
        success: true,
        message: 'User updated',
        data: users[userIndex]
    });
});

// DELETE - Delete user
app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    const deletedUser = users.splice(userIndex, 1);

    res.json({
        success: true,
        message: 'User deleted',
        data: deletedUser[0]
    });
});

// QUERY PARAMETERS

// GET /search?name=tuong&limit=10
app.get('/search', (req, res) => {
    const { name, limit } = req.query;

    let results = users;

    if (name) {
        results = results.filter(u =>
            u.name.toLowerCase().includes(name.toLowerCase())
        );
    }

    if (limit) {
        results = results.slice(0, parseInt(limit));
    }

    res.json({
        success: true,
        query: { name, limit },
        count: results.length,
        data: results
    });
});

// ROUTE CHAINING

app.route('/products')
    .get((req, res) => {
        res.json({ method: 'GET', message: 'Get all products' });
    })
    .post((req, res) => {
        res.json({ method: 'POST', message: 'Create product' });
    })
    .put((req, res) => {
        res.json({ method: 'PUT', message: 'Update product' });
    });

// Start server
app.listen(PORT, () => {
    console.log(`Express Routing Demo at http://localhost:${PORT}`);
    console.log('\n=== ROUTES ===');
    console.log('GET    /users        - Get all users');
    console.log('GET    /users/:id    - Get user by ID');
    console.log('POST   /users        - Create user');
    console.log('PUT    /users/:id    - Update user');
    console.log('DELETE /users/:id    - Delete user');
    console.log('GET    /search?name= - Search users');
});
