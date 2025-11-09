// VentasPet - Hero Categories Component
// Cards principales para Perrolandia y Gatolandia

console.log('🏠 Cargando Hero Categories Component...');

// Función para verificar que el componente se registra correctamente
function HeroCategoriesComponent() {
    console.log('🏠 DEBUG: HeroCategoriesComponent ejecutándose...', React, ReactDOM);
    const [hoveredCard, setHoveredCard] = React.useState(null);
    
    const categories = [
        {
            id: 'perrolandia',
            title: 'Perrolandia',
            subtitle: 'Todo para tu mejor amigo',
            description: 'Descubre productos especiales para perros de todas las edades y tamaños',
            icon: '🐕',
            image: './perro_card_img.jpg',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            shadowColor: 'rgba(102, 126, 234, 0.4)',
            productCount: '250+ productos',
            highlights: ['Alimento premium', 'Juguetes', 'Accesorios', 'Cuidado e higiene']
        },
        {
            id: 'gatolandia',
            title: 'Gatolandia',
            subtitle: 'Para tu felino especial',
            description: 'Encuentra todo lo que tu gato necesita para estar feliz y saludable',
            icon: '🐱',
            image: './gato_card_img.jpg',
            gradient: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)',
            shadowColor: 'rgba(74, 144, 226, 0.4)',
            productCount: '180+ productos',
            highlights: ['Arena y bandejas', 'Rascadores', 'Snacks felinos', 'Juguetes interactivos']
        }
    ];
    
    const handleCategoryClick = (categoryId) => {
        console.log(`🎯 Click en ${categoryId}`);
        // Aquí se puede filtrar productos por categoría
        if (window.setCurrentView) {
            window.setCurrentView('catalog');
        }
        
        // Si hay sistema de filtros, aplicar filtro
        if (window.ProductCatalog && window.ProductCatalog.filterByCategory) {
            window.ProductCatalog.filterByCategory(categoryId);
        }
    };
    
    const handleMouseEnter = (categoryId) => {
        setHoveredCard(categoryId);
    };
    
    const handleMouseLeave = () => {
        setHoveredCard(null);
    };
    
    return React.createElement('section',
        {
            className: 'hero-categories',
            style: {
                            padding: '40px 20px',
                            maxWidth: '900px',
                            margin: '0 auto'
            }
        },
        
        // Título de la sección
        React.createElement('div',
            {
                className: 'hero-header',
                style: {
                            textAlign: 'center',
                            marginBottom: '20px'
                }
            },
            React.createElement('h1',
                {
                    className: 'hero-title',
                    style: {
                        fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                        fontWeight: '800',
                        background: 'linear-gradient(45deg, var(--primary-color), var(--secondary-color))',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '16px',
                        fontFamily: 'var(--font-family-secondary)'
                    }
                },
                '🐾 ¿Qué estás buscando?'
            ),
            React.createElement('p',
                {
                    className: 'hero-subtitle',
                    style: {
                        fontSize: 'var(--font-size-lg)',
                        color: 'var(--gray-600)',
                        maxWidth: '600px',
                        margin: '0 auto',
                        lineHeight: '1.6'
                    }
                },
                'Selecciona la categoría perfecta para tu compañero'
            )
        ),
        
        // Grid de categorías - 2 columnas fijas
        React.createElement('div',
            {
                className: 'categories-grid',
                style: {
                     display: 'grid',
                     gridTemplateColumns: 'repeat(2, 1fr)',
                     gap: '12px',
                     alignItems: 'stretch',
                     maxWidth: '800px',
                     margin: '0 auto'
                 }
            },
            
            categories.map(category =>
                React.createElement('div',
                    {
                        key: category.id,
                        className: `category-card ${hoveredCard === category.id ? 'hovered' : ''}`,
                        onClick: () => handleCategoryClick(category.id),
                        onMouseEnter: () => handleMouseEnter(category.id),
                        onMouseLeave: handleMouseLeave,
                        style: {
                            backgroundImage: `linear-gradient(${category.gradient.replace('linear-gradient(', '').replace(')', '')}, rgba(0,0,0,0.4)), url(${category.image}), url(http://localhost:3000${category.image.replace('./', '/')}), url(${category.image.replace('./', '/images/')})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            borderRadius: 'var(--border-radius-xl)',
                            padding: '15px 12px',
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: hoveredCard === category.id ? 
                                `0 20px 40px ${category.shadowColor}` : 
                                `0 10px 20px rgba(0, 0, 0, 0.1)`,
                            transform: hoveredCard === category.id ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
                            transition: 'all var(--transition-normal)',
                            color: 'white',
                            minHeight: '160px',
                            display: 'flex',
                            flexDirection: 'column',
                            maxWidth: '380px',
                            justifyContent: 'space-between'
                        }
                    },
                        
                    // Overlay para mejor legibilidad
                    React.createElement('div',
                        {
                            className: 'category-overlay',
                            style: {
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: hoveredCard === category.id ? 
                                    'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.5)',
                                transition: 'background var(--transition-normal)',
                                zIndex: 1,
                                pointerEvents: 'none'
                            }
                        }
                    ),
                    
                    // Patrón de fondo decorativo
                    React.createElement('div',
                        {
                            className: 'category-pattern',
                            style: {
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: '120px',
                                height: '120px',
                                opacity: 0.15,
                                fontSize: '4rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transform: 'rotate(15deg)',
                                pointerEvents: 'none',
                                zIndex: 2,
                                textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                            }
                        },
                        category.icon
                    ),
                    
                    // Contenido principal
                    React.createElement('div',
                        { 
                            className: 'category-content',
                            style: {
                                position: 'relative',
                                zIndex: 3,
                                textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                            }
                        },
                        
                        // Header con icono y título
                        React.createElement('div',
                            {
                                className: 'category-header',
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: '10px'
                                }
                            },
                            React.createElement('div',
                                {
                                    className: 'category-icon',
                                    style: {
                                        fontSize: '3rem',
                                        marginRight: '16px',
                                        filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.2))'
                                    }
                                },
                                category.icon
                            ),
                            React.createElement('div',
                                { className: 'category-title-group' },
                                React.createElement('h2',
                                    {
                                        className: 'category-title',
                                        style: {
                                            fontSize: '1.8rem',
                                            fontWeight: '700',
                                            margin: '0 0 4px',
                                            textShadow: '3px 3px 6px rgba(0, 0, 0, 0.8)',
                                            fontFamily: 'var(--font-family-secondary)',
                                            color: '#ffffff'
                                        }
                                    },
                                    category.title
                                ),
                                React.createElement('p',
                                    {
                                        className: 'category-subtitle',
                                        style: {
                                            fontSize: '1rem',
                                            margin: 0,
                                            opacity: 0.95,
                                            fontWeight: '500',
                                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
                                            color: '#ffffff'
                                        }
                                    },
                                    category.subtitle
                                )
                            )
                        ),
                        
                        // Descripción
                        React.createElement('p',
                            {
                                className: 'category-description',
                                style: {
                                    fontSize: 'var(--font-size-base)',
                                    lineHeight: '1.6',
                                    opacity: 0.95,
                                    marginBottom: '12px',
                                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
                                    color: '#ffffff'
                                }
                            },
                            category.description
                        ),
                        
                        // Highlights
                        React.createElement('div',
                            {
                                className: 'category-highlights',
                                style: {
                                    marginBottom: '12px'
                                }
                            },
                            React.createElement('h4',
                                {
                                    style: {
                                        fontSize: 'var(--font-size-sm)',
                                        fontWeight: '600',
                                        marginBottom: '12px',
                                        opacity: 0.8,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }
                                },
                                'Productos destacados:'
                            ),
                            React.createElement('div',
                                {
                                    className: 'highlights-grid',
                                    style: {
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(2, 1fr)',
                                        gap: '8px'
                                    }
                                },
                                category.highlights.map((highlight, index) =>
                                    React.createElement('div',
                                        {
                                            key: index,
                                            className: 'highlight-item',
                                            style: {
                                                fontSize: 'var(--font-size-sm)',
                                                opacity: 0.9,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }
                                        },
                                        React.createElement('span', { style: { fontSize: '12px' } }, '✨'),
                                        highlight
                                    )
                                )
                            )
                        )
                    ),
                    
                    // Footer con stats y CTA
                    React.createElement('div',
                        {
                            className: 'category-footer',
                            style: {
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: 'auto',
                                paddingTop: '12px',
                                borderTop: '1px solid rgba(255, 255, 255, 0.2)'
                            }
                        },
                        React.createElement('span',
                            {
                                className: 'product-count',
                                style: {
                                    fontSize: 'var(--font-size-sm)',
                                    fontWeight: '600',
                                    opacity: 0.9
                                }
                            },
                            category.productCount
                        ),
                        React.createElement('div',
                            {
                                className: 'cta-button',
                                style: {
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    borderRadius: '25px',
                                    padding: '10px 20px',
                                    fontSize: 'var(--font-size-sm)',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    transition: 'all var(--transition-fast)',
                                    transform: hoveredCard === category.id ? 'scale(1.05)' : 'scale(1)'
                                }
                            },
                            'Explorar',
                            React.createElement('span', 
                                { 
                                    style: { 
                                        transform: hoveredCard === category.id ? 'translateX(4px)' : 'translateX(0)',
                                        transition: 'transform var(--transition-fast)'
                                    } 
                                }, 
                                '→'
                            )
                        )
                    )
                )
            )
        )
    );
}

// Registrar el componente globalmente
window.HeroCategoriesComponent = HeroCategoriesComponent;

// Estilos CSS adicionales para animaciones avanzadas
const heroStyles = document.createElement('style');
heroStyles.textContent = `
    .hero-categories {
        position: relative;
    }
    
    .category-card {
        position: relative;
        isolation: isolate;
    }
    
    .category-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: inherit;
        border-radius: inherit;
        opacity: 0;
        transition: opacity var(--transition-normal);
        z-index: -1;
    }
    
    .category-card.hovered::before {
        opacity: 0.1;
    }
    
    .category-card .cta-button:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: scale(1.08);
    }
    
    @media (max-width: 768px) {
        .hero-categories {
            padding: 30px 16px !important;
            max-width: 600px !important;
        }
        
        .categories-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
            max-width: none !important;
        }
        
        .category-card {
            padding: 12px 10px !important;
            min-height: 140px !important;
            max-width: none !important;
        }
        
        .category-icon {
            font-size: 2.5rem !important;
        }
        
        .category-pattern {
            font-size: 6rem !important;
            width: 120px !important;
            height: 120px !important;
        }
        
        .highlights-grid {
            grid-template-columns: 1fr !important;
        }
    }
    
    @media (max-width: 480px) {
        .hero-categories {
            padding: 15px 10px !important;
            max-width: 100% !important;
        }
        
        .category-card {
            padding: 12px 10px !important;
            min-height: 140px !important;
            max-width: none !important;
        }
    }
`;

document.head.appendChild(heroStyles);

console.log('✅ Hero Categories Component cargado');