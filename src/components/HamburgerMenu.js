// Modern Hamburger Menu for VelyKapet - White background, colorful icons, smooth transitions
// Clean, easy-to-read organization with user info at top

console.log('🍔 Loading Modern Hamburger Menu Component...');

window.HamburgerMenuComponent = function() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [currentUser, setCurrentUser] = React.useState(null);
    
    // Update user when authentication state changes
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
    
    // Close menu when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && !event.target.closest('.hamburger-menu-container')) {
                setIsOpen(false);
            }
        };
        
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);
    
    const toggleMenu = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        console.log('🍔 Toggle menu:', !isOpen);
        setIsOpen(!isOpen);
    };
    
    const handleMenuClick = (view, label) => {
        console.log(`🍔 Click on ${label} - navigating to:`, view);
        setIsOpen(false);
        
        if (typeof window.setCurrentView === 'function') {
            setTimeout(() => {
                console.log(`🚀 Redirecting to view: ${view}`);
                window.setCurrentView(view);
            }, 100);
        } else {
            console.error('❌ Error: window.setCurrentView not available');
            window.location.hash = `#${view}`;
        }
    };
    
    const handleLogout = () => {
        console.log('🍔 Logout from menu');
        setIsOpen(false);
        if (window.authManager) {
            window.authManager.logout();
        }
    };
    
    // Menu items with colorful icons
    const menuItems = [
        { id: 'home', icon: '🏠', label: 'Inicio', view: 'home', color: '#FF6B9D' },
        { id: 'catalog', icon: '🛍️', label: 'Catálogo', view: 'catalog', color: '#FFA502' },
        { id: 'cart', icon: '🛒', label: 'Carrito', view: 'cart', color: '#FF6B35' },
        ...(currentUser ? [
            { id: 'profile', icon: '👤', label: 'Mi Perfil', view: 'profile', color: '#4A90E2' },
            { id: 'favorites', icon: '❤️', label: 'Favoritos', view: 'favorites', color: '#FF4757' },
            { id: 'orderHistory', icon: '📋', label: 'Mis Pedidos', view: 'orderHistory', color: '#26DE81' }
        ] : []),
        { id: 'privacy', icon: '🔒', label: 'Privacidad', view: 'privacy', color: '#8B8B8B' },
        { id: 'terms', icon: '📋', label: 'Términos', view: 'terms', color: '#8B8B8B' }
    ];
    
    return React.createElement('div',
        {
            className: 'hamburger-menu-container',
            style: { position: 'relative' }
        },
        
        // Hamburger button - clean design
        React.createElement('button',
            {
                className: 'hamburger-button',
                onClick: (e) => toggleMenu(e),
                'aria-label': 'Menú de navegación',
                'aria-expanded': isOpen,
                style: {
                    background: '#FFFFFF',
                    border: '2px solid #F0F0F0',
                    borderRadius: '12px',
                    width: '44px',
                    height: '44px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    gap: '4px',
                    padding: '8px'
                },
                onMouseEnter: (e) => {
                    e.currentTarget.style.background = '#FAFAFA';
                    e.currentTarget.style.borderColor = '#E0E0E0';
                    e.currentTarget.style.transform = 'scale(1.05)';
                },
                onMouseLeave: (e) => {
                    e.currentTarget.style.background = '#FFFFFF';
                    e.currentTarget.style.borderColor = '#F0F0F0';
                    e.currentTarget.style.transform = 'scale(1)';
                }
            },
            
            // Animated hamburger lines
            ...[1, 2, 3].map(i => 
                React.createElement('div',
                    {
                        key: i,
                        'aria-hidden': 'true',
                        style: {
                            width: isOpen ? '20px' : '22px',
                            height: '3px',
                            background: isOpen ? '#FF6B9D' : '#333',
                            borderRadius: '2px',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: isOpen ? 
                                (i === 1 ? 'rotate(45deg) translateY(7px)' :
                                 i === 2 ? 'opacity(0) translateX(10px)' : 
                                 'rotate(-45deg) translateY(-7px)') : 'none'
                        }
                    }
                )
            )
        ),
        
        // Overlay
        isOpen && React.createElement('div',
            {
                className: 'menu-overlay',
                'aria-hidden': 'true',
                style: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.4)',
                    zIndex: 9998,
                    backdropFilter: 'blur(4px)',
                    animation: 'fadeIn 0.3s ease'
                }
            }
        ),
        
        // Menu sidebar - white background, left side
        isOpen && React.createElement('aside',
            {
                className: 'hamburger-menu',
                role: 'navigation',
                'aria-label': 'Menú principal',
                style: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '300px',
                    height: '100vh',
                    background: '#FFFFFF',
                    boxShadow: '4px 0 20px rgba(0, 0, 0, 0.15)',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'slideInLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    color: '#333'
                }
            },
            
            // Header section
            React.createElement('div',
                {
                    className: 'menu-header',
                    style: {
                        padding: '30px 20px',
                        borderBottom: '1px solid #F0F0F0',
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #FFF0F5 0%, #FFF5F0 100%)'
                    }
                },
                React.createElement('div',
                    { style: { fontSize: '3rem', marginBottom: '12px' } },
                    '🐾'
                ),
                React.createElement('h2',
                    { 
                        style: { 
                            margin: '0 0 6px 0', 
                            fontSize: '1.75rem', 
                            fontWeight: '800',
                            color: '#333',
                            fontFamily: 'Poppins, sans-serif'
                        } 
                    },
                    'VelyKapet'
                ),
                React.createElement('p',
                    { 
                        style: { 
                            margin: 0, 
                            fontSize: '0.9rem', 
                            color: '#666',
                            fontWeight: '500'
                        } 
                    },
                    'Todo para tu mascota'
                )
            ),
            
            // User info section (if authenticated)
            currentUser && React.createElement('div',
                {
                    className: 'menu-user-info',
                    style: {
                        padding: '20px',
                        borderBottom: '1px solid #F0F0F0',
                        background: '#FAFAFA'
                    }
                },
                React.createElement('div',
                    { style: { display: 'flex', alignItems: 'center', gap: '15px' } },
                    React.createElement('div',
                        {
                            'aria-hidden': 'true',
                            style: {
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #FF6B9D, #FF4757)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '22px',
                                boxShadow: '0 2px 8px rgba(255, 107, 157, 0.3)'
                            }
                        },
                        '👤'
                    ),
                    React.createElement('div',
                        { style: { flex: 1 } },
                        React.createElement('div',
                            { style: { fontWeight: '700', fontSize: '16px', color: '#333', marginBottom: '4px' } },
                            currentUser.name || 'Usuario'
                        ),
                        React.createElement('div',
                            { 
                                style: { 
                                    fontSize: '13px', 
                                    color: '#666',
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
            
            // Menu items list
            React.createElement('nav',
                {
                    className: 'menu-items',
                    style: {
                        flex: 1,
                        padding: '10px 0',
                        overflowY: 'auto',
                        overflowX: 'hidden'
                    }
                },
                ...menuItems.map(item =>
                    React.createElement('button',
                        {
                            key: item.id,
                            onClick: (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log(`🔗 Navigating to ${item.view} from hamburger menu`);
                                handleMenuClick(item.view, item.label);
                            },
                            'aria-label': item.label,
                            style: {
                                width: '100%',
                                background: 'transparent',
                                border: 'none',
                                color: '#333',
                                padding: '16px 20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                fontSize: '16px',
                                fontWeight: '600',
                                textAlign: 'left',
                                outline: 'none',
                                borderLeft: '4px solid transparent'
                            },
                            className: 'menu-item-button',
                            onMouseEnter: (e) => {
                                e.currentTarget.style.background = '#FAFAFA';
                                e.currentTarget.style.borderLeftColor = item.color;
                                e.currentTarget.style.paddingLeft = '24px';
                            },
                            onMouseLeave: (e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.borderLeftColor = 'transparent';
                                e.currentTarget.style.paddingLeft = '20px';
                            }
                        },
                        React.createElement('span', 
                            { 
                                style: { 
                                    fontSize: '22px',
                                    width: '28px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                },
                                'aria-hidden': 'true'
                            }, 
                            item.icon
                        ),
                        React.createElement('span', null, item.label)
                    )
                )
            ),
            
            // Footer section
            React.createElement('div',
                {
                    className: 'menu-footer',
                    style: {
                        padding: '20px',
                        borderTop: '1px solid #F0F0F0',
                        background: '#FAFAFA'
                    }
                },
                
                // Logout/Login button
                currentUser ? 
                    React.createElement('button',
                        {
                            onClick: handleLogout,
                            'aria-label': 'Cerrar sesión',
                            style: {
                                width: '100%',
                                background: 'linear-gradient(135deg, #FF6B9D, #FF4757)',
                                border: 'none',
                                color: 'white',
                                padding: '14px 20px',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                fontSize: '15px',
                                fontWeight: '700',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                marginBottom: '15px',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 8px rgba(255, 107, 157, 0.3)'
                            },
                            onMouseEnter: (e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 157, 0.4)';
                            },
                            onMouseLeave: (e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 107, 157, 0.3)';
                            }
                        },
                        React.createElement('span', null, '👋'),
                        React.createElement('span', null, 'Cerrar Sesión')
                    ) :
                    React.createElement('button',
                        {
                            onClick: () => handleMenuClick('auth', 'Login'),
                            'aria-label': 'Iniciar sesión',
                            style: {
                                width: '100%',
                                background: 'linear-gradient(135deg, #4A90E2, #357ABD)',
                                border: 'none',
                                color: 'white',
                                padding: '14px 20px',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                fontSize: '15px',
                                fontWeight: '700',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                marginBottom: '15px',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 8px rgba(74, 144, 226, 0.3)'
                            },
                            onMouseEnter: (e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(74, 144, 226, 0.4)';
                            },
                            onMouseLeave: (e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(74, 144, 226, 0.3)';
                            }
                        },
                        React.createElement('span', null, '🔐'),
                        React.createElement('span', null, 'Iniciar Sesión')
                    ),
                
                // Version text
                React.createElement('div',
                    {
                        style: {
                            textAlign: 'center',
                            fontSize: '12px',
                            color: '#999',
                            fontWeight: '500'
                        }
                    },
                    'VelyKapet v1.0'
                )
            )
        )
    );
};

// CSS animations
const menuStyles = `
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
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
    background: #F5F5F5;
}

.hamburger-menu::-webkit-scrollbar-thumb {
    background: #D0D0D0;
    borderRadius: 3px;
}

.hamburger-menu::-webkit-scrollbar-thumb:hover {
    background: #B0B0B0;
}
`;

// Inject styles
if (!document.querySelector('#hamburger-menu-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'hamburger-menu-styles';
    styleSheet.textContent = menuStyles;
    document.head.appendChild(styleSheet);
}

console.log('✅ Modern Hamburger Menu Component loaded');
console.log('🔍 HamburgerMenuComponent available:', !!window.HamburgerMenuComponent);
