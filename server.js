const http = require('http');
const fs = require('fs');
const path = require('path');
const { loadEnv } = require('./env-config.cjs');

// Cargar variables de entorno según el ambiente
const config = loadEnv(process.env.NODE_ENV);

// Usar variables de entorno o valores por defecto
const PORT = process.env.FRONTEND_PORT || 3333;

const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    let filePath;
    let contentType = 'text/html';
    
    // Routing
    if (req.url === '/' || req.url === '/index.html') {
        filePath = path.join(__dirname, 'public', 'index.html');
        contentType = 'text/html';
    } else if (req.url.startsWith('/src/')) {
        filePath = path.join(__dirname, req.url);
        contentType = 'application/javascript';
    } else if (req.url.endsWith('.css')) {
        filePath = path.join(__dirname, 'public', req.url);
        contentType = 'text/css';
    } else if (req.url.endsWith('.js')) {
        filePath = path.join(__dirname, req.url);
        contentType = 'application/javascript';
    } else {
        // SPA fallback
        filePath = path.join(__dirname, 'public', 'index.html');
        contentType = 'text/html';
    }
    
    console.log(`📁 Serving: ${filePath}`);
    
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.log(`❌ Error: ${err.message}`);
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(`
                <html>
                <head><title>404 Not Found</title></head>
                <body style="font-family: Arial, sans-serif; padding: 40px; background: #f8f9fa;">
                    <h1>🚫 404 - Archivo no encontrado</h1>
                    <p><strong>URL solicitada:</strong> ${req.url}</p>
                    <p><strong>Archivo buscado:</strong> ${filePath}</p>
                    <p><strong>Error:</strong> ${err.message}</p>
                    <p><a href="/" style="color: #007bff;">← Volver al inicio</a></p>
                </body>
                </html>
            `);
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
            console.log(`✅ Servido: ${path.basename(filePath)} (${contentType})`);
        }
    });
});

server.listen(PORT, process.env.FRONTEND_HOST || '127.0.0.1', () => {
    const host = process.env.FRONTEND_HOST || '127.0.0.1';
    const frontendUrl = `http://${host}:${PORT}`;
    
    console.log('🚀='.repeat(50));
    console.log(`🚀 VentasPet Server corriendo en ambiente: ${process.env.APP_ENV || 'development'}`);
    console.log(`🚀 ➜ ${frontendUrl}`);
    if (host === '0.0.0.0' || host === 'localhost') {
        console.log(`🚀 ➜ http://localhost:${PORT}`);
        console.log(`🚀 ➜ http://127.0.0.1:${PORT}`);
    }
    console.log(`🚀 Directorio: ${__dirname}`);
    console.log('🚀='.repeat(50));
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`❌ Puerto ${PORT} ocupado. Intentando puerto ${PORT + 1}...`);
        server.listen(PORT + 1, '127.0.0.1');
    } else {
        console.error('❌ Error del servidor:', err);
    }
});

console.log('🚀 Iniciando servidor VentasPet nuevo...');