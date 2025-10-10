// ============================================================================
// Ejemplo de Integración Frontend - Filtros Avanzados de Productos
// ============================================================================
// Este archivo demuestra cómo integrar los nuevos filtros avanzados
// en el frontend de VelyKaPet
// ============================================================================

// ============================================================================
// 1. ACTUALIZAR ApiService para cargar filtros dinámicos
// ============================================================================

class ApiService {
    // ... código existente ...

    // Nuevos métodos para cargar filtros dinámicos
    async getMascotaTipos() {
        console.log('🐾 Obteniendo tipos de mascota...');
        try {
            const mascotas = await this.get('/Productos/filtros/mascotas');
            console.log('✅ Tipos de mascota:', mascotas);
            return mascotas;
        } catch (error) {
            console.error('❌ Error obteniendo tipos de mascota:', error.message);
            return [];
        }
    }

    async getCategoriasAlimento(idMascotaTipo = null) {
        console.log('🍖 Obteniendo categorías de alimento...');
        try {
            const url = idMascotaTipo 
                ? `/Productos/filtros/categorias-alimento?idMascotaTipo=${idMascotaTipo}`
                : '/Productos/filtros/categorias-alimento';
            const categorias = await this.get(url);
            console.log('✅ Categorías de alimento:', categorias);
            return categorias;
        } catch (error) {
            console.error('❌ Error obteniendo categorías de alimento:', error.message);
            return [];
        }
    }

    async getSubcategorias(idCategoriaAlimento = null) {
        console.log('📂 Obteniendo subcategorías...');
        try {
            const url = idCategoriaAlimento 
                ? `/Productos/filtros/subcategorias?idCategoriaAlimento=${idCategoriaAlimento}`
                : '/Productos/filtros/subcategorias';
            const subcategorias = await this.get(url);
            console.log('✅ Subcategorías:', subcategorias);
            return subcategorias;
        } catch (error) {
            console.error('❌ Error obteniendo subcategorías:', error.message);
            return [];
        }
    }

    async getPresentaciones() {
        console.log('📦 Obteniendo presentaciones de empaque...');
        try {
            const presentaciones = await this.get('/Productos/filtros/presentaciones');
            console.log('✅ Presentaciones:', presentaciones);
            return presentaciones;
        } catch (error) {
            console.error('❌ Error obteniendo presentaciones:', error.message);
            return [];
        }
    }

    // Actualizar método getProducts para soportar nuevos filtros
    async getProducts(filters = {}) {
        console.log('📦 Obteniendo productos con filtros:', filters);
        try {
            // Construir parámetros de query
            const params = new URLSearchParams();
            
            // Filtros avanzados
            if (filters.idMascotaTipo) params.append('idMascotaTipo', filters.idMascotaTipo);
            if (filters.idCategoriaAlimento) params.append('idCategoriaAlimento', filters.idCategoriaAlimento);
            if (filters.idSubcategoria) params.append('idSubcategoria', filters.idSubcategoria);
            if (filters.idPresentacion) params.append('idPresentacion', filters.idPresentacion);
            
            // Filtros antiguos (compatibilidad)
            if (filters.categoria) params.append('categoria', filters.categoria);
            if (filters.tipoMascota) params.append('tipoMascota', filters.tipoMascota);
            if (filters.busqueda) params.append('busqueda', filters.busqueda);

            const url = `/Productos?${params.toString()}`;
            const productos = await this.get(url);
            
            console.log(`✅ Productos obtenidos: ${productos.length}`);
            return productos;
        } catch (error) {
            console.error('❌ Error obteniendo productos:', error.message);
            throw error;
        }
    }
}

// ============================================================================
// 2. COMPONENTE DE FILTROS AVANZADOS
// ============================================================================

