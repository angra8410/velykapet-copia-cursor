// Header Moderno para VentasPet
// Inspirado en Rappi y DoctorPet con colores E45A84

console.log('🎨 Cargando Header Component...');

window.HeaderComponent = function() {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isSearchExpanded, setIsSearchExpanded] = React.useState(false);
    const [cartItems, setCartItems] = React.useState(0);
    const [scrollPosition, setScrollPosition] = React.useState(0);
    const [headerVisible, setHeaderVisible] = React.useState(true);
    const [lastScrollTop, setLastScrollTop] = React.useState(0);
    
    // Actualizar contador del carrito
    React.useEffect(() => {
        const updateCart = () => {
            if (window.cartManager) {
                setCartItems(window.cartManager.getTotalItems());
            }
        };
        
        // Actualizar inmediatamente
        updateCart();
        
        // Suscribirse a cambios del carrito
        if (window.cartManager && window.cartManager.subscribe) {
            window.cartManager.subscribe(updateCart);
        }
        
        // Actualizar cada segundo (backup)
        const interval = setInterval(updateCart, 1000);
        
        return () => {
            clearInterval(interval);
            if (window.cartManager && window.cartManager.unsubscribe) {
                window.cartManager.unsubscribe(updateCart);
            }
        };
    }, []);
    
    // Efecto para controlar la visibilidad del header al hacer scroll
    React.useEffect(() => {
        // Usar un debounce para mejorar el rendimiento
        let scrollTimer = null;
        
        const handleScroll = () => {
            if (scrollTimer !== null) {
                clearTimeout(scrollTimer);
            }
            
            scrollTimer = setTimeout(() => {
                const currentScrollPos = window.pageYOffset;
                const scrollThreshold = 80; // Umbral para activar el efecto (altura del header)
                const scrollDelta = Math.abs(currentScrollPos - lastScrollTop);
                
                // Solo procesar si el cambio de scroll es significativo
                if (scrollDelta > 10) {
                    // Determinar dirección del scroll
                    const isScrollingDown = currentScrollPos > lastScrollTop;
                    
                    // Aplicar lógica de visibilidad
                    if (currentScrollPos < scrollThreshold) {
                        // Siempre visible al inicio de la página
                        setHeaderVisible(true);
                    } else if (isScrollingDown) {
                        // Ocultar al hacer scroll hacia abajo
                        setHeaderVisible(false);
                    } else {
                        // Mostrar al hacer scroll hacia arriba
                        setHeaderVisible(true);
                    }
                    
                    // Actualizar posición de scroll y última posición
                    setScrollPosition(currentScrollPos);
                    setLastScrollTop(currentScrollPos);
                }
            }, 50); // Pequeño retraso para mejorar rendimiento
        };
        
        // Agregar event listener
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Limpiar event listener y timer
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
        console.log('🔍 Buscando:', searchQuery);
    };
    
    console.log('📝 DEBUG Header: Renderizando header component');
    
    return React.createElement('header',
        {
            className: 'header-modern',
            style: {
                background: 'white',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                borderBottom: '1px solid #e9ecef',
                position: 'fixed', // Cambiado a fixed para mantener el header fijo
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                backdropFilter: 'blur(10px)',
                width: '100vw', // Forzar 100% del viewport
                maxWidth: '100vw', // Sin limitaciones
                minHeight: '80px', // Reducido según solicitud del usuario
                display: 'block',
                visibility: headerVisible ? 'visible' : 'hidden',
                opacity: headerVisible ? 1 : 0,
                transform: headerVisible ? 'translateY(0)' : 'translateY(-100%)',
                transition: 'transform 0.4s ease-in-out, opacity 0.4s ease-in-out, visibility 0.4s ease-in-out',
                margin: '0', // Sin márgenes que limiten
                padding: '0' // Sin padding que reduzca el ancho
            }
        },
        
        // Container principal - VIEWPORT COMPLETO
        React.createElement('div',
            {
                className: 'header-container-full-viewport',
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 2rem', // Padding reducido
                    width: '100%', // Usar todo el ancho disponible
                    maxWidth: '100%', // Sin limitaciones de maxWidth
                    margin: '0', // Sin margin que centre
                    minHeight: '80px', // Reducido según solicitud del usuario
                }
            },
            
            // Lado izquierdo: Menú hamburguesa, letras VelyKapet y barra de búsqueda
            React.createElement('div',
                {
                    className: 'header-left',
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        flex: '1',
                        maxWidth: '70%'
                    }
                },
                // Contenedor para menú y logo
                React.createElement('div',
                    {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px'
                        }
                    },
                    // Menú hamburguesa (sin evento de navegación)
                    window.HamburgerMenuComponent && React.createElement(window.HamburgerMenuComponent),
                    
                    // Letras VelyKapet al lado del menú hamburguesa (clickeable para home)
                    React.createElement('div',
                            {
                                className: 'brand-letters',
                                style: {
                                    height: '80px', // Aumentado para permitir un logo más grande
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'visible', // Mantener visible para evitar cortes
                                    minWidth: '300px', // Aumentado el ancho mínimo para el contenedor
                                    marginRight: '20px', // Añadir margen para separar del siguiente elemento
                                    cursor: 'pointer' // Indicar que es clickeable
                                },
                                onClick: () => {
                                    if (window.setCurrentView) {
                                        window.setCurrentView('home');
                                    }
                                }
                            },
                            React.createElement('img',
                                {
                                    src: '/public/images/velykapet_letras-removebg-preview.png',
                                    alt: 'VelyKapet Letras',
                                    style: {
                                    height: '70px', // Aumentado para hacer el logo más grande
                                    width: 'auto',
                                    maxWidth: 'none', // Mantener sin restricciones
                                    objectFit: 'contain',
                                    filter: 'brightness(1.2) contrast(1.2)', // Aumentado para mejor visibilidad
                                    dropShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                                    transform: 'scale(1.8)', // Aumentado aún más la escala a 1.8
                                    transformOrigin: 'left center' // Asegurar que la transformación se aplique desde la izquierda
                                },
                                onError: (e) => {
                                    // Fallback si no carga la imagen de letras
                                    console.warn('⚠️ Letras VelyKapet no encontradas, usando texto');
                                    e.target.style.display = 'none';
                                    const fallbackDiv = document.createElement('div');
                                    fallbackDiv.innerHTML = 'VelyKapet';
                                    fallbackDiv.style.color = '#333';
                                    fallbackDiv.style.fontSize = '2.5rem'; // Aumentado aún más
                                    fallbackDiv.style.fontWeight = '700';
                                    fallbackDiv.style.textShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
                                    e.target.parentElement.appendChild(fallbackDiv);
                                }
                            }
                        )
                    )
                ),
                
                // Barra de búsqueda movida al lado del logo (desktop)
                React.createElement('div',
                    {
                        className: 'header-search-desktop',
                        style: {
                            display: window.innerWidth > 768 ? 'flex' : 'none',
                            flex: 1,
                            maxWidth: '400px',
                            marginLeft: '20px'
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
                                placeholder: 'Buscar productos para tu mascota...',
                                value: searchQuery,
                                onChange: (e) => setSearchQuery(e.target.value),
                                style: {
                                    width: '100%',
                                    padding: '12px 50px 12px 20px',
                                    border: 'none',
                                    borderRadius: '25px',
                                    fontSize: '14px',
                                    background: '#f8f9fa',
                                    color: '#333',
                                    border: '2px solid #e9ecef',
                                    outline: 'none',
                                    transition: 'all 0.3s ease'
                                },
                                onFocus: (e) => {
                                    e.target.style.background = 'white';
                                    e.target.style.borderColor = '#007bff';
                                    e.target.style.transform = 'scale(1.02)';
                                },
                                onBlur: (e) => {
                                    e.target.style.background = '#f8f9fa';
                                    e.target.style.borderColor = '#e9ecef';
                                    e.target.style.transform = 'scale(1)';
                                }
                            }
                        ),
                        React.createElement('button',
                            {
                                type: 'submit',
                                style: {
                                    position: 'absolute',
                                    right: '5px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '35px',
                                    height: '35px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    transition: 'all 0.2s ease'
                                },
                                onMouseEnter: (e) => {
                                    e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                                    e.target.style.transform = 'translateY(-50%) scale(1.1)';
                                },
                                onMouseLeave: (e) => {
                                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                                    e.target.style.transform = 'translateY(-50%) scale(1)';
                                }
                            },
                            '🔍'
                        )
                    )
                )
            ),
            
            // Logo a la derecha
            React.createElement('div',
                {
                    className: 'header-brand',
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer'
                    },
                    onClick: () => {
                        if (window.setCurrentView) {
                            window.setCurrentView('home');
                        }
                    }
                },
                
                // Logo principal eliminado según solicitud
                
                
                // Subtítulo eliminado según solicitud
                
            ),
            
            // Logo a la derecha (eliminado)
            
            
            // Acciones del header
            React.createElement('div',
                {
                    className: 'header-actions',
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        gap: '10px'
                    }
                },
                
                // Redes sociales
                React.createElement('div',
                    {
                        className: 'social-buttons',
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginBottom: '5px'
                        }
                    },
                    // Instagram con imagen real
                    React.createElement('a',
                        {
                            href: 'https://www.instagram.com/velykapet',
                            target: '_blank',
                            rel: 'noopener noreferrer',
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: 'white',
                                textDecoration: 'none',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                transition: 'all 0.2s ease'
                            },
                            onMouseEnter: (e) => {
                                e.target.style.transform = 'scale(1.1)';
                            },
                            onMouseLeave: (e) => {
                                e.target.style.transform = 'scale(1)';
                            }
                        },
                        React.createElement('img', {
                            src: '/public/images/instagram.png',
                            alt: 'Instagram',
                            style: {
                                width: '24px',
                                height: '24px',
                                objectFit: 'contain'
                            },
                            onError: (e) => {
                                console.error('Error al cargar imagen de Instagram');
                                e.target.onerror = null;
                                // Reemplazar la imagen con texto
                                const parent = e.target.parentNode;
                                parent.innerHTML = 'IG';
                                parent.style.color = '#E45A84';
                                parent.style.fontSize = '16px';
                                parent.style.fontWeight = 'bold';
                            }
                        })
                    ),
                    // WhatsApp con imagen real
                    React.createElement('a',
                        {
                            href: 'https://wa.me/message/VELYKAPET',
                            target: '_blank',
                            rel: 'noopener noreferrer',
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: 'white',
                                textDecoration: 'none',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                transition: 'all 0.2s ease'
                            },
                            onMouseEnter: (e) => {
                                e.target.style.transform = 'scale(1.1)';
                            },
                            onMouseLeave: (e) => {
                                e.target.style.transform = 'scale(1)';
                            }
                        },
                        React.createElement('img', {
                            src: '/public/images/whatsapp.png',
                            alt: 'WhatsApp',
                            style: {
                                width: '24px',
                                height: '24px',
                                objectFit: 'contain'
                            },
                            onError: (e) => {
                                console.error('Error al cargar imagen de WhatsApp');
                                e.target.onerror = null;
                                // Reemplazar la imagen con texto
                                const parent = e.target.parentNode;
                                parent.innerHTML = 'WA';
                                parent.style.color = '#25D366';
                                parent.style.fontSize = '16px';
                                parent.style.fontWeight = 'bold';
                            }
                        })
                    )
                ),
                
                // Contenedor de botones principales
                React.createElement('div',
                    {
                        className: 'main-buttons',
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px'
                        }
                    },
                    
                    // Búsqueda móvil
                    window.innerWidth <= 768 && React.createElement('button',
                        {
                            className: 'btn-search-mobile',
                            onClick: () => setIsSearchExpanded(!isSearchExpanded),
                            style: {
                                background: '#f8f9fa',
                                border: '2px solid #e9ecef',
                                borderRadius: '10px',
                                width: '45px',
                                height: '45px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#333',
                                cursor: 'pointer',
                                fontSize: '18px',
                                transition: 'all 0.2s ease'
                            }
                        },
                        '🔍'
                    ),
                    
                    // Botón de favoritos
                    React.createElement('button',
                        {
                            className: 'btn-favorites',
                            onClick: () => {
                                // Verificar si la vista de favoritos existe
                                if (window.setCurrentView) {
                                    // Comprobar si existe la vista de favoritos
                                    if (window.availableViews && window.availableViews.includes('favorites')) {
                                        window.setCurrentView('favorites');
                                    } else {
                                        // Si no existe la vista, mostrar un mensaje amigable
                                        alert('La sección de favoritos estará disponible próximamente. ¡Gracias por tu paciencia!');
                                    }
                                } else {
                                    alert('Función de favoritos próximamente disponible');
                                }
                            },
                            style: {
                                background: 'rgba(255, 255, 255, 0.2)',
                                border: 'none',
                                borderRadius: '10px',
                                width: '45px',
                                height: '45px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#E45A84',
                                cursor: 'pointer',
                                fontSize: '22px',
                                fontWeight: '600',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                position: 'relative',
                                transition: 'all 0.2s ease'
                            },
                            onMouseEnter: (e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                                e.target.style.transform = 'scale(1.05)';
                            },
                            onMouseLeave: (e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                                e.target.style.transform = 'scale(1)';
                            }
                        },
                        '❤️'
                    ),
                    
                    // Carrito
                    React.createElement('button',
                        {
                            className: 'btn-cart',
                            onClick: () => {
                                if (window.setCurrentView) {
                                    window.setCurrentView('cart');
                                }
                            },
                            style: {
                                background: 'rgba(255, 255, 255, 0.2)',
                                border: 'none',
                                borderRadius: '10px',
                                width: '45px',
                                height: '45px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '22px',
                                fontWeight: '600',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                position: 'relative',
                                transition: 'all 0.2s ease'
                            },
                            onMouseEnter: (e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                                e.target.style.transform = 'scale(1.05)';
                            },
                            onMouseLeave: (e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                                e.target.style.transform = 'scale(1)';
                            }
                        },
                        
                        // Ícono del carrito
                        React.createElement('span', { style: { fontSize: '22px' } }, '🛒'),
                        
                        // Badge del contador
                        cartItems > 0 && React.createElement('span',
                            {
                                className: 'cart-badge animate-bounce',
                                style: {
                                    position: 'absolute',
                                    top: '-5px',
                                    right: '-5px',
                                    background: '#FF6B35',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '22px',
                                    height: '22px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    boxShadow: '0 2px 6px rgba(255, 107, 53, 0.4)',
                                    animation: 'heartbeat 1.5s ease-in-out'
                                }
                            },
                            cartItems > 99 ? '99+' : cartItems
                        )
                    ),
                    
                    // Botón de login para usuarios no autenticados
                    window.authManager && !window.authManager.isAuthenticated() && React.createElement('button',
                        {
                            className: 'btn-login',
                            onClick: () => {
                                if (window.setCurrentView) {
                                    window.setCurrentView('auth');
                                }
                            },
                            style: {
                                background: 'rgba(255, 255, 255, 0.9)',
                                border: 'none',
                                borderRadius: '10px',
                                width: '45px',
                                height: '45px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#E45A84',
                                cursor: 'pointer',
                                fontSize: '22px',
                                fontWeight: '600',
                                transition: 'all 0.2s ease',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.3)'
                            },
                            onMouseEnter: (e) => {
                                e.target.style.background = 'white';
                                e.target.style.transform = 'scale(1.05)';
                                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                            },
                            onMouseLeave: (e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                                e.target.style.transform = 'scale(1)';
                                e.target.style.boxShadow = 'none';
                            }
                        },
                        React.createElement('span', { style: { fontSize: '22px' } }, '👤')
                    ),
                    
                    // Perfil de usuario
                    window.authManager && window.authManager.isAuthenticated() && React.createElement('div',
                        {
                            className: 'user-profile',
                            onClick: () => {
                                if (window.setCurrentView) {
                                    window.setCurrentView('profile');
                                }
                            },
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '45px',
                                height: '45px',
                                background: 'rgba(255, 255, 255, 0.2)',
                                borderRadius: '10px',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            },
                            onMouseEnter: (e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                                e.target.style.transform = 'scale(1.05)';
                            },
                            onMouseLeave: (e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                                e.target.style.transform = 'scale(1)';
                            }
                        },
                        
                        // Avatar
                        React.createElement('div',
                            {
                                style: {
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: 'rgba(255, 255, 255, 0.3)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '22px'
                                }
                            },
                            '👤'
                        )
                    )
                )
            )
        ),
        
        // Barra de búsqueda móvil expandida
        isSearchExpanded && window.innerWidth <= 768 && React.createElement('div',
            {
                className: 'mobile-search',
                style: {
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '15px 20px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.2)'
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
                        style: {
                            width: '100%',
                            padding: '12px 50px 12px 20px',
                            border: 'none',
                            borderRadius: '25px',
                            fontSize: '16px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            outline: 'none'
                        }
                    }
                ),
                React.createElement('button',
                    {
                        type: 'submit',
                        style: {
                            position: 'absolute',
                            right: '5px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'rgba(255, 255, 255, 0.3)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '35px',
                            height: '35px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }
                    },
                    '🔍'
                )
            )
        )
    );
};

console.log('✅ Header Component cargado');