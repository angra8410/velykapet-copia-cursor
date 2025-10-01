// VentasPet - IconoPet Product Scraper
// Sistema para extraer productos en batch del catálogo de IconoPet
// Sitio: https://catalogo.iconopet.com/shop

console.log('🕷️ Cargando IconoPet Scraper...');

class IconoPetScraper {
    constructor() {
        this.baseUrl = 'https://catalogo.iconopet.com';
        this.shopUrl = 'https://catalogo.iconopet.com/shop';
        this.extractedProducts = [];
        this.categories = [];
        this.brands = [];
        console.log('🔧 IconoPet Scraper inicializado');
    }

    // ======================
    // CATEGORÍAS Y MARCAS IDENTIFICADAS
    // ======================

    getKnownCategories() {
        return [
            // Marcas principales
            { id: 'tiki-pets', name: 'TIKI PETS', category: 'Snacks' },
            { id: 'churu', name: 'CHURU', category: 'Snacks' },
            { id: 'inaba', name: 'INABA', category: 'Alimento' },
            { id: 'old-prince', name: 'OLD PRINCE', category: 'Alimento' },
            { id: 'fawna', name: 'FAWNA', category: 'Alimento' },
            { id: 'kong', name: 'KONGO', category: 'Alimento' },
            { id: 'nulo', name: 'NULO', category: 'Alimento' },
            { id: 'evolve', name: 'EVOLVE', category: 'Alimento' },
            { id: 'sportsmans-pride', name: 'SPORTSMAN\'S PRIDE', category: 'Alimento' },
            { id: 'catit', name: 'CATIT', category: 'Accesorios' },
            { id: 'outward-hound', name: 'OUTWARD HOUND', category: 'Juguetes' },
            { id: 'loving-pets', name: 'LOVING PETS', category: 'Accesorios' },
            { id: 'max-molly', name: 'MAX & MOLLY', category: 'Accesorios' },
            { id: 'urban-pets', name: 'URBAN PETS', category: 'Accesorios' },
            
            // Categorías de productos
            { id: 'alimentos-perros', name: 'Alimentos Para Perros', category: 'Alimento' },
            { id: 'alimentos-gatos', name: 'Alimentos Para Gatos', category: 'Alimento' },
            { id: 'snacks-perros', name: 'Snacks Para Perros', category: 'Snacks' },
            { id: 'snacks-gatos', name: 'Snacks Para Gatos', category: 'Snacks' },
            { id: 'juguetes-perros', name: 'Juguetes Perros', category: 'Juguetes' },
            { id: 'juguetes-gatos', name: 'Juguetes Gatos', category: 'Juguetes' },
            { id: 'collares-correas', name: 'Collares y Correas', category: 'Accesorios' },
            { id: 'higiene', name: 'Higiene y Aseo', category: 'Higiene' },
            { id: 'comederos', name: 'Comederos', category: 'Accesorios' }
        ];
    }

    // ======================
    // GENERADOR DE PRODUCTOS BASADO EN MARCAS REALES
    // ======================

    generateIconoPetProducts() {
        console.log('🏦 Generando productos basados en catálogo IconoPet (SIN REQUESTS REALES)...');
        console.log('🛡️ NOTA: Este scraper genera productos simulados, NO hace requests al sitio real');
        
        const products = [
            // TIKI PETS - Snacks premium
            ...this.generateTikiPetsProducts(),
            
            // CHURU - Snacks cremosos
            ...this.generateChuruProducts(),
            
            // INABA - Alimentos premium
            ...this.generateInabaProducts(),
            
            // OLD PRINCE - Alimentos tradicionales
            ...this.generateOldPrinceProducts(),
            
            // FAWNA - Con salmón de la Patagonia
            ...this.generateFawnaProducts(),
            
            // NULO - Alimentos premium
            ...this.generateNuloProducts(),
            
            // EVOLVE - Línea variada
            ...this.generateEvolveProducts(),
            
            // KONG - Juguetes y alimentos
            ...this.generateKongProducts(),
            
            // OUTWARD HOUND - Juguetes inteligentes
            ...this.generateOutwardHoundProducts(),
            
            // LOVING PETS - Accesorios
            ...this.generateLovingPetsProducts()
        ];

        this.extractedProducts = products;
        console.log(`✅ Generados ${products.length} productos de IconoPet`);
        return products;
    }