window.AdvancedFiltersComponent = function({ onFilterChange, initialFilters = {} }) {
    const [filters, setFilters] = React.useState({
        idMascotaTipo: initialFilters.idMascotaTipo || null,
        idCategoriaAlimento: initialFilters.idCategoriaAlimento || null,
        idSubcategoria: initialFilters.idSubcategoria || null,
        idPresentacion: initialFilters.idPresentacion || null
    });

    const [mascotas, setMascotas] = React.useState([]);
    const [categorias, setCategorias] = React.useState([]);
    const [subcategorias, setSubcategorias] = React.useState([]);
    const [presentaciones, setPresentaciones] = React.useState([]);
    
    const [loading, setLoading] = React.useState(true);

    // Cargar datos iniciales
    React.useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [mascotasData, presentacionesData] = await Promise.all([
                    window.ApiService.getMascotaTipos(),
                    window.ApiService.getPresentaciones()
                ]);
                
                setMascotas(mascotasData);
                setPresentaciones(presentacionesData);
                setLoading(false);
            } catch (error) {
                console.error('Error cargando datos iniciales:', error);
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);

    // Cargar categorías cuando cambia el tipo de mascota
    React.useEffect(() => {
        if (filters.idMascotaTipo) {
            window.ApiService.getCategoriasAlimento(filters.idMascotaTipo)
                .then(setCategorias);
        } else {
            setCategorias([]);
        }
    }, [filters.idMascotaTipo]);

    // Cargar subcategorías cuando cambia la categoría
    React.useEffect(() => {
        if (filters.idCategoriaAlimento) {
            window.ApiService.getSubcategorias(filters.idCategoriaAlimento)
                .then(setSubcategorias);
        } else {
            setSubcategorias([]);
        }
    }, [filters.idCategoriaAlimento]);

    const handleFilterChange = (filterName, value) => {
        const newFilters = { ...filters };
        newFilters[filterName] = value || null;

        // Limpiar filtros dependientes en cascada
        if (filterName === 'idMascotaTipo') {
            newFilters.idCategoriaAlimento = null;
            newFilters.idSubcategoria = null;
        } else if (filterName === 'idCategoriaAlimento') {
            newFilters.idSubcategoria = null;
        }

        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const clearFilters = () => {
        const emptyFilters = {
            idMascotaTipo: null,
            idCategoriaAlimento: null,
            idSubcategoria: null,
            idPresentacion: null
        };
        setFilters(emptyFilters);
        onFilterChange(emptyFilters);
    };

    if (loading) {
        return React.createElement('div', { className: 'filters-loading' },
            React.createElement('p', null, '🔄 Cargando filtros...')
        );
    }

    return React.createElement('div', 
        { 
            className: 'advanced-filters',
            style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                padding: '20px',
                background: '#f8f9fa',
                borderRadius: '8px'
            }
        },
        
        // Título
        React.createElement('h3', 
            { 
                style: { 
                    margin: '0 0 15px 0', 
                    color: '#333',
                    fontSize: '18px',
                    fontWeight: '600'
                } 
            },
            '🔍 Filtros Avanzados'
        ),

        // Filtro: Tipo de Mascota
        React.createElement('div', { className: 'filter-group' },
            React.createElement('label', 
                { 
                    style: { 
                        fontWeight: '500', 
                        marginBottom: '5px', 
                        display: 'block',
                        fontSize: '14px',
                        color: '#555'
                    } 
                },
                '🐾 Tipo de Mascota'
            ),
            React.createElement('select', {
                value: filters.idMascotaTipo || '',
                onChange: (e) => handleFilterChange('idMascotaTipo', e.target.value ? parseInt(e.target.value) : null),
                style: {
                    width: '100%',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                }
            },
                React.createElement('option', { value: '' }, '-- Todos --'),
                mascotas.map(m => 
                    React.createElement('option', { 
                        key: m.idMascotaTipo, 
                        value: m.idMascotaTipo 
                    }, m.nombre)
                )
            )
        ),

        // Filtro: Categoría de Alimento
        React.createElement('div', { className: 'filter-group' },
            React.createElement('label', 
                { 
                    style: { 
                        fontWeight: '500', 
                        marginBottom: '5px', 
                        display: 'block',
                        fontSize: '14px',
                        color: '#555'
                    } 
                },
                '🍖 Categoría de Alimento'
            ),
            React.createElement('select', {
                value: filters.idCategoriaAlimento || '',
                onChange: (e) => handleFilterChange('idCategoriaAlimento', e.target.value ? parseInt(e.target.value) : null),
                disabled: !filters.idMascotaTipo,
                style: {
                    width: '100%',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                    opacity: !filters.idMascotaTipo ? 0.5 : 1
                }
            },
                React.createElement('option', { value: '' }, 
                    !filters.idMascotaTipo ? 'Selecciona mascota primero' : '-- Todas --'
                ),
                categorias.map(c => 
                    React.createElement('option', { 
                        key: c.idCategoriaAlimento, 
                        value: c.idCategoriaAlimento 
                    }, c.nombre)
                )
            )
        ),

        // Filtro: Subcategoría
        React.createElement('div', { className: 'filter-group' },
            React.createElement('label', 
                { 
                    style: { 
                        fontWeight: '500', 
                        marginBottom: '5px', 
                        display: 'block',
                        fontSize: '14px',
                        color: '#555'
                    } 
                },
                '📂 Subcategoría'
            ),
            React.createElement('select', {
                value: filters.idSubcategoria || '',
                onChange: (e) => handleFilterChange('idSubcategoria', e.target.value ? parseInt(e.target.value) : null),
                disabled: !filters.idCategoriaAlimento,
                style: {
                    width: '100%',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                    opacity: !filters.idCategoriaAlimento ? 0.5 : 1
                }
            },
                React.createElement('option', { value: '' }, 
                    !filters.idCategoriaAlimento ? 'Selecciona categoría primero' : '-- Todas --'
                ),
                subcategorias.map(s => 
                    React.createElement('option', { 
                        key: s.idSubcategoria, 
                        value: s.idSubcategoria 
                    }, s.nombre)
                )
            )
        ),

        // Filtro: Presentación
        React.createElement('div', { className: 'filter-group' },
            React.createElement('label', 
                { 
                    style: { 
                        fontWeight: '500', 
                        marginBottom: '5px', 
                        display: 'block',
                        fontSize: '14px',
                        color: '#555'
                    } 
                },
                '📦 Presentación'
            ),
            React.createElement('select', {
                value: filters.idPresentacion || '',
                onChange: (e) => handleFilterChange('idPresentacion', e.target.value ? parseInt(e.target.value) : null),
                style: {
                    width: '100%',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                }
            },
                React.createElement('option', { value: '' }, '-- Todas --'),
                presentaciones.map(p => 
                    React.createElement('option', { 
                        key: p.idPresentacion, 
                        value: p.idPresentacion 
                    }, p.nombre)
                )
            )
        ),

        // Botón Limpiar Filtros
        React.createElement('button', {
            onClick: clearFilters,
            style: {
                padding: '10px',
                background: '#e9ecef',
                border: '1px solid #ddd',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                color: '#555',
                marginTop: '10px'
            }
        }, '🔄 Limpiar Filtros')
    );
};

