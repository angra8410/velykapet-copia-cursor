// TEST DIRECTO DE CONEXIÓN - SIN APISERVICE
// Ejecutar en la consola del navegador

console.log('🧪 ===== TEST DIRECTO DE CONEXIÓN =====');

// Test 1: Probar el proxy directamente
async function testProxy() {
    console.log('🔍 Test 1: Probando proxy en puerto 3333...');
    try {
        const response = await fetch('http://localhost:3333/api/Productos', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Proxy Response:', {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries())
        });
        
        const data = await response.text();
        console.log('📄 Proxy Data:', data);
        
        return { success: true, data };
    } catch (error) {
        console.error('❌ Proxy Error:', error);
        return { success: false, error: error.message };
    }
}

// Test 2: Probar backend directo (fallará por CORS pero podemos detectarlo)
async function testBackendDirect() {
    console.log('🔍 Test 2: Probando backend directo (puerto 5135)...');
    try {
        const response = await fetch('http://localhost:5135/api/Productos', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Backend Direct Response:', {
            status: response.status,
            statusText: response.statusText
        });
        
        const data = await response.text();
        console.log('📄 Backend Direct Data:', data);
        
        return { success: true, data };
    } catch (error) {
        console.error('❌ Backend Direct Error (esperado por CORS):', error);
        return { success: false, error: error.message };
    }
}

// Test 3: Verificar qué está haciendo ApiService
function testApiService() {
    console.log('🔍 Test 3: Verificando ApiService...');
    
    if (typeof ApiService === 'undefined') {
        console.error('❌ ApiService no está definido');
        return { success: false, error: 'ApiService no definido' };
    }
    
    console.log('📋 ApiService:', ApiService);
    console.log('🌐 ApiService.baseUrl:', ApiService.baseUrl);
    
    if (ApiService.getProducts) {
        console.log('🔍 Método getProducts encontrado');
        console.log('📝 getProducts function:', ApiService.getProducts.toString());
    } else {
        console.error('❌ Método getProducts no encontrado');
    }
    
    return { success: true };
}

// Ejecutar todos los tests
async function runAllTests() {
    console.log('🚀 EJECUTANDO TODOS LOS TESTS...');
    
    const results = {
        proxy: await testProxy(),
        backend: await testBackendDirect(),
        apiService: testApiService()
    };
    
    console.log('📊 RESULTADOS FINALES:', results);
    
    // Análisis de resultados
    if (results.proxy.success) {
        console.log('✅ PROXY FUNCIONA - El problema está en el frontend');
    } else {
        console.log('❌ PROXY NO FUNCIONA - El problema está en el servidor proxy');
    }
    
    return results;
}

// Ejecutar automáticamente
runAllTests();

// Hacer funciones disponibles globalmente
window.testProxy = testProxy;
window.testBackendDirect = testBackendDirect;
window.testApiService = testApiService;
window.runAllTests = runAllTests;

console.log('📝 FUNCIONES DISPONIBLES:');
console.log('- testProxy() - Probar solo el proxy');
console.log('- testBackendDirect() - Probar backend directo');
console.log('- testApiService() - Verificar ApiService');
console.log('- runAllTests() - Ejecutar todos los tests');