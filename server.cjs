const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuración del servidor
const PORT = 3333;
const HOST = 'localhost';

// MIME types para diferentes archivos
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// Función para obtener MIME type
function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return mimeTypes[ext] || 'text/plain';
}

// Crear servidor HTTP
const server = http.createServer(async (req, res) => {
    console.log(`📡 ${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Manejar preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Manejar proxy para API (CORS bypass)
    if (req.url.startsWith('/api/')) {
        console.log(`🔀 Proxy API request: ${req.method} ${req.url}`);
        
        // Construir URL del backend
        const backendUrl = `http://localhost:5135${req.url}`;
        
        try {
            // Configurar headers para la petición al backend
            const options = {
                method: req.method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };
            
            // Si hay Authorization header, pasarlo
            if (req.headers.authorization) {
                options.headers.Authorization = req.headers.authorization;
            }
            
            // Si es POST/PUT, leer el body
            if (req.method === 'POST' || req.method === 'PUT') {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', async () => {
                    if (body) {
                        options.body = body;
                    }
                    await forwardRequest();
                });
                return;
            } else {
                await forwardRequest();
                return;
            }
            
            async function forwardRequest() {
                try {
                    // Usar el fetch nativo de Node.js (disponible en Node 18+)
                    const response = await fetch(backendUrl, options);
                    
                    console.log(`📨 Backend response: ${response.status} ${response.statusText}`);
                    
                    // Copiar headers importantes del backend
                    const responseHeaders = {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                        'Content-Type': response.headers.get('content-type') || 'application/json'
                    };
                    
                    res.writeHead(response.status, responseHeaders);
                    
                    // Obtener y enviar el body
                    const data = await response.text();
                    res.end(data);
                    
                } catch (proxyError) {
                    console.error(`❌ Proxy error: ${proxyError.message}`);
                    res.writeHead(500, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ 
                        error: 'Proxy error', 
                        message: proxyError.message 
                    }));
                }
            }
            
        } catch (error) {
            console.error(`❌ Error in proxy: ${error.message}`);
            res.writeHead(500, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ 
                error: 'Internal proxy error', 
                message: error.message 
            }));
        }
        return;
    }
    
    // Parsear URL
    let filePath = req.url === '/' ? '/index.html' : req.url;
    
    // Construir ruta del archivo
    const fullPath = path.join(__dirname, filePath);
    const ext = path.extname(filePath);
    
    console.log(`📁 Buscando archivo: ${fullPath}`);
    
    // Verificar si el archivo existe
    fs.access(fullPath, fs.constants.F_OK, (err) => {
        if (err) {
            console.log(`❌ Archivo no encontrado: ${fullPath}`);
            
            // Si es un archivo .js y no existe, intentar servirlo como JS vacío
            if (ext === '.js') {
                res.writeHead(200, { 'Content-Type': 'application/javascript' });
                res.end('console.log("Archivo JS no encontrado:", "' + filePath + '");');
                return;
            }
            
            // Error 404
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>404 - Archivo no encontrado</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                        .error { color: #d32f2f; background: #ffebee; padding: 20px; border-radius: 8px; display: inline-block; }
                    </style>
                </head>
                <body>
                    <div class="error">
                        <h1>❌ Error 404</h1>
                        <p>Archivo no encontrado: <code>${filePath}</code></p>
                        <p>Ruta completa: <code>${fullPath}</code></p>
                        <hr>
                        <p><a href="/">← Volver al inicio</a></p>
                    </div>
                </body>
                </html>
            `);
            return;
        }
        
        // Leer y servir el archivo
        fs.readFile(fullPath, (readErr, data) => {
            if (readErr) {
                console.log(`❌ Error leyendo archivo: ${readErr.message}`);
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end(`
                    <div style="color: red; padding: 20px; text-align: center;">
                        <h1>❌ Error del servidor</h1>
                        <p>No se pudo leer el archivo: ${filePath}</p>
                        <p>Error: ${readErr.message}</p>
                    </div>
                `);
                return;
            }
            
            // Servir archivo exitosamente
            const mimeType = getMimeType(filePath);
            console.log(`✅ Sirviendo: ${filePath} (${mimeType})`);
            
            res.writeHead(200, { 
                'Content-Type': mimeType,
                'Cache-Control': 'no-cache' // Evitar cache durante desarrollo
            });
            res.end(data);
        });
    });
});

// Iniciar servidor
server.listen(PORT, HOST, () => {
    console.log('🚀 ===================================');
    console.log('🚀 VentasPet Frontend Server');
    console.log('🚀 ===================================');
    console.log(`🌐 Servidor corriendo en: http://${HOST}:${PORT}`);
    console.log(`📁 Directorio raíz: ${__dirname}`);
    console.log(`⏰ Iniciado: ${new Date().toISOString()}`);
    console.log('🚀 ===================================');
    console.log('');
    console.log('📋 Para probar:');
    console.log(`   👉 Abrir: http://${HOST}:${PORT}`);
    console.log(`   👉 API Backend: http://localhost:5135`);
    console.log('');
    console.log('🛑 Para detener el servidor: Ctrl+C');
    console.log('');
});

// Manejo de errores del servidor
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Puerto ${PORT} ya está en uso. Prueba con otro puerto.`);
    } else {
        console.error('❌ Error del servidor:', err.message);
    }
});

// Manejo de cierre del proceso
process.on('SIGINT', () => {
    console.log('\n🛑 Cerrando servidor...');
    server.close(() => {
        console.log('✅ Servidor cerrado exitosamente');
        process.exit(0);
    });
});