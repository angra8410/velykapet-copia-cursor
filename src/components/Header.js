// Modern Header for VelyKapet - Clean, Joyful, Accessible
// White background, vibrant navigation links, centered logo, accessible rounded search
// User/favorite/cart icons aligned right

console.log('🎨 Loading Modern Header Component...');

window.HeaderComponent = function() {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isSearchExpanded, setIsSearchExpanded] = React.useState(false);
    const [cartItems, setCartItems] = React.useState(0);
    const [favoritesCount, setFavoritesCount] = React.useState(0);
    const [scrollPosition, setScrollPosition] = React.useState(0);
    const [headerVisible, setHeaderVisible] = React.useState(true);
    const [lastScrollTop, setLastScrollTop] = React.useState(0);
    
    // Update cart counter
    React.useEffect(() => {
        const updateCart = () => {
            if (window.cartManager) {
                setCartItems(window.cartManager.getTotalItems());
            }
        };
        
        updateCart();
        
        if (window.cartManager && window.cartManager.subscribe) {
            window.cartManager.subscribe(updateCart);
        }
        
        const interval = setInterval(updateCart, 1000);
        
        return () => {
            clearInterval(interval);
            if (window.cartManager && window.cartManager.unsubscribe) {
                window.cartManager.unsubscribe(updateCart);
            }
        };
    }, []);
    
    // Update favorites counter
    React.useEffect(() => {
        const updateFavorites = () => {
            if (window.favoritesManager) {
                setFavoritesCount(window.favoritesManager.getTotalFavorites());
            }
        };
        
        updateFavorites();
        
        if (window.favoritesManager && window.favoritesManager.subscribe) {
            window.favoritesManager.subscribe(updateFavorites);
        }
        
        const interval = setInterval(updateFavorites, 1000);
        
        return () => {
            clearInterval(interval);
            if (window.favoritesManager && window.favoritesManager.unsubscribe) {
                window.favoritesManager.unsubscribe(updateFavorites);
            }
        };
    }, []);
    
    // Scroll effect for header visibility
    React.useEffect(() => {
        let scrollTimer = null;
        
        const handleScroll = () => {
            if (scrollTimer !== null) {
                clearTimeout(scrollTimer);
            }
            
            scrollTimer = setTimeout(() => {
                const currentScrollPos = window.pageYOffset;
                const scrollThreshold = 80;
                const scrollDelta = Math.abs(currentScrollPos - lastScrollTop);
                
                if (scrollDelta > 10) {
                    const isScrollingDown = currentScrollPos > lastScrollTop;
                    
                    if (currentScrollPos < scrollThreshold) {
                        setHeaderVisible(true);
                    } else if (isScrollingDown) {
                        setHeaderVisible(false);
                    } else {
                        setHeaderVisible(true);
                    }
                    
                    setScrollPosition(currentScrollPos);
                    setLastScrollTop(currentScrollPos);
                }
            }, 50);
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (scrollTimer !== null) {
                clearTimeout(scrollTimer);
            }
        };
    }, [lastScrollTop]);
    
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim() && window.ProductCatalog && window.ProductCatalog.search) {
            window.ProductCatalog.search(searchQuery);
        }
        console.log('🔍 Searching:', searchQuery);
    };
    
    console.log('📝 DEBUG Header: Rendering modern header component');
    
    return React.createElement('header',
        {
            className: 'header-modern',
            style: {
                background: '#FFFFFF',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                borderBottom: '1px solid #F0F0F0',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                width: '100vw',
                maxWidth: '100vw',
                minHeight: '80px',
                display: 'block',
                visibility: headerVisible ? 'visible' : 'hidden',
                opacity: headerVisible ? 1 : 0,
                transform: headerVisible ? 'translateY(0)' : 'translateY(-100%)',
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                margin: '0',
                padding: '0'
            }
        },
        
        // Main container - clean, spacious layout
        React.createElement('div',
            {
                className: 'header-container',
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 2rem',
                    width: '100%',
                    maxWidth: '1400px',
                    margin: '0 auto',
                    minHeight: '80px',
                }
            },
            
            // Left side: Hamburger menu
            React.createElement('div',
                {
                    className: 'header-left',
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        flex: '0 0 auto'
                    }
                },
                // Hamburger menu component
                window.HamburgerMenuComponent && React.createElement(window.HamburgerMenuComponent)
            ),
            
            // Center: Navigation links and logo
            React.createElement('div',
                {
                    className: 'header-center',
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '40px',
                        flex: '1',
                        justifyContent: 'center'
                    }
                },
                
                // Navigation links - bold and vibrant
                React.createElement('nav',
                    {
                        className: 'header-nav',
                        style: {
                            display: window.innerWidth > 768 ? 'flex' : 'none',
                            gap: '30px',
                            alignItems: 'center'
                        }
                    },
                    
                    // Home link
                    React.createElement('a',
                        {
                            href: '#',
                            onClick: (e) => {
                                e.preventDefault();
                                if (window.setCurrentView) {
                                    window.setCurrentView('home');
                                }
                            },
                            style: {
                                color: '#FF6B9D',
                                fontSize: '16px',
                                fontWeight: '700',
                                textDecoration: 'none',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                transition: 'all 0.2s ease',
                                cursor: 'pointer'
                            },
                            onMouseEnter: (e) => {
                                e.target.style.background = '#FFF0F5';
                                e.target.style.transform = 'translateY(-2px)';
                            },
                            onMouseLeave: (e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.transform = 'translateY(0)';
                            }
                        },
                        'Inicio'
                    ),
                    
                    // Contact link
                    React.createElement('a',
                        {
                            href: '#',
                            onClick: (e) => {
                                e.preventDefault();
                                window.location.href = 'https://wa.me/573247770793';
                            },
                            style: {
                                color: '#FF4757',
                                fontSize: '16px',
                                fontWeight: '700',
                                textDecoration: 'none',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                transition: 'all 0.2s ease',
                                cursor: 'pointer'
                            },
                            onMouseEnter: (e) => {
                                e.target.style.background = '#FFF5F5';
                                e.target.style.transform = 'translateY(-2px)';
                            },
                            onMouseLeave: (e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.transform = 'translateY(0)';
                            }
                        },
                        'Contáctenos'
                    ),
                    
                    // Blog/Catalog link
                    React.createElement('a',
                        {
                            href: '#',
                            onClick: (e) => {
                                e.preventDefault();
                                if (window.setCurrentView) {
                                    window.setCurrentView('catalog');
                                }
                            },
                            style: {
                                color: '#FFA502',
                                fontSize: '16px',
                                fontWeight: '700',
                                textDecoration: 'none',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                transition: 'all 0.2s ease',
                                cursor: 'pointer'
                            },
                            onMouseEnter: (e) => {
                                e.target.style.background = '#FFFBF0';
                                e.target.style.transform = 'translateY(-2px)';
                            },
                            onMouseLeave: (e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.transform = 'translateY(0)';
                            }
                        },
                        'Blog'
                    )
                ),
                
                // Logo - central position (clickable for home)
                React.createElement('div',
                    {
                        className: 'header-logo',
                        style: {
                            height: '60px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        },
                        onClick: () => {
                            if (window.setCurrentView) {
                                window.setCurrentView('home');
                            }
                        }
                    },
                    React.createElement('img',
                        {
                            src: '/images/Logo_VelykaPet.png',
                            alt: 'VelyKapet Logo',
                            style: {
                                height: '55px',
                                width: 'auto',
                                objectFit: 'contain',
                                filter: 'brightness(1.05) contrast(1.05)'
                            },
                            onError: (e) => {
                                console.warn('⚠️ Logo not found, using fallback');
                                if (!e.target.dataset.fallback) {
                                    e.target.dataset.fallback = 'true';
                                    e.target.src = '/images/velykapet_letras-removebg-preview.png';
                                } else {
                                    e.target.style.display = 'none';
                                    const fallbackText = document.createElement('span');
                                    fallbackText.textContent = 'VelyKapet';
                                    fallbackText.style.cssText = 'font-size: 28px; font-weight: 800; color: #FF6B9D; font-family: Poppins, sans-serif;';
                                    e.target.parentElement.appendChild(fallbackText);
                                }
                            }
                        }
                    )
                ),
                
                // Search bar - accessible, rounded
                React.createElement('div',
                    {
                        className: 'header-search',
                        style: {
                            display: window.innerWidth > 768 ? 'flex' : 'none',
                            flex: '0 0 300px',
                            maxWidth: '300px'
                        }
                    },
                    React.createElement('form',
                        {
                            onSubmit: handleSearch,
                            style: {
                                width: '100%',
                                position: 'relative'
                            }
                        },
                        React.createElement('input',
                            {
                                type: 'text',
                                placeholder: 'Buscar productos...',
                                value: searchQuery,
                                onChange: (e) => setSearchQuery(e.target.value),
                                'aria-label': 'Buscar productos para tu mascota',
                                style: {
                                    width: '100%',
                                    padding: '10px 40px 10px 18px',
                                    border: '2px solid #F0F0F0',
                                    borderRadius: '25px',
                                    fontSize: '14px',
                                    background: '#FAFAFA',
                                    color: '#333',
                                    outline: 'none',
                                    transition: 'all 0.2s ease'
                                },
                                onFocus: (e) => {
                                    e.target.style.background = '#FFFFFF';
                                    e.target.style.borderColor = '#FF6B9D';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(255, 107, 157, 0.1)';
                                },
                                onBlur: (e) => {
                                    e.target.style.background = '#FAFAFA';
                                    e.target.style.borderColor = '#F0F0F0';
                                    e.target.style.boxShadow = 'none';
                                }
                            }
                        ),
                        React.createElement('button',
                            {
                                type: 'submit',
                                'aria-label': 'Buscar',
                                style: {
                                    position: 'absolute',
                                    right: '8px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '18px',
                                    color: '#FF6B9D',
                                    padding: '5px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'transform 0.2s ease'
                                },
                                onMouseEnter: (e) => {
                                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                                },
                                onMouseLeave: (e) => {
                                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                                }
                            },
                            '🔍'
                        )
                    )
                )
            ),
            
            // Right side: User actions - favorites, cart, user icons
            React.createElement('div',
                {
                    className: 'header-actions',
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        flex: '0 0 auto'
                    }
                },
                
                // Favorites button
                React.createElement('button',
                    {
                        className: 'btn-favorites',
                        onClick: () => {
                            if (window.setCurrentView) {
                                window.setCurrentView('favorites');
                            }
                        },
                        'aria-label': 'Ver favoritos',
                        style: {
                            background: '#FFF0F5',
                            border: '2px solid #FFE0EB',
                            borderRadius: '12px',
                            width: '44px',
                            height: '44px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FF6B9D',
                            cursor: 'pointer',
                            fontSize: '20px',
                            position: 'relative',
                            transition: 'all 0.2s ease'
                        },
                        onMouseEnter: (e) => {
                            e.currentTarget.style.background = '#FFE0EB';
                            e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 157, 0.2)';
                        },
                        onMouseLeave: (e) => {
                            e.currentTarget.style.background = '#FFF0F5';
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = 'none';
                        }
                    },
                    '❤️',
                    
                    favoritesCount > 0 && React.createElement('span',
                        {
                            className: 'favorites-badge',
                            'aria-label': `${favoritesCount} favoritos`,
                            style: {
                                position: 'absolute',
                                top: '-6px',
                                right: '-6px',
                                background: '#FF4757',
                                color: 'white',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '11px',
                                fontWeight: '700',
                                boxShadow: '0 2px 8px rgba(255, 71, 87, 0.3)'
                            }
                        },
                        favoritesCount > 99 ? '99+' : favoritesCount
                    )
                ),
                
                // Cart button
                React.createElement('button',
                    {
                        className: 'btn-cart',
                        onClick: () => {
                            if (window.setCurrentView) {
                                window.setCurrentView('cart');
                            }
                        },
                        'aria-label': 'Ver carrito de compras',
                        style: {
                            background: '#FFF5F0',
                            border: '2px solid #FFE5D9',
                            borderRadius: '12px',
                            width: '44px',
                            height: '44px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFA502',
                            cursor: 'pointer',
                            fontSize: '20px',
                            position: 'relative',
                            transition: 'all 0.2s ease'
                        },
                        onMouseEnter: (e) => {
                            e.currentTarget.style.background = '#FFE5D9';
                            e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 165, 2, 0.2)';
                        },
                        onMouseLeave: (e) => {
                            e.currentTarget.style.background = '#FFF5F0';
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = 'none';
                        }
                    },
                    '🛒',
                    
                    cartItems > 0 && React.createElement('span',
                        {
                            className: 'cart-badge',
                            'aria-label': `${cartItems} items en el carrito`,
                            style: {
                                position: 'absolute',
                                top: '-6px',
                                right: '-6px',
                                background: '#FF6B35',
                                color: 'white',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '11px',
                                fontWeight: '700',
                                boxShadow: '0 2px 8px rgba(255, 107, 53, 0.3)'
                            }
                        },
                        cartItems > 99 ? '99+' : cartItems
                    )
                ),
                
                // User button (login or profile)
                window.authManager && !window.authManager.isAuthenticated() ? 
                    React.createElement('button',
                        {
                            className: 'btn-login',
                            onClick: () => {
                                if (window.setCurrentView) {
                                    window.setCurrentView('auth');
                                }
                            },
                            'aria-label': 'Iniciar sesión',
                            style: {
                                background: '#F0F5FF',
                                border: '2px solid #D9E5FF',
                                borderRadius: '12px',
                                width: '44px',
                                height: '44px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#4A90E2',
                                cursor: 'pointer',
                                fontSize: '20px',
                                transition: 'all 0.2s ease'
                            },
                            onMouseEnter: (e) => {
                                e.currentTarget.style.background = '#D9E5FF';
                                e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(74, 144, 226, 0.2)';
                            },
                            onMouseLeave: (e) => {
                                e.currentTarget.style.background = '#F0F5FF';
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.boxShadow = 'none';
                            }
                        },
                        '👤'
                    ) :
                    React.createElement('div',
                        {
                            className: 'user-profile',
                            onClick: () => {
                                if (window.setCurrentView) {
                                    window.setCurrentView('profile');
                                }
                            },
                            'aria-label': 'Ver perfil de usuario',
                            role: 'button',
                            tabIndex: 0,
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '44px',
                                height: '44px',
                                background: '#F0F5FF',
                                border: '2px solid #D9E5FF',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            },
                            onMouseEnter: (e) => {
                                e.currentTarget.style.background = '#D9E5FF';
                                e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(74, 144, 226, 0.2)';
                            },
                            onMouseLeave: (e) => {
                                e.currentTarget.style.background = '#F0F5FF';
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.boxShadow = 'none';
                            },
                            onKeyPress: (e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    if (window.setCurrentView) {
                                        window.setCurrentView('profile');
                                    }
                                }
                            }
                        },
                        React.createElement('div',
                            {
                                style: {
                                    fontSize: '20px',
                                    color: '#4A90E2'
                                }
                            },
                            '👤'
                        )
                    )
            )
        ),
        
        // Mobile search bar (expanded)
        isSearchExpanded && window.innerWidth <= 768 && React.createElement('div',
            {
                className: 'mobile-search',
                style: {
                    background: '#FAFAFA',
                    padding: '15px 20px',
                    borderTop: '1px solid #F0F0F0'
                }
            },
            React.createElement('form',
                {
                    onSubmit: handleSearch,
                    style: {
                        position: 'relative',
                        maxWidth: '400px',
                        margin: '0 auto'
                    }
                },
                React.createElement('input',
                    {
                        type: 'text',
                        placeholder: 'Buscar productos...',
                        value: searchQuery,
                        onChange: (e) => setSearchQuery(e.target.value),
                        autoFocus: true,
                        'aria-label': 'Buscar productos para tu mascota',
                        style: {
                            width: '100%',
                            padding: '12px 50px 12px 20px',
                            border: '2px solid #F0F0F0',
                            borderRadius: '25px',
                            fontSize: '16px',
                            background: '#FFFFFF',
                            color: '#333',
                            outline: 'none'
                        }
                    }
                ),
                React.createElement('button',
                    {
                        type: 'submit',
                        'aria-label': 'Buscar',
                        style: {
                            position: 'absolute',
                            right: '5px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '18px',
                            color: '#FF6B9D',
                            padding: '8px'
                        }
                    },
                    '🔍'
                )
            )
        )
    );
};

console.log('✅ Modern Header Component loaded');
