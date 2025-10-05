// Debug utility for image loading
// This script adds console logging to track image URL processing

console.log('🔍 Loading Image Loading Debugger...');

// Intercept and log image URLs being processed
const originalTransformImageUrl = window.transformImageUrl;

if (originalTransformImageUrl) {
    window.transformImageUrl = function(url, options = {}) {
        console.log('🖼️ transformImageUrl called:', {
            input: url,
            options: options,
            type: typeof url
        });
        
        const result = originalTransformImageUrl.call(this, url, options);
        
        console.log('🖼️ transformImageUrl result:', {
            output: result,
            changed: url !== result
        });
        
        return result;
    };
    console.log('✅ Image URL transformer intercepted for debugging');
}

// Helper to debug product data
window.debugProductImages = function(products) {
    console.log('🔍 === DEBUGGING PRODUCT IMAGES ===');
    console.log('Total products:', products.length);
    
    products.forEach((product, index) => {
        console.log(`\n📦 Product ${index + 1}:`, {
            IdProducto: product.IdProducto,
            NombreBase: product.NombreBase,
            URLImagen: product.URLImagen,
            hasURLImagen: !!product.URLImagen,
            URLImagenType: typeof product.URLImagen,
            allImageFields: {
                image: product.image,
                ImageUrl: product.ImageUrl,
                URLImagen: product.URLImagen,
                imageUrl: product.imageUrl
            }
        });
    });
    
    const productsWithImages = products.filter(p => p.URLImagen && p.URLImagen.trim() !== '');
    const productsWithoutImages = products.filter(p => !p.URLImagen || p.URLImagen.trim() === '');
    
    console.log('\n📊 Summary:');
    console.log(`✅ Products with URLImagen: ${productsWithImages.length}`);
    console.log(`❌ Products without URLImagen: ${productsWithoutImages.length}`);
    
    if (productsWithImages.length > 0) {
        console.log('\n✅ Products with images:');
        productsWithImages.forEach(p => {
            console.log(`  - ${p.NombreBase}: ${p.URLImagen}`);
        });
    }
    
    if (productsWithoutImages.length > 0) {
        console.log('\n❌ Products without images:');
        productsWithoutImages.forEach(p => {
            console.log(`  - ${p.NombreBase} (ID: ${p.IdProducto})`);
        });
    }
};

console.log('✅ Image Loading Debugger loaded');
console.log('💡 Use window.debugProductImages(products) to debug product image data');
