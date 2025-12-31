// TASK 7: Mini Project - Todo API (In-Memory)
// Full CRUD API for Todo items stored in array

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = 3000;

// ========== MIDDLEWARE ==========
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// ========== IN-MEMORY DATABASE ==========
let todos = [
    { id: 1, title: 'Learn Node.js', completed: false, createdAt: new Date().toISOString() },
    { id: 2, title: 'Learn Express', completed: false, createdAt: new Date().toISOString() },
    { id: 3, title: 'Build Todo API', completed: true, createdAt: new Date().toISOString() }
];

let nextId = 4;

// HELPER FUNCTIONS
const findTodoById = (id) => todos.find(todo => todo.id === id);
const findTodoIndex = (id) => todos.findIndex(todo => todo.id === id);

// ROUTES

// GET / - API info
app.get('/', (req, res) => {
    res.json({
        message: 'Todo API - In Memory',
        version: '1.0.0',
        endpoints: {
            'GET /todos': 'Get all todos',
            'GET /todos/:id': 'Get todo by ID',
            'POST /todos': 'Create new todo',
            'PUT /todos/:id': 'Update todo',
            'PATCH /todos/:id': 'Partial update todo',
            'DELETE /todos/:id': 'Delete todo',
            'DELETE /todos': 'Delete all todos'
        }
    });
});

// GET /todos - Get all todos
app.get('/todos', (req, res) => {
    // Query params: ?completed=true, ?completed=false
    const { completed } = req.query;

    let result = todos;

    if (completed !== undefined) {
        const isCompleted = completed === 'true';
        result = todos.filter(todo => todo.completed === isCompleted);
    }

    res.json({
        success: true,
        count: result.length,
        data: result
    });
});

// GET /todos/:id - Get todo by ID
app.get('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = findTodoById(id);

    if (!todo) {
        return res.status(404).json({
            success: false,
            message: `Todo with id ${id} not found`
        });
    }

    res.json({
        success: true,
        data: todo
    });
});

// POST /todos - Create new todo
app.post('/todos', (req, res) => {
    const { title, completed = false } = req.body;

    // Validation
    if (!title || title.trim() === '') {
        return res.status(400).json({
            success: false,
            message: 'Title is required'
        });
    }

    const newTodo = {
        id: nextId++,
        title: title.trim(),
        completed: Boolean(completed),
        createdAt: new Date().toISOString()
    };

    todos.push(newTodo);

    res.status(201).json({
        success: true,
        message: 'Todo created successfully',
        data: newTodo
    });
});

// PUT /todos/:id - Update entire todo
app.put('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = findTodoIndex(id);

    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: `Todo with id ${id} not found`
        });
    }

    const { title, completed } = req.body;

    // Validation
    if (!title || title.trim() === '') {
        return res.status(400).json({
            success: false,
            message: 'Title is required'
        });
    }

    todos[index] = {
        ...todos[index],
        title: title.trim(),
        completed: Boolean(completed),
        updatedAt: new Date().toISOString()
    };

    res.json({
        success: true,
        message: 'Todo updated successfully',
        data: todos[index]
    });
});

// PATCH /todos/:id - Partial update
app.patch('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = findTodoIndex(id);

    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: `Todo with id ${id} not found`
        });
    }

    const { title, completed } = req.body;

    if (title !== undefined) {
        todos[index].title = title.trim();
    }

    if (completed !== undefined) {
        todos[index].completed = Boolean(completed);
    }

    todos[index].updatedAt = new Date().toISOString();

    res.json({
        success: true,
        message: 'Todo patched successfully',
        data: todos[index]
    });
});

// DELETE /todos/:id - Delete one todo
app.delete('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = findTodoIndex(id);

    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: `Todo with id ${id} not found`
        });
    }

    const deletedTodo = todos.splice(index, 1)[0];

    res.json({
        success: true,
        message: 'Todo deleted successfully',
        data: deletedTodo
    });
});

// DELETE /todos - Delete all todos
app.delete('/todos', (req, res) => {
    const count = todos.length;
    todos = [];
    nextId = 1;

    res.json({
        success: true,
        message: `Deleted ${count} todos`
    });
});

// 404 HANDLER
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.url} not found`
    });
});

// ERROR HANDLER
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// START SERVER
app.listen(PORT, () => {
    console.log(`\n=== Todo API Server ===`);
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`\n=== ENDPOINTS ===`);
    console.log(`GET    /todos        - Get all todos`);
    console.log(`GET    /todos/:id    - Get todo by ID`);
    console.log(`POST   /todos        - Create todo`);
    console.log(`PUT    /todos/:id    - Update todo`);
    console.log(`PATCH  /todos/:id    - Partial update`);
    console.log(`DELETE /todos/:id    - Delete todo`);
    console.log(`DELETE /todos        - Delete all`);
    console.log(`\n=== QUERY PARAMS ===`);
    console.log(`GET /todos?completed=true  - Filter completed`);
    console.log(`GET /todos?completed=false - Filter pending`);
});