// ============================================================================
// 3. EJEMPLO DE USO EN CATÁLOGO
// ============================================================================

window.CatalogoConFiltrosAvanzados = function() {
    const [productos, setProductos] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [filters, setFilters] = React.useState({});

    // Cargar productos cuando cambian los filtros
    React.useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                const productsData = await window.ApiService.getProducts(filters);
                setProductos(productsData);
            } catch (error) {
                console.error('Error cargando productos:', error);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [filters]);

    const handleFilterChange = (newFilters) => {
        console.log('Filtros actualizados:', newFilters);
        setFilters(newFilters);
    };

    return React.createElement('div', 
        { 
            className: 'catalogo-con-filtros',
            style: {
                display: 'grid',
                gridTemplateColumns: '280px 1fr',
                gap: '20px',
                padding: '20px'
            }
        },
        
        // Sidebar de filtros
        React.createElement(window.AdvancedFiltersComponent, {
            onFilterChange: handleFilterChange,
            initialFilters: filters
        }),

        // Área de productos
        React.createElement('div', { className: 'productos-area' },
            // Header de resultados
            React.createElement('div', 
                { 
                    style: { 
                        marginBottom: '20px',
                        padding: '15px',
                        background: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    } 
                },
                React.createElement('h2', 
                    { 
                        style: { 
                            margin: 0, 
                            fontSize: '20px',
                            color: '#333'
                        } 
                    },
                    `📦 ${productos.length} productos encontrados`
                )
            ),

            // Grid de productos
            loading 
                ? React.createElement('div', { style: { textAlign: 'center', padding: '40px' } },
                    React.createElement('p', null, '🔄 Cargando productos...')
                  )
                : React.createElement('div', 
                    { 
                        className: 'productos-grid',
                        style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                            gap: '20px'
                        }
                    },
                    productos.length > 0
                        ? productos.map(producto => 
                            React.createElement(window.ProductCard || 'div', {
                                key: producto.idProducto,
                                product: producto
                            })
                          )
                        : React.createElement('div', 
                            { 
                                style: { 
                                    gridColumn: '1 / -1',
                                    textAlign: 'center',
                                    padding: '60px 20px',
                                    background: 'white',
                                    borderRadius: '8px'
                                } 
                            },
                            React.createElement('p', 
                                { style: { fontSize: '48px', margin: '0 0 20px 0' } }, 
                                '🔍'
                            ),
                            React.createElement('h3', 
                                { style: { color: '#666', margin: '0 0 10px 0' } },
                                'No se encontraron productos'
                            ),
                            React.createElement('p', 
                                { style: { color: '#999' } },
                                'Intenta ajustar los filtros'
                            )
                          )
                )
        )
    );
};

