// Demo data para probar las variaciones de productos sin necesidad de backend
// Este archivo puede ser usado para desarrollo y testing del frontend

window.DEMO_PRODUCTS = [
    {
        IdProducto: 1,
        NombreBase: "BR FOR CAT VET CONTROL DE PESO",
        Descripcion: "Alimento con un balance adecuado de nutrientes que ayuda a reducir la formación de bolas de pelo, brindándole máxima protección de piel y pelaje.",
        NombreCategoria: "Alimento para Gatos",
        TipoMascota: "Gatos",
        URLImagen: "https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=500&q=80",
        Activo: true,
        Variaciones: [
            {
                IdVariacion: 1,
                IdProducto: 1,
                Peso: "500 GR",
                Precio: 20400,
                Stock: 50,
                Activa: true
            },
            {
                IdVariacion: 2,
                IdProducto: 1,
                Peso: "1.5 KG",
                Precio: 58200,
                Stock: 30,
                Activa: true
            },
            {
                IdVariacion: 3,
                IdProducto: 1,
                Peso: "3 KG",
                Precio: 110800,
                Stock: 20,
                Activa: true
            }
        ]
    }
];

// Función para cargar los productos demo en lugar de hacer llamadas al backend
window.loadDemoProducts = function() {
    console.log('📦 Cargando productos DEMO para testing...');
    return Promise.resolve(window.DEMO_PRODUCTS);
};

console.log('✅ Demo data cargado - Use window.loadDemoProducts() para obtener los productos');
console.log('📊 Productos demo disponibles:', window.DEMO_PRODUCTS.length);
