// VelyKapet - Filter Sidebar Component
// Sistema de filtros lateral estilo Amazon para productos de mascotas

console.log('🔍 Cargando Filter Sidebar Component...');

function FilterSidebar({ onFiltersChange, activeFilters = {}, productCounts = {} }) {
    const [expandedSections, setExpandedSections] = React.useState({
        pets: true,
        categoryFood: true,
        subcategory: false,
        presentation: false,
        price: true,
        availability: true
    });

    const [priceRange, setPriceRange] = React.useState(activeFilters.maxPrice || 500000);
    
    // Estados para las opciones dinámicas cargadas del backend
    const [mascotaTipos, setMascotaTipos] = React.useState([]);
    const [categoriasAlimento, setCategoriasAlimento] = React.useState([]);
    const [subcategorias, setSubcategorias] = React.useState([]);
    const [presentaciones, setPresentaciones] = React.useState([]);
    const [loadingFilters, setLoadingFilters] = React.useState(true);

    // Cargar opciones de filtros dinámicamente desde el backend
    React.useEffect(() => {
        const loadFilterOptions = async () => {
            try {
                console.log('📥 Cargando opciones de filtros desde backend...');
                
                // Esperar que ApiService esté disponible
                let apiService = window.ApiService;
                if (!apiService) {
                    console.log('⏳ Esperando ApiService...');
                    await new Promise(resolve => setTimeout(resolve, 500));
                    apiService = window.ApiService;
                }

                if (apiService) {
                    // Cargar todas las opciones en paralelo
                    const [mascotas, categorias, subs, presen] = await Promise.all([
                        apiService.getMascotaTipos().catch(e => { console.warn('⚠️ Error cargando mascotas:', e); return []; }),
                        apiService.getCategoriasAlimento().catch(e => { console.warn('⚠️ Error cargando categorías:', e); return []; }),
                        apiService.getSubcategorias().catch(e => { console.warn('⚠️ Error cargando subcategorías:', e); return []; }),
                        apiService.getPresentaciones().catch(e => { console.warn('⚠️ Error cargando presentaciones:', e); return []; })
                    ]);

                    console.log('✅ Opciones de filtros cargadas:', { 
                        mascotas: mascotas.length, 
                        categorias: categorias.length,
                        subcategorias: subs.length,
                        presentaciones: presen.length
                    });

                    setMascotaTipos(mascotas);
                    setCategoriasAlimento(categorias);
                    setSubcategorias(subs);
                    setPresentaciones(presen);
                } else {
                    console.error('❌ ApiService no disponible');
                }
            } catch (error) {
                console.error('❌ Error cargando opciones de filtros:', error);
            } finally {
                setLoadingFilters(false);
            }
        };

        loadFilterOptions();
    }, []);

    // Configuración de filtros de disponibilidad (estáticos)
    const availabilityOptions = [
        { id: 'in-stock', label: 'En stock', icon: '📦' },
        { id: 'free-shipping', label: 'Envío gratis', icon: '🚚' }
    ];

    const handleFilterChange = (filterType, value, checked) => {
        const newFilters = { ...activeFilters };
        
        // Para filtros de múltiple selección (checkbox)
        if (filterType === 'availability') {
            if (!newFilters[filterType]) {
                newFilters[filterType] = [];
            }

            if (checked) {
                if (!newFilters[filterType].includes(value)) {
                    newFilters[filterType].push(value);
                }
            } else {
                newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
            }
        } else {
            // Para filtros de selección única (radio - ID numéricos)
            if (checked) {
                newFilters[filterType] = value;
            } else {
                delete newFilters[filterType];
            }
        }

        onFiltersChange(newFilters);
    };

    const handlePriceChange = (newPrice) => {
        setPriceRange(newPrice);
        const newFilters = { ...activeFilters, maxPrice: newPrice };
        onFiltersChange(newFilters);
    };

    const clearAllFilters = () => {
        setPriceRange(500000);
        onFiltersChange({});
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Renderizar sección de filtro con radio buttons (selección única)
    const renderRadioFilterSection = (title, items, filterType, icon, sectionKey, activeValue) => {
        const isExpanded = expandedSections[sectionKey];
        
        return React.createElement('div',
            {
                className: 'filter-section',
                style: {
                    marginBottom: '20px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    background: 'white'
                }
            },
            
            // Header del filtro
            React.createElement('div',
                {
                    className: 'filter-header',
                    onClick: () => toggleSection(sectionKey),
                    style: {
                        padding: '12px 16px',
                        background: '#f8f9fa',
                        borderRadius: '8px 8px 0 0',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontWeight: '600',
                        fontSize: '14px',
                        color: '#333'
                    }
                },
                React.createElement('span',
                    { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                    icon && React.createElement('span', null, icon),
                    title
                ),
                React.createElement('span',
                    {
                        style: {
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease'
                        }
                    },
                    '▼'
                )
            ),
            
            // Contenido del filtro
            isExpanded && React.createElement('div',
                {
                    className: 'filter-content',
                    style: {
                        padding: '12px 16px',
                        maxHeight: '300px',
                        overflowY: 'auto'
                    }
                },
                // Opción "Todos" para limpiar el filtro
                React.createElement('label',
                    {
                        key: 'all',
                        className: 'filter-option',
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 0',
                            cursor: 'pointer',
                            fontSize: '13px',
                            color: '#555',
                            fontWeight: activeValue === null || activeValue === undefined ? '600' : '400'
                        }
                    },
                    React.createElement('input',
                        {
                            type: 'radio',
                            name: filterType,
                            checked: activeValue === null || activeValue === undefined,
                            onChange: () => {
                                const newFilters = { ...activeFilters };
                                delete newFilters[filterType];
                                onFiltersChange(newFilters);
                            },
                            style: {
                                width: '16px',
                                height: '16px'
                            }
                        }
                    ),
                    React.createElement('span', null, 'Todos')
                ),
                items.map(item => 
                    React.createElement('label',
                        {
                            key: item.IdMascotaTipo || item.IdCategoriaAlimento || item.IdSubcategoria || item.IdPresentacion,
                            className: 'filter-option',
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '6px 0',
                                cursor: 'pointer',
                                fontSize: '13px',
                                color: '#555'
                            }
                        },
                        React.createElement('input',
                            {
                                type: 'radio',
                                name: filterType,
                                checked: activeValue === (item.IdMascotaTipo || item.IdCategoriaAlimento || item.IdSubcategoria || item.IdPresentacion),
                                onChange: (e) => handleFilterChange(filterType, item.IdMascotaTipo || item.IdCategoriaAlimento || item.IdSubcategoria || item.IdPresentacion, e.target.checked),
                                style: {
                                    width: '16px',
                                    height: '16px'
                                }
                            }
                        ),
                        React.createElement('span', null, item.Nombre),
                        React.createElement('span',
                            {
                                style: {
                                    marginLeft: 'auto',
                                    color: '#999',
                                    fontSize: '12px'
                                }
                            },
                            productCounts[item.IdMascotaTipo || item.IdCategoriaAlimento || item.IdSubcategoria || item.IdPresentacion] !== undefined 
                                ? `(${productCounts[item.IdMascotaTipo || item.IdCategoriaAlimento || item.IdSubcategoria || item.IdPresentacion]})`
                                : ''
                        )
                    )
                )
            )
        );
    };

    const renderFilterSection = (title, items, filterType, icon, sectionKey) => {
        const isExpanded = expandedSections[sectionKey];
        
        return React.createElement('div',
            {
                className: 'filter-section',
                style: {
                    marginBottom: '20px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    background: 'white'
                }
            },
            
            // Header del filtro
            React.createElement('div',
                {
                    className: 'filter-header',
                    onClick: () => toggleSection(sectionKey),
                    style: {
                        padding: '12px 16px',
                        background: '#f8f9fa',
                        borderRadius: '8px 8px 0 0',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontWeight: '600',
                        fontSize: '14px',
                        color: '#333'
                    }
                },
                React.createElement('span',
                    { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                    icon && React.createElement('span', null, icon),
                    title
                ),
                React.createElement('span',
                    {
                        style: {
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease'
                        }
                    },
                    '▼'
                )
            ),
            
            // Contenido del filtro
            isExpanded && React.createElement('div',
                {
                    className: 'filter-content',
                    style: {
                        padding: '12px 16px',
                        maxHeight: '200px',
                        overflowY: 'auto'
                    }
                },
                items.map(item => 
                    React.createElement('label',
                        {
                            key: item.id,
                            className: 'filter-option',
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '6px 0',
                                cursor: 'pointer',
                                fontSize: '13px',
                                color: '#555'
                            }
                        },
                        React.createElement('input',
                            {
                                type: 'checkbox',
                                checked: activeFilters[filterType]?.includes(item.id) || false,
                                onChange: (e) => handleFilterChange(filterType, item.id, e.target.checked),
                                style: {
                                    width: '16px',
                                    height: '16px'
                                }
                            }
                        ),
                        item.icon && React.createElement('span', { style: { fontSize: '16px' } }, item.icon),
                        React.createElement('span', null, item.label),
                        React.createElement('span',
                            {
                                style: {
                                    marginLeft: 'auto',
                                    color: '#999',
                                    fontSize: '12px'
                                }
                            },
                            productCounts[item.id] !== undefined ? `(${productCounts[item.id]})` : ''
                        )
                    )
                )
            )
        );
    };

    if (loadingFilters) {
        return React.createElement('aside',
            {
                className: 'filter-sidebar',
                style: {
                    width: '280px',
                    background: '#f8f9fa',
                    padding: '25px',
                    borderRadius: '12px',
                    height: 'fit-content',
                    position: 'sticky',
                    top: '20px'
                }
            },
            React.createElement('div',
                { style: { textAlign: 'center', padding: '20px' } },
                React.createElement('div',
                    {
                        style: {
                            width: '40px',
                            height: '40px',
                            border: '4px solid #f3f3f3',
                            borderTop: '4px solid #E45A84',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 10px'
                        }
                    }
                ),
                React.createElement('p', { style: { color: '#666', fontSize: '14px' } }, 'Cargando filtros...')
            )
        );
    }

    return React.createElement('aside',
        {
            className: 'filter-sidebar',
            style: {
                width: '280px', // Compacto para dejar más espacio a los productos
                background: '#f8f9fa',
                padding: '25px', // Más padding
                borderRadius: '12px', // Bordes más redondeados
                height: 'fit-content',
                position: 'sticky',
                top: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)' // Sombra sutil
            }
        },
        
        // Header del sidebar
        React.createElement('div',
            {
                className: 'sidebar-header',
                style: {
                    marginBottom: '20px',
                    paddingBottom: '15px',
                    borderBottom: '2px solid #e0e0e0'
                }
            },
            React.createElement('h3',
                {
                    style: {
                        margin: '0',
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#333',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }
                },
                '🔍', 'FILTROS'
            )
        ),

        // Búsqueda rápida
        React.createElement('div',
            {
                className: 'quick-search',
                style: { marginBottom: '20px' }
            },
            React.createElement('input',
                {
                    type: 'text',
                    placeholder: 'Buscar productos...',
                    style: {
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                    },
                    onChange: (e) => {
                        const newFilters = { ...activeFilters, search: e.target.value };
                        onFiltersChange(newFilters);
                    }
                }
            )
        ),

        // Filtros de mascotas (usando IDs del backend)
        mascotaTipos.length > 0 && renderRadioFilterSection(
            'TIPO DE MASCOTA', 
            mascotaTipos, 
            'idMascotaTipo', 
            '🐾', 
            'pets',
            activeFilters.idMascotaTipo
        ),

        // Categorías de alimento (usando IDs del backend)
        categoriasAlimento.length > 0 && renderRadioFilterSection(
            'CATEGORÍA DE ALIMENTO', 
            categoriasAlimento, 
            'idCategoriaAlimento', 
            '🍖', 
            'categoryFood',
            activeFilters.idCategoriaAlimento
        ),

        // Subcategorías (usando IDs del backend)
        subcategorias.length > 0 && renderRadioFilterSection(
            'SUBCATEGORÍA', 
            subcategorias, 
            'idSubcategoria', 
            '📋', 
            'subcategory',
            activeFilters.idSubcategoria
        ),

        // Presentaciones (usando IDs del backend)
        presentaciones.length > 0 && renderRadioFilterSection(
            'PRESENTACIÓN', 
            presentaciones, 
            'idPresentacion', 
            '📦', 
            'presentation',
            activeFilters.idPresentacion
        ),

        // Filtro de precio
        React.createElement('div',
            {
                className: 'filter-section',
                style: {
                    marginBottom: '20px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    background: 'white'
                }
            },
            React.createElement('div',
                {
                    className: 'filter-header',
                    onClick: () => toggleSection('price'),
                    style: {
                        padding: '12px 16px',
                        background: '#f8f9fa',
                        borderRadius: '8px 8px 0 0',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontWeight: '600',
                        fontSize: '14px',
                        color: '#333'
                    }
                },
                React.createElement('span',
                    { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                    '💰', 'PRECIO'
                ),
                React.createElement('span',
                    {
                        style: {
                            transform: expandedSections.price ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease'
                        }
                    },
                    '▼'
                )
            ),
            expandedSections.price && React.createElement('div',
                {
                    style: { padding: '16px' }
                },
                React.createElement('div',
                    {
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '10px',
                            fontSize: '13px',
                            color: '#666'
                        }
                    },
                    React.createElement('span', null, '$0'),
                    React.createElement('span', { style: { fontWeight: '600', color: '#333' } }, 
                        window.formatCOP ? window.formatCOP(priceRange) : `$${priceRange.toLocaleString()}`
                    ),
                    React.createElement('span', null, '$500,000')
                ),
                React.createElement('input',
                    {
                        type: 'range',
                        min: '0',
                        max: '500000',
                        step: '10000',
                        value: priceRange,
                        onChange: (e) => handlePriceChange(parseInt(e.target.value)),
                        style: {
                            width: '100%',
                            appearance: 'none',
                            height: '6px',
                            background: '#ddd',
                            borderRadius: '3px',
                            outline: 'none'
                        }
                    }
                )
            )
        ),

        // Disponibilidad (checkboxes)
        renderFilterSection('DISPONIBILIDAD', availabilityOptions, 'availability', '📦', 'availability'),

        // Botón limpiar filtros
        React.createElement('button',
            {
                onClick: clearAllFilters,
                style: {
                    width: '100%',
                    padding: '12px',
                    background: '#e9ecef',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    color: '#666',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginTop: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                },
                onMouseEnter: (e) => {
                    e.target.style.background = '#dee2e6';
                    e.target.style.color = '#333';
                },
                onMouseLeave: (e) => {
                    e.target.style.background = '#e9ecef';
                    e.target.style.color = '#666';
                }
            },
            '🔄', 'LIMPIAR FILTROS'
        )
    );
}

// Registrar el componente globalmente
window.FilterSidebar = FilterSidebar;

console.log('✅ Filter Sidebar Component cargado');