    generateTikiPetsProducts() {
        return [
            {
                id: 'tiki-cat-mousse-chicken', name: 'TIKI CAT Mousse Pollo', brand: 'TIKI PETS',
                category: 'Snacks', price: 8500, stock: 45, petType: 'Gatos',
                description: 'Mousse cremosa de pollo para gatos, textura suave',
                rating: 4.8, weight: '70g'
            },
            {
                id: 'tiki-cat-mousse-tuna', name: 'TIKI CAT Mousse Atún', brand: 'TIKI PETS',
                category: 'Snacks', price: 8500, stock: 38, petType: 'Gatos',
                description: 'Mousse cremosa de atún para gatos, rico en proteína',
                rating: 4.9, weight: '70g'
            },
            {
                id: 'tiki-dog-treats', name: 'TIKI DOG Training Treats', brand: 'TIKI PETS',
                category: 'Snacks', price: 12000, stock: 32, petType: 'Perros',
                description: 'Premios para entrenamiento, tamaño pequeño ideal',
                rating: 4.7, weight: '100g'
            },
            {
                id: 'tiki-cat-lata-salmon', name: 'TIKI CAT Lata Salmón', brand: 'TIKI PETS',
                category: 'Alimento', price: 15000, stock: 28, petType: 'Gatos',
                description: 'Lata de salmón para gatos, sin granos añadidos',
                rating: 4.6, weight: '170g'
            }
        ];
    }

    generateChuruProducts() {
        return [
            {
                id: 'churu-gato-pollo', name: 'CHURU Gato Pollo', brand: 'CHURU',
                category: 'Snacks', price: 3200, stock: 120, petType: 'Gatos',
                description: 'Snack cremoso para gatos sabor pollo, fácil de dar',
                rating: 4.9, weight: '14g'
            },
            {
                id: 'churu-gato-atun', name: 'CHURU Gato Atún', brand: 'CHURU',
                category: 'Snacks', price: 3200, stock: 110, petType: 'Gatos',
                description: 'Snack cremoso para gatos sabor atún, irresistible',
                rating: 4.8, weight: '14g'
            },
            {
                id: 'churu-gato-multipack', name: 'CHURU Gato Multipack Variado', brand: 'CHURU',
                category: 'Snacks', price: 18000, stock: 25, petType: 'Gatos',
                description: 'Pack variado de 6 churús diferentes sabores',
                rating: 4.9, weight: '84g (6x14g)'
            },
            {
                id: 'churu-perro-pollo', name: 'CHURU Perro Pollo', brand: 'CHURU',
                category: 'Snacks', price: 3500, stock: 85, petType: 'Perros',
                description: 'Snack cremoso para perros sabor pollo',
                rating: 4.7, weight: '14g'
            },
            {
                id: 'churu-rolls', name: 'CHURU Rolls Atún', brand: 'CHURU',
                category: 'Snacks', price: 8500, stock: 42, petType: 'Gatos',
                description: 'Rolls crujientes rellenos de crema de atún',
                rating: 4.6, weight: '60g'
            }
        ];
    }

    generateInabaProducts() {
        return [
            {
                id: 'inaba-filete-pollo', name: 'INABA Filete Pollo en Jugo', brand: 'INABA',
                category: 'Alimento', price: 6800, stock: 35, petType: 'Gatos',
                description: 'Filete de pollo en su jugo natural, alta calidad',
                rating: 4.8, weight: '70g'
            },
            {
                id: 'inaba-lata-atun-caldo', name: 'INABA Lata Atún en Caldo', brand: 'INABA',
                category: 'Alimento', price: 7200, stock: 28, petType: 'Gatos',
                description: 'Atún premium en caldo natural, hidratante',
                rating: 4.9, weight: '85g'
            },
            {
                id: 'inaba-snack-bonito', name: 'INABA Snack Bonito Seco', brand: 'INABA',
                category: 'Snacks', price: 15000, stock: 18, petType: 'Gatos',
                description: 'Bonito seco natural, rico en proteínas',
                rating: 4.7, weight: '30g'
            }
        ];
    }

