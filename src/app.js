// VentasPet - React App con JavaScript puro (sin JSX)
// Vamos a usar React.createElement() para evitar problemas de transpilación

console.log('🚀 Cargando React App...');

// Añadir estilo para compensar el header fijo
const headerSpacerStyle = document.createElement('style');
headerSpacerStyle.textContent = `
    body {
        padding-top: 80px; /* Mismo tamaño que el header */
    }
`;
document.head.appendChild(headerSpacerStyle);

// Verificar que React esté disponible
if (typeof React === 'undefined') {
    console.error('❌ React no está disponible');
    document.getElementById('root').innerHTML = `
        <div style="padding: 20px; background: #f8d7da; color: #721c24; border-radius: 8px; margin: 20px;">
            <h2>❌ Error: React no encontrado</h2>
            <p>React no se pudo cargar desde CDN.</p>
        </div>
    `;
} else {
    console.log('✅ React disponible:', React.version);
    
    // Componente principal usando React.createElement
    function App() {
        const [mensaje, setMensaje] = React.useState('Inicializando React...');
        const [contador, setContador] = React.useState(0);
        const [backendStatus, setBackendStatus] = React.useState({ testing: true, connected: false, message: 'Probando conexión...' });
        const [productos, setProductos] = React.useState([]);
        const [currentUser, setCurrentUser] = React.useState(null);
        const [currentView, setCurrentView] = React.useState('home'); // 'home', 'catalog', 'cart', 'dashboard', 'product'
        const [selectedProduct, setSelectedProduct] = React.useState(null);
        
        // Exponer setCurrentView, getCurrentView y funciones de producto globalmente para otros componentes
        window.setCurrentView = setCurrentView;
        window.getCurrentView = () => currentView;
        window.setSelectedProduct = setSelectedProduct;
        window.getSelectedProduct = () => selectedProduct;
        window.viewProductDetails = (product) => {
            setSelectedProduct(product);
            setCurrentView('product');
        };
        
        // Efecto para simular carga y probar backend
        React.useEffect(() => {
            console.log('🔄 useEffect ejecutándose...');
            
            // Actualizar mensaje de React
            setTimeout(() => {
                setMensaje('¡React funcionando correctamente!');
            }, 1000);
            
            // Probar conexión con backend
            const testBackend = async () => {
                try {
                    console.log('🔍 Probando conexión con backend...');
                    const result = await window.ApiService.testConnection();
                    
                    setBackendStatus({
                        testing: false,
                        connected: result.connected,
                        message: result.message
                    });
                    
                    if (result.connected && result.data) {
                        setProductos(result.data.slice(0, 3)); // Mostrar solo 3 productos como preview
                    }
                    
                } catch (error) {
                    console.error('❌ Error probando backend:', error);
                    setBackendStatus({
                        testing: false,
                        connected: false,
                        message: 'Error de conexión: ' + error.message
                    });
                }
            };
            
            // Esperar un poco antes de probar el backend
            setTimeout(testBackend, 2000);
            
            // Suscribirse a cambios de usuario (solo una vez)
            if (window.authManager) {
                const handleUserChange = (user) => {
                    setCurrentUser(user);
                    // Si cierra sesión, volver al dashboard
                    if (!user) {
                        setCurrentView('dashboard');
                    }
                };
                
                window.authManager.subscribe(handleUserChange);
                setCurrentUser(window.authManager.getUser());
                
                // Si ya está autenticado al cargar, mantener la vista actual
                // No forzar ninguna redirección automática
                if (window.authManager.isAuthenticated()) {
                    console.log('✅ Usuario autenticado - manteniendo vista actual:', currentView);
                }
            }
            
        }, []); // ← Sin dependencias para evitar loops
        
        // Si hay componentes modernos disponibles, usar el layout moderno
        if (window.ModernLayoutComponent) {
            return React.createElement(window.ModernLayoutComponent,
                {
                    currentView: currentView,
                    currentUser: currentUser
                },
                // Contenido específico de cada vista
                (() => {
                    if (currentView === 'home') {
                        // Vista principal con categorías - SIN BANNER DUPLICADO (el header ya tiene el logo)
                        return React.createElement('div',
                            { 
                                className: 'home-content',
                                style: {
                                    width: '100%',
                                    maxWidth: '100%',
                                    padding: '20px',
                                    minHeight: 'calc(100vh - 80px)'
                                }
                            },
                            
                            // Banner eliminado por solicitud del usuario
                            
                            currentUser && React.createElement('p',
                                {
                                    style: {
                                        fontSize: '1rem',
                                        opacity: 0.8,
                                        margin: '10px 0 0 0'
                                    }
                                },
                                `👋 ¡Hola, ${currentUser.name}!`
                            ),
                            
                            // Hero Categories - Gallery Images Integration
                            (() => {
                                console.log('🏠 DEBUG: Renderizando categorias con galería de imágenes');
                                
                                // Get categories from the data file
                                const categories = window.CATEGORY_DATA || [];
                                
                                return React.createElement('section',
                                    {
                                        className: 'hero-categories-embedded',
                                        style: {
                                            padding: '60px 2rem',
                                            maxWidth: '1400px',
                                            width: '100%',
                                            margin: '0 auto'
                                        }
                                    },
                                    
                                    // Título
                                    React.createElement('div',
                                        { 
                                            style: {
                                                textAlign: 'center',
                                                marginBottom: '60px'
                                            }
                                        },
                                        React.createElement('h1',
                                            {
                                                style: {
                                                    fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                                                    fontWeight: '800',
                                                    background: 'linear-gradient(45deg, #FF6B9D, #FF4757)',
                                                    backgroundClip: 'text',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                    marginBottom: '16px',
                                                    fontFamily: 'var(--font-family-secondary)'
                                                }
                                            },
                                            '🐾 Encuentra todo para tu mascota'
                                        ),
                                        React.createElement('p',
                                            {
                                                style: {
                                                    fontSize: 'var(--font-size-xl)',
                                                    color: 'var(--gray-600)',
                                                    maxWidth: '600px',
                                                    margin: '0 auto',
                                                    lineHeight: '1.6',
                                                    fontWeight: '500'
                                                }
                                            },
                                            'Explora nuestras categorías y descubre productos de calidad'
                                        )
                                    ),
                                    
                                    // Grid de categorías - 3 columnas en desktop, 1 en mobile
                                    React.createElement('div',
                                        {
                                            className: 'categories-grid',
                                            style: {
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                                gap: '30px',
                                                alignItems: 'stretch',
                                                margin: '0 auto'
                                            }
                                        },
                                        
                                        categories.map(category =>
                                            React.createElement(window.CategoryCardComponent,
                                                {
                                                    key: category.id,
                                                    img1x: category.img1x,
                                                    img2x: category.img2x,
                                                    thumb: category.thumb,
                                                    color: category.color,
                                                    category: category.category,
                                                    subtitle: category.subtitle,
                                                    fit: category.fit,
                                                    alt: category.alt,
                                                    onClick: () => {
                                                        console.log(`🎯 Click en ${category.category}`);
                                                        window.setCurrentView('catalog');
                                                    }
                                                }
                                            )
                                        )
                                    )
                                );
                            })(),
                            
                            // Sección de información adicional - APROVECHANDO VIEWPORT COMPLETO
                            React.createElement('div',
                                {
                                    className: 'home-extra-content',
                                    style: {
                                        marginTop: '60px',
                                        padding: '0 2rem', // Padding lateral
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', // Más ancho
                                        gap: '30px', // Mayor separación
                                        maxWidth: '100%', // Aprovechar todo el ancho
                                        width: '100%'
                                    }
                                },
                                
                                // Card de información
                                React.createElement('div',
                                    {
                                        className: 'info-card',
                                        style: {
                                            background: 'white',
                                            borderRadius: 'var(--border-radius-xl)',
                                            padding: '30px',
                                            boxShadow: 'var(--shadow-lg)',
                                            textAlign: 'center'
                                        }
                                    },
                                    React.createElement('div', { style: { fontSize: '3rem', marginBottom: '15px' } }, '🚚'),
                                    React.createElement('h3', 
                                        { style: { color: '#333', marginBottom: '10px' } }, 
                                        'Envío Gratis'
                                    ),
                                    React.createElement('p', 
                                        { style: { color: '#666', fontSize: '14px', margin: 0 } }, 
                                        'En compras superiores a $50.000'
                                    )
                                ),
                                
                                // Card de calidad
                                React.createElement('div',
                                    {
                                        className: 'info-card',
                                        style: {
                                            background: 'white',
                                            borderRadius: 'var(--border-radius-xl)',
                                            padding: '30px',
                                            boxShadow: 'var(--shadow-lg)',
                                            textAlign: 'center'
                                        }
                                    },
                                    React.createElement('div', { style: { fontSize: '3rem', marginBottom: '15px' } }, '✨'),
                                    React.createElement('h3', 
                                        { style: { color: '#333', marginBottom: '10px' } }, 
                                        'Calidad Premium'
                                    ),
                                    React.createElement('p', 
                                        { style: { color: '#666', fontSize: '14px', margin: 0 } }, 
                                        'Solo marcas reconocidas y confiables'
                                    )
                                ),
                                
                                // Card de soporte
                                React.createElement('div',
                                    {
                                        className: 'info-card',
                                        style: {
                                            background: 'white',
                                            borderRadius: 'var(--border-radius-xl)',
                                            padding: '30px',
                                            boxShadow: 'var(--shadow-lg)',
                                            textAlign: 'center'
                                        }
                                    },
                                    React.createElement('div', { style: { fontSize: '3rem', marginBottom: '15px' } }, '📞'),
                                    React.createElement('h3', 
                                        { style: { color: '#333', marginBottom: '10px' } }, 
                                        'Soporte 24/7'
                                    ),
                                    React.createElement('p', 
                                        { style: { color: '#666', fontSize: '14px', margin: 0 } }, 
                                        'Te ayudamos cuando lo necesites'
                                    )
                                )
                            )
                        );
                    }
                    
                    if (currentView === 'auth') {
                        // Vista de autenticación explícita
                        return window.AuthComponent ? React.createElement(window.AuthComponent) : 
                            React.createElement('div', { style: { textAlign: 'center', padding: '40px' } },
                                React.createElement('h2', null, 'Cargando autenticación...')
                            );
                    }
                    
                    if (currentView === 'catalog') {
                        // CATÁLOGO - APROVECHAMIENTO COMPLETO DEL VIEWPORT
                        console.log('🛜️ DEBUG Catálogo - Componentes disponibles:', {
                            CatalogWithFilters: !!window.CatalogWithFilters,
                            FilterSidebar: !!window.FilterSidebar,
                            ProductCatalog: !!window.ProductCatalog
                        });
                        
                        // USAR CatalogWithFilters OPTIMIZADO PARA VIEWPORT COMPLETO
                        if (window.CatalogWithFilters) {
                            console.log('✅ Cargando CatalogWithFilters con viewport optimizado');
                            return React.createElement('div',
                                {
                                    className: 'catalog-content',
                                    style: {
                                        width: '100%',
                                        maxWidth: '100%',
                                        minHeight: 'calc(100vh - 80px)',
                                        padding: '0', // Sin padding para máximo aprovechamiento
                                        margin: '0'
                                    }
                                },
                                React.createElement(window.CatalogWithFilters)
                            );
                        } else if (window.ProductCatalog) {
                            console.log('⚠️ Fallback: usando ProductCatalog básico');
                            return React.createElement(window.ProductCatalog);
                        } else {
                            console.log('❌ ERROR: Ningún componente de catálogo disponible');
                            return React.createElement('div', { style: { textAlign: 'center', padding: '40px' } },
                                React.createElement('h3', null, '❌ Error cargando catálogo'),
                                React.createElement('p', null, 'CatalogWithFilters no está disponible'),
                                React.createElement('div', { className: 'loader' })
                            );
                        }
                    }
                    
                    if (currentView === 'cart') {
                        // CARRITO - USA EL WRAPPER QUE REPLICA EL PATRÓN EXITOSO
                        console.log('🛟 DEBUG Cart: CartWrapper disponible:', !!window.CartWrapper);
                        console.log('🛟 DEBUG Cart: CartView disponible:', !!window.CartView);
                        
                        if (window.CartWrapper) {
                            // Actualizar el wrapper con el componente real si existe
                            if (window.CartView && window.updateSectionWrapper) {
                                window.updateSectionWrapper('Cart', window.CartView);
                            }
                            return React.createElement(window.CartWrapper);
                        } else {
                            // Fallback si no hay wrapper
                            console.log('⚠️ CartWrapper no disponible, usando fallback');
                            return React.createElement('div', 
                                { 
                                    className: 'cart-content',
                                    style: { 
                                        textAlign: 'center', 
                                        padding: '40px',
                                        width: '100%',
                                        minHeight: 'calc(100vh - 80px)'
                                    } 
                                },
                                React.createElement('h3', null, 'Cargando carrito...'),
                                React.createElement('div', { className: 'loader' })
                            );
                        }
                    }
                    
                    if (currentView === 'favorites') {
                        // Vista de favoritos
                        return window.FavoritesView ? React.createElement(window.FavoritesView) : 
                            React.createElement('div', 
                                { 
                                    style: { 
                                        textAlign: 'center', 
                                        padding: '40px', 
                                        color: '#666' 
                                    } 
                                },
                                React.createElement('h3', null, 'Cargando favoritos...'),
                                React.createElement('p', null, 'El componente de favoritos se está cargando...')
                            );
                    }
                    
                    if (currentView === 'checkout') {
                        // Checkout requiere autenticación
                        if (!currentUser) {
                            return React.createElement('div', 
                                { style: { textAlign: 'center', padding: '60px', background: 'white', borderRadius: '15px', margin: '20px' } },
                                React.createElement('h2', { style: { color: '#E45A84', marginBottom: '20px' } }, '🔒 Autenticación Requerida'),
                                React.createElement('p', { style: { fontSize: '18px', marginBottom: '30px', color: '#666' } }, 
                                    'Para completar tu compra necesitas iniciar sesión o crear una cuenta.'
                                ),
                                React.createElement('button', {
                                    onClick: () => window.setCurrentView('auth'),
                                    style: {
                                        background: 'linear-gradient(135deg, #E45A84, #D94876)',
                                        color: 'white',
                                        padding: '15px 30px',
                                        border: 'none',
                                        borderRadius: '25px',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        marginRight: '15px'
                                    }
                                }, '🔐 Iniciar Sesión / Registrarse'),
                                React.createElement('button', {
                                    onClick: () => window.setCurrentView('cart'),
                                    style: {
                                        background: 'transparent',
                                        color: '#666',
                                        padding: '15px 30px',
                                        border: '2px solid #ddd',
                                        borderRadius: '25px',
                                        fontSize: '16px',
                                        cursor: 'pointer'
                                    }
                                }, '← Volver al Carrito')
                            );
                        }
                        
                        // CHECKOUT - USA EL WRAPPER QUE REPLICA EL PATRÓN EXITOSO
                        console.log('💳 DEBUG Checkout: CheckoutWrapper disponible:', !!window.CheckoutWrapper);
                        console.log('💳 DEBUG Checkout: CheckoutView disponible:', !!window.CheckoutView);
                        console.log('💳 DEBUG Checkout: ModernCheckoutComponent disponible:', !!window.ModernCheckoutComponent);
                        
                        if (window.CheckoutWrapper) {
                            // Determinar qué componente de checkout usar
                            const checkoutComponent = window.CheckoutView || window.ModernCheckoutComponent;
                            
                            // Actualizar el wrapper con el componente real si existe
                            if (checkoutComponent && window.updateSectionWrapper) {
                                window.updateSectionWrapper('Checkout', checkoutComponent);
                            }
                            return React.createElement(window.CheckoutWrapper);
                        } else {
                            console.log('⚠️ CheckoutWrapper no disponible, usando fallback');
                            return React.createElement('div', 
                                { 
                                    className: 'checkout-content',
                                    style: { 
                                        textAlign: 'center', 
                                        padding: '40px',
                                        width: '100%',
                                        minHeight: 'calc(100vh - 80px)'
                                    } 
                                },
                                React.createElement('h3', null, 'Cargando checkout...'),
                                React.createElement('div', { className: 'loader' })
                            );
                        }
                    }
                    
                    if (currentView === 'orderHistory') {
                        // HISTORIAL DE PEDIDOS - USA EL WRAPPER QUE REPLICA EL PATRÓN EXITOSO
                        console.log('📦 DEBUG OrderHistory: OrderHistoryWrapper disponible:', !!window.OrderHistoryWrapper);
                        console.log('📦 DEBUG OrderHistory: OrderHistory disponible:', !!window.OrderHistory);
                        console.log('📦 DEBUG OrderHistory: Usuario autenticado:', !!currentUser);
                        
                        if (!currentUser) {
                            return React.createElement('div', 
                                { 
                                    className: 'order-history-content',
                                    style: { 
                                        textAlign: 'center', 
                                        padding: '60px 20px', 
                                        background: 'white', 
                                        borderRadius: '15px', 
                                        margin: '20px auto',
                                        maxWidth: '600px',
                                        minHeight: 'calc(100vh - 200px)'
                                    } 
                                },
                                React.createElement('h2', { style: { color: '#E45A84', marginBottom: '20px' } }, '🔒 Inicia Sesión'),
                                React.createElement('p', { style: { fontSize: '18px', marginBottom: '30px', color: '#666' } }, 
                                    'Para ver tu historial de pedidos necesitas iniciar sesión o crear una cuenta.'
                                ),
                                React.createElement('button', {
                                    onClick: () => window.setCurrentView('auth'),
                                    style: {
                                        background: 'linear-gradient(135deg, #E45A84, #D94876)',
                                        color: 'white',
                                        padding: '15px 30px',
                                        border: 'none',
                                        borderRadius: '25px',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }
                                }, '🔐 Iniciar Sesión / Registrarse')
                            );
                        }
                        
                        // Si el componente OrderHistory está disponible, usarlo directamente
                        if (window.OrderHistory) {
                            return React.createElement(window.OrderHistory);
                        } else {
                            console.log('⚠️ OrderHistory no disponible, usando fallback');
                            return React.createElement('div', 
                                { 
                                    className: 'order-history-content',
                                    style: { 
                                        textAlign: 'center', 
                                        padding: '40px',
                                        width: '100%',
                                        minHeight: 'calc(100vh - 80px)'
                                    } 
                                },
                                React.createElement('h3', null, 'Cargando historial de pedidos...'),
                                React.createElement('div', { className: 'loader' })
                            );
                        }
                    }
                    
                    if (currentView === 'profile') {
                        // PERFIL - USA EL WRAPPER QUE REPLICA EL PATRÓN EXITOSO
                        console.log('👤 DEBUG Profile: ProfileWrapper disponible:', !!window.ProfileWrapper);
                        console.log('👤 DEBUG Profile: UserProfile disponible:', !!window.UserProfile);
                        console.log('👤 DEBUG Profile: Usuario autenticado:', !!currentUser);
                        
                        if (!currentUser) {
                            return React.createElement('div', 
                                { 
                                    className: 'profile-content',
                                    style: { 
                                        textAlign: 'center', 
                                        padding: '60px 20px', 
                                        background: 'white', 
                                        borderRadius: '15px', 
                                        margin: '20px auto',
                                        maxWidth: '600px',
                                        minHeight: 'calc(100vh - 200px)'
                                    } 
                                },
                                React.createElement('h2', { style: { color: '#E45A84', marginBottom: '20px' } }, '🔒 Inicia Sesión'),
                                React.createElement('p', { style: { fontSize: '18px', marginBottom: '30px', color: '#666' } }, 
                                    'Para ver tu perfil necesitas iniciar sesión o crear una cuenta.'
                                ),
                                React.createElement('button', {
                                    onClick: () => window.setCurrentView('auth'),
                                    style: {
                                        background: 'linear-gradient(135deg, #E45A84, #D94876)',
                                        color: 'white',
                                        padding: '15px 30px',
                                        border: 'none',
                                        borderRadius: '25px',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }
                                }, '🔐 Iniciar Sesión / Registrarse')
                            );
                        }
                        
                        if (window.ProfileWrapper) {
                            // Actualizar el wrapper con el componente real si existe
                            if (window.UserProfile && window.updateSectionWrapper) {
                                window.updateSectionWrapper('Profile', window.UserProfile);
                            }
                            return React.createElement(window.ProfileWrapper);
                        } else {
                            console.log('⚠️ ProfileWrapper no disponible, usando fallback');
                            return React.createElement('div', 
                                { 
                                    className: 'profile-content',
                                    style: { 
                                        textAlign: 'center', 
                                        padding: '40px',
                                        width: '100%',
                                        minHeight: 'calc(100vh - 80px)'
                                    } 
                                },
                                React.createElement('h3', null, 'Cargando perfil...'),
                                React.createElement('div', { className: 'loader' })
                            );
                        }
                    }
                    
                    if (currentView === 'admin') {
                        // ADMIN - USA EL WRAPPER QUE REPLICA EL PATRÓN EXITOSO
                        console.log('🚯 DEBUG Admin: AdminWrapper disponible:', !!window.AdminWrapper);
                        console.log('🚯 DEBUG Admin: AdminPanel disponible:', !!window.AdminPanel);
                        console.log('🚯 DEBUG Admin: Usuario autenticado:', !!currentUser);
                        
                        if (!currentUser) {
                            return React.createElement('div', 
                                { 
                                    className: 'admin-content',
                                    style: { 
                                        textAlign: 'center', 
                                        padding: '60px 20px', 
                                        background: 'white', 
                                        borderRadius: '15px', 
                                        margin: '20px auto',
                                        maxWidth: '600px',
                                        minHeight: 'calc(100vh - 200px)'
                                    } 
                                },
                                React.createElement('h2', { style: { color: '#E45A84', marginBottom: '20px' } }, '🔐 Acceso Restringido'),
                                React.createElement('p', { style: { fontSize: '18px', marginBottom: '30px', color: '#666' } }, 
                                    'El panel de administración requiere autenticación.'
                                ),
                                React.createElement('button', {
                                    onClick: () => window.setCurrentView('auth'),
                                    style: {
                                        background: 'linear-gradient(135deg, #E45A84, #D94876)',
                                        color: 'white',
                                        padding: '15px 30px',
                                        border: 'none',
                                        borderRadius: '25px',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }
                                }, '🔐 Iniciar Sesión')
                            );
                        }
                        
                        if (window.AdminWrapper) {
                            // Actualizar el wrapper con el componente real si existe
                            if (window.AdminPanel && window.updateSectionWrapper) {
                                window.updateSectionWrapper('Admin', window.AdminPanel);
                            }
                            return React.createElement(window.AdminWrapper);
                        } else {
                            console.log('⚠️ AdminWrapper no disponible, usando fallback');
                            return React.createElement('div', 
                                { 
                                    className: 'admin-content',
                                    style: { 
                                        textAlign: 'center', 
                                        padding: '40px',
                                        width: '100%',
                                        minHeight: 'calc(100vh - 80px)'
                                    } 
                                },
                                React.createElement('h3', null, 'Cargando panel de administración...'),
                                React.createElement('div', { className: 'loader' })
                            );
                        }
                    }
                    
                    if (currentView === 'dashboard') {
                        // DASHBOARD - USA EL WRAPPER QUE REPLICA EL PATRÓN EXITOSO
                        console.log('📊 DEBUG Dashboard: DashboardWrapper disponible:', !!window.DashboardWrapper);
                        
                        // Crear componente de dashboard inline para el wrapper
                        const DashboardComponent = function() {
                            return React.createElement('div',
                                { 
                                    className: 'dashboard-inner-content',
                                    style: {
                                        width: '100%',
                                        maxWidth: '100%'
                                    }
                                },
                            
                            // Estadísticas rápidas
                            React.createElement('div',
                                {
                                    className: 'stats-grid',
                                    style: {
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                        gap: '20px',
                                        marginBottom: '30px',
                                        marginTop: '40px'
                                    }
                                },
                                
                                // Productos en carrito
                                React.createElement('div',
                                    {
                                        className: 'stat-card card',
                                        style: {
                                            background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%)',
                                            color: 'white',
                                            textAlign: 'center',
                                            padding: '25px'
                                        }
                                    },
                                    React.createElement('div', { style: { fontSize: '2.5rem', marginBottom: '10px' } }, '🛒'),
                                    React.createElement('h3', { style: { fontSize: '2rem', margin: '0 0 5px' } }, 
                                        window.cartManager ? window.cartManager.getTotalItems() : 0
                                    ),
                                    React.createElement('p', { style: { margin: 0, opacity: 0.9 } }, 'Productos en carrito')
                                ),
                                
                                // Total a pagar
                                React.createElement('div',
                                    {
                                        className: 'stat-card card',
                                        style: {
                                            background: 'linear-gradient(135deg, var(--success-color) 0%, #20a53a 100%)',
                                            color: 'white',
                                            textAlign: 'center',
                                            padding: '25px'
                                        }
                                    },
                                    React.createElement('div', { style: { fontSize: '2.5rem', marginBottom: '10px' } }, '💰'),
                                    React.createElement('h3', { style: { fontSize: '1.5rem', margin: '0 0 5px' } }, 
                                        window.cartManager ? (window.formatCOP ? window.formatCOP(window.cartManager.getTotalPrice()) : '$' + window.cartManager.getTotalPrice()) : '$0'
                                    ),
                                    React.createElement('p', { style: { margin: 0, opacity: 0.9 } }, 'Total a pagar')
                                ),
                                
                                // Estado del backend
                                React.createElement('div',
                                    {
                                        className: 'stat-card card',
                                        style: {
                                            background: backendStatus.connected ? 
                                                'linear-gradient(135deg, var(--info-color) 0%, #138496 100%)' :
                                                'linear-gradient(135deg, var(--error-color) 0%, #c82333 100%)',
                                            color: 'white',
                                            textAlign: 'center',
                                            padding: '25px'
                                        }
                                    },
                                    React.createElement('div', { style: { fontSize: '2.5rem', marginBottom: '10px' } }, 
                                        backendStatus.connected ? '✅' : '❌'
                                    ),
                                    React.createElement('h3', { style: { fontSize: '1.2rem', margin: '0 0 5px' } }, 
                                        backendStatus.connected ? 'Conectado' : 'Desconectado'
                                    ),
                                    React.createElement('p', { style: { margin: 0, opacity: 0.9 } }, 'Estado del backend')
                                )
                            ),
                            
                            // Acciones rápidas
                            React.createElement('div',
                                {
                                    className: 'quick-actions card',
                                    style: {
                                        padding: '25px'
                                    }
                                },
                                React.createElement('h3', 
                                    { style: { marginBottom: '20px', color: 'var(--gray-800)' } }, 
                                    '⚡ Acciones Rápidas'
                                ),
                                React.createElement('div',
                                    {
                                        style: {
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                            gap: '15px'
                                        }
                                    },
                                    
                                    React.createElement('button',
                                        {
                                            className: 'btn btn-primary',
                                            onClick: () => setCurrentView('catalog'),
                                            style: {
                                                padding: '15px 20px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                justifyContent: 'center'
                                            }
                                        },
                                        React.createElement('span', { style: { fontSize: '20px' } }, '🛍️'),
                                        React.createElement('span', null, 'Ver Catálogo')
                                    ),
                                    
                                    React.createElement('button',
                                        {
                                            className: 'btn btn-secondary',
                                            onClick: () => setCurrentView('cart'),
                                            disabled: !window.cartManager || window.cartManager.getTotalItems() === 0,
                                            style: {
                                                padding: '15px 20px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                justifyContent: 'center',
                                                opacity: window.cartManager && window.cartManager.getTotalItems() > 0 ? 1 : 0.6
                                            }
                                        },
                                        React.createElement('span', { style: { fontSize: '20px' } }, '🛒'),
                                        React.createElement('span', null, 'Ver Carrito')
                                    )
                                )
                            )
                            );
                        };
                        
                        // Usar el DashboardWrapper
                        if (window.DashboardWrapper) {
                            if (window.updateSectionWrapper) {
                                window.updateSectionWrapper('Dashboard', DashboardComponent);
                            }
                            return React.createElement(window.DashboardWrapper);
                        } else {
                            console.log('⚠️ DashboardWrapper no disponible, usando componente directo');
                            return React.createElement(DashboardComponent);
                        }
                    }
                    
                    if (currentView === 'privacy') {
                        // CONFIGURACIÓN DE PRIVACIDAD - USA EL WRAPPER
                        console.log('🔒 DEBUG Privacy: PrivacySettingsComponent disponible:', !!window.PrivacySettingsComponent);
                        
                        if (window.PrivacySettingsComponent) {
                            return React.createElement('div',
                                {
                                    className: 'privacy-content',
                                    style: {
                                        width: '100%',
                                        maxWidth: '100%',
                                        minHeight: 'calc(100vh - 80px)',
                                        padding: '0'
                                    }
                                },
                                React.createElement(window.PrivacySettingsComponent)
                            );
                        } else {
                            return React.createElement('div', 
                                { 
                                    className: 'privacy-content',
                                    style: { 
                                        textAlign: 'center', 
                                        padding: '40px',
                                        width: '100%',
                                        minHeight: 'calc(100vh - 80px)'
                                    } 
                                },
                                React.createElement('h3', null, 'Cargando configuración de privacidad...'),
                                React.createElement('div', { className: 'loader' })
                            );
                        }
                    }
                    
                    if (currentView === 'terms') {
                        // TÉRMINOS Y CONDICIONES
                        console.log('📋 DEBUG Terms: TermsConditionsComponent disponible:', !!window.TermsConditionsComponent);
                        
                        if (window.TermsConditionsComponent) {
                            return React.createElement('div',
                                {
                                    className: 'terms-content',
                                    style: {
                                        width: '100%',
                                        maxWidth: '100%',
                                        minHeight: 'calc(100vh - 80px)',
                                        padding: '0'
                                    }
                                },
                                React.createElement(window.TermsConditionsComponent)
                            );
                        } else {
                            return React.createElement('div', 
                                { 
                                    className: 'terms-content',
                                    style: { 
                                        textAlign: 'center', 
                                        padding: '40px',
                                        width: '100%',
                                        minHeight: 'calc(100vh - 80px)'
                                    } 
                                },
                                React.createElement('h3', null, 'Cargando términos y condiciones...'),
                                React.createElement('div', { className: 'loader' })
                            );
                        }
                    }
                    
                    if (currentView === 'policy') {
                        // POLÍTICA DE PRIVACIDAD
                        console.log('🔒 DEBUG Policy: Vista policy activada');
                        console.log('🔒 DEBUG Policy: PrivacyPolicyComponent disponible:', !!window.PrivacyPolicyComponent);
                        console.log('🔒 DEBUG Policy: typeof PrivacyPolicyComponent:', typeof window.PrivacyPolicyComponent);
                        
                        if (window.PrivacyPolicyComponent && typeof window.PrivacyPolicyComponent === 'function') {
                            console.log('✅ PrivacyPolicyComponent encontrado, renderizando...');
                            return React.createElement('div',
                                {
                                    className: 'policy-content',
                                    style: {
                                        width: '100%',
                                        maxWidth: '100%',
                                        minHeight: 'calc(100vh - 80px)',
                                        padding: '0'
                                    }
                                },
                                React.createElement(window.PrivacyPolicyComponent)
                            );
                        } else {
                            console.warn('⚠️ PrivacyPolicyComponent no disponible, mostrando loader');
                            return React.createElement('div', 
                                { 
                                    className: 'policy-content',
                                    style: { 
                                        textAlign: 'center', 
                                        padding: '40px',
                                        width: '100%',
                                        minHeight: 'calc(100vh - 80px)'
                                    } 
                                },
                                React.createElement('h3', null, 'Cargando política de privacidad...'),
                                React.createElement('p', { style: { color: '#666', marginTop: '20px' } }, 
                                    'Componente PrivacyPolicy: ' + (!!window.PrivacyPolicyComponent ? 'Disponible' : 'No disponible')
                                ),
                                React.createElement('div', { className: 'loader' })
                            );
                        }
                    }
                    
                    if (currentView === 'product' && selectedProduct) {
                        // Vista de producto individual
                        return React.createElement('div', 
                            { 
                                className: 'product-detail-view',
                                style: { 
                                    maxWidth: '1200px', 
                                    margin: '0 auto', 
                                    padding: '20px',
                                    backgroundColor: '#fff',
                                    borderRadius: '12px',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                                    minHeight: 'calc(100vh - 80px)'
                                } 
                            },
                            // Botón para volver al catálogo
                            React.createElement('button', 
                                {
                                    onClick: () => setCurrentView('catalog'),
                                    style: {
                                        padding: '8px 16px',
                                        background: '#f8f9fa',
                                        border: '1px solid #dee2e6',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        marginBottom: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontSize: '14px'
                                    }
                                },
                                '← Volver al catálogo'
                            ),
                            
                            // Contenido del producto
                            React.createElement('div', 
                                {
                                    className: 'product-content',
                                    style: {
                                        display: 'grid',
                                        gridTemplateColumns: 'minmax(300px, 40%) 1fr',
                                        gap: '30px',
                                        marginBottom: '30px'
                                    }
                                },
                                // Imagen del producto
                                React.createElement('div', 
                                    {
                                        className: 'product-image',
                                        style: {
                                            borderRadius: '8px',
                                            overflow: 'hidden'
                                        }
                                    },
                                    React.createElement('img', 
                                        {
                                            src: (selectedProduct.Images && selectedProduct.Images.length > 0 ? selectedProduct.Images[0] : null) || 
                                                 selectedProduct.image || 
                                                 selectedProduct.ImageUrl ||
                                                 'https://via.placeholder.com/400x400?text=Sin+imagen',
                                            alt: selectedProduct.Name || selectedProduct.name || 'Producto',
                                            style: {
                                                width: '100%',
                                                height: 'auto',
                                                objectFit: 'cover'
                                            }
                                        }
                                    )
                                ),
                                
                                // Información del producto
                                React.createElement('div', 
                                    { className: 'product-info' },
                                    // Categoría
                                    React.createElement('div', 
                                        {
                                            style: {
                                                color: '#6c757d',
                                                fontSize: '0.9rem',
                                                marginBottom: '8px'
                                            }
                                        },
                                        selectedProduct.Categoria || selectedProduct.category || 'Sin categoría'
                                    ),
                                    
                                    // Nombre del producto
                                    React.createElement('h1', 
                                        {
                                            style: {
                                                fontSize: '2rem',
                                                margin: '0 0 16px 0',
                                                color: '#212529'
                                            }
                                        },
                                        selectedProduct.Name || selectedProduct.name || 'Producto sin nombre'
                                    ),
                                    
                                    // Precio
                                    React.createElement('div', 
                                        {
                                            style: {
                                                fontSize: '1.5rem',
                                                fontWeight: 'bold',
                                                color: '#007bff',
                                                marginBottom: '16px'
                                            }
                                        },
                                        window.formatCOP ? window.formatCOP(selectedProduct.Price || selectedProduct.price || 0) : `$${(selectedProduct.Price || selectedProduct.price || 0).toLocaleString()}`
                                    ),
                                    
                                    // Descripción
                                    (selectedProduct.Descripcion || selectedProduct.description) && React.createElement('p', 
                                        {
                                            style: {
                                                lineHeight: '1.6',
                                                color: '#495057',
                                                marginBottom: '24px'
                                            }
                                        },
                                        selectedProduct.Descripcion || selectedProduct.description
                                    ),
                                    
                                    // Stock
                                    React.createElement('div', 
                                        {
                                            style: {
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                marginBottom: '24px',
                                                padding: '8px 12px',
                                                backgroundColor: (selectedProduct.Stock || selectedProduct.stock || 0) > 0 ? '#e8f5e9' : '#ffebee',
                                                borderRadius: '4px',
                                                width: 'fit-content'
                                            }
                                        },
                                        React.createElement('span', null, (selectedProduct.Stock || selectedProduct.stock || 0) > 0 ? '✅ En stock' : '❌ Sin stock'),
                                        (selectedProduct.Stock || selectedProduct.stock || 0) > 0 && React.createElement('span', 
                                            { style: { color: '#2e7d32', fontWeight: 'bold' } },
                                            `(${selectedProduct.Stock || selectedProduct.stock} disponibles)`
                                        )
                                    ),
                                    
                                    // Botón de agregar al carrito
                                    React.createElement('button', 
                                        {
                                            onClick: () => {
                                                if (window.cartManager) {
                                                    window.cartManager.addItem(selectedProduct, 1);
                                                    alert(`✅ ${selectedProduct.Name || selectedProduct.name} agregado al carrito!`);
                                                }
                                            },
                                            disabled: (selectedProduct.Stock || selectedProduct.stock || 0) <= 0,
                                            style: {
                                                padding: '12px 24px',
                                                backgroundColor: (selectedProduct.Stock || selectedProduct.stock || 0) > 0 ? '#007bff' : '#6c757d',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                fontSize: '1rem',
                                                fontWeight: 'bold',
                                                cursor: (selectedProduct.Stock || selectedProduct.stock || 0) > 0 ? 'pointer' : 'not-allowed',
                                                width: '100%',
                                                maxWidth: '300px'
                                            }
                                        },
                                        (selectedProduct.Stock || selectedProduct.stock || 0) > 0 ? '🛒 Agregar al carrito' : '❌ No disponible'
                                    )
                                )
                            ),
                            
                            // Componente de reseñas
                            window.ProductReviewsWrapper ? 
                                React.createElement(window.ProductReviewsWrapper, { productId: selectedProduct.Id || selectedProduct.id }) :
                                React.createElement('div', 
                                    { style: { textAlign: 'center', padding: '40px', color: '#666' } },
                                    React.createElement('h3', null, 'Cargando reseñas...'),
                                    React.createElement('p', null, 'El componente de reseñas se está cargando...')
                                )
                        );
                    }
                    
                    return React.createElement('div', 
                        { style: { textAlign: 'center', padding: '40px' } },
                        React.createElement('h2', null, '❓ Vista no encontrada'),
                        React.createElement('p', null, 'Vista actual: ' + currentView)
                    );
                })()
            );
        }
        
        // Fallback al layout anterior si no hay componentes modernos
        return React.createElement('div', 
            { 
                style: { 
                    padding: '40px', 
                    maxWidth: '800px', 
                    margin: '0 auto',
                    fontFamily: 'var(--font-family-primary, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)'
                } 
            },
            // Título principal
            React.createElement('h1', 
                { style: { color: '#007bff', textAlign: 'center' } },
                '🚀 VentasPet - Frontend Nuevo'
            ),
            
            // Estado de React
            React.createElement('div',
                {
                    style: {
                        background: '#d4edda',
                        color: '#155724',
                        padding: '20px',
                        borderRadius: '8px',
                        border: '1px solid #c3e6cb',
                        marginBottom: '20px'
                    }
                },
                React.createElement('h2', null, '✅ React Status'),
                React.createElement('p', null, React.createElement('strong', null, 'Estado: '), mensaje),
                React.createElement('p', null, React.createElement('strong', null, 'Versión React: '), React.version),
                React.createElement('p', null, React.createElement('strong', null, 'Versión ReactDOM: '), ReactDOM.version)
            ),
            
            // Contador interactivo
            React.createElement('div',
                {
                    style: {
                        background: '#fff3cd',
                        color: '#856404',
                        padding: '20px',
                        borderRadius: '8px',
                        border: '1px solid #ffeaa7',
                        marginBottom: '20px'
                    }
                },
                React.createElement('h3', null, '🧮 Contador Interactivo (React State)'),
                React.createElement('p', null, 'Clicks: ', React.createElement('strong', null, contador)),
                React.createElement('button',
                    {
                        onClick: () => setContador(contador + 1),
                        style: {
                            background: '#007bff',
                            color: 'white',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            marginRight: '10px'
                        }
                    },
                    '➕ Incrementar'
                ),
                React.createElement('button',
                    {
                        onClick: () => setContador(0),
                        style: {
                            background: '#6c757d',
                            color: 'white',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }
                    },
                    '🔄 Reset'
                )
            ),
            
            // Navegación (si está autenticado)
            currentUser && React.createElement('div',
                {
                    style: {
                        background: 'white',
                        padding: '15px',
                        borderRadius: '10px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        marginBottom: '20px',
                        display: 'flex',
                        gap: '15px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                    }
                },
                
                // Bienvenida y debug
                React.createElement('span',
                    { style: { color: '#333', fontWeight: 'bold' } },
                    `👋 Hola, ${currentUser.name} | Vista: ${currentView}`
                ),
                
                // Botones de navegación
                React.createElement('button',
                    {
                        onClick: () => {
                            console.log('🛍️ Click en Catálogo - Cambiando vista de', currentView, 'a catalog');
                            setCurrentView('catalog');
                        },
                        style: {
                            padding: '8px 16px',
                            background: currentView === 'catalog' ? '#007bff' : '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }
                    },
                    '🛍️ Catálogo'
                ),
                
                React.createElement('button',
                    {
                        onClick: () => {
                            console.log('💆 Click en Dashboard - Cambiando vista de', currentView, 'a dashboard');
                            setCurrentView('dashboard');
                        },
                        style: {
                            padding: '8px 16px',
                            background: currentView === 'dashboard' ? '#007bff' : '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }
                    },
                    '📊 Dashboard'
                ),
                
                React.createElement('button',
                    {
                        onClick: () => {
                            console.log('🛍️ Click en Carrito - Cambiando vista de', currentView, 'a cart');
                            setCurrentView('cart');
                        },
                        style: {
                            padding: '8px 16px',
                            background: currentView === 'cart' ? '#007bff' : '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            position: 'relative'
                        }
                    },
                    '🛍️ Carrito' + (window.cartManager && window.cartManager.getTotalItems() > 0 ? ` (${window.cartManager.getTotalItems()})` : '')
                ),
                
                React.createElement('button',
                    {
                        onClick: () => {
                            console.log('💳 Click en Checkout - Cambiando vista de', currentView, 'a checkout');
                            setCurrentView('checkout');
                        },
                        style: {
                            padding: '8px 16px',
                            background: currentView === 'checkout' ? '#007bff' : (window.cartManager && window.cartManager.getTotalItems() > 0 ? '#28a745' : '#6c757d'),
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: window.cartManager && window.cartManager.getTotalItems() > 0 ? 'pointer' : 'not-allowed',
                            fontSize: '14px',
                            opacity: window.cartManager && window.cartManager.getTotalItems() > 0 ? 1 : 0.6
                        },
                        disabled: !window.cartManager || window.cartManager.getTotalItems() === 0
                    },
                    '💳 Checkout'
                ),
                
                React.createElement('button',
                    {
                        onClick: () => window.authManager.logout(),
                        style: {
                            padding: '8px 16px',
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }
                    },
                    '👋 Cerrar Sesión'
                )
            ),
            
            // Contenido principal según la vista
            (() => {
                console.log('🔍 Vista actual:', currentView, 'Usuario:', !!currentUser);
                
                if (!currentUser) {
                    // Si no hay usuario, mostrar login
                    return window.AuthComponent ? React.createElement(window.AuthComponent) : null;
                }
                
                if (currentView === 'catalog') {
                    // Mostrar catálogo de productos
                    return window.ProductCatalog ? React.createElement(window.ProductCatalog) : 
                        React.createElement('div', 
                            { style: { textAlign: 'center', padding: '40px', color: '#666' } },
                            React.createElement('h3', null, 'Cargando catálogo...'),
                            React.createElement('p', null, 'El componente de productos se está cargando...')
                        );
                }
                
                if (currentView === 'cart') {
                    // Mostrar vista del carrito
                    return window.CartView ? React.createElement(window.CartView) : 
                        React.createElement('div', 
                            { style: { textAlign: 'center', padding: '40px', color: '#666' } },
                            React.createElement('h3', null, 'Cargando carrito...'),
                            React.createElement('p', null, 'El componente del carrito se está cargando...')
                        );
                }
                
                if (currentView === 'checkout') {
                    // Mostrar vista de checkout
                    return window.CheckoutView ? React.createElement(window.CheckoutView) : 
                        window.ModernCheckoutComponent ? React.createElement(window.ModernCheckoutComponent) :
                        React.createElement('div', 
                            { style: { textAlign: 'center', padding: '40px', color: '#666' } },
                            React.createElement('h3', null, 'Cargando checkout...'),
                            React.createElement('p', null, 'El componente de checkout se está cargando...')
                        );
                }
                
                if (currentView === 'product' && selectedProduct) {
                    // Mostrar vista de producto individual
                    return React.createElement('div', 
                        { 
                            className: 'product-detail-view',
                            style: { 
                                maxWidth: '1200px', 
                                margin: '0 auto', 
                                padding: '20px',
                                backgroundColor: '#fff',
                                borderRadius: '12px',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                            } 
                        },
                        // Botón para volver al catálogo
                        React.createElement('button', 
                            {
                                onClick: () => setCurrentView('catalog'),
                                style: {
                                    padding: '8px 16px',
                                    background: '#f8f9fa',
                                    border: '1px solid #dee2e6',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    marginBottom: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '14px'
                                }
                            },
                            '← Volver al catálogo'
                        ),
                        
                        // Contenido del producto
                        React.createElement('div', 
                            {
                                className: 'product-content',
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: 'minmax(300px, 40%) 1fr',
                                    gap: '30px',
                                    marginBottom: '30px'
                                }
                            },
                            // Imagen del producto
                            React.createElement('div', 
                                {
                                    className: 'product-image',
                                    style: {
                                        borderRadius: '8px',
                                        overflow: 'hidden'
                                    }
                                },
                                React.createElement('img', 
                                    {
                                        src: (selectedProduct.Images && selectedProduct.Images.length > 0 ? selectedProduct.Images[0] : null) || 
                                             selectedProduct.image || 
                                             selectedProduct.ImageUrl ||
                                             'https://via.placeholder.com/400x400?text=Sin+imagen',
                                        alt: selectedProduct.Name || selectedProduct.name || 'Producto',
                                        style: {
                                            width: '100%',
                                            height: 'auto',
                                            objectFit: 'cover'
                                        }
                                    }
                                )
                            ),
                            
                            // Información del producto
                            React.createElement('div', 
                                { className: 'product-info' },
                                // Categoría
                                React.createElement('div', 
                                    {
                                        style: {
                                            color: '#6c757d',
                                            fontSize: '0.9rem',
                                            marginBottom: '8px'
                                        }
                                    },
                                    selectedProduct.Categoria || selectedProduct.category || 'Sin categoría'
                                ),
                                
                                // Nombre del producto
                                React.createElement('h1', 
                                    {
                                        style: {
                                            fontSize: '2rem',
                                            margin: '0 0 16px 0',
                                            color: '#212529'
                                        }
                                    },
                                    selectedProduct.Name || selectedProduct.name || 'Producto sin nombre'
                                ),
                                
                                // Precio
                                React.createElement('div', 
                                    {
                                        style: {
                                            fontSize: '1.5rem',
                                            fontWeight: 'bold',
                                            color: '#007bff',
                                            marginBottom: '16px'
                                        }
                                    },
                                    window.formatCOP ? window.formatCOP(selectedProduct.Price || selectedProduct.price || 0) : `$${(selectedProduct.Price || selectedProduct.price || 0).toLocaleString()}`
                                ),
                                
                                // Descripción
                                (selectedProduct.Descripcion || selectedProduct.description) && React.createElement('p', 
                                    {
                                        style: {
                                            lineHeight: '1.6',
                                            color: '#495057',
                                            marginBottom: '24px'
                                        }
                                    },
                                    selectedProduct.Descripcion || selectedProduct.description
                                ),
                                
                                // Stock
                                React.createElement('div', 
                                    {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            marginBottom: '24px',
                                            padding: '8px 12px',
                                            backgroundColor: (selectedProduct.Stock || selectedProduct.stock || 0) > 0 ? '#e8f5e9' : '#ffebee',
                                            borderRadius: '4px',
                                            width: 'fit-content'
                                        }
                                    },
                                    React.createElement('span', null, (selectedProduct.Stock || selectedProduct.stock || 0) > 0 ? '✅ En stock' : '❌ Sin stock'),
                                    (selectedProduct.Stock || selectedProduct.stock || 0) > 0 && React.createElement('span', 
                                        { style: { color: '#2e7d32', fontWeight: 'bold' } },
                                        `(${selectedProduct.Stock || selectedProduct.stock} disponibles)`
                                    )
                                ),
                                
                                // Botón de agregar al carrito
                                React.createElement('button', 
                                    {
                                        onClick: () => {
                                            if (window.cartManager) {
                                                window.cartManager.addItem(selectedProduct, 1);
                                                alert(`✅ ${selectedProduct.Name || selectedProduct.name} agregado al carrito!`);
                                            }
                                        },
                                        disabled: (selectedProduct.Stock || selectedProduct.stock || 0) <= 0,
                                        style: {
                                            padding: '12px 24px',
                                            backgroundColor: (selectedProduct.Stock || selectedProduct.stock || 0) > 0 ? '#007bff' : '#6c757d',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                            fontWeight: 'bold',
                                            cursor: (selectedProduct.Stock || selectedProduct.stock || 0) > 0 ? 'pointer' : 'not-allowed',
                                            width: '100%',
                                            maxWidth: '300px'
                                        }
                                    },
                                    (selectedProduct.Stock || selectedProduct.stock || 0) > 0 ? '🛒 Agregar al carrito' : '❌ No disponible'
                                )
                            )
                        ),
                        
                        // Componente de reseñas
                        window.ProductReviewsWrapper ? 
                            React.createElement(window.ProductReviewsWrapper, { productId: selectedProduct.Id || selectedProduct.id }) :
                            React.createElement('div', 
                                { style: { textAlign: 'center', padding: '40px', color: '#666' } },
                                React.createElement('h3', null, 'Cargando reseñas...'),
                                React.createElement('p', null, 'El componente de reseñas se está cargando...')
                            )
                    );
                }
                
                if (currentView === 'dashboard') {
                    // Mostrar dashboard
                    return React.createElement('div', 
                        { style: { maxWidth: '800px', margin: '0 auto', padding: '20px' } },
                        
                        // Debug info
                        React.createElement('div', 
                            { style: { background: '#f8f9fa', padding: '10px', borderRadius: '5px', marginBottom: '20px', fontSize: '12px' } },
                            `Debug: Vista=${currentView}, Usuario=${currentUser?.name || 'null'}, Contador=${contador}`
                        ),
                        
                        // Título del Dashboard
                        React.createElement('h1',
                            {
                                style: {
                                    textAlign: 'center',
                                    color: '#333',
                                    marginBottom: '30px',
                                    fontSize: '2.5rem'
                                }
                            },
                            '📊 Dashboard - VentasPet'
                        ),
                        
                        // Contador interactivo (Demo de React State)
                        React.createElement('div',
                            {
                                style: {
                                    background: '#fff3cd',
                                    color: '#856404',
                                    padding: '25px',
                                    borderRadius: '15px',
                                    border: '1px solid #ffeaa7',
                                    marginBottom: '25px',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                                }
                            },
                            React.createElement('h3', 
                                { style: { marginTop: '0', marginBottom: '15px' } }, 
                                '🧮 Demo: Contador de Clicks (React State)'
                            ),
                            React.createElement('p', 
                                { style: { fontSize: '0.9rem', marginBottom: '15px', color: '#666' } },
                                'Este es un ejemplo de cómo React maneja el estado. Cada click actualiza el número.'
                            ),
                            React.createElement('p', 
                                { style: { fontSize: '1.2rem', marginBottom: '20px' } },
                                'Clicks: ', React.createElement('strong', 
                                    { style: { fontSize: '1.5rem', color: '#007bff' } }, 
                                    contador
                                )
                            ),
                            React.createElement('div', 
                                { style: { display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' } },
                                React.createElement('button',
                                    {
                                        onClick: () => {
                                            console.log('🔄 Incrementando contador de', contador, 'a', contador + 1);
                                            setContador(contador + 1);
                                        },
                                        style: {
                                            background: '#007bff',
                                            color: 'white',
                                            padding: '12px 24px',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '1rem',
                                            fontWeight: 'bold'
                                        }
                                    },
                                    '➕ Incrementar'
                                ),
                                React.createElement('button',
                                    {
                                        onClick: () => {
                                            console.log('🔄 Reseteando contador a 0');
                                            setContador(0);
                                        },
                                        style: {
                                            background: '#6c757d',
                                            color: 'white',
                                            padding: '12px 24px',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '1rem',
                                            fontWeight: 'bold'
                                        }
                                    },
                                    '🔄 Reset'
                                )
                            )
                        ),
                        
                        // Estadísticas del carrito
                        React.createElement('div',
                            {
                                style: {
                                    background: '#d4edda',
                                    color: '#155724',
                                    padding: '25px',
                                    borderRadius: '15px',
                                    border: '1px solid #c3e6cb',
                                    marginBottom: '25px',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                                }
                            },
                            React.createElement('h3',
                                { style: { marginTop: '0', marginBottom: '15px' } },
                                '🛍️ Estadísticas del Carrito de Compras'
                            ),
                            React.createElement('div',
                                { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' } },
                                React.createElement('div',
                                    { style: { textAlign: 'center' } },
                                    React.createElement('div', 
                                        { style: { fontSize: '2rem', marginBottom: '5px', fontWeight: 'bold' } }, 
                                        window.cartManager ? window.cartManager.getTotalItems() : 0
                                    ),
                                    React.createElement('div', { style: { fontSize: '0.9rem' } }, 'Productos en carrito')
                                ),
                                React.createElement('div',
                                    { style: { textAlign: 'center' } },
                                    React.createElement('div', 
                                        { style: { fontSize: '2rem', marginBottom: '5px', fontWeight: 'bold' } }, 
                                        window.cartManager ? (window.formatCOP ? window.formatCOP(window.cartManager.getTotalPrice()) : '$' + window.cartManager.getTotalPrice()) : '$0'
                                    ),
                                    React.createElement('div', { style: { fontSize: '0.9rem' } }, 'Total a pagar')
                                ),
                                React.createElement('div',
                                    { style: { textAlign: 'center' } },
                                    React.createElement('div', 
                                        { style: { fontSize: '2rem', marginBottom: '5px', fontWeight: 'bold' } }, 
                                        window.cartManager ? window.cartManager.getItems().length : 0
                                    ),
                                    React.createElement('div', { style: { fontSize: '0.9rem' } }, 'Productos diferentes')
                                )
                            )
                        ),
                        
                        // Estado del sistema
                        React.createElement('div',
                            {
                                style: {
                                    background: '#d1ecf1',
                                    color: '#0c5460',
                                    padding: '25px',
                                    borderRadius: '15px',
                                    border: '1px solid #bee5eb',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                                }
                            },
                            React.createElement('h3',
                                { style: { marginTop: '0', marginBottom: '15px' } },
                                '📊 Estado del Sistema'
                            ),
                            React.createElement('ul',
                                { style: { listStyle: 'none', padding: '0', margin: '0' } },
                                React.createElement('li', 
                                    { style: { padding: '8px 0', borderBottom: '1px solid #bee5eb' } },
                                    '✅ Frontend React: Funcionando'
                                ),
                                React.createElement('li', 
                                    { style: { padding: '8px 0', borderBottom: '1px solid #bee5eb' } },
                                    '✅ Autenticación: Activa (' + (currentUser?.email || 'N/A') + ')'
                                ),
                                React.createElement('li', 
                                    { style: { padding: '8px 0', borderBottom: '1px solid #bee5eb' } },
                                    '✅ Carrito: ' + (window.cartManager ? 'Funcionando' : 'No disponible')
                                ),
                                React.createElement('li', 
                                    { style: { padding: '8px 0', borderBottom: '1px solid #bee5eb' } },
                                    '✅ Catálogo: ' + (window.ProductCatalog ? 'Cargado' : 'No disponible')
                                ),
                                React.createElement('li', 
                                    { style: { padding: '8px 0' } },
                                    backendStatus.connected ? '✅ Backend API: Conectado' : '⏳ Backend API: Desconectado'
                                )
                            )
                        )
                    );
                }
                
                // Vista por defecto
                return React.createElement('div', 
                    { style: { textAlign: 'center', padding: '40px' } },
                    React.createElement('h2', null, '❓ Vista no encontrada'),
                    React.createElement('p', null, 'Vista actual: ' + currentView)
                );
            })(),
            
            // Estado del Backend (simplificado)
            React.createElement('div',
                {
                    style: {
                        background: backendStatus.connected ? '#d1ecf1' : '#f8d7da',
                        color: backendStatus.connected ? '#0c5460' : '#721c24',
                        padding: '15px',
                        borderRadius: '8px',
                        border: `1px solid ${backendStatus.connected ? '#bee5eb' : '#f5c6cb'}`,
                        marginTop: '20px',
                        marginBottom: '20px',
                        textAlign: 'center'
                    }
                },
                React.createElement('strong', null,
                    backendStatus.connected ? '✅ Backend Conectado' : '❌ Backend Desconectado'
                ),
                !backendStatus.connected && React.createElement('div', { style: { marginTop: '10px' } },
                    React.createElement('button',
                        {
                            onClick: async () => {
                                setBackendStatus({ testing: true, connected: false, message: 'Probando...' });
                                const result = await window.ApiService.testConnection();
                                setBackendStatus({
                                    testing: false,
                                    connected: result.connected,
                                    message: result.message
                                });
                            },
                            style: {
                                background: '#007bff',
                                color: 'white',
                                padding: '8px 16px',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }
                        },
                        '🔍 Reconectar'
                    )
                )
            ),
            
            // Información del sistema
            React.createElement('div',
                {
                    style: {
                        background: '#d1ecf1',
                        color: '#0c5460',
                        padding: '20px',
                        borderRadius: '8px',
                        border: '1px solid #bee5eb',
                        marginBottom: '20px'
                    }
                },
                React.createElement('h3', null, '📊 Estado del Sistema'),
                React.createElement('ul', null,
                    React.createElement('li', null, '✅ HTML: Funcionando'),
                    React.createElement('li', null, '✅ JavaScript: Funcionando'),
                    React.createElement('li', null, '✅ React: Funcionando'),
                    React.createElement('li', null, '✅ React Hooks: Funcionando'),
                    React.createElement('li', null, '✅ Event Handlers: Funcionando'),
                    React.createElement('li', null, backendStatus.connected ? '✅ Backend API: Conectado' : '⏳ Backend API: Probando...')
                )
            ),
            
            // Próximos pasos
            React.createElement('div',
                {
                    style: {
                        background: '#e7f3ff',
                        color: '#004085',
                        padding: '20px',
                        borderRadius: '8px',
                        border: '1px solid #b3d7ff'
                    }
                },
                React.createElement('h3', null, '🎯 Próximos Pasos'),
                React.createElement('ol', null,
                    React.createElement('li', null, 'Habilitar JSX (opcional)'),
                    React.createElement('li', null, 'Agregar React Router para navegación'),
                    React.createElement('li', null, 'Conectar con Backend API (localhost:5135)'),
                    React.createElement('li', null, 'Implementar páginas: Home, Catálogo, Carrito'),
                    React.createElement('li', null, 'Agregar estilos y UX profesional')
                )
            )
        );
    }
    
    // Renderizar la aplicación
    console.log('🎨 Renderizando App...');
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(App));
    console.log('✅ App renderizada exitosamente');
}