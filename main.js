const express = require('express');
const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'YourTravelSearch', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html><head><title>YourTravelSearch</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<style>body{font-family:Arial,sans-serif;margin:40px;background:#f5f5f5}.container{max-width:600px;margin:0 auto;background:white;padding:40px;border-radius:8px}.status{color:#28a745;font-weight:bold}</style>
</head><body><div class="container"><h1>YourTravelSearch</h1><p class="status">Production Server Running</p><p>Flight booking platform with live Duffel API integration</p><p><a href="/health">Health Check</a></p></div></body></html>`);
});

const port = process.env.PORT || 5000;
app.listen(port, '0.0.0.0', () => console.log('YourTravelSearch server running on port', port));
