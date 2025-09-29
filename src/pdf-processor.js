// VentasPet - PDF Product Processor
// Sistema para procesar catálogos en PDF y extraer productos

console.log('📄 Cargando PDF Product Processor...');

class PDFProductProcessor {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3333/api';
        this.supportedFormats = ['pdf', 'docx', 'xlsx', 'csv'];
        console.log('🔧 PDF Processor inicializado');
    }

    // ======================
    // PROCESAMIENTO DE PDF
    // ======================

    async processPDFCatalog(file, options = {}) {
        console.log('📄 Iniciando procesamiento de catálogo PDF:', file.name);
        
        try {
            // Validar archivo
            if (!this.isValidFile(file)) {
                throw new Error('Formato de archivo no soportado');
            }

            // Configuración por defecto
            const config = {
                category: options.category || 'Alimento',
                petType: options.petType || 'General',
                brand: options.brand || 'Desconocida',
                extractImages: options.extractImages || false,
                ...options
            };

            console.log('⚙️ Configuración:', config);

            // Procesar archivo según tipo
            let extractedData;
            if (file.type === 'application/pdf') {
                extractedData = await this.extractFromPDF(file, config);
            } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
                extractedData = await this.extractFromExcel(file, config);
            } else if (file.name.endsWith('.csv')) {
                extractedData = await this.extractFromCSV(file, config);
            } else {
                throw new Error('Tipo de archivo no soportado');
            }

            console.log(`✅ Extraídos ${extractedData.length} productos del archivo`);
            return {
                success: true,
                products: extractedData,
                totalProducts: extractedData.length,
                source: file.name,
                processedAt: new Date().toISOString()
            };

        } catch (error) {
            console.error('❌ Error procesando PDF:', error);
            return {
                success: false,
                error: error.message,
                products: [],
                totalProducts: 0
            };
        }
    }

    // ======================
    // VALIDACIÓN DE ARCHIVOS
    // ======================

    isValidFile(file) {
        const validTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
            'text/csv'
        ];
        
        const hasValidType = validTypes.includes(file.type);
        const hasValidExtension = this.supportedFormats.some(format => file.name.toLowerCase().endsWith(format));
        
        return hasValidType || hasValidExtension;
    }

    // ======================
    // EXTRACCIÓN DESDE PDF (SIMULADO)
    // ======================

    async extractFromPDF(file, config) {
        console.log('📄 Extrayendo datos de PDF...');
        
        // Simulación de extracción de PDF
        // En una implementación real, usarías librerías como PDF.js o PDFParser
        
        // Datos de ejemplo que simularían la extracción de un catálogo real
        const simulatedProducts = [
            {
                name: 'Royal Canin Adult Medium Dog',
                category: config.category,
                price: 89000,
                stock: 25,
                brand: 'Royal Canin',
                description: 'Alimento balanceado para perros adultos de raza mediana',
                petType: 'Perros',
                weight: '15kg',
                age: 'Adulto',
                size: 'Mediano'
            },
            {
                name: 'Hills Science Diet Cat Indoor',
                category: config.category,
                price: 95000,
                stock: 18,
                brand: 'Hills',
                description: 'Alimento premium para gatos de interior',
                petType: 'Gatos',
                weight: '7.5kg',
                age: 'Adulto',
                size: 'N/A'
            },
            {
                name: 'Pro Plan Puppy Small Breed',
                category: config.category,
                price: 75000,
                stock: 30,
                brand: 'Pro Plan',
                description: 'Alimento especial para cachorros de razas pequeñas',
                petType: 'Perros',
                weight: '7.5kg',
                age: 'Cachorro',
                size: 'Pequeño'
            },
            {
                name: 'Whiskas Adult Tuna Flavor',
                category: config.category,
                price: 25000,
                stock: 50,
                brand: 'Whiskas',
                description: 'Alimento húmedo para gatos adultos sabor atún',
                petType: 'Gatos',
                weight: '400g',
                age: 'Adulto',
                size: 'N/A'
            },
            {
                name: 'Pedigree Adult Complete Nutrition',
                category: config.category,
                price: 45000,
                stock: 35,
                brand: 'Pedigree',
                description: 'Nutrición completa para perros adultos',
                petType: 'Perros',
                weight: '10kg',
                age: 'Adulto',
                size: 'Mediano'
            }
        ];

        // Simular tiempo de procesamiento
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        return simulatedProducts.map((product, index) => ({
            id: Date.now() + index,
            name: product.name,
            category: product.category,
            price: product.price,
            stock: product.stock,
            description: product.description,
            brand: product.brand,
            petType: product.petType,
            specifications: {
                weight: product.weight,
                age: product.age,
                size: product.size
            },
            rating: (Math.random() * 1.5 + 3.5).toFixed(1), // Rating entre 3.5 y 5.0
            extractedFrom: 'PDF',
            extractedAt: new Date().toISOString()
        }));
    }

    // ======================
    // EXTRACCIÓN DESDE EXCEL
    // ======================

    async extractFromExcel(file, config) {
        console.log('📊 Extrayendo datos de Excel...');
        
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                try {
                    // Simular lectura de Excel
                    // En una implementación real, usarías librerías como SheetJS
                    
                    const simulatedExcelData = [
                        ['Nombre', 'Precio', 'Stock', 'Marca', 'Descripción'],
                        ['Alimento Premium Dog', '85000', '20', 'Premium Brand', 'Alimento balanceado premium'],
                        ['Cat Food Indoor', '78000', '15', 'Cat Brand', 'Alimento para gatos de interior'],
                        ['Puppy Food Small', '65000', '25', 'Puppy Brand', 'Alimento para cachorros pequeños']
                    ];
                    
                    const products = simulatedExcelData.slice(1).map((row, index) => ({
                        id: Date.now() + index,
                        name: row[0],
                        price: parseInt(row[1]),
                        stock: parseInt(row[2]),
                        brand: row[3],
                        description: row[4],
                        category: config.category,
                        petType: config.petType,
                        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
                        extractedFrom: 'Excel',
                        extractedAt: new Date().toISOString()
                    }));

                    resolve(products);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('Error leyendo archivo Excel'));
            reader.readAsArrayBuffer(file);
        });
    }

    // ======================
    // EXTRACCIÓN DESDE CSV
    // ======================

    async extractFromCSV(file, config) {
        console.log('📄 Extrayendo datos de CSV...');
        
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const csv = e.target.result;
                    const lines = csv.split('\n').filter(line => line.trim());
                    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
                    
                    const products = lines.slice(1).map((line, index) => {
                        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
                        
                        return {
                            id: Date.now() + index,
                            name: values[0] || 'Producto sin nombre',
                            price: parseInt(values[1]) || 0,
                            stock: parseInt(values[2]) || 0,
                            brand: values[3] || 'Sin marca',
                            description: values[4] || 'Sin descripción',
                            category: config.category,
                            petType: config.petType,
                            rating: (Math.random() * 1.5 + 3.5).toFixed(1),
                            extractedFrom: 'CSV',
                            extractedAt: new Date().toISOString()
                        };
                    });

                    resolve(products);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('Error leyendo archivo CSV'));
            reader.readAsText(file);
        });
    }

    // ======================
    // GUARDADO EN BASE DE DATOS
    // ======================

    async saveProductsToDatabase(products) {
        console.log('💾 Guardando productos en base de datos...');
        
        try {
            // Simular llamada a API para guardar productos
            const response = await fetch(`${this.apiBaseUrl}/Products/bulk`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': window.ApiService?.token ? `Bearer ${window.ApiService.token}` : ''
                },
                body: JSON.stringify(products)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('✅ Productos guardados exitosamente:', result);
            
            return {
                success: true,
                savedCount: products.length,
                message: `${products.length} productos guardados exitosamente`
            };

        } catch (error) {
            console.error('❌ Error guardando productos:', error);
            
            // Fallback: guardar en localStorage
            const savedProducts = JSON.parse(localStorage.getItem('ventaspet_imported_products') || '[]');
            const updatedProducts = [...savedProducts, ...products];
            localStorage.setItem('ventaspet_imported_products', JSON.stringify(updatedProducts));
            
            return {
                success: false,
                error: error.message,
                fallback: true,
                message: `Productos guardados localmente debido a error de conexión: ${error.message}`
            };
        }
    }

    // ======================
    // UTILIDADES
    // ======================

    getSupportedFormats() {
        return this.supportedFormats;
    }

    getFileInfo(file) {
        return {
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
            type: file.type,
            lastModified: new Date(file.lastModified).toLocaleDateString()
        };
    }

    // Validar formato de producto extraído
    validateProduct(product) {
        const required = ['name', 'price', 'stock', 'category'];
        const missing = required.filter(field => !product[field]);
        
        if (missing.length > 0) {
            return {
                valid: false,
                errors: missing.map(field => `Campo requerido: ${field}`)
            };
        }

        return { valid: true, errors: [] };
    }
}

// Crear instancia global
const pdfProcessor = new PDFProductProcessor();
window.PDFProductProcessor = pdfProcessor;

console.log('✅ PDF Product Processor cargado y disponible globalmente');