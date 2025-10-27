// Hamburger Menu - Menú moderno tipo móvil con navegación completa
// Colores: #E45A84 - Estilo VelyKapet

console.log('🍔 Cargando Hamburger Menu Component...');

window.HamburgerMenuComponent = function() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [currentUser, setCurrentUser] = React.useState(null);
    
    // Actualizar usuario cuando cambie el estado de autenticación
    React.useEffect(() => {
        const updateUser = () => {
            if (window.authManager) {
                setCurrentUser(window.authManager.getUser());
            }
        };
        
        updateUser();
        
        if (window.authManager && window.authManager.subscribe) {
            window.authManager.subscribe(updateUser);
        }
        
        return () => {
            if (window.authManager && window.authManager.unsubscribe) {
                window.authManager.unsubscribe(updateUser);
            }
        };
    }, []);
    
    // Cerrar menú cuando se hace click fuera
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && !event.target.closest('.hamburger-menu-container')) {
                setIsOpen(false);
            }
        };
        
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden'; // Prevenir scroll
        } else {
            document.body.style.overflow = 'auto';
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);
    
    const toggleMenu = (e) => {
        // Prevenir la propagación del evento para evitar comportamientos no deseados
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        console.log('🍔 Toggle menu:', !isOpen);
        setIsOpen(!isOpen);
        // No navegar a ninguna vista al abrir/cerrar el menú
    };
    
    const handleMenuClick = (view, label) => {
        console.log(`🍔 Click en ${label} - navegando a:`, view);
        setIsOpen(false); // Cerrar menú
        
        // Asegurarse de que la función setCurrentView existe y llamarla con un pequeño retraso
        // para permitir que el menú se cierre primero
        if (typeof window.setCurrentView === 'function') {
            setTimeout(() => {
                console.log(`🚀 Redirigiendo a vista: ${view}`);
                window.setCurrentView(view);
            }, 100);
        } else {
            console.error('❌ Error: window.setCurrentView no está disponible');
            // Alternativa de navegación si setCurrentView no está disponible
            if (view === 'home') {
                window.location.hash = '#home';
            } else if (view === 'catalog') {
                window.location.hash = '#catalog';
            } else if (view === 'cart') {
                window.location.hash = '#cart';
            } else {
                window.location.hash = `#${view}`;
            }
        }
    };
    
    const handleLogout = () => {
        console.log('🍔 Logout desde menú');
        setIsOpen(false);
        if (window.authManager) {
            window.authManager.logout();
        }
    };
    
    // Opciones de menú
    const menuItems = [
        { id: 'home', icon: '🏠', label: 'Inicio', view: 'home' },
        { id: 'catalog', icon: '🛍️', label: 'Catálogo', view: 'catalog' },
        { id: 'cart', icon: '🛒', label: 'Carrito', view: 'cart' },
        ...(currentUser ? [
            { id: 'profile', icon: '👤', label: 'Mi Perfil', view: 'profile' },
            { id: 'orderHistory', icon: '📋', label: 'Historial de Pedidos', view: 'orderHistory' },
            { id: 'dashboard', icon: '📊', label: 'Dashboard', view: 'dashboard' }
        ] : []),
        { id: 'privacy', icon: '🔒', label: 'Privacidad', view: 'privacy' },
        { id: 'terms', icon: '📋', label: 'Términos', view: 'terms' },
        { id: 'policy', icon: '🔐', label: 'Política', view: 'policy' }
    ];
    
    return React.createElement('div',
        {
            className: 'hamburger-menu-container',
            style: { position: 'relative' }
        },
        
        // Botón hamburguesa
        React.createElement('button',
            {
                className: 'hamburger-button',
                onClick: (e) => toggleMenu(e), // Pasar el evento para prevenir comportamientos no deseados
                style: {
                    background: 'rgba(0, 0, 0, 0.7)',
                    border: 'none',
                    borderRadius: '10px',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 0, 0, 0.5)',
                    transition: 'all 0.3s ease',
                    gap: '3px'
                },
                onMouseEnter: (e) => {
                    e.target.style.background = 'rgba(0, 0, 0, 0.9)';
                    e.target.style.transform = 'scale(1.05)';
                },
                onMouseLeave: (e) => {
                    e.target.style.background = 'rgba(0, 0, 0, 0.7)';
                    e.target.style.transform = 'scale(1)';
                }
            },
            
            // Líneas del hamburguesa (animadas)
            ...[1, 2, 3].map(i => 
                React.createElement('div',
                    {
                        key: i,
                        style: {
                            width: isOpen ? '20px' : '18px',
                            height: '2px',
                            background: 'white',
                            borderRadius: '2px',
                            transition: 'all 0.3s ease',
                            transform: isOpen ? 
                                (i === 1 ? 'rotate(45deg) translateY(5px)' :
                                 i === 2 ? 'opacity(0)' : 
                                 'rotate(-45deg) translateY(-5px)') : 'none'
                        }
                    }
                )
            )
        ),
        
        // Overlay
        isOpen && React.createElement('div',
            {
                className: 'menu-overlay',
                style: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 9998,
                    backdropFilter: 'blur(5px)',
                    animation: 'fadeIn 0.3s ease'
                }
            }
        ),
        
        // Menú desplegable - LADO IZQUIERDO
        isOpen && React.createElement('div',
            {
                className: 'hamburger-menu',
                style: {
                    position: 'fixed',
                    top: 0,
                    left: 0, // Cambiado de right a left
                    width: '280px',
                    height: '100vh',
                    background: 'linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%)',
                    boxShadow: '10px 0 30px rgba(0, 0, 0, 0.3)', // Sombra hacia la derecha
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'slideInLeft 0.3s ease', // Animación desde la izquierda
                    color: 'white'
                }
            },
            
            // Header del menú
            React.createElement('div',
                {
                    className: 'menu-header',
                    style: {
                        padding: '30px 20px',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                        textAlign: 'center'
                    }
                },
                React.createElement('div',
                    { style: { fontSize: '2rem', marginBottom: '10px' } },
                    '🐾'
                ),
                React.createElement('h3',
                    { 
                        style: { 
                            margin: '0 0 5px 0', 
                            fontSize: '1.5rem', 
                            fontWeight: '700' 
                        } 
                    },
                    'VelyKapet'
                ),
                React.createElement('p',
                    { 
                        style: { 
                            margin: 0, 
                            fontSize: '0.9rem', 
                            opacity: 0.8 
                        } 
                    },
                    'Todo para tu mascota'
                )
            ),
            
            // Usuario info (si está autenticado)
            currentUser && React.createElement('div',
                {
                    className: 'menu-user-info',
                    style: {
                        padding: '20px',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                React.createElement('div',
                    { style: { display: 'flex', alignItems: 'center', gap: '15px' } },
                    React.createElement('div',
                        {
                            style: {
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '18px'
                            }
                        },
                        '👤'
                    ),
                    React.createElement('div',
                        { style: { flex: 1 } },
                        React.createElement('div',
                            { style: { fontWeight: '600', fontSize: '16px' } },
                            currentUser.name || 'Invitado'
                        ),
                        React.createElement('div',
                            { 
                                style: { 
                                    fontSize: '13px', 
                                    opacity: 0.8,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                } 
                            },
                            currentUser.email || 'usuario@email.com'
                        )
                    )
                )
            ),
            
            // Items del menú
            React.createElement('div',
                {
                    className: 'menu-items',
                    style: {
                        flex: 1,
                        padding: '20px 0',
                        overflowY: 'auto'
                    }
                },
                ...menuItems.map(item =>
                    React.createElement('button',
                        {
                            key: item.id,
                            onClick: (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log(`🔗 Navegando a ${item.view} desde menú hamburguesa`);
                                handleMenuClick(item.view, item.label);
                            },
                            style: {
                                width: '100%',
                                background: 'transparent',
                                border: 'none',
                                color: 'white',
                                padding: '15px 20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                fontSize: '16px',
                                textAlign: 'left',
                                outline: 'none' // Eliminar el contorno al hacer clic
                            },
                            className: 'menu-item-button',
                            onMouseEnter: (e) => {
                                // Usar currentTarget en lugar de target para asegurar que el estilo se aplica al botón completo
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                e.currentTarget.style.paddingLeft = '25px';
                            },
                            onMouseLeave: (e) => {
                                // Usar currentTarget en lugar de target para asegurar que el estilo se aplica al botón completo
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.paddingLeft = '20px';
                            }
                        },
                        React.createElement('span', { style: { fontSize: '20px' } }, item.icon),
                        React.createElement('span', null, item.label)
                    )
                )
            ),
            
            // Footer del menú
            React.createElement('div',
                {
                    className: 'menu-footer',
                    style: {
                        padding: '20px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                
                // Botón de cerrar sesión (si está autenticado)
                currentUser ? React.createElement('button',
                    {
                        onClick: handleLogout,
                        style: {
                            width: '100%',
                            background: 'rgba(255, 255, 255, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            color: 'white',
                            padding: '12px 20px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            marginBottom: '15px',
                            transition: 'all 0.2s ease'
                        },
                        onMouseEnter: (e) => {
                            e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                        },
                        onMouseLeave: (e) => {
                            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                        }
                    },
                    React.createElement('span', null, '👋'),
                    React.createElement('span', null, 'Cerrar Sesión')
                ) : 
                
                // Botón de login (si no está autenticado)
                React.createElement('button',
                    {
                        onClick: () => handleMenuClick('auth', 'Login'),
                        style: {
                            width: '100%',
                            background: 'rgba(255, 255, 255, 0.9)',
                            border: 'none',
                            color: '#E45A84',
                            padding: '12px 20px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            marginBottom: '15px',
                            transition: 'all 0.2s ease'
                        },
                        onMouseEnter: (e) => {
                            e.target.style.background = 'white';
                            e.target.style.transform = 'scale(1.02)';
                        },
                        onMouseLeave: (e) => {
                            e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                            e.target.style.transform = 'scale(1)';
                        }
                    },
                    React.createElement('span', null, '🔐'),
                    React.createElement('span', null, 'Iniciar Sesión')
                ),
                
                // Versión
                React.createElement('div',
                    {
                        style: {
                            textAlign: 'center',
                            fontSize: '12px',
                            opacity: 0.6
                        }
                    },
                    'VelyKapet v1.0'
                )
            )
        )
    );
};

// Estilos CSS para animaciones
const menuStyles = `
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideInRight {
    from { 
        transform: translateX(100%);
        opacity: 0;
    }
    to { 
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideInLeft {
    from { 
        transform: translateX(-100%);
        opacity: 0;
    }
    to { 
        transform: translateX(0);
        opacity: 1;
    }
}

.hamburger-menu::-webkit-scrollbar {
    width: 6px;
}

.hamburger-menu::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
}

.hamburger-menu::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
}
`;

// Inyectar estilos
if (!document.querySelector('#hamburger-menu-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'hamburger-menu-styles';
    styleSheet.textContent = menuStyles;
    document.head.appendChild(styleSheet);
}

console.log('✅ Hamburger Menu Component cargado');
console.log('🔍 HamburgerMenuComponent disponible:', !!window.HamburgerMenuComponent);