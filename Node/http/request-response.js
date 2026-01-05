const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
    //REQUEST OBJECT
    console.log('\n=== REQUEST INFO ===');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('HTTP Version:', req.httpVersion);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));

    // Parse URL to get path and query
    const url = new URL(req.url, `http://${req.headers.host}`);
    console.log('Pathname:', url.pathname);
    console.log('Search Params:', Object.fromEntries(url.searchParams));

    //RESPONSE OBJECT
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('X-Author', 'Le Chi Tuong');

    const responseData = {
        message: 'Request received!',
        request: {
            method: req.method,
            url: req.url,
            pathname: url.pathname,
            query: Object.fromEntries(url.searchParams)
        },
        server: {
            time: new Date().toISOString(),
            nodeVersion: process.version
        }
    };

    res.end(JSON.stringify(responseData, null, 2));
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('\nTry: http://localhost:3000/api?name=Tuong&age=21');
});
