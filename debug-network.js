// SCRIPT DE DEBUGGING AVANZADO - INTERCEPTOR DE RED
// Ejecutar en la consola del navegador para ver EXACTAMENTE qué está pasando

console.log('🔍 INICIANDO DEBUGGING AVANZADO DE RED...');

// 1. INTERCEPTAR TODAS LAS PETICIONES FETCH
const originalFetch = window.fetch;
window.fetch = function(...args) {
    console.log('🌐 FETCH INTERCEPTADO:', {
        url: args[0],
        options: args[1],
        timestamp: new Date().toISOString()
    });
    
    return originalFetch.apply(this, args)
        .then(response => {
            console.log('✅ RESPUESTA FETCH:', {
                url: args[0],
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries()),
                timestamp: new Date().toISOString()
            });
            return response;
        })
        .catch(error => {
            console.error('❌ ERROR FETCH:', {
                url: args[0],
                error: error.message,
                timestamp: new Date().toISOString()
            });
            throw error;
        });
};

// 2. INTERCEPTAR XMLHttpRequest
const originalXHROpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url, ...args) {
    console.log('📡 XHR INTERCEPTADO:', {
        method,
        url,
        timestamp: new Date().toISOString()
    });
    
    this.addEventListener('load', function() {
        console.log('✅ RESPUESTA XHR:', {
            method,
            url,
            status: this.status,
            statusText: this.statusText,
            response: this.responseText.substring(0, 200) + '...',
            timestamp: new Date().toISOString()
        });
    });
    
    this.addEventListener('error', function() {
        console.error('❌ ERROR XHR:', {
            method,
            url,
            status: this.status,
            statusText: this.statusText,
            timestamp: new Date().toISOString()
        });
    });
    
    return originalXHROpen.apply(this, [method, url, ...args]);
};

// 3. FUNCIÓN PARA PROBAR DIRECTAMENTE EL ENDPOINT
window.testDirectEndpoint = async function() {
    console.log('🧪 PROBANDO ENDPOINT DIRECTO...');
    
    const testUrls = [
        '/api/Productos',                      // A través del proxy (correcto)
        'http://localhost:5135/api/Productos', // Directo al backend
        'http://localhost:3333/api/Productos'  // Proxy explícito
    ];
    
    for (const url of testUrls) {
        try {
            console.log(`🔍 Probando: ${url}`);
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            console.log(`✅ ${url} - Status: ${response.status}`);
            if (response.ok) {
                const data = await response.text();
                console.log(`📄 Respuesta: ${data.substring(0, 100)}...`);
            }
        } catch (error) {
            console.error(`❌ ${url} - Error:`, error.message);
        }
    }
};

// 4. FUNCIÓN PARA VERIFICAR LA CONFIGURACIÓN ACTUAL
window.checkCurrentConfig = function() {
    console.log('⚙️ VERIFICANDO CONFIGURACIÓN ACTUAL...');
    
    // Verificar si ApiService existe
    if (typeof ApiService !== 'undefined') {
        console.log('📋 ApiService encontrado:', ApiService);
        
        // Verificar configuración
        if (ApiService.config) {
            console.log('🔧 Configuración ApiService:', ApiService.config);
        }
        
        // Verificar baseUrl
        if (ApiService.baseUrl) {
            console.log('🌐 Base URL:', ApiService.baseUrl);
        }
    } else {
        console.log('❌ ApiService NO encontrado');
    }
    
    // Verificar API_CONFIG global
    if (typeof API_CONFIG !== 'undefined') {
        console.log('🔧 API_CONFIG global:', API_CONFIG);
    } else {
        console.log('❌ API_CONFIG NO encontrado');
    }
    
    // Verificar localStorage
    console.log('💾 localStorage keys:', Object.keys(localStorage));
    
    // Verificar sessionStorage
    console.log('🗂️ sessionStorage keys:', Object.keys(sessionStorage));
};

// 5. EJECUTAR VERIFICACIONES AUTOMÁTICAS
console.log('🚀 EJECUTANDO VERIFICACIONES...');
checkCurrentConfig();

console.log('📝 COMANDOS DISPONIBLES:');
console.log('- testDirectEndpoint() - Probar todos los endpoints posibles');
console.log('- checkCurrentConfig() - Verificar configuración actual');
console.log('- Todas las peticiones de red serán interceptadas y mostradas');

console.log('🎯 AHORA INTENTA CARGAR PRODUCTOS Y OBSERVA LA CONSOLA');