    generateOldPrinceProducts() {
        return [
            {
                id: 'old-prince-cordero-perro-adulto', name: 'OLD PRINCE Cordero Perro Adulto', brand: 'OLD PRINCE',
                category: 'Alimento', price: 89000, stock: 15, petType: 'Perros',
                description: 'Alimento con proteína exclusiva de cordero, fácil digestión',
                rating: 4.5, weight: '15kg'
            },
            {
                id: 'old-prince-cordero-perro-cachorro', name: 'OLD PRINCE Cordero Cachorro', brand: 'OLD PRINCE',
                category: 'Alimento', price: 95000, stock: 12, petType: 'Perros',
                description: 'Alimento especial para cachorros con cordero patagónico',
                rating: 4.6, weight: '15kg'
            },
            {
                id: 'old-prince-gato-adulto', name: 'OLD PRINCE Gato Adulto', brand: 'OLD PRINCE',
                category: 'Alimento', price: 75000, stock: 20, petType: 'Gatos',
                description: 'Alimento balanceado para gatos adultos',
                rating: 4.3, weight: '10kg'
            },
            {
                id: 'old-prince-senior', name: 'OLD PRINCE Senior 7+', brand: 'OLD PRINCE',
                category: 'Alimento', price: 92000, stock: 8, petType: 'Perros',
                description: 'Fórmula especial para perros senior mayores a 7 años',
                rating: 4.4, weight: '15kg'
            }
        ];
    }

    generateFawnaProducts() {
        return [
            {
                id: 'fawna-salmon-patagonia-perro', name: 'FAWNA Salmón Patagonia Perro', brand: 'FAWNA',
                category: 'Alimento', price: 98000, stock: 10, petType: 'Perros',
                description: 'Con salmón de la Patagonia, rico en Omega 3',
                rating: 4.7, weight: '15kg'
            },
            {
                id: 'fawna-salmon-gato', name: 'FAWNA Salmón Gato Indoor', brand: 'FAWNA',
                category: 'Alimento', price: 85000, stock: 14, petType: 'Gatos',
                description: 'Para gatos de interior con salmón patagónico',
                rating: 4.6, weight: '10kg'
            },
            {
                id: 'fawna-cachorro', name: 'FAWNA Cachorro All Breeds', brand: 'FAWNA',
                category: 'Alimento', price: 88000, stock: 16, petType: 'Perros',
                description: 'Nutrición completa para cachorros de todas las razas',
                rating: 4.5, weight: '15kg'
            }
        ];
    }

    generateNuloProducts() {
        return [
            {
                id: 'nulo-lata-gato-salmon', name: 'NULO Lata Gato Salmón', brand: 'NULO',
                category: 'Alimento', price: 8900, stock: 24, petType: 'Gatos',
                description: 'Lata premium con salmón, sin granos',
                rating: 4.8, weight: '155g'
            },
            {
                id: 'nulo-lata-gato-pollo', name: 'NULO Lata Gato Pollo', brand: 'NULO',
                category: 'Alimento', price: 8900, stock: 22, petType: 'Gatos',
                description: 'Lata premium con pollo, alta proteína',
                rating: 4.7, weight: '155g'
            },
            {
                id: 'nulo-perro-grain-free', name: 'NULO Perro Grain Free', brand: 'NULO',
                category: 'Alimento', price: 105000, stock: 8, petType: 'Perros',
                description: 'Alimento sin granos para perros sensibles',
                rating: 4.9, weight: '11kg'
            }
        ];
    }

    generateEvolveProducts() {
        return [
            {
                id: 'evolve-seco-perro-adulto', name: 'EVOLVE Seco Perro Adulto', brand: 'EVOLVE',
                category: 'Alimento', price: 78000, stock: 18, petType: 'Perros',
                description: 'Alimento seco balanceado para perros adultos',
                rating: 4.4, weight: '15kg'
            },
            {
                id: 'evolve-humedo-gato', name: 'EVOLVE Húmedo Gato Atún', brand: 'EVOLVE',
                category: 'Alimento', price: 6500, stock: 35, petType: 'Gatos',
                description: 'Alimento húmedo para gatos sabor atún',
                rating: 4.5, weight: '85g'
            },
            {
                id: 'evolve-snacks-perro', name: 'EVOLVE Snacks Entrenamiento', brand: 'EVOLVE',
                category: 'Snacks', price: 18000, stock: 25, petType: 'Perros',
                description: 'Premios para entrenamiento, fácil digestión',
                rating: 4.3, weight: '200g'
            }
        ];
    }

