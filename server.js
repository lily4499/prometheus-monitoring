const express = require('express');
const client = require('prom-client');

const app = express();
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

const requestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
});

app.get('/', (req, res) => {
    requestCounter.inc({ method: 'GET', route: '/', status_code: 200 });
    res.send('Hello, World!');
});

app.get('/metrics', async (req, res) => {  // ✅ Add async
    res.set('Content-Type', client.register.contentType);
    const metrics = await client.register.metrics();  // ✅ Await the Promise
    res.end(metrics);
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

