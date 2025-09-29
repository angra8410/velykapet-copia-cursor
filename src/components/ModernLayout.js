// Layout Principal Moderno para VentasPet
// Integra Header, Navegación y Contenido

console.log('🎨 Cargando Modern Layout Component...');

window.ModernLayoutComponent = function({ children, currentView, currentUser }) {
    console.log('🏠 DEBUG ModernLayout: Renderizando con vista:', currentView, 'Usuario:', !!currentUser);
    const [selectedCategory, setSelectedCategory] = React.useState(null);
    
    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        console.log('📂 Categoría cambiada:', categoryId);
        
        // Si hay un catálogo de productos, aplicar el filtro
        if (window.ProductCatalog && window.ProductCatalog.filterByCategory) {
            window.ProductCatalog.filterByCategory(categoryId);
        }
    };
    
    // Verificar si debe mostrar la navegación de categorías
    const shouldShowCategoryNav = currentView === 'catalog' || currentView === 'dashboard' || currentView === 'home';
    
    return React.createElement('div',
        {
            className: 'modern-layout',
            style: {
                minHeight: '100vh',
                background: '#ffffff',
                display: 'flex',
                flexDirection: 'column'
            }
        },
        
        // Header moderno - SIEMPRE VISIBLE Y CONSISTENTE
        (() => {
            console.log('📝 DEBUG ModernLayout: HeaderComponent disponible:', !!window.HeaderComponent);
            if (window.HeaderComponent) {
                console.log('✅ Renderizando HeaderComponent');
                return React.createElement(window.HeaderComponent);
            } else {
                console.log('⚠️ HeaderComponent NO disponible - Renderizando header básico');
                // Fallback: header básico pero funcional - VIEWPORT COMPLETO
                return React.createElement('header',
                    {
                        style: {
                            background: 'white',
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                            position: 'sticky',
                            top: 0,
                            left: 0,
                            right: 0,
                            zIndex: 1000,
                            minHeight: '70px',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '15px 2rem',
                            width: '100vw', // Viewport completo
                            maxWidth: '100vw', // Sin limitaciones
                            margin: '0' // Sin margin
                        }
                    },
                    React.createElement('div',
                        {
                            style: {
                                color: '#333',
                                fontSize: '1.5rem',
                                fontWeight: '700',
                                cursor: 'pointer'
                            },
                            onClick: () => {
                                if (window.setCurrentView) {
                                    window.setCurrentView('home');
                                }
                            }
                        },
                        '🐾 VelyKapet'
                    )
                );
            }
        })(),
        
        // Contenido principal
        React.createElement('main',
            {
                className: 'main-content',
                style: {
                    flex: 1,
                    padding: '0',
                    background: '#ffffff'
                }
            },
            
            // Container principal - VIEWPORT VISUAL COMPLETO PARA TODAS LAS SECCIONES
            React.createElement('div',
                {
                    className: 'container-full-viewport-visual',
                    style: {
                        // VIEWPORT VISUAL COMPLETO - SIN LIMITACIONES
                        width: '100vw', // TODO EL ANCHO DEL VIEWPORT
                        maxWidth: '100vw', // SIN LIMITACIONES MÁXIMAS
                        minWidth: '100vw', // GARANTIZAR ANCHO COMPLETO
                        margin: '0', // SIN MARGIN QUE CENTRE O LIMITE
                        padding: currentView === 'catalog' ? '10px 1rem' : 
                                currentView === 'home' ? '15px 2rem' : '15px 1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: currentView === 'catalog' ? '15px' : '20px',
                        minHeight: 'calc(100vh - 80px)', // Altura completa
                        backgroundColor: 'transparent',
                        position: 'relative', // Para posicionamiento correcto
                        left: '50%', // Centrado pero ocupando todo el viewport
                        transform: 'translateX(-50%)', // Ajuste para centrado perfecto
                        overflow: 'visible' // Sin restricciones de overflow
                    }
                },
                
                // Banner eliminado por solicitud del usuario
                
                // Hero Categories - Navegación principal
                shouldShowCategoryNav && window.HeroCategoriesComponent && React.createElement(window.HeroCategoriesComponent),
                
                // Contenido dinámico
                React.createElement('div',
                    {
                        className: 'dynamic-content',
                        style: {
                            flex: 1
                        }
                    },
                    children
                )
            )
        )
    );
};

console.log('✅ Modern Layout Component cargado');