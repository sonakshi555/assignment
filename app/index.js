const http = require('http');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
    // Standard JSON response headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('X-Powered-By', 'Node.js-Native');

    // Health check endpoint
    if (req.url === '/health' || req.url === '/') {
        res.writeHead(200);
        return res.end(JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString() }));
    }

    // Dynamic processing route for performance benchmarking under load testing
    if (req.url === '/api/data') {
        let computeWeight = 0;
        
        // Artificial CPU bound task to stress-test system telemetry
        for (let i = 0; i < 7e5; i++) {
            computeWeight += Math.sqrt(i);
        }

        res.writeHead(200);
        return res.end(JSON.stringify({
            status: 'success',
            tier: 'dynamic-api',
            result: computeWeight.toFixed(2)
        }));
    }

    // Fallback 404 handler
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Route not mapped on infrastructure tier' }));
});

server.listen(PORT, () => {
    console.log(`Core application logic engine listening on execution port ${PORT}`);
});