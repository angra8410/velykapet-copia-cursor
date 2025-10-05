// Mock product data with Cloudflare R2 images for testing
// This file provides sample data to test image loading without backend

window.MOCK_PRODUCTS_WITH_R2_IMAGES = [
    {
        IdProducto: 1,
        NombreBase: "Churu Atún 4 Piezas 56gr",
        Descripcion: "Snack cremoso para gatos sabor atún, presentación 4 piezas de 56 gramos",
        NombreCategoria: "Snacks y Premios",
        TipoMascota: "Gatos",
        URLImagen: "https://www.velykapet.com/CHURU_ATUN_4_PIEZAS_56_GR.jpg",
        Activo: true,
        Variaciones: [
            {
                IdVariacion: 1,
                IdProducto: 1,
                Peso: "56 GR",
                Precio: 85.00,
                Stock: 50,
                Activa: true
            }
        ]
    },
    {
        IdProducto: 2,
        NombreBase: "Royal Canin Adult",
        Descripcion: "Alimento balanceado para perros adultos de todas las razas",
        NombreCategoria: "Alimento para Perros",
        TipoMascota: "Perros",
        URLImagen: "https://www.velykapet.com/ROYAL_CANIN_ADULT.jpg",
        Activo: true,
        Variaciones: [
            {
                IdVariacion: 2,
                IdProducto: 2,
                Peso: "3 KG",
                Precio: 450.00,
                Stock: 25,
                Activa: true
            }
        ]
    },
    {
        IdProducto: 3,
        NombreBase: "BR FOR CAT VET CONTROL DE PESO",
        Descripcion: "Alimento con balance adecuado de nutrientes que ayuda a controlar el peso de tu gato",
        NombreCategoria: "Alimento para Gatos",
        TipoMascota: "Gatos",
        URLImagen: "https://www.velykapet.com/BR_FOR_CAT_VET.jpg",
        Activo: true,
        Variaciones: [
            {
                IdVariacion: 3,
                IdProducto: 3,
                Peso: "500 GR",
                Precio: 204.00,
                Stock: 50,
                Activa: true
            }
        ]
    },
    {
        IdProducto: 4,
        NombreBase: "Hill's Science Diet Puppy",
        Descripcion: "Nutrición científicamente formulada para cachorros",
        NombreCategoria: "Alimento para Perros",
        TipoMascota: "Perros",
        URLImagen: "https://www.velykapet.com/HILLS_SCIENCE_DIET_PUPPY.jpg",
        Activo: true,
        Variaciones: [
            {
                IdVariacion: 4,
                IdProducto: 4,
                Peso: "2 KG",
                Precio: 380.00,
                Stock: 30,
                Activa: true
            }
        ]
    },
    {
        IdProducto: 5,
        NombreBase: "Purina Pro Plan Adult Cat",
        Descripcion: "Alimento completo y balanceado para gatos adultos",
        NombreCategoria: "Alimento para Gatos",
        TipoMascota: "Gatos",
        URLImagen: "https://www.velykapet.com/PURINA_PRO_PLAN_ADULT_CAT.jpg",
        Activo: true,
        Variaciones: [
            {
                IdVariacion: 5,
                IdProducto: 5,
                Peso: "1 KG",
                Precio: 185.00,
                Stock: 40,
                Activa: true
            }
        ]
    },
    {
        IdProducto: 6,
        NombreBase: "Snacks Naturales",
        Descripcion: "Premios naturales para perros y gatos",
        NombreCategoria: "Snacks y Premios",
        TipoMascota: "Ambos",
        URLImagen: "https://www.velykapet.com/SNACKS_NATURALES.jpg",
        Activo: true,
        Variaciones: [
            {
                IdVariacion: 6,
                IdProducto: 6,
                Peso: "200 GR",
                Precio: 85.00,
                Stock: 60,
                Activa: true
            }
        ]
    }
];

console.log('✅ Mock R2 product data loaded:', window.MOCK_PRODUCTS_WITH_R2_IMAGES.length, 'products');

// Function to use mock data instead of API
window.useMockProductsData = function() {
    console.log('🔄 Switching to mock R2 product data...');
    
    // Override the API service getProducts method
    if (window.ApiService) {
        const originalGetProducts = window.ApiService.getProducts.bind(window.ApiService);
        
        window.ApiService.getProducts = async function(filters = {}) {
            console.log('📦 Using MOCK product data with R2 images');
            
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            let products = [...window.MOCK_PRODUCTS_WITH_R2_IMAGES];
            
            // Apply filters if needed
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                products = products.filter(p => 
                    p.NombreBase.toLowerCase().includes(searchLower) ||
                    p.Descripcion.toLowerCase().includes(searchLower)
                );
            }
            
            if (filters.category) {
                products = products.filter(p => 
                    p.NombreCategoria.toLowerCase().includes(filters.category.toLowerCase())
                );
            }
            
            if (filters.petType) {
                products = products.filter(p => 
                    p.TipoMascota === filters.petType || p.TipoMascota === 'Ambos'
                );
            }
            
            console.log('✅ Returning', products.length, 'mock products');
            return products;
        };
        
        console.log('✅ Mock data enabled. Reload the page to use mock products with R2 images.');
        console.log('💡 To restore API: reload the page or call location.reload()');
    } else {
        console.error('❌ ApiService not found. Load this script after api.js');
    }
};

console.log('💡 To use mock data with R2 images, call: window.useMockProductsData()');