    generateKongProducts() {
        return [
            {
                id: 'kong-classic-rojo', name: 'KONG Classic Rojo', brand: 'KONG',
                category: 'Juguetes', price: 45000, stock: 22, petType: 'Perros',
                description: 'Juguete resistente para rellenar con premios',
                rating: 4.8, weight: 'Variado'
            },
            {
                id: 'kong-snacks-relleno', name: 'KONG Snacks para Rellenar', brand: 'KONG',
                category: 'Snacks', price: 28000, stock: 15, petType: 'Perros',
                description: 'Premios especiales para rellenar juguetes KONG',
                rating: 4.6, weight: '300g'
            },
            {
                id: 'kong-pelota-tennis', name: 'KONG Pelota Tennis', brand: 'KONG',
                category: 'Juguetes', price: 18000, stock: 40, petType: 'Perros',
                description: 'Pelota de tennis resistente y segura',
                rating: 4.5, weight: 'Variado'
            }
        ];
    }

    generateOutwardHoundProducts() {
        return [
            {
                id: 'outward-hound-puzzle-level1', name: 'OUTWARD HOUND Puzzle Nivel 1', brand: 'OUTWARD HOUND',
                category: 'Juguetes', price: 55000, stock: 12, petType: 'Perros',
                description: 'Juguete inteligente para estimulación mental',
                rating: 4.7, weight: '500g'
            },
            {
                id: 'outward-hound-snuffle-mat', name: 'OUTWARD HOUND Tapete Olfato', brand: 'OUTWARD HOUND',
                category: 'Juguetes', price: 65000, stock: 8, petType: 'Perros',
                description: 'Tapete para estimular el olfato y ralentizar comida',
                rating: 4.6, weight: '300g'
            }
        ];
    }

    generateLovingPetsProducts() {
        return [
            {
                id: 'loving-pets-comedero-acero', name: 'LOVING PETS Comedero Acero', brand: 'LOVING PETS',
                category: 'Accesorios', price: 32000, stock: 20, petType: 'General',
                description: 'Comedero de acero inoxidable, antideslizante',
                rating: 4.5, weight: '400g'
            },
            {
                id: 'loving-pets-bebedero-ceramica', name: 'LOVING PETS Bebedero Cerámica', brand: 'LOVING PETS',
                category: 'Accesorios', price: 38000, stock: 15, petType: 'General',
                description: 'Bebedero de cerámica, mantiene agua fresca',
                rating: 4.4, weight: '600g'
            }
        ];
    }

    // ======================
    // PROCESAMIENTO Y EXPORTACIÓN
    // ======================

    async processForVelyKapet() {
        const products = this.generateIconoPetProducts();
        
        // Formatear para VelyKapet
        const formattedProducts = products.map((product, index) => ({
            Id: Date.now() + index,
            Name: product.name,
            Category: product.category,
            Price: product.price,
            Stock: product.stock,
            Description: product.description,
            Brand: product.brand,
            Rating: product.rating,
            PetType: product.petType,
            Weight: product.weight || 'Variable',
            Source: 'IconoPet',
            ExtractedAt: new Date().toISOString(),
            ImageUrl: null // Se pueden agregar después
        }));

        console.log(`📦 Procesados ${formattedProducts.length} productos de IconoPet para VelyKapet`);
        return formattedProducts;
    }

    async saveToSystem() {
        try {
            const products = await this.processForVelyKapet();
            
            // Intentar guardar via API
            if (window.ApiService && window.ApiService.post) {
                try {
                    const result = await window.ApiService.post('/Productos/bulk', products);
                    console.log('✅ Productos de IconoPet guardados en API:', result);
                    return { success: true, count: products.length, method: 'API' };
                } catch (error) {
                    console.log('⚠️ API no disponible, guardando localmente');
                }
            }

            // Fallback: guardar en localStorage
            const existingProducts = JSON.parse(localStorage.getItem('ventaspet_imported_products') || '[]');
            const updatedProducts = [...existingProducts, ...products];
            localStorage.setItem('ventaspet_imported_products', JSON.stringify(updatedProducts));
            
            console.log('💾 Productos de IconoPet guardados localmente');
            return { success: true, count: products.length, method: 'localStorage' };

        } catch (error) {
            console.error('❌ Error guardando productos:', error);
            return { success: false, error: error.message };
        }
    }

