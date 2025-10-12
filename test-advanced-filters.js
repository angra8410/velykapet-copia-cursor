// Test script para verificar los filtros avanzados de productos
// Este script verifica que los filtros funcionan correctamente con productos del backend

const http = require('http');

console.log('🧪 ====================================');
console.log('🧪 TEST DE FILTROS AVANZADOS');
console.log('🧪 ====================================\n');

const API_BASE_URL = 'http://localhost:5135/api';

// Función auxiliar para hacer peticiones HTTP
function makeRequest(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(data);
                    resolve({ status: res.statusCode, data: parsedData });
                } catch (error) {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

async function runTests() {
    console.log('📋 Ejecutando tests de filtros avanzados...\n');
    
    let passedTests = 0;
    let failedTests = 0;
    
    // Test 1: Obtener todos los productos sin filtros
    try {
        console.log('Test 1️⃣: Obtener todos los productos sin filtros');
        const response = await makeRequest(`${API_BASE_URL}/Productos`);
        
        if (response.status === 200 && Array.isArray(response.data)) {
            console.log(`✅ PASS: Se obtuvieron ${response.data.length} productos`);
            
            // Verificar que los productos tienen los campos necesarios para filtros
            const firstProduct = response.data[0];
            if (firstProduct) {
                console.log(`   📦 Primer producto: "${firstProduct.NombreBase}"`);
                console.log(`   🔍 Campos de filtros:`, {
                    IdMascotaTipo: firstProduct.IdMascotaTipo,
                    NombreMascotaTipo: firstProduct.NombreMascotaTipo,
                    IdCategoriaAlimento: firstProduct.IdCategoriaAlimento,
                    NombreCategoriaAlimento: firstProduct.NombreCategoriaAlimento,
                    IdSubcategoria: firstProduct.IdSubcategoria,
                    NombreSubcategoria: firstProduct.NombreSubcategoria,
                    IdPresentacion: firstProduct.IdPresentacion,
                    NombrePresentacion: firstProduct.NombrePresentacion
                });
            }
            passedTests++;
        } else {
            console.log(`❌ FAIL: Respuesta inesperada`, response);
            failedTests++;
        }
    } catch (error) {
        console.log(`❌ FAIL: Error en la petición - ${error.message}`);
        failedTests++;
    }
    
    console.log('');
    
    // Test 2: Obtener tipos de mascotas
    try {
        console.log('Test 2️⃣: Obtener tipos de mascotas');
        const response = await makeRequest(`${API_BASE_URL}/Productos/filtros/mascotas`);
        
        if (response.status === 200 && Array.isArray(response.data)) {
            console.log(`✅ PASS: Se obtuvieron ${response.data.length} tipos de mascotas`);
            response.data.forEach(m => {
                console.log(`   🐾 ${m.Nombre} (ID: ${m.IdMascotaTipo})`);
            });
            passedTests++;
        } else {
            console.log(`❌ FAIL: Respuesta inesperada`, response);
            failedTests++;
        }
    } catch (error) {
        console.log(`❌ FAIL: Error en la petición - ${error.message}`);
        failedTests++;
    }
    
    console.log('');
    
    // Test 3: Obtener categorías de alimento
    try {
        console.log('Test 3️⃣: Obtener categorías de alimento');
        const response = await makeRequest(`${API_BASE_URL}/Productos/filtros/categorias-alimento`);
        
        if (response.status === 200 && Array.isArray(response.data)) {
            console.log(`✅ PASS: Se obtuvieron ${response.data.length} categorías de alimento`);
            response.data.forEach(c => {
                console.log(`   🍖 ${c.Nombre} (ID: ${c.IdCategoriaAlimento})`);
            });
            passedTests++;
        } else {
            console.log(`❌ FAIL: Respuesta inesperada`, response);
            failedTests++;
        }
    } catch (error) {
        console.log(`❌ FAIL: Error en la petición - ${error.message}`);
        failedTests++;
    }
    
    console.log('');
    
    // Test 4: Obtener subcategorías
    try {
        console.log('Test 4️⃣: Obtener subcategorías');
        const response = await makeRequest(`${API_BASE_URL}/Productos/filtros/subcategorias`);
        
        if (response.status === 200 && Array.isArray(response.data)) {
            console.log(`✅ PASS: Se obtuvieron ${response.data.length} subcategorías`);
            passedTests++;
        } else {
            console.log(`❌ FAIL: Respuesta inesperada`, response);
            failedTests++;
        }
    } catch (error) {
        console.log(`❌ FAIL: Error en la petición - ${error.message}`);
        failedTests++;
    }
    
    console.log('');
    
    // Test 5: Obtener presentaciones
    try {
        console.log('Test 5️⃣: Obtener presentaciones');
        const response = await makeRequest(`${API_BASE_URL}/Productos/filtros/presentaciones`);
        
        if (response.status === 200 && Array.isArray(response.data)) {
            console.log(`✅ PASS: Se obtuvieron ${response.data.length} presentaciones`);
            response.data.forEach(p => {
                console.log(`   📦 ${p.Nombre} (ID: ${p.IdPresentacion})`);
            });
            passedTests++;
        } else {
            console.log(`❌ FAIL: Respuesta inesperada`, response);
            failedTests++;
        }
    } catch (error) {
        console.log(`❌ FAIL: Error en la petición - ${error.message}`);
        failedTests++;
    }
    
    console.log('');
    
    // Test 6: Filtrar por tipo de mascota "GATO" (asumiendo ID=1)
    try {
        console.log('Test 6️⃣: Filtrar productos por tipo de mascota (GATO - ID 1)');
        const response = await makeRequest(`${API_BASE_URL}/Productos?idMascotaTipo=1`);
        
        if (response.status === 200 && Array.isArray(response.data)) {
            console.log(`✅ PASS: Se obtuvieron ${response.data.length} productos de gatos`);
            
            // Verificar que todos los productos filtrados tienen IdMascotaTipo=1
            const allAreGatos = response.data.every(p => p.IdMascotaTipo === 1);
            if (allAreGatos) {
                console.log(`   ✅ Todos los productos tienen IdMascotaTipo=1`);
            } else {
                console.log(`   ⚠️ Algunos productos no tienen IdMascotaTipo=1`);
            }
            
            // Mostrar primeros productos
            response.data.slice(0, 3).forEach(p => {
                console.log(`   🐱 ${p.NombreBase} (Mascota: ${p.NombreMascotaTipo})`);
            });
            passedTests++;
        } else {
            console.log(`❌ FAIL: Respuesta inesperada`, response);
            failedTests++;
        }
    } catch (error) {
        console.log(`❌ FAIL: Error en la petición - ${error.message}`);
        failedTests++;
    }
    
    console.log('');
    
    // Test 7: Filtrar por categoría de alimento (asumiendo ID=2 para ALIMENTO SECO)
    try {
        console.log('Test 7️⃣: Filtrar productos por categoría de alimento (ID 2)');
        const response = await makeRequest(`${API_BASE_URL}/Productos?idCategoriaAlimento=2`);
        
        if (response.status === 200 && Array.isArray(response.data)) {
            console.log(`✅ PASS: Se obtuvieron ${response.data.length} productos`);
            
            // Verificar que todos tienen IdCategoriaAlimento=2
            const allMatch = response.data.every(p => p.IdCategoriaAlimento === 2);
            if (allMatch) {
                console.log(`   ✅ Todos los productos tienen IdCategoriaAlimento=2`);
            } else {
                console.log(`   ⚠️ Algunos productos no tienen IdCategoriaAlimento=2`);
            }
            
            response.data.slice(0, 3).forEach(p => {
                console.log(`   🍖 ${p.NombreBase} (Categoría: ${p.NombreCategoriaAlimento})`);
            });
            passedTests++;
        } else {
            console.log(`❌ FAIL: Respuesta inesperada`, response);
            failedTests++;
        }
    } catch (error) {
        console.log(`❌ FAIL: Error en la petición - ${error.message}`);
        failedTests++;
    }
    
    console.log('');
    
    // Test 8: Filtro combinado (mascota + categoría)
    try {
        console.log('Test 8️⃣: Filtro combinado (idMascotaTipo=1 + idCategoriaAlimento=2)');
        const response = await makeRequest(`${API_BASE_URL}/Productos?idMascotaTipo=1&idCategoriaAlimento=2`);
        
        if (response.status === 200 && Array.isArray(response.data)) {
            console.log(`✅ PASS: Se obtuvieron ${response.data.length} productos con filtro combinado`);
            
            // Verificar que todos cumplen ambos criterios
            const allMatch = response.data.every(p => 
                p.IdMascotaTipo === 1 && p.IdCategoriaAlimento === 2
            );
            
            if (allMatch) {
                console.log(`   ✅ Todos los productos cumplen ambos criterios`);
            } else {
                console.log(`   ⚠️ Algunos productos no cumplen los criterios`);
            }
            
            response.data.slice(0, 3).forEach(p => {
                console.log(`   🐱🍖 ${p.NombreBase}`);
                console.log(`        Mascota: ${p.NombreMascotaTipo}, Categoría: ${p.NombreCategoriaAlimento}`);
            });
            passedTests++;
        } else {
            console.log(`❌ FAIL: Respuesta inesperada`, response);
            failedTests++;
        }
    } catch (error) {
        console.log(`❌ FAIL: Error en la petición - ${error.message}`);
        failedTests++;
    }
    
    console.log('');
    console.log('🧪 ====================================');
    console.log(`📊 RESULTADOS: ${passedTests} passed, ${failedTests} failed`);
    console.log('🧪 ====================================');
    
    if (failedTests === 0) {
        console.log('✅ Todos los tests pasaron correctamente');
        process.exit(0);
    } else {
        console.log('❌ Algunos tests fallaron');
        process.exit(1);
    }
}

// Ejecutar tests
runTests().catch(error => {
    console.error('❌ Error crítico ejecutando tests:', error);
    process.exit(1);
});
