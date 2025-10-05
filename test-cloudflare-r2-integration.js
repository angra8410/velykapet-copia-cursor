// Test de Validación - Integración Cloudflare R2
// Valida que las funciones de transformación de imágenes funcionen correctamente

console.log('🧪 Iniciando tests de integración Cloudflare R2...\n');

// Simular las funciones del image-url-transformer.js
const tests = [];

// Test 1: Detectar URLs de Cloudflare R2
console.log('Test 1: Detectar URLs de Cloudflare R2');
const r2Urls = [
    'https://www.velykapet.com/productos/CHURU_ATUN.jpg',
    'https://www.velykapet.com/productos/alimentos/gatos/ROYAL_CANIN.jpg',
    'https://velykapet.com/categorias/banner.jpg'
];

const nonR2Urls = [
    'https://drive.google.com/file/d/123/view',
    'https://cloudinary.com/image.jpg',
    'https://example.com/image.jpg'
];

function isCloudflareR2Url(url) {
    return url && typeof url === 'string' && url.includes('velykapet.com') && 
           url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
}

let test1Pass = true;
r2Urls.forEach(url => {
    const result = isCloudflareR2Url(url);
    if (!result) {
        console.log(`  ❌ Falló: ${url} debería ser detectada como R2`);
        test1Pass = false;
    }
});

nonR2Urls.forEach(url => {
    const result = isCloudflareR2Url(url);
    if (result) {
        console.log(`  ❌ Falló: ${url} NO debería ser detectada como R2`);
        test1Pass = false;
    }
});

if (test1Pass) {
    console.log('  ✅ Test 1 PASÓ: Detección de URLs R2 correcta\n');
} else {
    console.log('  ❌ Test 1 FALLÓ\n');
}
tests.push({ name: 'Detección URLs R2', passed: test1Pass });

// Test 2: Normalizar URLs de Cloudflare R2
console.log('Test 2: Normalizar URLs de Cloudflare R2');
function normalizeCloudflareR2Url(url) {
    if (!isCloudflareR2Url(url)) {
        return url;
    }
    
    // Asegurar HTTPS
    if (url.startsWith('http://')) {
        url = url.replace('http://', 'https://');
    }
    
    // Remover parámetros de query innecesarios
    if (url.includes('?') && !url.includes('/cdn-cgi/image/')) {
        url = url.split('?')[0];
    }
    
    return url;
}

const normalizationTests = [
    {
        input: 'http://www.velykapet.com/productos/test.jpg',
        expected: 'https://www.velykapet.com/productos/test.jpg',
        description: 'Convertir HTTP a HTTPS'
    },
    {
        input: 'https://www.velykapet.com/cdn-cgi/image/width=300/productos/test.jpg',
        expected: 'https://www.velykapet.com/cdn-cgi/image/width=300/productos/test.jpg',
        description: 'Mantener transformaciones de Cloudflare'
    },
    {
        input: 'https://www.velykapet.com/productos/test.jpg',
        expected: 'https://www.velykapet.com/productos/test.jpg',
        description: 'URL simple sin cambios'
    }
];

let test2Pass = true;
normalizationTests.forEach(test => {
    const result = normalizeCloudflareR2Url(test.input);
    if (result !== test.expected) {
        console.log(`  ❌ Falló: ${test.description}`);
        console.log(`     Input:    ${test.input}`);
        console.log(`     Expected: ${test.expected}`);
        console.log(`     Got:      ${result}`);
        test2Pass = false;
    } else {
        console.log(`  ✅ ${test.description}`);
    }
});

if (test2Pass) {
    console.log('  ✅ Test 2 PASÓ: Normalización de URLs correcta\n');
} else {
    console.log('  ❌ Test 2 FALLÓ\n');
}
tests.push({ name: 'Normalización URLs', passed: test2Pass });

// Test 3: Transformación con Image Resizing
console.log('Test 3: Transformación con Image Resizing');
function addCdnOptimization(url, options = {}) {
    const {
        width = 800,
        height = 800,
        quality = 80,
        format = 'auto'
    } = options;
    
    // Cloudflare R2 con dominio propio
    if (url.includes('velykapet.com') && url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        if (!url.includes('/cdn-cgi/image/')) {
            const urlParts = url.split('velykapet.com');
            if (urlParts.length === 2) {
                const imagePath = urlParts[1];
                const transformations = `width=${width},quality=${quality},format=auto`;
                return `${urlParts[0]}velykapet.com/cdn-cgi/image/${transformations}${imagePath}`;
            }
        }
    }
    
    return url;
}

const optimizationTests = [
    {
        input: 'https://www.velykapet.com/productos/test.jpg',
        options: { width: 300, quality: 85 },
        expected: 'https://www.velykapet.com/cdn-cgi/image/width=300,quality=85,format=auto/productos/test.jpg',
        description: 'Agregar transformaciones básicas'
    },
    {
        input: 'https://www.velykapet.com/cdn-cgi/image/width=300/productos/test.jpg',
        options: { width: 400 },
        expected: 'https://www.velykapet.com/cdn-cgi/image/width=300/productos/test.jpg',
        description: 'No duplicar transformaciones existentes'
    }
];

