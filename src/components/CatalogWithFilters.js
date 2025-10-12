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
                // Cargar productos sin filtros inicialmente
                const response = await apiService.getProducts();
                
                if (response && response.length > 0) {
                    console.log('✅ Productos cargados exitosamente:', response.length);
                    console.log('🔍 Productos con campos de filtros:', response.slice(0, 3));

                    setProductos(response);
                    setFilteredProducts(response);
                } else {
                    console.log('⚠️ No hay productos desde API');
                    setProductos([]);
                    setFilteredProducts([]);
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

    // Función para aplicar filtros usando los campos del backend
    const applyFilters = React.useCallback((filters) => {
        let filtered = [...productos];

        console.log('🔍 Aplicando filtros:', filters);
        console.log('📦 Total productos antes de filtrar:', filtered.length);

        // Filtro de búsqueda por texto (búsqueda general)
        if (filters.search && filters.search.trim()) {
            const searchTerm = filters.search.toLowerCase().trim();
            filtered = filtered.filter(product => 
                (product.NombreBase && product.NombreBase.toLowerCase().includes(searchTerm)) ||
                (product.Descripcion && product.Descripcion.toLowerCase().includes(searchTerm)) ||
                (product.NombreCategoria && product.NombreCategoria.toLowerCase().includes(searchTerm))
            );
            console.log(`🔍 Después de búsqueda "${searchTerm}": ${filtered.length} productos`);
        }

        // Filtro por tipo de mascota (ID numérico del backend)
        if (filters.idMascotaTipo) {
            filtered = filtered.filter(product => 
                product.IdMascotaTipo === filters.idMascotaTipo
            );
            console.log(`🐾 Después de filtrar por mascota ID ${filters.idMascotaTipo}: ${filtered.length} productos`);
        }

        // Filtro por categoría de alimento (ID numérico del backend)
        if (filters.idCategoriaAlimento) {
            filtered = filtered.filter(product => 
                product.IdCategoriaAlimento === filters.idCategoriaAlimento
            );
            console.log(`🍖 Después de filtrar por categoría alimento ID ${filters.idCategoriaAlimento}: ${filtered.length} productos`);
        }

        // Filtro por subcategoría (ID numérico del backend)
        if (filters.idSubcategoria) {
            filtered = filtered.filter(product => 
                product.IdSubcategoria === filters.idSubcategoria
            );
            console.log(`📋 Después de filtrar por subcategoría ID ${filters.idSubcategoria}: ${filtered.length} productos`);
        }

        // Filtro por presentación (ID numérico del backend)
        if (filters.idPresentacion) {
            filtered = filtered.filter(product => 
                product.IdPresentacion === filters.idPresentacion
            );
            console.log(`📦 Después de filtrar por presentación ID ${filters.idPresentacion}: ${filtered.length} productos`);
        }

        // Filtro por precio máximo
        if (filters.maxPrice && filters.maxPrice < 500000) {
            filtered = filtered.filter(product => {
                // Obtener el precio mínimo de las variaciones
                const variaciones = product.Variaciones || [];
                if (variaciones.length > 0) {
                    const minPrice = Math.min(...variaciones.map(v => v.Precio || 0));
                    return minPrice <= filters.maxPrice;
                }
                return true; // Si no hay variaciones, incluir el producto
            });
            console.log(`💰 Después de filtrar por precio <= ${filters.maxPrice}: ${filtered.length} productos`);
        }

        // Filtro por disponibilidad
        if (filters.availability && filters.availability.length > 0) {
            filtered = filtered.filter(product => {
                // Verificar si tiene stock en alguna variación
                const variaciones = product.Variaciones || [];
                const hasStock = variaciones.some(v => (v.Stock || 0) > 0);
                
                if (filters.availability.includes('in-stock')) {
                    if (!hasStock) return false;
                }
                if (filters.availability.includes('free-shipping')) {
                    // Calcular precio mínimo para envío gratis
                    if (variaciones.length > 0) {
                        const minPrice = Math.min(...variaciones.map(v => v.Precio || 0));
                        if (minPrice < 50000) return false;
                    }
                }
                return true;
            });
            console.log(`📦 Después de filtrar por disponibilidad: ${filtered.length} productos`);
        }

        console.log(`✅ Filtros aplicados: ${filtered.length} de ${productos.length} productos`);
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

    // Calcular contadores para cada filtro usando los IDs del backend
    const calculateProductCounts = React.useCallback(() => {
        const counts = {};

        // Contar por cada tipo de mascota (usando IdMascotaTipo)
        productos.forEach(p => {
            if (p.IdMascotaTipo) {
                counts[p.IdMascotaTipo] = (counts[p.IdMascotaTipo] || 0) + 1;
            }
        });

        // Contar por cada categoría de alimento (usando IdCategoriaAlimento)
        productos.forEach(p => {
            if (p.IdCategoriaAlimento) {
                counts[p.IdCategoriaAlimento] = (counts[p.IdCategoriaAlimento] || 0) + 1;
            }
        });

        // Contar por cada subcategoría (usando IdSubcategoria)
        productos.forEach(p => {
            if (p.IdSubcategoria) {
                counts[p.IdSubcategoria] = (counts[p.IdSubcategoria] || 0) + 1;
            }
        });

        // Contar por cada presentación (usando IdPresentacion)
        productos.forEach(p => {
            if (p.IdPresentacion) {
                counts[p.IdPresentacion] = (counts[p.IdPresentacion] || 0) + 1;
            }
        });

        // Contar disponibilidad
        counts['in-stock'] = productos.filter(p => {
            const variaciones = p.Variaciones || [];
            return variaciones.some(v => (v.Stock || 0) > 0);
        }).length;
        
        counts['free-shipping'] = productos.filter(p => {
            const variaciones = p.Variaciones || [];
            if (variaciones.length > 0) {
                const minPrice = Math.min(...variaciones.map(v => v.Precio || 0));
                return minPrice >= 50000;
            }
            return false;
        }).length;

        console.log('📊 Contadores de productos calculados:', counts);
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
                    { style: { color: '#999', marginBottom: '15px' } },
                    'Intenta ajustar los filtros para encontrar más productos'
                ),
                // Mostrar filtros activos
                Object.keys(activeFilters).length > 0 && React.createElement('div',
                    {
                        style: {
                            background: '#f8f9fa',
                            padding: '15px',
                            borderRadius: '8px',
                            marginBottom: '15px',
                            textAlign: 'left',
                            maxWidth: '400px',
                            margin: '15px auto'
                        }
                    },
                    React.createElement('p',
                        { style: { fontWeight: '600', marginBottom: '10px', color: '#333' } },
                        'Filtros activos:'
                    ),
                    Object.entries(activeFilters).map(([key, value]) => {
                        if (key === 'search' && value) {
                            return React.createElement('div', 
                                { key: key, style: { marginBottom: '5px', color: '#666' } },
                                `• Búsqueda: "${value}"`
                            );
                        }
                        if ((key === 'idMascotaTipo' || key === 'idCategoriaAlimento' || 
                             key === 'idSubcategoria' || key === 'idPresentacion') && value) {
                            const labels = {
                                'idMascotaTipo': 'Tipo de mascota',
                                'idCategoriaAlimento': 'Categoría',
                                'idSubcategoria': 'Subcategoría',
                                'idPresentacion': 'Presentación'
                            };
                            return React.createElement('div', 
                                { key: key, style: { marginBottom: '5px', color: '#666' } },
                                `• ${labels[key]}: ID ${value}`
                            );
                        }
                        if (key === 'maxPrice' && value < 500000) {
                            return React.createElement('div', 
                                { key: key, style: { marginBottom: '5px', color: '#666' } },
                                `• Precio máximo: ${window.formatCOP ? window.formatCOP(value) : '$' + value}`
                            );
                        }
                        if (key === 'availability' && value.length > 0) {
                            return React.createElement('div', 
                                { key: key, style: { marginBottom: '5px', color: '#666' } },
                                `• Disponibilidad: ${value.join(', ')}`
                            );
                        }
                        return null;
                    })
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
                            cursor: 'pointer',
                            fontWeight: '600'
                        }
                    },
                    '🔄 Limpiar todos los filtros'
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