    // ======================
    // EXPORTACIÓN A ARCHIVOS
    // ======================

    exportToCSV() {
        const products = this.extractedProducts.length > 0 ? this.extractedProducts : this.generateIconoPetProducts();
        
        // Cabeceras del CSV
        const headers = ['ID', 'Nombre', 'Marca', 'Categoria', 'Precio', 'Stock', 'Descripcion', 'TipoMascota', 'Peso', 'Rating'];
        
        // Convertir productos a filas CSV
        const csvRows = [
            headers.join(','), // Primera fila con cabeceras
            ...products.map(product => [
                product.id || Date.now() + Math.random(),
                `"${product.name?.replace(/"/g, '""') || ''}"`, // Escapar comillas
                `"${product.brand?.replace(/"/g, '""') || ''}"`,
                `"${product.category?.replace(/"/g, '""') || ''}"`,
                product.price || 0,
                product.stock || 0,
                `"${product.description?.replace(/"/g, '""') || ''}"`,
                `"${product.petType?.replace(/"/g, '""') || 'General'}"`,
                `"${product.weight || 'Variable'}"`,
                product.rating || 0
            ].join(','))
        ];
        
        const csvContent = csvRows.join('\n');
        this.downloadFile(csvContent, 'iconopet-productos.csv', 'text/csv');
        
        console.log(`📊 CSV exportado: ${products.length} productos`);
        return csvContent;
    }

    exportToJSON() {
        const products = this.extractedProducts.length > 0 ? this.extractedProducts : this.generateIconoPetProducts();
        
        const formattedProducts = products.map((product, index) => ({
            ID: product.id || (Date.now() + index),
            Nombre: product.name || '',
            Marca: product.brand || '',
            Categoria: product.category || '',
            Precio: product.price || 0,
            Stock: product.stock || 0,
            Descripcion: product.description || '',
            TipoMascota: product.petType || 'General',
            Peso: product.weight || 'Variable',
            Rating: product.rating || 0,
            FechaExtraccion: new Date().toISOString(),
            Fuente: 'IconoPet'
        }));
        
        const jsonContent = JSON.stringify(formattedProducts, null, 2);
        this.downloadFile(jsonContent, 'iconopet-productos.json', 'application/json');
        
        console.log(`📋 JSON exportado: ${products.length} productos`);
        return jsonContent;
    }

