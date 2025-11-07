// VentasPet - Categories Data
// Data for the 3 main homepage category cards

/**
 * Categories configuration
 * Each category includes:
 * - baseImage: base name for image files (without dimension suffix)
 * - category: category display name
 * - subtitle: descriptive subtitle
 * - color: background color for the card
 * - fit: 'cover' or 'contain' for image object-fit
 * - alt: descriptive alt text for accessibility
 */

const categories = [
    {
        id: 'alimento',
        baseImage: 'imagen01-alimento',
        category: 'Alimento',
        subtitle: 'Nutrición premium para tu mascota',
        color: '#FF6B6B', // Warm red/coral
        fit: 'cover', // Use cover to fill the space nicely
        alt: 'Alimento premium para perros y gatos con ingredientes naturales'
    },
    {
        id: 'salud-bienestar',
        baseImage: 'imagen02-salud',
        category: 'Salud & Bienestar',
        subtitle: 'Cuidado integral para su salud',
        color: '#4ECDC4', // Teal/turquoise
        fit: 'contain', // Use contain to avoid cropping pets' ears/paws
        alt: 'Productos de salud y bienestar para el cuidado integral de mascotas'
    },
    {
        id: 'juguetes-accesorios',
        baseImage: 'imagen03-juguetes',
        category: 'Juguetes & Accesorios',
        subtitle: 'Diversión y estilo para tu compañero',
        color: '#95E1D3', // Soft mint green
        fit: 'contain', // Use contain to show full toys without cropping
        alt: 'Juguetes divertidos y accesorios elegantes para mascotas'
    }
];

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = categories;
}

// Make available globally for non-module scripts
if (typeof window !== 'undefined') {
    window.CATEGORY_DATA = categories;
}

console.log('✅ Categories data loaded:', categories.length, 'categories');
