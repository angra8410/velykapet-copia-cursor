// src/data/categories.js
// VentasPet - Categories Data (R2-hosted images)
// Data for the 3 main homepage category cards with absolute URLs to R2

/**
 * Each category includes:
 * - category: display name
 * - subtitle: descriptive subtitle
 * - color: background color for the card
 * - fit: 'cover' or 'contain' for image object-fit
 * - alt: descriptive alt text for accessibility
 * - img1x, img2x, thumb, og: absolute URLs (already uploaded to R2)
 */

const IMAGE_BASE = 'https://www.velykapet.com/velyka-gallery/gallery';

const categories = [
  {
    id: 'alimento',
    category: 'Alimento',
    subtitle: 'Nutrición premium para tu mascota',
    color: '#FF6B6B', // Warm red/coral
    fit: 'cover',
    alt: 'Alimento premium para perros y gatos con ingredientes naturales',
    // R2-hosted URLs (principal, retina, thumbnail, social-og)
    img1x: `${IMAGE_BASE}/principal/FOTO_PERRO_GATO_ALIMENTO.jpg`,
    img2x: `${IMAGE_BASE}/retina/FOTO_PERRO_GATO_ALIMENTO.jpg`,
    thumb: `${IMAGE_BASE}/miniatura/FOTO_PERRO_GATO_ALIMENTO.jpg`,
    og: `${IMAGE_BASE}/social-og/FOTO_PERRO_GATO_ALIMENTO.jpg`,
    href: '/productos/alimentos'
  },
  {
    id: 'salud-bienestar',
    category: 'Salud & Bienestar',
    subtitle: 'Cuidado integral para su salud',
    color: '#4ECDC4', // Teal/turquoise
    fit: 'contain',
    alt: 'Productos de salud y bienestar para el cuidado integral de mascotas',
    img1x: `${IMAGE_BASE}/principal/FOTO_PERRO_SALUD_Y_BIENESTAR.jpg`,
    img2x: `${IMAGE_BASE}/retina/FOTO_PERRO_SALUD_Y_BIENESTAR.jpg`,
    thumb: `${IMAGE_BASE}/miniatura/FOTO_PERRO_SALUD_Y_BIENESTAR.jpg`,
    og: `${IMAGE_BASE}/social-og/FOTO_PERRO_SALUD_Y_BIENESTAR.jpg`,
    href: '/productos/salud-bienestar'
  },
  {
    id: 'juguetes-accesorios',
    category: 'Juguetes & Accesorios',
    subtitle: 'Diversión y estilo para tu compañero',
    color: '#95E1D3', // Soft mint green
    fit: 'contain',
    alt: 'Juguetes divertidos y accesorios elegantes para mascotas',
    img1x: `${IMAGE_BASE}/principal/FOTO_PERRO_JUGUETES_Y_ACCESORIOS.jpg`,
    img2x: `${IMAGE_BASE}/retina/FOTO_PERRO_JUGUETES_Y_ACCESORIOS.jpg`,
    thumb: `${IMAGE_BASE}/miniatura/FOTO_PERRO_JUGUETES_Y_ACCESORIOS.jpg`,
    og: `${IMAGE_BASE}/social-og/FOTO_PERRO_JUGUETES_Y_ACCESORIOS.jpg`,
    href: '/productos/juguetes-accesorios'
  }
];

// Export for CommonJS environments (node)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = categories;
}

// Make available globally for non-module scripts (fallback)
if (typeof window !== 'undefined') {
  window.CATEGORY_DATA = categories;
}

console.log('✅ Categories data (R2 URLs) loaded:', categories.length, 'categories');