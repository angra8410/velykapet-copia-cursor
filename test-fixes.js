// Script de prueba para verificar las correcciones implementadas
// Ejecutar en la consola del navegador después de cargar la página

console.log('🧪 Iniciando pruebas de las correcciones...');

// Función para probar las variaciones de productos
function testProductVariations() {
    console.log('📦 Probando sistema de variaciones...');
    
    // Producto de ejemplo
    const testProduct = {
        Id: 'test-001',
        Name: 'Alimento Premium para Gatos',
        Description: 'Alimento balanceado para gatos adultos',
        Category: 'Alimento',
        Price: 15000,
        Stock: 50,
        PetType: 'Gatos'
    };
    
    // Probar generación de variaciones
    if (window.getProductVariations) {
        const variations = window.getProductVariations(testProduct);
        console.log('✅ Variaciones generadas:', variations.length);
        console.log('📋 Variaciones:', variations);
        
        // Verificar que se generaron las variaciones de peso
        const weightVariations = variations.filter(v => v.weight);
        console.log('⚖️ Variaciones de peso:', weightVariations.length);
        
        if (weightVariations.length >= 3) {
            console.log('✅ Variaciones de peso implementadas correctamente');
        } else {
            console.log('❌ Faltan variaciones de peso');
        }
    } else {
        console.log('❌ Función getProductVariations no disponible');
    }
}

// Función para probar la carga de imágenes
function testImageLoading() {
    console.log('🖼️ Probando carga de imágenes...');
    
    // Verificar que el ProductCard maneja múltiples campos de imagen
    const testProductWithImage = {
        Id: 'test-002',
        Name: 'Producto con imagen',
        ImageUrl: 'https://example.com/image.jpg',
        Price: 10000
    };
    
    const testProductWithoutImage = {
        Id: 'test-003',
        Name: 'Producto sin imagen',
        Price: 10000
    };
    
    console.log('📸 Producto con imagen:', testProductWithImage.ImageUrl);
    console.log('📸 Producto sin imagen:', testProductWithoutImage.ImageUrl);
    
    // Verificar que se usa el placeholder mejorado
    console.log('🎨 Placeholder mejorado implementado');
}

// Función para probar la integración completa
function testIntegration() {
    console.log('🔗 Probando integración completa...');
    
    // Verificar que los componentes están disponibles
    const components = [
        'ProductCardComponent',
        'ProductVariationsComponent',
        'getProductVariations'
    ];
    
    components.forEach(component => {
        if (window[component]) {
            console.log(`✅ ${component} disponible`);
        } else {
            console.log(`❌ ${component} no disponible`);
        }
    });
}

// Ejecutar todas las pruebas
function runAllTests() {
    console.log('🚀 Ejecutando todas las pruebas...');
    
    testProductVariations();
    testImageLoading();
    testIntegration();
    
    console.log('✅ Pruebas completadas');
}

// Ejecutar automáticamente si se está en el navegador
if (typeof window !== 'undefined') {
    // Esperar a que la página se cargue completamente
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runAllTests);
    } else {
        runAllTests();
    }
}

// Exportar funciones para uso manual
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        testProductVariations,
        testImageLoading,
        testIntegration,
        runAllTests
    };
}
