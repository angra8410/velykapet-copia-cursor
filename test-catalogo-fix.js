// Test de Verificación: JSON en PascalCase
// Este script verifica que la API devuelve datos en PascalCase después del fix

console.log('🧪 ===== TEST DE VERIFICACIÓN: CATALOGO FIX =====\n');

async function testProductAPI() {
    console.log('📋 Test: Verificando formato de respuesta de API de productos\n');
    
    try {
        // Llamar a la API a través del proxy del frontend
        const response = await fetch('/api/Productos', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const productos = await response.json();
        
        console.log(`✅ API respondió con ${productos.length} productos\n`);
        
        if (productos.length === 0) {
            console.warn('⚠️  No hay productos en la base de datos');
            return { success: false, reason: 'No hay productos' };
        }
        
        // Verificar el primer producto
        const primerProducto = productos[0];
        console.log('🔍 Analizando primer producto:');
        console.log('   Raw object keys:', Object.keys(primerProducto));
        console.log('');
        
        // Verificar que las propiedades están en PascalCase
        const propiedadesEsperadas = [
            'IdProducto',
            'NombreBase',
            'Descripcion',
            'NombreCategoria',
            'TipoMascota',
            'URLImagen',
            'Variaciones'
        ];
        
        const propiedadesFaltantes = [];
        const propiedadesEncontradas = [];
        
        for (const prop of propiedadesEsperadas) {
            if (primerProducto.hasOwnProperty(prop)) {
                propiedadesEncontradas.push(prop);
                const value = primerProducto[prop];
                const preview = typeof value === 'object' 
                    ? (Array.isArray(value) ? `Array(${value.length})` : 'Object')
                    : (typeof value === 'string' ? `"${value}"` : value);
                console.log(`   ✅ ${prop}: ${preview}`);
            } else {
                propiedadesFaltantes.push(prop);
                console.log(`   ❌ ${prop}: FALTANTE`);
            }
        }
        
        console.log('');
        
        // Verificar variaciones
        if (primerProducto.Variaciones && Array.isArray(primerProducto.Variaciones)) {
            console.log(`📦 Variaciones encontradas: ${primerProducto.Variaciones.length}`);
            
            if (primerProducto.Variaciones.length > 0) {
                const primeraVariacion = primerProducto.Variaciones[0];
                console.log('   Primera variación:');
                console.log(`   - IdVariacion: ${primeraVariacion.IdVariacion}`);
                console.log(`   - Peso: ${primeraVariacion.Peso}`);
                console.log(`   - Precio: ${primeraVariacion.Precio}`);
                console.log(`   - Stock: ${primeraVariacion.Stock}`);
                console.log(`   - Activa: ${primeraVariacion.Activa}`);
            }
        } else {
            console.warn('   ⚠️  Variaciones no encontradas o formato incorrecto');
        }
        
        console.log('');
        
        // Determinar si el fix funcionó
        const fixFunciono = propiedadesFaltantes.length === 0;
        
        if (fixFunciono) {
            console.log('✅ ¡FIX EXITOSO!');
            console.log('   Todas las propiedades esperadas están presentes en PascalCase');
            console.log('   El catálogo debería mostrar los productos correctamente');
        } else {
            console.error('❌ FIX NO APLICADO CORRECTAMENTE');
            console.error(`   Propiedades faltantes: ${propiedadesFaltantes.join(', ')}`);
            console.error('   El catálogo seguirá mostrando productos vacíos');
            console.log('');
            console.log('💡 Posibles causas:');
            console.log('   1. El backend no se reinició después del cambio');
            console.log('   2. La configuración de JSON no se aplicó correctamente');
            console.log('   3. El backend está usando una configuración diferente');
        }
        
        console.log('');
        console.log('📊 Resumen:');
        console.log(`   Total de productos: ${productos.length}`);
        console.log(`   Propiedades encontradas: ${propiedadesEncontradas.length}/${propiedadesEsperadas.length}`);
        console.log(`   Formato correcto: ${fixFunciono ? 'SÍ' : 'NO'}`);
        
        return {
            success: fixFunciono,
            productCount: productos.length,
            missingProperties: propiedadesFaltantes,
            firstProduct: primerProducto
        };
        
    } catch (error) {
        console.error('❌ Error en el test:', error.message);
        console.log('');
        console.log('💡 Asegúrate de que:');
        console.log('   1. El backend está corriendo (puerto 5135)');
        console.log('   2. El frontend está corriendo (puerto 3333)');
        console.log('   3. El proxy está configurado correctamente');
        
        return {
            success: false,
            error: error.message
        };
    }
}

// Ejecutar el test automáticamente si se carga en el navegador
if (typeof window !== 'undefined') {
    console.log('🌐 Test cargado en el navegador');
    console.log('📝 Ejecuta: testProductAPI() para verificar el fix\n');
    window.testProductAPI = testProductAPI;
    
    // Auto-ejecutar después de 1 segundo
    setTimeout(() => {
        console.log('🚀 Auto-ejecutando test...\n');
        testProductAPI().then(result => {
            console.log('\n🏁 Test completado');
            if (result.success) {
                console.log('✅ El fix está funcionando correctamente');
            } else {
                console.log('❌ El fix NO está funcionando. Revisar los pasos de verificación.');
            }
        });
    }, 1000);
}

// Exportar para uso en Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { testProductAPI };
}