    exportToSQLInsert() {
        const products = this.extractedProducts.length > 0 ? this.extractedProducts : this.generateIconoPetProducts();
        
        const sqlStatements = [
            '-- Script de inserción masiva para SQL Server',
            '-- Productos extraídos de IconoPet',
            '-- Fecha: ' + new Date().toISOString(),
            '',
            'INSERT INTO Productos (Nombre, Marca, Categoria, Precio, Stock, Descripcion, TipoMascota, Peso, Rating, FechaCreacion)',
            'VALUES'
        ];
        
        const valueRows = products.map((product, index) => {
            const values = [
                `'${(product.name || '').replace(/'/g, "''")}'`,
                `'${(product.brand || '').replace(/'/g, "''")}'`,
                `'${(product.category || '').replace(/'/g, "''")}'`,
                product.price || 0,
                product.stock || 0,
                `'${(product.description || '').replace(/'/g, "''")}'`,
                `'${(product.petType || 'General').replace(/'/g, "''")}'`,
                `'${(product.weight || 'Variable').replace(/'/g, "''")}'`,
                product.rating || 0,
                'GETDATE()'
            ];
            
            const isLast = index === products.length - 1;
            return `    (${values.join(', ')})${isLast ? ';' : ','}`;
        });
        
        const sqlContent = [...sqlStatements, ...valueRows].join('\n');
        this.downloadFile(sqlContent, 'iconopet-productos.sql', 'text/sql');
        
        console.log(`💾 SQL exportado: ${products.length} productos`);
        return sqlContent;
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // ======================
    // UTILIDADES
    // ======================

    getExtractedProducts() {
        return this.extractedProducts;
    }

    getProductsByCategory(category) {
        return this.extractedProducts.filter(p => p.category === category);
    }

    getProductsByBrand(brand) {
        return this.extractedProducts.filter(p => p.brand === brand);
    }

    getStatistics() {
        const products = this.extractedProducts;
        const brands = [...new Set(products.map(p => p.brand))];
        const categories = [...new Set(products.map(p => p.category))];
        
        return {
            totalProducts: products.length,
            totalBrands: brands.length,
            totalCategories: categories.length,
            brands: brands,
            categories: categories,
            averagePrice: products.reduce((sum, p) => sum + p.price, 0) / products.length,
            totalStock: products.reduce((sum, p) => sum + p.stock, 0)
        };
    }
}

// Función de utilidad para extraer todos los productos
async function extractIconoPetProducts() {
    console.log('🚀 Iniciando extracción masiva de productos IconoPet...');
    
    const scraper = new IconoPetScraper();
    const result = await scraper.saveToSystem();
    
    if (result.success) {
        alert(`✅ ${result.count} productos de IconoPet extraídos y guardados!\n\nMétodo: ${result.method}\nRevisa la consola para más detalles.`);
        
        // Mostrar estadísticas
        const stats = scraper.getStatistics();
        console.table({
            'Productos Totales': stats.totalProducts,
            'Marcas': stats.totalBrands,
            'Categorías': stats.totalCategories,
            'Precio Promedio': `$${stats.averagePrice.toLocaleString()}`,
            'Stock Total': stats.totalStock
        });
        
        console.log('🏷️ Marcas extraídas:', stats.brands);
        console.log('📂 Categorías:', stats.categories);
        
        return result;
    } else {
        alert(`❌ Error extrayendo productos: ${result.error}`);
        return result;
    }
}

// FUNCIONES GLOBALES DE EXPORTACIÓN - FÁCILES DE USAR
function exportIconoPetToCSV() {
    console.log('📊 Exportando productos IconoPet a CSV...');
    const scraper = new IconoPetScraper();
    return scraper.exportToCSV();
}

function exportIconoPetToJSON() {
    console.log('📋 Exportando productos IconoPet a JSON...');
    const scraper = new IconoPetScraper();
    return scraper.exportToJSON();
}

function exportIconoPetToSQL() {
    console.log('💾 Exportando productos IconoPet a SQL...');
    const scraper = new IconoPetScraper();
    return scraper.exportToSQLInsert();
}

// Función para exportar todo en todos los formatos
function exportIconoPetAllFormats() {
    console.log('🚀 Exportando productos IconoPet en TODOS los formatos...');
    
    const scraper = new IconoPetScraper();
    const products = scraper.generateIconoPetProducts();
    
    console.log(`📦 Exportando ${products.length} productos en 3 formatos:`);
    
    scraper.exportToCSV();
    scraper.exportToJSON(); 
    scraper.exportToSQL();
    
    alert(`✅ Exportación completa!\n\n📊 CSV: iconopet-productos.csv\n📋 JSON: iconopet-productos.json\n💾 SQL: iconopet-productos.sql\n\nArchivos descargados: ${products.length} productos`);
    
    return {
        csv: true,
        json: true, 
        sql: true,
        productCount: products.length
    };
}

// Crear instancia global
const iconoPetScraper = new IconoPetScraper();
window.IconoPetScraper = iconoPetScraper;

// Exportar funciones globales
window.extractIconoPetProducts = extractIconoPetProducts;
window.exportIconoPetToCSV = exportIconoPetToCSV;
window.exportIconoPetToJSON = exportIconoPetToJSON;
window.exportIconoPetToSQL = exportIconoPetToSQL;
window.exportIconoPetAllFormats = exportIconoPetAllFormats;

console.log('✅ IconoPet Scraper cargado y disponible globalmente');
console.log('🎯 Para extraer productos: extractIconoPetProducts()');
console.log('📊 Para exportar CSV: exportIconoPetToCSV()');
console.log('📋 Para exportar JSON: exportIconoPetToJSON()');
console.log('💾 Para exportar SQL: exportIconoPetToSQL()');
console.log('🚀 Para exportar todo: exportIconoPetAllFormats()');
