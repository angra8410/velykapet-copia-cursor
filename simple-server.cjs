const http = require('http');
const fs = require('fs');
const path = require('path');
const { loadEnv } = require('./env-config.cjs');

// Cargar variables de entorno según el ambiente
const config = loadEnv(process.env.NODE_ENV);

// Usar variables de entorno o valores por defecto
const PORT = process.env.FRONTEND_PORT || 3333;
const BACKEND_PORT = process.env.BACKEND_PORT || 5135;
const BACKEND_HOST = process.env.BACKEND_HOST || 'localhost';

console.log(`🚀 Iniciando servidor simple en ambiente: ${process.env.APP_ENV || 'development'}...`);

const server = http.createServer((req, res) => {
    console.log(`📡 ${req.method} ${req.url}`);
    
    // CORS headers para todas las respuestas
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Manejar preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Proxy para API requests
    if (req.url.startsWith('/api/')) {
        console.log(`🔀 Proxying to backend: ${req.url}`);
        
        const options = {
            hostname: BACKEND_HOST,
            port: BACKEND_PORT,
            path: req.url,
            method: req.method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };
        
        const proxyReq = http.request(options, (proxyRes) => {
            console.log(`📨 Backend response: ${proxyRes.statusCode}`);
            
            // Copiar status code
            res.writeHead(proxyRes.statusCode, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            });
            
            // Pipe response
            proxyRes.pipe(res);
        });
        
        proxyReq.on('error', (err) => {
            console.error('❌ Proxy error:', err.message);
            res.writeHead(500, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ 
                error: 'Backend connection failed',
                message: err.message 
            }));
        });
        
        // Forward request body if present
        if (req.method === 'POST' || req.method === 'PUT') {
            req.pipe(proxyReq);
        } else {
            proxyReq.end();
        }
        
        return;
    }
    
    // Servir archivos estáticos
    let filePath = req.url === '/' ? '/index.html' : req.url;
    const fullPath = path.join(__dirname, filePath);
    
    fs.readFile(fullPath, (err, data) => {
        if (err) {
            if (path.extname(filePath) === '.js') {
                res.writeHead(200, { 'Content-Type': 'application/javascript' });
                res.end('console.log("File not found:", "' + filePath + '");');
            } else {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - Archivo no encontrado</h1><p>' + filePath + '</p>');
            }
            return;
        }
        
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes = {
            '.html': 'text/html',
            '.js': 'application/javascript',
            '.css': 'text/css',
            '.json': 'application/json'
        };
        
        const mimeType = mimeTypes[ext] || 'text/plain';
        res.writeHead(200, { 'Content-Type': mimeType });
        res.end(data);
    });
});

server.listen(PORT, process.env.FRONTEND_HOST || 'localhost', () => {
    const frontendUrl = `http://${process.env.FRONTEND_HOST || 'localhost'}:${PORT}`;
    const backendUrl = process.env.API_URL || `http://${BACKEND_HOST}:${BACKEND_PORT}`;
    
    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('🚀 VelyKapet Frontend Server');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`🌐 Servidor corriendo en ${frontendUrl}`);
    console.log(`🔀 Proxy configurado para backend en ${backendUrl}`);
    console.log(`🔧 Ambiente: ${process.env.APP_ENV || 'development'}`);
    console.log('✨ CORS habilitado para todas las rutas');
    console.log('');
    console.log('💡 Próximos pasos:');
    console.log(`   1. Abrir navegador en: ${frontendUrl}`);
    console.log(`   2. Verificar que el backend esté corriendo en: ${backendUrl}`);
    console.log('   3. Ver documentación: README.md y PORT_CONFIGURATION.md');
    console.log('');
    console.log('⚠️  Si experimentas ERR_CONNECTION_REFUSED:');
    console.log('   → Verifica que el backend esté corriendo (dotnet run)');
    console.log('   → Ver PORT_CONFIGURATION.md para ayuda completa');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
});

server.on('error', (err) => {
    console.error('❌ Error del servidor:', err.message);
});