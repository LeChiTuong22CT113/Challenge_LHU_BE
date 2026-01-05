const http = require('http');

const PORT = 3000;

// Mock database
const users = [
    { id: 1, name: 'Le Chi Tuong', class: '22CT113' },
    { id: 2, name: 'Nguyen Van A', class: '22CT114' }
];

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    console.log(`[${req.method}] ${pathname}`);

    //ROUTING + STATUS CODES

    // 200 OK - Success
    if (pathname === '/' || pathname === '/api') {
        res.statusCode = 200;
        return res.end(JSON.stringify({
            status: 200,
            message: 'OK - Welcome to API',
            endpoints: ['/users', '/users/:id', '/error']
        }));
    }

    // 200 OK - Get all users
    if (pathname === '/users' && req.method === 'GET') {
        res.statusCode = 200;
        return res.end(JSON.stringify({
            status: 200,
            message: 'OK',
            data: users
        }));
    }

    // 200/404 - Get user by ID
    if (pathname.startsWith('/users/') && req.method === 'GET') {
        const id = parseInt(pathname.split('/')[2]);
        const user = users.find(u => u.id === id);

        if (user) {
            res.statusCode = 200;
            return res.end(JSON.stringify({ status: 200, data: user }));
        } else {
            res.statusCode = 404;
            return res.end(JSON.stringify({
                status: 404,
                message: 'Not Found - User does not exist'
            }));
        }
    }

    // 201 Created
    if (pathname === '/create' && req.method === 'POST') {
        res.statusCode = 201;
        return res.end(JSON.stringify({
            status: 201,
            message: 'Created - Resource created successfully'
        }));
    }

    // 400 Bad Request
    if (pathname === '/bad-request') {
        res.statusCode = 400;
        return res.end(JSON.stringify({
            status: 400,
            message: 'Bad Request - Invalid request'
        }));
    }

    // 401 Unauthorized
    if (pathname === '/unauthorized') {
        res.statusCode = 401;
        return res.end(JSON.stringify({
            status: 401,
            message: 'Unauthorized - Authentication required'
        }));
    }

    // 403 Forbidden
    if (pathname === '/forbidden') {
        res.statusCode = 403;
        return res.end(JSON.stringify({
            status: 403,
            message: 'Forbidden - Access denied'
        }));
    }

    // 500 Internal Server Error
    if (pathname === '/error') {
        res.statusCode = 500;
        return res.end(JSON.stringify({
            status: 500,
            message: 'Internal Server Error'
        }));
    }

    // 404 Not Found - Default
    res.statusCode = 404;
    res.end(JSON.stringify({
        status: 404,
        message: `Route ${pathname} not found`
    }));
});

server.listen(PORT, () => {
    console.log(`Server: http://localhost:${PORT}\n`);
    console.log('=== STATUS CODES ===');
    console.log('2xx: GET /users, POST /create');
    console.log('4xx: /bad-request, /unauthorized, /forbidden, /users/999');
    console.log('5xx: /error');
});
