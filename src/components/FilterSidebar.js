// VelyKapet - Filter Sidebar Component
// Sistema de filtros lateral estilo Amazon para productos de mascotas

console.log('🔍 Cargando Filter Sidebar Component...');

function FilterSidebar({ onFiltersChange, activeFilters = {}, productCounts = {} }) {
    const [expandedSections, setExpandedSections] = React.useState({
        pets: true,
        productType: true,
        snackBrands: false,
        foodBrands: false,
        price: true,
        rating: true,
        availability: true
    });

    const [priceRange, setPriceRange] = React.useState(activeFilters.maxPrice || 500000);

    // Configuración de filtros con las marcas reales
    const filterConfig = {
        pets: [
            { id: 'perros', label: 'Perros', icon: '🐕' },
            { id: 'gatos', label: 'Gatos', icon: '🐱' }
        ],
        productTypes: [
            { id: 'alimento', label: 'Alimento', icon: '🍖' },
            { id: 'snacks', label: 'Snacks y premios', icon: '🦴' },
            { id: 'juguetes', label: 'Juguetes', icon: '🎾' },
            { id: 'accesorios', label: 'Accesorios', icon: '🎀' },
            { id: 'higiene', label: 'Higiene y cuidado', icon: '🧴' }
        ],
        snackBrands: [
            { id: 'tiki-pets', label: 'TIKI PETS' },
            { id: 'inaba', label: 'INABA' },
            { id: 'evolve-snacks', label: 'EVOLVE' },
            { id: 'emerald-pet', label: 'EMERALD PET' },
            { id: 'loving-pets', label: 'LOVING PETS' }
        ],
        foodBrands: [
            { id: 'nulo', label: 'NULO' },
            { id: 'evolve-food', label: 'EVOLVE' },
            { id: 'sportmans-pride', label: 'SPORTMAN\'S PRIDE' },
            { id: 'kongo', label: 'KONGO' },
            { id: 'old-prince', label: 'OLD PRINCE' },
            { id: 'fawna', label: 'FAWNA' }
        ],
        ratings: [
            { id: '4.5', label: '4.5+', stars: '⭐⭐⭐⭐⭐' },
            { id: '4.0', label: '4.0+', stars: '⭐⭐⭐⭐' },
            { id: '3.5', label: '3.5+', stars: '⭐⭐⭐' }
        ],
        availability: [
            { id: 'in-stock', label: 'En stock', icon: '📦' },
            { id: 'free-shipping', label: 'Envío gratis', icon: '🚚' }
        ]
    };

    const handleFilterChange = (filterType, value, checked) => {
        const newFilters = { ...activeFilters };
        
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
                        item.stars && React.createElement('span', { style: { fontSize: '12px' } }, item.stars),
                        React.createElement('span', null, item.label),
                        React.createElement('span',
                            {
                                style: {
                                    marginLeft: 'auto',
                                    color: '#999',
                                    fontSize: '12px'
                                }
                            },
                            `(${productCounts[item.id] || 0})`
                        )
                    )
                )
            )
        );
    };

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

        // Filtros de mascotas
        renderFilterSection('MASCOTAS', filterConfig.pets, 'pets', '🐾', 'pets'),

        // Tipos de producto
        renderFilterSection('TIPO DE PRODUCTO', filterConfig.productTypes, 'productTypes', '📦', 'productType'),

        // Marcas de snacks
        renderFilterSection('MARCAS - SNACKS', filterConfig.snackBrands, 'snackBrands', '🦴', 'snackBrands'),

        // Marcas de alimento
        renderFilterSection('MARCAS - ALIMENTO', filterConfig.foodBrands, 'foodBrands', '🍖', 'foodBrands'),

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

        // Calificaciones
        renderFilterSection('CALIFICACIÓN', filterConfig.ratings, 'ratings', '⭐', 'rating'),

        // Disponibilidad
        renderFilterSection('DISPONIBILIDAD', filterConfig.availability, 'availability', '📦', 'availability'),

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