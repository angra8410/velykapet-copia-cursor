// Tarjeta de Producto Moderna para VentasPet
// Estilo Rappi/DoctorPet con animaciones y efectos

console.log('🛍️ Cargando Product Card Component...');

window.ProductCardComponent = function({ product, onAddToCart, onViewDetails }) {
    const [isImageLoading, setIsImageLoading] = React.useState(true);
    const [imageError, setImageError] = React.useState(false);
    const [isAddingToCart, setIsAddingToCart] = React.useState(false);
    const [showQuickView, setShowQuickView] = React.useState(false);
    const [selectedVariation, setSelectedVariation] = React.useState(null);
    const [productVariations, setProductVariations] = React.useState([]);
    const [isFavorite, setIsFavorite] = React.useState(false);
    
    if (!product) return null;
    
    // Verificar si el producto está en favoritos
    React.useEffect(() => {
        if (window.favoritesManager) {
            const productId = product.Id || product.IdProducto;
            setIsFavorite(window.favoritesManager.isFavorite(productId));
        }
    }, [product]);
    
    // Suscribirse a cambios de favoritos
    React.useEffect(() => {
        const updateFavoriteStatus = () => {
            if (window.favoritesManager) {
                const productId = product.Id || product.IdProducto;
                setIsFavorite(window.favoritesManager.isFavorite(productId));
            }
        };
        
        if (window.favoritesManager && window.favoritesManager.subscribe) {
            window.favoritesManager.subscribe(updateFavoriteStatus);
            return () => {
                if (window.favoritesManager && window.favoritesManager.unsubscribe) {
                    window.favoritesManager.unsubscribe(updateFavoriteStatus);
                }
            };
        }
    }, [product]);
    
    // Cargar variaciones del producto
    React.useEffect(() => {
        if (window.getProductVariations) {
            // Pasar el producto completo con Variaciones del backend
            const variations = window.getProductVariations(product);
            setProductVariations(variations);
            
            // Seleccionar la primera variación por defecto
            if (variations.length > 0) {
                setSelectedVariation(variations[0]);
            }
        }
    }, [product]);
    
    const handleImageLoad = () => {
        setIsImageLoading(false);
    };
    
    const handleImageError = () => {
        setIsImageLoading(false);
        setImageError(true);
    };
    
    const handleAddToCart = async (e) => {
        e.stopPropagation();
        
        if (isAddingToCart) return;
        
        setIsAddingToCart(true);
        
        try {
            // Usar la variación seleccionada o el producto original
            const productToAdd = selectedVariation || product;
            
            // Solo usar onAddToCart - NO usar cartManager directamente
            if (onAddToCart) {
                await onAddToCart(productToAdd);
                console.log('🛒 Producto añadido al carrito:', productToAdd.name || productToAdd.Name);
            } else {
                console.error('❌ No se puede agregar producto: falta onAddToCart');
                return;
            }
            
            // Animación de éxito
            setTimeout(() => setIsAddingToCart(false), 1000);
            
        } catch (error) {
            console.error('❌ Error añadiendo al carrito:', error);
            setIsAddingToCart(false);
        }
    };
    
    const handleCardClick = () => {
        if (onViewDetails) {
            onViewDetails(product);
        }
    };
    
    const handleToggleFavorite = (e) => {
        e.stopPropagation(); // Prevenir que se active el click del card
        
        if (window.favoritesManager) {
            window.favoritesManager.toggleFavorite(product);
        }
    };
    
    const formatPrice = (price) => {
        if (window.formatCOP) {
            return window.formatCOP(price);
        }
        return `$${price?.toLocaleString() || '0'}`;
    };
    
    // Obtener el precio actual (de la variación seleccionada o del producto)
    const getCurrentPrice = () => {
        return selectedVariation?.price || product.Price || product.price || 0;
    };
    
    const getStockStatus = () => {
        const currentStock = selectedVariation?.stock || product.Stock || product.stock || 0;
        
        if (!currentStock || currentStock === 0) {
            return { text: 'Agotado', color: '#dc3545', available: false };
        } else if (currentStock <= 5) {
            return { text: 'Últimas unidades', color: '#ffc107', available: true };
        } else {
            return { text: 'Disponible', color: '#28a745', available: true };
        }
    };
    
    const stockStatus = getStockStatus();
    
    return React.createElement('div',
        {
            className: 'product-card hover-lift',
            onClick: handleCardClick,
            style: {
                background: 'white',
                borderRadius: '18px', // Bordes más redondeados
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // Transición más suave
                border: '1px solid rgba(0, 0, 0, 0.08)',
                position: 'relative',
                height: '100%',
                minHeight: '360px', // Altura compacta para 4-5 columnas
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' // Sombra sutil inicial
            },
            onMouseEnter: (e) => {
                e.target.style.transform = 'translateY(-12px) scale(1.02)';
                e.target.style.boxShadow = '0 25px 50px rgba(74, 144, 226, 0.15), 0 10px 30px rgba(0, 0, 0, 0.1)';
                e.target.style.borderColor = '#4A90E2';
                
                // Activar Quick View con un pequeño delay para mejor UX
                setTimeout(() => {
                    if (e.target.matches(':hover')) {
                        setShowQuickView(true);
                    }
                }, 300);
            },
            onMouseLeave: (e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                e.target.style.borderColor = 'rgba(0, 0, 0, 0.08)';
                setShowQuickView(false);
            }
        },
        
        // Badge de descuento (si existe)
        product.discount && product.discount > 0 && React.createElement('div',
            {
                className: 'discount-badge',
                style: {
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: '#FF6B35',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    zIndex: 2,
                    boxShadow: '0 2px 8px rgba(255, 107, 53, 0.4)'
                }
            },
            `-${product.discount}%`
        ),
        
        // Botón de favoritos
        React.createElement('button',
            {
                onClick: handleToggleFavorite,
                style: {
                    position: 'absolute',
                    top: '10px',
                    right: product.discount && product.discount > 0 ? '70px' : '10px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    fontSize: '18px',
                    cursor: 'pointer',
                    zIndex: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    transition: 'all 0.2s ease',
                    color: isFavorite ? '#E45A84' : '#999'
                },
                onMouseEnter: (e) => {
                    e.target.style.transform = 'scale(1.15)';
                    e.target.style.boxShadow = '0 4px 12px rgba(228, 90, 132, 0.3)';
                },
                onMouseLeave: (e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
                },
                title: isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'
            },
            isFavorite ? '❤️' : '🤍'
        ),
        
        // Badge de stock
        React.createElement('div',
            {
                className: 'stock-badge',
                style: {
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: stockStatus.color,
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '600',
                    zIndex: 2,
                    opacity: 0.9
                }
            },
            stockStatus.text
        ),
        
        // Contenedor de imagen
        React.createElement('div',
            {
                className: 'product-image-container',
                style: {
                    position: 'relative',
                    paddingTop: '60%', // Aspect ratio más compacto
                    background: '#f8f9fa',
                    overflow: 'hidden'
                }
            },
            
            // Loader de imagen
            isImageLoading && React.createElement('div',
                {
                    className: 'image-loader',
                    style: {
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '30px',
                        height: '30px',
                        border: '3px solid #f3f3f3',
                        borderTop: '3px solid #4A90E2',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }
                }
            ),
            
            // Imagen del producto o placeholder mejorado
            React.createElement('img',
                {
                    src: (() => {
                        // Debug: Log image URL detection
                        const imageUrl = product.image || product.ImageUrl || product.URLImagen || product.imageUrl;
                        console.log('🖼️ ProductCard - Image URL for', product.name || product.Name || product.NombreBase, ':', {
                            imageUrl: imageUrl,
                            hasError: imageError,
                            fields: {
                                image: product.image,
                                ImageUrl: product.ImageUrl,
                                URLImagen: product.URLImagen,
                                imageUrl: product.imageUrl
                            }
                        });
                        
                        if (imageError || !imageUrl) {
                            console.log('⚠️ Using placeholder for', product.name || product.Name || product.NombreBase);
                            return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM0QTkwRTI7c3RvcC1vcGFjaXR5OjEiIC8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzM1N0FCRDtzdG9wLW9wYWNpdHk6MSIgLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8Y2lyY2xlIGN4PSIxMDAiIGN5PSI3NSIgcj0iMzAiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuOSIvPgo8Y2lyY2xlIGN4PSI5MCIgY3k9IjY1IiByPSI4IiBmaWxsPSIjMzMzIi8+CjxjaXJjbGUgY3g9IjExMCIgY3k9IjY1IiByPSI4IiBmaWxsPSIjMzMzIi8+CjxwYXRoIGQ9Ik0xMDAgODVDMTA1IDkwIDk1IDkwIDEwMCA4NSIgZmlsbD0iIzMzMyIvPgo8dGV4dCB4PSIxMDAiIHk9IjEzMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+4p2M77iPPC90ZXh0Pgo8L3N2Zz4=';
                        }
                        
                        // Transform URL if transformer is available
                        const finalUrl = window.transformImageUrl ? 
                            window.transformImageUrl(imageUrl) :
                            imageUrl;
                        
                        console.log('✅ Final image URL:', finalUrl);
                        return finalUrl;
                    })(),
                    alt: product.name || product.Name || product.NombreBase,
                    onLoad: handleImageLoad,
                    onError: handleImageError,
                    style: {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'all 0.3s ease',
                        opacity: isImageLoading ? 0 : 1
                    }
                }
            ),
            
            // Quick view overlay - Solo información, sin botón de agregar
            showQuickView && stockStatus.available && React.createElement('div',
                {
                    className: 'quick-view-overlay',
                    style: {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(228, 90, 132, 0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: showQuickView ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                        backdropFilter: 'blur(2px)'
                    }
                },
React.createElement('div',
                    {
                        onClick: (e) => e.stopPropagation(),
                        style: {
                            background: 'white',
                            borderRadius: '15px',
                            padding: '15px',
                            minWidth: '200px',
                            transform: showQuickView ? 'scale(1)' : 'scale(0.8)',
                            transition: 'transform 0.3s ease',
                            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
                            textAlign: 'center'
                        }
                    },
                    
                    // Nombre del producto
                    React.createElement('h4',
                        {
                            style: {
                                margin: '0 0 8px 0',
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#333'
                            }
                        },
                        product.name
                    ),
                    
                    // Precio destacado
                    React.createElement('div',
                        {
                            style: {
                                fontSize: '18px',
                                fontWeight: '700',
                                color: '#4A90E2',
                                marginBottom: '8px'
                            }
                        },
                        formatPrice(getCurrentPrice())
                    ),
                    
                    // Stock
                    React.createElement('div',
                        {
                            style: {
                                fontSize: '12px',
                                color: '#666',
                                marginBottom: '10px'
                            }
                        },
                        `Stock: ${product.stock} disponibles`
                    ),
                    
                    // Indicador de acción
                    React.createElement('div',
                        {
                            style: {
                                fontSize: '12px',
                                color: '#4A90E2',
                                fontWeight: '500',
                                opacity: 0.8
                            }
                        },
                        '👆 Haz clic abajo para agregar'
                    )
                )
            )
        ),
        
        // Contenido de la tarjeta
        React.createElement('div',
            {
                className: 'product-content',
                style: {
                    padding: '16px',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column'
                }
            },
            
            // Categoría
            product.category && React.createElement('div',
                {
                    className: 'product-category caption',
                    style: {
                        color: '#666',
                        marginBottom: '4px'
                    }
                },
                product.category
            ),
            
            // Nombre del producto
            React.createElement('h3',
                {
                    className: 'product-name heading-4',
                    style: {
                        color: '#333',
                        margin: '0 0 8px 0',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }
                },
                product.name
            ),
            
            // Descripción corta
            product.description && React.createElement('p',
                {
                    className: 'product-description body-small',
                    style: {
                        color: '#666',
                        margin: '0 0 12px 0',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }
                },
                product.description
            ),
            
            // Variaciones del producto (si existen)
            productVariations.length > 1 && window.ProductVariationsComponent && React.createElement(window.ProductVariationsComponent, {
                product: product,
                onVariationChange: setSelectedVariation,
                selectedVariation: selectedVariation
            }),
            
            // Rating (si existe)
            product.rating && React.createElement('div',
                {
                    className: 'product-rating',
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginBottom: '8px'
                    }
                },
                // Estrellas
                Array.from({ length: 5 }, (_, i) => 
                    React.createElement('span',
                        {
                            key: i,
                            style: {
                                color: i < Math.floor(product.rating) ? '#FFD700' : '#E0E0E0',
                                fontSize: '14px'
                            }
                        },
                        '⭐'
                    )
                ),
                React.createElement('span',
                    {
                        style: {
                            fontSize: '12px',
                            color: '#666',
                            marginLeft: '4px'
                        }
                    },
                    `(${product.rating})`
                )
            ),
            
            // Precios
            React.createElement('div',
                {
                    className: 'product-pricing',
                    style: {
                        marginTop: 'auto',
                        marginBottom: '12px'
                    }
                },
                
                // Precio original (si hay descuento)
                product.discount && product.originalPrice && React.createElement('span',
                    {
                        className: 'original-price',
                        style: {
                            fontSize: '13px',
                            color: '#999',
                            textDecoration: 'line-through',
                            marginRight: '8px'
                        }
                    },
                    formatPrice(product.originalPrice)
                ),
                
                // Precio actual
                React.createElement('span',
                    {
                        className: 'current-price price',
                        style: {
                            color: '#4A90E2'
                        }
                    },
                    formatPrice(getCurrentPrice())
                )
            ),
            
            // Botón de acción
            React.createElement('button',
                {
                    onClick: handleAddToCart,
                    disabled: isAddingToCart || !stockStatus.available,
                    style: {
                        width: '100%',
                        background: stockStatus.available 
                            ? (isAddingToCart ? '#28a745' : 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)')
                            : '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '10px 16px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: stockStatus.available ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease',
                        opacity: stockStatus.available ? 1 : 0.6
                    },
                    onMouseEnter: (e) => {
                        if (stockStatus.available && !isAddingToCart) {
                            e.target.style.transform = 'scale(1.02)';
                            e.target.style.boxShadow = '0 4px 12px rgba(228, 90, 132, 0.4)';
                        }
                    },
                    onMouseLeave: (e) => {
                        if (stockStatus.available) {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.boxShadow = 'none';
                        }
                    }
                },
                
            // Ícono del botón con animación
            React.createElement('span', 
                { 
                    style: { fontSize: '16px' },
                    className: isAddingToCart ? 'animate-bounce' : ''
                }, 
                !stockStatus.available ? '❌' : isAddingToCart ? '✅' : '🛒'
            ),
                
                // Texto del botón
                React.createElement('span', null,
                    !stockStatus.available ? 'Agotado' :
                    isAddingToCart ? 'Agregado' : 'Agregar al carrito'
                )
            )
        )
    );
};

console.log('✅ Product Card Component cargado');