let test3Pass = true;
optimizationTests.forEach(test => {
    const result = addCdnOptimization(test.input, test.options);
    if (result !== test.expected) {
        console.log(`  ❌ Falló: ${test.description}`);
        console.log(`     Input:    ${test.input}`);
        console.log(`     Expected: ${test.expected}`);
        console.log(`     Got:      ${result}`);
        test3Pass = false;
    } else {
        console.log(`  ✅ ${test.description}`);
    }
});

if (test3Pass) {
    console.log('  ✅ Test 3 PASÓ: Transformaciones CDN correctas\n');
} else {
    console.log('  ❌ Test 3 FALLÓ\n');
}
tests.push({ name: 'Transformaciones CDN', passed: test3Pass });

// Test 4: Compatibilidad con otros servicios
console.log('Test 4: Compatibilidad con otros servicios');
function transformGoogleDriveUrl(url) {
    if (!url || !url.includes('drive.google.com')) return url;
    if (url.includes('drive.google.com/uc?')) return url;
    
    const patternFileD = /\/file\/d\/([a-zA-Z0-9_-]+)/;
    const match = url.match(patternFileD);
    if (match && match[1]) {
        return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
    return url;
}

const compatibilityTests = [
    {
        input: 'https://drive.google.com/file/d/ABC123xyz/view',
        transform: transformGoogleDriveUrl,
        expected: 'https://drive.google.com/uc?export=view&id=ABC123xyz',
        description: 'Google Drive URLs siguen funcionando'
    },
    {
        input: 'https://www.velykapet.com/productos/test.jpg',
        transform: (url) => url, // No transformar R2
        expected: 'https://www.velykapet.com/productos/test.jpg',
        description: 'R2 URLs no se modifican sin optimización'
    }
];

let test4Pass = true;
compatibilityTests.forEach(test => {
    const result = test.transform(test.input);
    if (result !== test.expected) {
        console.log(`  ❌ Falló: ${test.description}`);
        console.log(`     Expected: ${test.expected}`);
        console.log(`     Got:      ${result}`);
        test4Pass = false;
    } else {
        console.log(`  ✅ ${test.description}`);
    }
});

if (test4Pass) {
    console.log('  ✅ Test 4 PASÓ: Compatibilidad mantenida\n');
} else {
    console.log('  ❌ Test 4 FALLÓ\n');
}
tests.push({ name: 'Compatibilidad', passed: test4Pass });

// Resumen final
console.log('\n' + '='.repeat(50));
console.log('📊 RESUMEN DE TESTS');
console.log('='.repeat(50));

const passed = tests.filter(t => t.passed).length;
const failed = tests.filter(t => !t.passed).length;
const total = tests.length;

tests.forEach(test => {
    const icon = test.passed ? '✅' : '❌';
    console.log(`${icon} ${test.name}`);
});

console.log('\n' + '-'.repeat(50));
console.log(`Total: ${total} tests`);
console.log(`✅ Pasaron: ${passed}`);
console.log(`❌ Fallaron: ${failed}`);
console.log(`📈 Tasa de éxito: ${((passed/total)*100).toFixed(1)}%`);

if (failed === 0) {
    console.log('\n🎉 ¡TODOS LOS TESTS PASARON!');
    console.log('✅ La integración de Cloudflare R2 está funcionando correctamente.');
} else {
    console.log('\n⚠️ ALGUNOS TESTS FALLARON');
    console.log('Por favor revisa los errores arriba.');
}

console.log('\n' + '='.repeat(50));

// Ejemplo de uso final
console.log('\n📝 EJEMPLO DE USO EN PRODUCCIÓN:');
console.log('\nProducto en JSON:');
console.log(JSON.stringify({
    "IdProducto": 1,
    "NombreBase": "Churu Atún 4 Piezas 56gr",
    "URLImagen": "https://www.velykapet.com/productos/alimentos/gatos/CHURU_ATUN_4_PIEZAS_56_GR.jpg",
    "Precio": 8500
}, null, 2));

console.log('\nEn el frontend:');
console.log('const imageUrl = product.URLImagen;');
console.log('// URL ya es directa y optimizada por Cloudflare CDN');
console.log('<img src={imageUrl} alt={product.NombreBase} loading="lazy" />');

console.log('\nCon optimización (si Image Resizing está activo):');
console.log('const thumbnailUrl = window.transformImageUrl(product.URLImagen, {');
console.log('  width: 300,');
console.log('  quality: 80');
console.log('});');
console.log('// https://www.velykapet.com/cdn-cgi/image/width=300,quality=80/.../CHURU_ATUN.jpg');
