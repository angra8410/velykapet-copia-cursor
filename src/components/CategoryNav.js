// Navegación de Categorías para VentasPet
// Perros y Gatos con subcategorías modernas

console.log('📂 Cargando Category Navigation Component...');

window.CategoryNavComponent = function({ onCategoryChange, selectedCategory }) {
    const [expandedCategory, setExpandedCategory] = React.useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    
    const categories = [
        {
            id: 'perros',
            name: 'Perros',
            emoji: '🐕',
            color: '#E45A84',
            subcategories: [
                { id: 'medicamentos-perros', name: 'Medicamentos', icon: '💊' },
                { id: 'comida-perros', name: 'Comidas', icon: '🍖' },
                { id: 'suplementos-perros', name: 'Suplementos', icon: '🧪' },
                { id: 'accesorios-perros', name: 'Accesorios', icon: '🦴' },
                { id: 'juguetes-perros', name: 'Juguetes', icon: '🎾' },
                { id: 'higiene-perros', name: 'Higiene', icon: '🧼' }
            ]
        },
        {
            id: 'gatos',
            name: 'Gatos',
            emoji: '🐱',
            color: '#4A90E2',
            subcategories: [
                { id: 'medicamentos-gatos', name: 'Medicamentos', icon: '💊' },
                { id: 'comida-gatos', name: 'Comidas', icon: '🐟' },
                { id: 'suplementos-gatos', name: 'Suplementos', icon: '🧪' },
                { id: 'accesorios-gatos', name: 'Accesorios', icon: '🎀' },
                { id: 'juguetes-gatos', name: 'Juguetes', icon: '🧶' },
                { id: 'arena-gatos', name: 'Arena', icon: '📦' }
            ]
        }
    ];
    
    const handleCategoryClick = (categoryId, subcategoryId = null) => {
        const category = subcategoryId || categoryId;
        if (onCategoryChange) {
            onCategoryChange(category);
        }
        console.log('📂 Categoría seleccionada:', category);
        
        // Cerrar menú móvil después de seleccionar
        if (window.innerWidth <= 768) {
            setIsMobileMenuOpen(false);
        }
    };
    
    const toggleCategory = (categoryId) => {
        setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    };
    
    // Versión Desktop
    const DesktopNav = React.createElement('div',
        {
            className: 'category-nav-desktop',
            style: {
                display: window.innerWidth > 768 ? 'block' : 'none',
                background: 'white',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                borderRadius: '15px',
                padding: '20px',
                marginBottom: '20px'
            }
        },
        
        // Título
        React.createElement('h3',
            {
                className: 'heading-3',
                style: {
                    margin: '0 0 20px 0',
                    color: '#333',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }
            },
            '🏷️ Categorías'
        ),
        
        // Todas las categorías
        React.createElement('div',
            {
                className: 'category-grid',
                style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '20px'
                }
            },
            
            categories.map(category =>
                React.createElement('div',
                    {
                        key: category.id,
                        className: 'category-section',
                        style: {
                            background: selectedCategory === category.id ? `${category.color}10` : '#f8f9fa',
                            border: selectedCategory === category.id ? `2px solid ${category.color}` : '2px solid transparent',
                            borderRadius: '12px',
                            padding: '15px',
                            transition: 'all 0.3s ease'
                        }
                    },
                    
                    // Header de categoría
                    React.createElement('button',
                        {
                            onClick: () => handleCategoryClick(category.id),
                            style: {
                                width: '100%',
                                background: 'none',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '10px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                marginBottom: '10px',
                                backgroundColor: selectedCategory === category.id ? category.color : 'transparent'
                            },
                            onMouseEnter: (e) => {
                                if (selectedCategory !== category.id) {
                                    e.target.style.backgroundColor = `${category.color}20`;
                                }
                            },
                            onMouseLeave: (e) => {
                                if (selectedCategory !== category.id) {
                                    e.target.style.backgroundColor = 'transparent';
                                }
                            }
                        },
                        
                        React.createElement('span', 
                            { style: { fontSize: '24px' } }, 
                            category.emoji
                        ),
                        React.createElement('span',
                            {
                                style: {
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    color: selectedCategory === category.id ? 'white' : '#333',
                                    flex: 1,
                                    textAlign: 'left'
                                }
                            },
                            category.name
                        )
                    ),
                    
                    // Subcategorías
                    React.createElement('div',
                        {
                            className: 'subcategories',
                            style: {
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '8px'
                            }
                        },
                        
                        category.subcategories.map(sub =>
                            React.createElement('button',
                                {
                                    key: sub.id,
                                    onClick: () => handleCategoryClick(category.id, sub.id),
                                    style: {
                                        background: selectedCategory === sub.id ? category.color : 'transparent',
                                        color: selectedCategory === sub.id ? 'white' : '#666',
                                        border: selectedCategory === sub.id ? 'none' : '1px solid #ddd',
                                        borderRadius: '6px',
                                        padding: '8px 12px',
                                        fontSize: '13px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        fontWeight: selectedCategory === sub.id ? '600' : '400'
                                    },
                                    onMouseEnter: (e) => {
                                        if (selectedCategory !== sub.id) {
                                            e.target.style.backgroundColor = `${category.color}15`;
                                            e.target.style.borderColor = category.color;
                                            e.target.style.color = category.color;
                                        }
                                    },
                                    onMouseLeave: (e) => {
                                        if (selectedCategory !== sub.id) {
                                            e.target.style.backgroundColor = 'transparent';
                                            e.target.style.borderColor = '#ddd';
                                            e.target.style.color = '#666';
                                        }
                                    }
                                },
                                React.createElement('span', null, sub.icon),
                                React.createElement('span', null, sub.name)
                            )
                        )
                    )
                )
            )
        )
    );
    
    // Versión Móvil
    const MobileNav = React.createElement('div',
        {
            className: 'category-nav-mobile',
            style: {
                display: window.innerWidth <= 768 ? 'block' : 'none'
            }
        },
        
        // Botón de menú móvil
        React.createElement('button',
            {
                onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen),
                style: {
                    width: '100%',
                    background: 'white',
                    border: '2px solid #E45A84',
                    borderRadius: '12px',
                    padding: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#E45A84',
                    cursor: 'pointer',
                    marginBottom: '10px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }
            },
            React.createElement('span',
                {
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }
                },
                React.createElement('span', null, '🏷️'),
                React.createElement('span', null, 'Categorías')
            ),
            React.createElement('span',
                {
                    style: {
                        transform: isMobileMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease'
                    }
                },
                '▼'
            )
        ),
        
        // Menú móvil desplegable
        isMobileMenuOpen && React.createElement('div',
            {
                className: 'mobile-menu',
                style: {
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                    overflow: 'hidden',
                    marginBottom: '20px',
                    animation: 'fadeIn 0.3s ease-out'
                }
            },
            
            categories.map((category, index) =>
                React.createElement('div',
                    {
                        key: category.id,
                        style: {
                            borderBottom: index < categories.length - 1 ? '1px solid #f0f0f0' : 'none'
                        }
                    },
                    
                    // Header de categoría móvil
                    React.createElement('button',
                        {
                            onClick: () => toggleCategory(category.id),
                            style: {
                                width: '100%',
                                background: 'none',
                                border: 'none',
                                padding: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: '600'
                            }
                        },
                        React.createElement('div',
                            {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }
                            },
                            React.createElement('span', { style: { fontSize: '20px' } }, category.emoji),
                            React.createElement('span', { color: category.color }, category.name)
                        ),
                        React.createElement('span',
                            {
                                style: {
                                    transform: expandedCategory === category.id ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.3s ease',
                                    color: category.color
                                }
                            },
                            '▼'
                        )
                    ),
                    
                    // Subcategorías móvil
                    expandedCategory === category.id && React.createElement('div',
                        {
                            className: 'mobile-subcategories',
                            style: {
                                background: '#f8f9fa',
                                padding: '10px'
                            }
                        },
                        
                        category.subcategories.map(sub =>
                            React.createElement('button',
                                {
                                    key: sub.id,
                                    onClick: () => handleCategoryClick(category.id, sub.id),
                                    style: {
                                        width: '100%',
                                        background: selectedCategory === sub.id ? category.color : 'white',
                                        color: selectedCategory === sub.id ? 'white' : '#333',
                                        border: selectedCategory === sub.id ? 'none' : '1px solid #ddd',
                                        borderRadius: '8px',
                                        padding: '10px 15px',
                                        margin: '5px 0',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        textAlign: 'left'
                                    }
                                },
                                React.createElement('span', null, sub.icon),
                                React.createElement('span', null, sub.name)
                            )
                        )
                    )
                )
            )
        )
    );
    
    return React.createElement('div',
        {
            className: 'category-navigation'
        },
        DesktopNav,
        MobileNav
    );
};

console.log('✅ Category Navigation Component cargado');