// ============================================================================
// 4. EJEMPLO DE INTEGRACIÓN EN index.html
// ============================================================================

/*
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>VelyKaPet - Catálogo con Filtros Avanzados</title>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
</head>
<body>
    <div id="root"></div>
    
    <!-- Cargar ApiService -->
    <script src="/src/api.js"></script>
    
    <!-- Cargar componente de filtros avanzados -->
    <script src="/src/components/AdvancedFilters.js"></script>
    
    <!-- Cargar componente de catálogo -->
    <script src="/src/components/CatalogWithAdvancedFilters.js"></script>
    
    <script>
        // Renderizar aplicación
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(
            React.createElement(window.CatalogoConFiltrosAvanzados)
        );
    </script>
</body>
</html>
*/

// ============================================================================
// 5. RESUMEN DE BENEFICIOS
// ============================================================================

/*
✅ BENEFICIOS DE LOS FILTROS AVANZADOS:

1. **Búsqueda Más Precisa**: Los usuarios pueden encontrar exactamente lo que necesitan
2. **Experiencia Mejorada**: Filtros en cascada que se adaptan a la selección previa
3. **Escalabilidad**: Fácil agregar nuevas categorías, subcategorías y presentaciones
4. **Rendimiento**: Filtrado del lado del servidor para manejar grandes catálogos
5. **Mantenibilidad**: Datos centralizados en tablas maestras
6. **Compatibilidad**: Mantiene filtros antiguos para no romper funcionalidad existente

🎯 CASOS DE USO:

- "Quiero ver alimento seco para gatos adultos"
  → idMascotaTipo=1, idCategoriaAlimento=2, idSubcategoria=6

- "Necesito snacks en presentación sobre"
  → idCategoriaAlimento=5, idPresentacion=3

- "Busco alimento para cachorros"
  → idMascotaTipo=2, idSubcategoria=3

📊 ESTADÍSTICAS:
- 4 dimensiones de filtrado
- Filtros en cascada inteligentes
- Compatibilidad con filtros anteriores
- API RESTful completa
*/

console.log('✅ Ejemplo de integración de filtros avanzados cargado');
console.log('📚 Ver GUIA_FILTROS_AVANZADOS.md para más información');
