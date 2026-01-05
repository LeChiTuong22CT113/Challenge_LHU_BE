// Create server with http module

const http = require('http');

const PORT = 3000;
const HOST = 'localhost';

// Create server
const server = http.createServer((req, res) => {
    // req = Request object (info from client)
    // res = Response object (send back to client)

    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);

    // Set header
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    // Return response
    res.statusCode = 200;
    res.end(`
        <h1>Hello from Node.js Server!</h1>
        <p>Method: ${req.method}</p>
        <p>URL: ${req.url}</p>
        <p>Time: ${new Date().toLocaleString()}</p>
    `);
});

// Listen on port
server.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
    console.log('Press Ctrl+C to stop');
});
