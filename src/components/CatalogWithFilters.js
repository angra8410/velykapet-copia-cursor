// VelyKapet - Catalog with Filters Component
// Catálogo integrado con sistema de filtros lateral

console.log('🛍️ Cargando Catalog with Filters Component...');

function CatalogWithFilters() {
    const [productos, setProductos] = React.useState([]);
    const [filteredProducts, setFilteredProducts] = React.useState([]);
    const [displayedProducts, setDisplayedProducts] = React.useState([]);
    const [activeFilters, setActiveFilters] = React.useState({});
    const [loading, setLoading] = React.useState(true);
    const [loadingMore, setLoadingMore] = React.useState(false);
    const [error, setError] = React.useState('');
    const [currentPage, setCurrentPage] = React.useState(1);
    const [hasMore, setHasMore] = React.useState(true);
    
    // Configuración del infinite scroll
    const PRODUCTS_PER_PAGE = 12; // 3 o 4 por fila dependiendo del tamaño de pantalla
    const [showScrollTop, setShowScrollTop] = React.useState(false);

    // Función para esperar que ApiService esté disponible
    const waitForApiService = async (maxAttempts = 10, delay = 300) => {
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            console.log(`🔄 Intento ${attempt}/${maxAttempts} - Verificando ApiService...`);
            
            if (window.ApiService && typeof window.ApiService.getProducts === 'function') {
                console.log('✅ ApiService disponible');
                return window.ApiService;
            }
            
            if (attempt < maxAttempts) {
                console.log(`⏳ Esperando ${delay}ms antes del siguiente intento...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        
        throw new Error(`ApiService no disponible después de ${maxAttempts} intentos`);
    };

    // Cargar productos del backend
    React.useEffect(() => {
        const loadProducts = async () => {
            try {
                console.log('📦 Iniciando carga de productos para catálogo con filtros...');
                
                // Esperar que ApiService esté disponible
                const apiService = await waitForApiService();
                
                console.log('📦 Obteniendo productos desde la API...');
                const response = await apiService.getProducts();
                
                if (response && response.length > 0) {
                    console.log('✅ Productos cargados exitosamente:', response.length);

                    // MEZCLAR con productos importados localmente (IconoPet u otros)
                    let localImported = [];
                    try {
                        localImported = JSON.parse(localStorage.getItem('ventaspet_imported_products') || '[]');
                    } catch {}
                    // EVITAR DUPLICADOS AL MEZCLAR PRODUCTOS
                    const normalizedLocal = localImported.map(p => ({
                        Id: p.Id || (p.id ?? Date.now() + Math.random()),
                        Name: p.Name || p.name,
                        Description: p.Description || p.description || '',
                        Category: p.Category || p.category || 'Otros',
                        Price: p.Price || p.price || 0,
                        Stock: p.Stock || p.stock || 0,
                        Rating: p.Rating || p.rating || 0,
                        PetType: p.PetType || p.petType || 'General',
                        Source: 'Local'
                    }));
                    
                    // Filtrar duplicados por nombre
                    const existingNames = new Set(response.map(p => p.Name?.toLowerCase()));
                    const uniqueLocal = normalizedLocal.filter(p => 
                        !existingNames.has(p.Name?.toLowerCase())
                    );
                    
                    const merged = Array.isArray(localImported) && uniqueLocal.length > 0
                        ? [...response, ...uniqueLocal]
                        : response;

                    console.log(`📦 Catálogo final: API=${response.length} + Local=${localImported.length} (Unicos=${uniqueLocal.length}) => Total=${merged.length}`);
                    console.log('🛡️ Duplicados filtrados:', localImported.length - uniqueLocal.length);

                    setProductos(merged);
                    setFilteredProducts(merged);
                } else {
                    console.log('⚠️ No hay productos desde API, cargando catálogo IconoPet + ejemplos');
                    
                    // Cargar productos de IconoPet si están disponibles
                    let iconoPetProducts = [];
                    if (window.IconoPetScraper) {
                        try {
                            iconoPetProducts = await window.IconoPetScraper.processForVelyKapet();
                            console.log(`🏢 Cargados ${iconoPetProducts.length} productos de IconoPet`);
                        } catch (error) {
                            console.log('⚠️ Error cargando productos IconoPet:', error.message);
                        }
                    }
                    
                    // Productos de ejemplo para testing
                    const sampleProducts = [
                        { Id: 1, Name: 'Alimento Premium Royal Canin Perro Adulto', Category: 'Alimento', Price: 85000, Stock: 15, Rating: 4.8, Description: 'Alimento balanceado para perros adultos' },
                        { Id: 2, Name: 'Snacks TIKI PETS Cat Treats', Category: 'Snacks', Price: 25000, Stock: 8, Rating: 4.5, Description: 'Premios naturales para gatos' },
                        { Id: 3, Name: 'Juguete KONG Classic Perro', Category: 'Juguetes', Price: 45000, Stock: 12, Rating: 4.7, Description: 'Juguete resistente para perros' },
                        { Id: 4, Name: 'Alimento NULO Gato Indoor', Category: 'Alimento', Price: 95000, Stock: 6, Rating: 4.6, Description: 'Alimento premium para gatos de interior' },
                        { Id: 5, Name: 'Collar EVOLVE Ajustable', Category: 'Accesorios', Price: 35000, Stock: 20, Rating: 4.3, Description: 'Collar cómodo y seguro' },
                        { Id: 6, Name: 'Shamú EMERALD PET Natural', Category: 'Higiene', Price: 28000, Stock: 10, Rating: 4.4, Description: 'Shampú suave para mascotas' },
                        { Id: 7, Name: 'Alimento OLD PRINCE Cachorro', Category: 'Alimento', Price: 65000, Stock: 14, Rating: 4.5, Description: 'Alimento especial para cachorros' },
                        { Id: 8, Name: 'Premios INABA Churu Gato', Category: 'Snacks', Price: 18000, Stock: 25, Rating: 4.9, Description: 'Premios cremosos para gatos' },
                        { Id: 9, Name: 'Cama LOVING PETS Comfort', Category: 'Accesorios', Price: 55000, Stock: 7, Rating: 4.2, Description: 'Cama suave y confortable' },
                        { Id: 10, Name: 'Alimento SPORTMANS PRIDE Active', Category: 'Alimento', Price: 78000, Stock: 11, Rating: 4.6, Description: 'Para perros activos y deportistas' },
                        { Id: 11, Name: 'Juguete Película Gato FAWNA', Category: 'Juguetes', Price: 22000, Stock: 18, Rating: 4.3, Description: 'Juguete interactivo para gatos' },
                        { Id: 12, Name: 'Alimento EVOLVE Grain Free', Category: 'Alimento', Price: 105000, Stock: 9, Rating: 4.8, Description: 'Sin granos, para mascotas sensibles' },
                        { Id: 13, Name: 'Transportadora KONGO Secure', Category: 'Transporte', Price: 125000, Stock: 5, Rating: 4.4, Description: 'Transportadora segura y cómoda' },
                        { Id: 14, Name: 'Snacks EMERALD PET Training', Category: 'Snacks', Price: 32000, Stock: 16, Rating: 4.5, Description: 'Premios para entrenamiento' },
                        { Id: 15, Name: 'Correa LOVING PETS Retractil', Category: 'Accesorios', Price: 42000, Stock: 13, Rating: 4.1, Description: 'Correa retráctil de 5 metros' },
                        { Id: 16, Name: 'Alimento ROYAL CANIN Persian', Category: 'Alimento', Price: 92000, Stock: 8, Rating: 4.7, Description: 'Especial para gatos persas' },
                        { Id: 17, Name: 'Juguete Ratón TIKI PETS', Category: 'Juguetes', Price: 15000, Stock: 22, Rating: 4.4, Description: 'Ratón de juguete con hierba gatera' },
                        { Id: 18, Name: 'Arena FAWNA Clumping', Category: 'Higiene', Price: 35000, Stock: 12, Rating: 4.2, Description: 'Arena aglutinante sin polvo' },
                        { Id: 19, Name: 'Alimento HILLS Science Diet', Category: 'Alimento', Price: 98000, Stock: 7, Rating: 4.8, Description: 'Fórmula científica avanzada' },
                        { Id: 20, Name: 'Snacks KONG Stuff\'N Treats', Category: 'Snacks', Price: 28000, Stock: 15, Rating: 4.6, Description: 'Para rellenar juguetes KONG' },
                        { Id: 21, Name: 'Collar LED EVOLVE Safety', Category: 'Accesorios', Price: 38000, Stock: 18, Rating: 4.3, Description: 'Collar con luces LED recargables' },
                        { Id: 22, Name: 'Champú INABA Sensitive', Category: 'Higiene', Price: 32000, Stock: 9, Rating: 4.5, Description: 'Para pieles sensibles' },
                        { Id: 23, Name: 'Alimento NULO Puppy', Category: 'Alimento', Price: 89000, Stock: 11, Rating: 4.7, Description: 'Para cachorros en crecimiento' },
                        { Id: 24, Name: 'Rascador EMERALD PET Tower', Category: 'Juguetes', Price: 125000, Stock: 4, Rating: 4.4, Description: 'Torre rascadora de 1.5m' },
                        { Id: 25, Name: 'Transportín LOVING PETS Air', Category: 'Transporte', Price: 85000, Stock: 6, Rating: 4.2, Description: 'Aprobado para viajes aéreos' },
                        { Id: 26, Name: 'Alimento SPORTMANS Senior', Category: 'Alimento', Price: 75000, Stock: 13, Rating: 4.5, Description: 'Para perros mayores' },
                        { Id: 27, Name: 'Juguete Cuerda OLD PRINCE', Category: 'Juguetes', Price: 18000, Stock: 24, Rating: 4.1, Description: 'Cuerda natural para morder' },
                        { Id: 28, Name: 'Vitaminas FAWNA Multi', Category: 'Salud', Price: 45000, Stock: 10, Rating: 4.6, Description: 'Multivitamínico completo' },
                        { Id: 29, Name: 'Alimento KONGO Natural', Category: 'Alimento', Price: 72000, Stock: 16, Rating: 4.3, Description: 'Ingredientes naturales' },
                        { Id: 30, Name: 'Pelota TIKI PETS Bounce', Category: 'Juguetes', Price: 22000, Stock: 19, Rating: 4.4, Description: 'Pelota que rebota impredeciblemente' }
                    ];
                    
                    // COMBINAR productos de IconoPet + ejemplos
                    const allProducts = [...iconoPetProducts, ...sampleProducts];
                    console.log(`📦 Total productos cargados: ${allProducts.length} (IconoPet: ${iconoPetProducts.length}, Ejemplos: ${sampleProducts.length})`);
                    
                    setProductos(allProducts);
                    setFilteredProducts(allProducts);
                }
            } catch (error) {
                console.error('❌ Error cargando productos:', error);
                setError('Error al cargar los productos: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        // Iniciar la carga inmediatamente
        loadProducts();
    }, []);

    // Función para aplicar filtros
    const applyFilters = React.useCallback((filters) => {
        let filtered = [...productos];

        // Filtro de búsqueda por texto
        if (filters.search && filters.search.trim()) {
            const searchTerm = filters.search.toLowerCase().trim();
            filtered = filtered.filter(product => 
                product.Name?.toLowerCase().includes(searchTerm) ||
                product.Description?.toLowerCase().includes(searchTerm) ||
                product.Category?.toLowerCase().includes(searchTerm)
            );
        }

        // Filtro por tipo de mascota (perros/gatos)
        if (filters.pets && filters.pets.length > 0) {
            filtered = filtered.filter(product => {
                const category = product.Category?.toLowerCase() || '';
                return filters.pets.some(pet => category.includes(pet));
            });
        }

        // Filtro por tipo de producto
        if (filters.productTypes && filters.productTypes.length > 0) {
            filtered = filtered.filter(product => {
                const name = product.Name?.toLowerCase() || '';
                const description = product.Description?.toLowerCase() || '';
                return filters.productTypes.some(type => 
                    name.includes(type) || description.includes(type)
                );
            });
        }

        // Filtro por marcas de snacks
        if (filters.snackBrands && filters.snackBrands.length > 0) {
            filtered = filtered.filter(product => {
                const name = product.Name?.toLowerCase() || '';
                const description = product.Description?.toLowerCase() || '';
                return filters.snackBrands.some(brand => {
                    const brandName = brand.replace('-', ' ').toLowerCase();
                    return name.includes(brandName) || description.includes(brandName);
                });
            });
        }

        // Filtro por marcas de alimento
        if (filters.foodBrands && filters.foodBrands.length > 0) {
            filtered = filtered.filter(product => {
                const name = product.Name?.toLowerCase() || '';
                const description = product.Description?.toLowerCase() || '';
                return filters.foodBrands.some(brand => {
                    const brandName = brand.replace('-', ' ').toLowerCase();
                    return name.includes(brandName) || description.includes(brandName);
                });
            });
        }

        // Filtro por precio máximo
        if (filters.maxPrice && filters.maxPrice < 500000) {
            filtered = filtered.filter(product => 
                (product.Price || 0) <= filters.maxPrice
            );
        }

        // Filtro por calificación
        if (filters.ratings && filters.ratings.length > 0) {
            filtered = filtered.filter(product => {
                const rating = product.Rating || 0;
                return filters.ratings.some(minRating => 
                    rating >= parseFloat(minRating)
                );
            });
        }

        // Filtro por disponibilidad
        if (filters.availability && filters.availability.length > 0) {
            filtered = filtered.filter(product => {
                if (filters.availability.includes('in-stock')) {
                    return (product.Stock || 0) > 0;
                }
                if (filters.availability.includes('free-shipping')) {
                    return (product.Price || 0) >= 50000; // Envío gratis > $50k
                }
                return true;
            });
        }

        console.log(`🔍 Filtros aplicados: ${filtered.length} de ${productos.length} productos`);
        setFilteredProducts(filtered);
    }, [productos]);

    // Función para cargar más productos (infinite scroll) - SOLO PARA PÁGINAS 2+
    const loadMoreProducts = React.useCallback(() => {
        if (loadingMore) {
            console.log('⚠️ Ya se está cargando, evitando bucle...');
            return; // Evitar múltiples cargas simultáneas
        }
        
        if (currentPage === 1) {
            console.log('⚠️ loadMoreProducts llamado para página 1, ignorando (ya se maneja en otro useEffect)');
            return; // La página 1 se maneja en el useEffect de inicialización
        }
        
        const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
        const endIndex = startIndex + PRODUCTS_PER_PAGE;
        const newProducts = filteredProducts.slice(startIndex, endIndex);
        
        if (newProducts.length === 0) {
            setHasMore(false);
            return;
        }
        
        setDisplayedProducts(prev => {
            const combined = [...prev, ...newProducts];
            // Evitar duplicados
            const uniqueCombined = combined.filter((product, index, self) => 
                self.findIndex(p => p.Id === product.Id) === index
            );
            return uniqueCombined;
        });
        
        setHasMore(endIndex < filteredProducts.length);
        console.log(`📦 Añadidos ${newProducts.length} productos adicionales. Página: ${currentPage}`);
    }, [currentPage, filteredProducts, loadingMore, PRODUCTS_PER_PAGE]);
    
    // Detectar scroll para infinite loading
    const handleScroll = React.useCallback(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Mostrar botón de scroll-to-top después de 400px
        setShowScrollTop(scrollTop > 400);
        
        // Cargar más cuando esté a 200px del final
        if (!loadingMore && hasMore && scrollTop + windowHeight >= documentHeight - 200) {
            setLoadingMore(true);
            setCurrentPage(prev => prev + 1);
        }
    }, [loadingMore, hasMore]);
    
    // Función para volver arriba
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    
    // Aplicar filtros cuando cambien
    React.useEffect(() => {
        applyFilters(activeFilters);
    }, [activeFilters, applyFilters]);
    
    // INICIALIZACIÓN Y RESET: Cuando cambien los productos filtrados, mostrar los primeros inmediatamente
    React.useEffect(() => {
        if (filteredProducts.length > 0) {
            console.log('🔄 Productos filtrados cambiaron:', filteredProducts.length);
            // Resetear paginación
            setCurrentPage(1);
            setHasMore(true);
            
            // MOSTRAR INMEDIATAMENTE los primeros productos
            const initialProducts = filteredProducts.slice(0, PRODUCTS_PER_PAGE);
            setDisplayedProducts(initialProducts);
            setHasMore(filteredProducts.length > PRODUCTS_PER_PAGE);
            
            console.log(`📦 Mostrando inicialmente ${initialProducts.length} productos de ${filteredProducts.length} totales`);
        } else {
            // Si no hay productos filtrados, limpiar
            setDisplayedProducts([]);
            setHasMore(false);
        }
    }, [filteredProducts.length, PRODUCTS_PER_PAGE]);
    
    // Cargar MÁS productos cuando cambie la página (solo para página 2+)
    React.useEffect(() => {
        if (currentPage > 1 && filteredProducts.length > 0) {
            console.log(`📦 Cargando página ${currentPage}...`);
            loadMoreProducts();
            setLoadingMore(false);
        }
    }, [currentPage]); // SOLO dependencia de currentPage para evitar bucle
    
    // Event listener para scroll (OPTIMIZADO)
    React.useEffect(() => {
        let scrollTimeout;
        const optimizedScrollHandler = () => {
            if (scrollTimeout) return; // Throttle scroll events
            scrollTimeout = setTimeout(() => {
                handleScroll();
                scrollTimeout = null;
            }, 100); // Solo ejecutar cada 100ms
        };
        
        window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
        return () => {
            window.removeEventListener('scroll', optimizedScrollHandler);
            if (scrollTimeout) clearTimeout(scrollTimeout);
        };
    }, [handleScroll]);
    
    // Función para manejar cambios de filtros
    const handleFiltersChange = (newFilters) => {
        console.log('🔧 Filtros actualizados:', newFilters);
        setActiveFilters(newFilters);
    };

    // Calcular contadores para cada filtro
    const calculateProductCounts = React.useCallback(() => {
        const counts = {};

        // Contar por mascotas
        counts['perros'] = productos.filter(p => 
            p.Category?.toLowerCase().includes('perro') || 
            p.Name?.toLowerCase().includes('perro')
        ).length;
        counts['gatos'] = productos.filter(p => 
            p.Category?.toLowerCase().includes('gato') || 
            p.Name?.toLowerCase().includes('gato')
        ).length;

        // Contar por tipos de producto
        counts['alimento'] = productos.filter(p => 
            p.Name?.toLowerCase().includes('alimento') ||
            p.Description?.toLowerCase().includes('alimento')
        ).length;
        counts['snacks'] = productos.filter(p => 
            p.Name?.toLowerCase().includes('snack') ||
            p.Name?.toLowerCase().includes('premio') ||
            p.Description?.toLowerCase().includes('snack')
        ).length;

        // Contar disponibilidad
        counts['in-stock'] = productos.filter(p => (p.Stock || 0) > 0).length;
        counts['free-shipping'] = productos.filter(p => (p.Price || 0) >= 50000).length;

        // Contadores por defecto para marcas (se pueden actualizar dinámicamente)
        const brands = ['tiki-pets', 'inaba', 'evolve-snacks', 'emerald-pet', 'loving-pets', 
                      'nulo', 'evolve-food', 'sportmans-pride', 'kongo', 'old-prince', 'fawna'];
        brands.forEach(brand => {
            const brandName = brand.replace('-', ' ').toLowerCase();
            counts[brand] = productos.filter(p => 
                p.Name?.toLowerCase().includes(brandName) ||
                p.Description?.toLowerCase().includes(brandName)
            ).length;
        });

        return counts;
    }, [productos]);

    // FUNCIÓN ÚNICA para agregar al carrito - SIN DUPLICADOS
    const handleAddToCart = async (product) => {
        try {
            if (window.cartManager && window.cartManager.addItem) {
                await window.cartManager.addItem(product, 1);
                console.log('✅ Producto agregado al carrito:', product.Name);
            } else {
                console.error('❌ CartManager no disponible');
            }
        } catch (error) {
            console.error('❌ Error agregando al carrito:', error);
        }
    };

    if (loading) {
        return React.createElement('div',
            {
                className: 'catalog-loading',
                style: {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '400px',
                    flexDirection: 'column',
                    gap: '20px'
                }
            },
            React.createElement('div',
                {
                    style: {
                        width: '50px',
                        height: '50px',
                        border: '4px solid #f3f3f3',
                        borderTop: '4px solid #E45A84',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }
                }
            ),
            React.createElement('p',
                { style: { color: '#666', fontSize: '16px' } },
                'Cargando productos...'
            )
        );
    }

    if (error) {
        return React.createElement('div',
            {
                className: 'catalog-error',
                style: {
                    textAlign: 'center',
                    padding: '60px 20px',
                    color: '#721c24',
                    background: '#f8d7da',
                    borderRadius: '8px',
                    margin: '20px'
                }
            },
            React.createElement('h3', null, '❌ Error al cargar productos'),
            React.createElement('p', null, error),
            React.createElement('button',
                {
                    onClick: () => window.location.reload(),
                    style: {
                        padding: '10px 20px',
                        background: '#E45A84',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }
                },
                'Reintentar'
            )
        );
    }

    // DEBUG: Verificar que los filtros estén disponibles
    console.log('🔍 DEBUG CatalogWithFilters - Componentes:', {
        FilterSidebar: !!window.FilterSidebar,
        productCount: productos.length,
        filteredCount: filteredProducts.length,
        activeFiltersCount: Object.keys(activeFilters).length
    });

    return React.createElement('div',
        {
            className: 'catalog-with-filters',
            style: {
                maxWidth: '100%', // APROVECHAMIENTO COMPLETO - ya está dentro del container optimizado
                width: '100%',
                margin: '0',
                padding: '0', // Sin padding, el container ya lo maneja
                display: 'flex',
                gap: '1.5rem', // Gap optimizado
                alignItems: 'flex-start',
                backgroundColor: 'transparent' // Sin fondo de debug
            }
        },

        // SIDEBAR DE FILTROS - SIEMPRE VISIBLE CON DEBUG
        window.FilterSidebar ? React.createElement(window.FilterSidebar, {
            onFiltersChange: handleFiltersChange,
            activeFilters: activeFilters,
            productCounts: calculateProductCounts()
        }) : React.createElement('div',
            {
                style: {
                    width: '280px',
                    background: '#ffcccc',
                    padding: '20px',
                    borderRadius: '10px',
                    border: '2px solid red'
                }
            },
            React.createElement('h3', { style: { color: 'red' } }, '❌ ERROR'),
            React.createElement('p', null, 'FilterSidebar no disponible'),
            React.createElement('p', { style: { fontSize: '12px' } }, 'Verifica que FilterSidebar.js se haya cargado')
        ),

        // Área de productos
        React.createElement('div',
            {
                className: 'products-area',
                style: {
                    flex: 1,
                    minWidth: 0 // Para permitir shrinking
                }
            },

            // Header con información de resultados
            React.createElement('div',
                {
                    className: 'results-header',
                    style: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px',
                        padding: '15px 20px',
                        background: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }
                },
                React.createElement('div',
                    {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }
                    },
                    React.createElement('span',
                        {
                            style: {
                                fontSize: '18px',
                                fontWeight: '600',
                                color: '#333'
                            }
                        },
                        displayedProducts.length < filteredProducts.length ? 
                            `📦 Mostrando ${displayedProducts.length} de ${filteredProducts.length} productos` :
                            `📦 ${filteredProducts.length} productos encontrados`
                    ),
                    filteredProducts.length !== productos.length && React.createElement('span',
                        {
                            style: {
                                fontSize: '14px',
                                color: '#666',
                                background: '#f8f9fa',
                                padding: '4px 8px',
                                borderRadius: '12px'
                            }
                        },
                        `de ${productos.length} totales`
                    )
                )
            ),

            // Grid de productos con infinite scroll
            displayedProducts.length > 0 ? React.createElement('div',
                { className: 'products-container' },
                
                // Grid de productos
                React.createElement('div',
                    {
                        className: 'products-grid',
                        style: {
                            display: 'grid',
                            // GRID SÚPER OPTIMIZADO PARA VIEWPORTS ULTRA ANCHOS
                            gridTemplateColumns: window.innerWidth >= 3200 ? 'repeat(10, 1fr)' : // 4K+ ultra-wide
                                               window.innerWidth >= 2800 ? 'repeat(9, 1fr)' : // 4K monitors
                                               window.innerWidth >= 2400 ? 'repeat(8, 1fr)' : // Ultra-wide
                                               window.innerWidth >= 2000 ? 'repeat(7, 1fr)' : // Resoluciones altas
                                               window.innerWidth >= 1800 ? 'repeat(6, 1fr)' : // 1800px+
                                               window.innerWidth >= 1600 ? 'repeat(5, 1fr)' : // 1600px+
                                               window.innerWidth >= 1400 ? 'repeat(4, 1fr)' : // 1400px+
                                               window.innerWidth >= 1200 ? 'repeat(4, 1fr)' : // Laptops
                                               window.innerWidth >= 1000 ? 'repeat(3, 1fr)' : // Tablets
                                               window.innerWidth >= 800 ? 'repeat(2, 1fr)' : // Mobile landscape
                                               '1fr', // Mobile portrait
                            gap: '25px', // Mayor separación para mejor apariencia
                            marginBottom: '40px',
                            maxWidth: 'none',
                            width: '100%' // Asegurar 100% del ancho
                        }
                    },
                    displayedProducts.map(product => 
                        React.createElement(window.ProductCard || window.ProductCardComponent, {
                            key: `${product.Id}-${Math.random()}`, // Key único para evitar duplicados
                            product: product,
                            onAddToCart: handleAddToCart,
                            onViewDetails: (prod) => {
                                console.log('Ver detalles de producto:', prod.Name || prod.name);
                                if (window.viewProductDetails) {
                                    window.viewProductDetails(prod);
                                } else {
                                    console.error('❌ window.viewProductDetails no está disponible');
                                }
                            }
                        })
                    )
                ),
                
                // Loading indicator para infinite scroll
                loadingMore && React.createElement('div',
                    {
                        className: 'loading-more',
                        style: {
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '40px 20px',
                            gap: '15px'
                        }
                    },
                    React.createElement('div',
                        {
                            style: {
                                width: '30px',
                                height: '30px',
                                border: '3px solid #f3f3f3',
                                borderTop: '3px solid #E45A84',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }
                        }
                    ),
                    React.createElement('span',
                        { style: { color: '#666', fontSize: '16px' } },
                        'Cargando más productos...'
                    )
                ),
                
                // Mensaje de fin si no hay más productos
                !hasMore && displayedProducts.length < filteredProducts.length && React.createElement('div',
                    {
                        style: {
                            textAlign: 'center',
                            padding: '30px 20px',
                            color: '#666',
                            fontSize: '16px'
                        }
                    },
                    '✨ Has visto todos los productos que coinciden con tus filtros'
                )
                
            ) : React.createElement('div',
                {
                    className: 'no-results',
                    style: {
                        textAlign: 'center',
                        padding: '60px 20px',
                        background: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }
                },
                React.createElement('div',
                    { style: { fontSize: '4rem', marginBottom: '20px' } },
                    '🔍'
                ),
                React.createElement('h3',
                    { style: { color: '#666', marginBottom: '10px' } },
                    'No se encontraron productos'
                ),
                React.createElement('p',
                    { style: { color: '#999' } },
                    'Intenta ajustar los filtros para encontrar más productos'
                ),
                React.createElement('button',
                    {
                        onClick: () => handleFiltersChange({}),
                        style: {
                            marginTop: '20px',
                            padding: '10px 20px',
                            background: '#E45A84',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }
                    },
                    'Limpiar filtros'
                )
            ),
            
            // Botón Scroll to Top
            showScrollTop && React.createElement('button',
                {
                    onClick: scrollToTop,
                    className: 'scroll-to-top',
                    style: {
                        position: 'fixed',
                        bottom: '30px',
                        right: '30px',
                        width: '55px',
                        height: '55px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #E45A84, #D94876)',
                        color: 'white',
                        border: 'none',
                        boxShadow: '0 8px 25px rgba(228, 90, 132, 0.4)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        zIndex: 1000,
                        transition: 'all 0.3s ease',
                        animation: 'fadeIn 0.3s ease'
                    },
                    onMouseEnter: (e) => {
                        e.target.style.transform = 'scale(1.1)';
                        e.target.style.boxShadow = '0 12px 35px rgba(228, 90, 132, 0.5)';
                    },
                    onMouseLeave: (e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = '0 8px 25px rgba(228, 90, 132, 0.4)';
                    }
                },
                '↑'
            )
        )
    );
}

// REGISTRAR EL COMPONENTE GLOBALMENTE - FORZAR CARGA
window.CatalogWithFilters = CatalogWithFilters;

// LOGS DE CONFIRMACIÓN PARA DEBUG
console.log('✅✅✅ Catalog with Filters Component cargado EXITOSAMENTE');
console.log('🔍 DEBUG: window.CatalogWithFilters disponible:', !!window.CatalogWithFilters);
console.log('🔍 DEBUG: window.FilterSidebar disponible:', !!window.FilterSidebar);
