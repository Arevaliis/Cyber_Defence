const express = require('express');

const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(express.json());

// Proxy to auth-service

app.use('/auth', createProxyMiddleware({ target: 'http://auth-service:3000', changeOrigin: true }));

// Proxy to transfer-service

app.use('/transfer', createProxyMiddleware({ target: 'http://transfer-service:3001', changeOrigin: true }));

// Proxy to audit-logs

app.use('/audit', createProxyMiddleware({ target: 'http://audit-logs:3002', changeOrigin: true }));

app.listen(8080, () => console.log('API Gateway listening on port 8080'));