// VentasPet - Vista Detallada del Carrito de Compras
// Página completa para ver, editar y gestionar items del carrito

console.log('🛒 Cargando vista detallada del carrito...');

// ======================
// COMPONENTE DE ITEM DEL CARRITO
// ======================

function CartItem({ item, onUpdateQuantity, onRemoveItem }) {
    const [quantity, setQuantity] = React.useState(item.quantity);
    const [isUpdating, setIsUpdating] = React.useState(false);

    const handleQuantityChange = async (newQuantity) => {
        if (newQuantity < 1) return;
        if (newQuantity > item.stock) {
            alert(`❌ Stock máximo disponible: ${item.stock}`);
            return;
        }

        setIsUpdating(true);
        try {
            await onUpdateQuantity(item.productId, newQuantity);
            setQuantity(newQuantity);
            
            console.log('🔄 Cantidad actualizada:', item.name, 'Nueva cantidad:', newQuantity);
        } catch (error) {
            console.error('Error actualizando cantidad:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleRemove = async () => {
        if (confirm(`¿Estás seguro de eliminar "${item.name}" del carrito?`)) {
            try {
                await onRemoveItem(item.productId);
            } catch (error) {
                console.error('Error eliminando item:', error);
            }
        }
    };

    return React.createElement('div',
        {
            style: {
                background: 'white',
                padding: '20px',
                borderRadius: '15px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                border: '1px solid #e0e0e0',
                marginBottom: '15px',
                transition: 'transform 0.2s',
                opacity: isUpdating ? 0.7 : 1
            },
            onMouseEnter: (e) => {
                e.target.style.transform = 'translateY(-2px)';
            },
            onMouseLeave: (e) => {
                e.target.style.transform = 'translateY(0)';
            }
        },

        React.createElement('div',
            {
                style: {
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr auto auto auto',
                    gap: '20px',
                    alignItems: 'center'
                }
            },

            // Imagen del producto (placeholder)
            React.createElement('div',
                {
                    style: {
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem'
                    }
                },
                '📦'
            ),

            // Información del producto
            React.createElement('div', null,
                React.createElement('h4',
                    {
                        style: {
                            margin: '0 0 8px 0',
                            fontSize: '1.1rem',
                            color: '#333',
                            fontWeight: 'bold'
                        }
                    },
                    item.name
                ),
                React.createElement('p',
                    {
                        style: {
                            margin: '0 0 5px 0',
                            color: '#28a745',
                            fontSize: '1.1rem',
                            fontWeight: 'bold'
                        }
                    },
                    `${window.formatCOP ? window.formatCOP(item.price) : '$' + item.price} c/u`
                ),
                React.createElement('p',
                    {
                        style: {
                            margin: '0',
                            color: '#666',
                            fontSize: '0.9rem'
                        }
                    },
                    `Stock disponible: ${item.stock}`
                )
            ),

            // Controles de cantidad
            React.createElement('div',
                {
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: '#f8f9fa',
                        padding: '8px',
                        borderRadius: '8px'
                    }
                },
                
                // Botón decrementar
                React.createElement('button',
                    {
                        onClick: () => handleQuantityChange(quantity - 1),
                        disabled: isUpdating || quantity <= 1,
                        style: {
                            width: '35px',
                            height: '35px',
                            background: quantity <= 1 ? '#6c757d' : '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                            fontSize: '1.2rem',
                            fontWeight: 'bold'
                        }
                    },
                    '−'
                ),
                
                // Cantidad actual
                React.createElement('span',
                    {
                        style: {
                            minWidth: '40px',
                            textAlign: 'center',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            color: '#333'
                        }
                    },
                    isUpdating ? '⏳' : quantity
                ),
                
                // Botón incrementar
                React.createElement('button',
                    {
                        onClick: () => handleQuantityChange(quantity + 1),
                        disabled: isUpdating || quantity >= item.stock,
                        style: {
                            width: '35px',
                            height: '35px',
                            background: quantity >= item.stock ? '#6c757d' : '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: quantity >= item.stock ? 'not-allowed' : 'pointer',
                            fontSize: '1.2rem',
                            fontWeight: 'bold'
                        }
                    },
                    '+'
                )
            ),

            // Subtotal
            React.createElement('div',
                {
                    style: {
                        textAlign: 'right'
                    }
                },
                React.createElement('div',
                    {
                        style: {
                            fontSize: '1.3rem',
                            fontWeight: 'bold',
                            color: '#007bff'
                        }
                    },
                    `${window.formatCOP ? window.formatCOP(item.subtotal) : '$' + item.subtotal}`
                ),
                React.createElement('div',
                    {
                        style: {
                            fontSize: '0.9rem',
                            color: '#666'
                        }
                    },
                    'Subtotal'
                )
            ),

            // Botón eliminar
            React.createElement('button',
                {
                    onClick: handleRemove,
                    disabled: isUpdating,
                    style: {
                        width: '40px',
                        height: '40px',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    },
                    title: 'Eliminar del carrito'
                },
                '🗑️'
            )
        )
    );
}

// ======================
// COMPONENTE DE RESUMEN DE COMPRA
// ======================

function CartSummary({ items, onClearCart, onCheckout }) {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.subtotal, 0);
    const uniqueProducts = items.length;

    // Calcular impuestos y envío (simulados)
    const taxRate = 0.19; // 19% IVA
    const taxes = totalPrice * taxRate;
    const shipping = totalPrice > 100000 ? 0 : 15000; // Envío gratis sobre $100.000 COP
    const finalTotal = totalPrice + taxes + shipping;

    return React.createElement('div',
        {
            style: {
                background: 'white',
                padding: '30px',
                borderRadius: '15px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                border: '1px solid #e0e0e0',
                position: 'sticky',
                top: '20px'
            }
        },

        // Título
        React.createElement('h3',
            {
                style: {
                    margin: '0 0 20px 0',
                    fontSize: '1.4rem',
                    color: '#333',
                    textAlign: 'center'
                }
            },
            '🧾 Resumen de Compra'
        ),

        // Estadísticas básicas
        React.createElement('div',
            {
                style: {
                    background: '#f8f9fa',
                    padding: '15px',
                    borderRadius: '10px',
                    marginBottom: '20px'
                }
            },
            React.createElement('div',
                {
                    style: {
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: '10px',
                        textAlign: 'center'
                    }
                },
                React.createElement('div', null,
                    React.createElement('div', { style: { fontSize: '1.5rem', fontWeight: 'bold', color: '#007bff' } }, totalItems),
                    React.createElement('div', { style: { fontSize: '0.8rem', color: '#666' } }, 'Items')
                ),
                React.createElement('div', null,
                    React.createElement('div', { style: { fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' } }, uniqueProducts),
                    React.createElement('div', { style: { fontSize: '0.8rem', color: '#666' } }, 'Productos')
                ),
                React.createElement('div', null,
                    React.createElement('div', { style: { fontSize: '1.5rem', fontWeight: 'bold', color: '#dc3545' } }, window.formatCOP ? window.formatCOP(totalPrice) : '$' + totalPrice),
                    React.createElement('div', { style: { fontSize: '0.8rem', color: '#666' } }, 'Subtotal')
                )
            )
        ),

        // Desglose de costos
        React.createElement('div',
            {
                style: {
                    borderTop: '1px solid #e0e0e0',
                    paddingTop: '20px',
                    marginBottom: '20px'
                }
            },
            React.createElement('div',
                {
                    style: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '10px'
                    }
                },
                React.createElement('span', null, 'Subtotal:'),
                React.createElement('span', { style: { fontWeight: 'bold' } }, window.formatCOP ? window.formatCOP(totalPrice) : '$' + totalPrice)
            ),
            React.createElement('div',
                {
                    style: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '10px'
                    }
                },
                React.createElement('span', null, `IVA (${(taxRate * 100)}%):`),
                React.createElement('span', { style: { fontWeight: 'bold' } }, window.formatCOP ? window.formatCOP(taxes) : '$' + taxes)
            ),
            React.createElement('div',
                {
                    style: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '15px'
                    }
                },
                React.createElement('span', null, 'Envío:'),
                React.createElement('span', 
                    { style: { fontWeight: 'bold', color: shipping === 0 ? '#28a745' : '#333' } }, 
                    shipping === 0 ? 'GRATIS' : (window.formatCOP ? window.formatCOP(shipping) : '$' + shipping)
                )
            ),
            shipping === 0 && React.createElement('div',
                {
                    style: {
                        background: '#d4edda',
                        color: '#155724',
                        padding: '8px',
                        borderRadius: '5px',
                        fontSize: '0.9rem',
                        textAlign: 'center',
                        marginBottom: '15px'
                    }
                },
                '🚚 ¡Envío gratuito por compras sobre $100.000!'
            )
        ),

        // Total final
        React.createElement('div',
            {
                style: {
                    borderTop: '2px solid #007bff',
                    paddingTop: '15px',
                    marginBottom: '25px'
                }
            },
            React.createElement('div',
                {
                    style: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }
                },
                React.createElement('span', 
                    { style: { fontSize: '1.2rem', fontWeight: 'bold' } }, 
                    'Total a Pagar:'
                ),
                React.createElement('span',
                    {
                        style: {
                            fontSize: '1.8rem',
                            fontWeight: 'bold',
                            color: '#007bff'
                        }
                    },
                    window.formatCOP ? window.formatCOP(finalTotal) : '$' + finalTotal
                )
            )
        ),

        // Botones de acción
        React.createElement('div',
            {
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px'
                }
            },
            
            // Botón proceder al pago
            React.createElement('button',
                {
                    onClick: onCheckout,
                    style: {
                        width: '100%',
                        padding: '15px',
                        background: 'linear-gradient(45deg, #007bff, #0056b3)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'transform 0.2s'
                    },
                    onMouseEnter: (e) => e.target.style.transform = 'translateY(-2px)',
                    onMouseLeave: (e) => e.target.style.transform = 'translateY(0)'
                },
                '💳 Proceder al Pago'
            ),
            
            // Botón vaciar carrito
            React.createElement('button',
                {
                    onClick: () => {
                        if (confirm('¿Estás seguro de vaciar todo el carrito?')) {
                            onClearCart();
                        }
                    },
                    style: {
                        width: '100%',
                        padding: '12px',
                        background: 'transparent',
                        color: '#dc3545',
                        border: '2px solid #dc3545',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        cursor: 'pointer'
                    }
                },
                '🗑️ Vaciar Carrito'
            )
        )
    );
}

// ======================
// COMPONENTE PRINCIPAL DEL CARRITO
// ======================

function CartView() {
    const [cartItems, setCartItems] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    // Cargar items del carrito
    React.useEffect(() => {
        loadCartItems();
        
        // Suscribirse a cambios del carrito
        const handleCartChange = (items) => {
            console.log('🔄 Cart Manager notifica cambio:', items.length, 'items');
            setCartItems([...items]); // Crear nuevo array para forzar re-render
        };
        
        if (window.cartManager) {
            window.cartManager.subscribe(handleCartChange);
            return () => window.cartManager.unsubscribe(handleCartChange);
        }
    }, []);
    
    // Efecto adicional para monitorear cambios en tiempo real
    React.useEffect(() => {
        const interval = setInterval(() => {
            if (window.cartManager) {
                const currentItems = window.cartManager.getItems();
                // Solo actualizar si hay diferencias reales
                if (JSON.stringify(currentItems) !== JSON.stringify(cartItems)) {
                    setCartItems([...currentItems]);
                    console.log('🔍 Sincronización automática del carrito');
                }
            }
        }, 1000); // Verificar cada segundo
        
        return () => clearInterval(interval);
    }, [cartItems]);

    const loadCartItems = () => {
        setLoading(true);
        try {
            if (window.cartManager) {
                const items = window.cartManager.getItems();
                setCartItems(items);
                console.log('🛒 Items del carrito cargados:', items.length);
            }
        } catch (error) {
            console.error('Error cargando carrito:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateQuantity = async (productId, newQuantity) => {
        if (window.cartManager) {
            // Actualizar cantidad en el cart manager
            window.cartManager.updateQuantity(productId, newQuantity);
            
            // Recargar items inmediatamente
            setTimeout(() => {
                const updatedItems = window.cartManager.getItems();
                setCartItems([...updatedItems]); // Crear nuevo array para forzar re-render
                console.log('🔄 Carrito actualizado - Producto:', productId, 'Nueva cantidad:', newQuantity);
                console.log('📊 Items actuales:', updatedItems.map(item => `${item.name}: ${item.quantity} x ${item.price} = ${item.subtotal}`));
            }, 100);
        }
    };

    const handleRemoveItem = async (productId) => {
        if (window.cartManager) {
            window.cartManager.removeItem(productId);
            
            // Recargar items inmediatamente
            setTimeout(() => {
                const updatedItems = window.cartManager.getItems();
                setCartItems([...updatedItems]); // Crear nuevo array para forzar re-render
                console.log('🗑️ Item eliminado, carrito actualizado:', updatedItems.length, 'items restantes');
            }, 100);
        }
    };

    const handleClearCart = () => {
        if (window.cartManager) {
            window.cartManager.clearCart();
            
            // Actualizar vista inmediatamente
            setCartItems([]);
            
            console.log('🗑️ Carrito vaciado completamente, vista actualizada');
            alert('🗑️ Carrito vaciado completamente');
        }
    };

    const handleCheckout = () => {
        console.log('🛜 Iniciando proceso de checkout con items:', cartItems);
        
        // Verificar que hay items en el carrito
        if (cartItems.length === 0) {
            alert('🛜 Tu carrito está vacío. Agrega algunos productos antes de continuar.');
            return;
        }
        
        // Cambiar a vista de checkout
        if (window.setCurrentView) {
            window.setCurrentView('checkout');
        } else {
            alert('💳 Redirigiendo al checkout...');
        }
    };

    if (loading) {
        return React.createElement('div',
            {
                style: {
                    textAlign: 'center',
                    padding: '60px 20px',
                    color: '#666'
                }
            },
            React.createElement('div',
                { style: { fontSize: '3rem', marginBottom: '20px' } },
                '🛒'
            ),
            React.createElement('h2', null, 'Cargando carrito...'),
            React.createElement('p', null, 'Por favor espera mientras cargamos tus productos.')
        );
    }

    if (cartItems.length === 0) {
        return React.createElement('div',
            {
                style: {
                    textAlign: 'center',
                    padding: '80px 20px',
                    maxWidth: '100%', // Aprovechar todo el ancho
                    width: '100%',
                    margin: '0 auto',
                    minHeight: 'calc(100vh - 200px)' // Altura mínima para aprovechar viewport
                }
            },
            
            React.createElement('div',
                { style: { fontSize: '4rem', marginBottom: '30px' } },
                '🛒'
            ),
            React.createElement('h2',
                {
                    style: {
                        color: '#666',
                        marginBottom: '15px',
                        fontSize: '1.8rem'
                    }
                },
                'Tu carrito está vacío'
            ),
            React.createElement('p',
                {
                    style: {
                        color: '#888',
                        marginBottom: '30px',
                        fontSize: '1.1rem'
                    }
                },
                'Agrega algunos productos desde el catálogo para comenzar tu compra.'
            ),
            React.createElement('button',
                {
                    onClick: () => {
                        // Cambiar a vista de catálogo
                        if (window.setCurrentView) {
                            window.setCurrentView('catalog');
                        }
                    },
                    style: {
                        padding: '15px 30px',
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }
                },
                '🛍️ Ir al Catálogo'
            )
        );
    }

    return React.createElement('div',
        {
            style: {
                maxWidth: '100%', // APROVECHAR TODO EL VIEWPORT
                width: '100%',
                margin: '0',
                padding: '20px 2rem', // Padding optimizado
                minHeight: 'calc(100vh - 120px)' // Altura mínima para viewport completo
            }
        },

        // Título principal
        React.createElement('h1',
            {
                style: {
                    textAlign: 'center',
                    color: '#333',
                    marginBottom: '30px',
                    fontSize: '2.5rem'
                }
            },
            '🛒 Mi Carrito de Compras'
        ),

        // Indicador de items
        React.createElement('div',
            {
                style: {
                    background: '#e7f3ff',
                    color: '#004085',
                    padding: '15px 20px',
                    borderRadius: '10px',
                    border: '1px solid #b3d7ff',
                    marginBottom: '30px',
                    textAlign: 'center'
                }
            },
            React.createElement('strong', null,
                `📦 ${cartItems.reduce((sum, item) => sum + item.quantity, 0)} productos en tu carrito`
            )
        ),

        // Layout principal: Items + Resumen - OPTIMIZADO PARA VIEWPORT
        React.createElement('div',
            {
                style: {
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 2fr) minmax(300px, 400px)', // Más flexible y ancho
                    gap: '40px', // Mayor separación
                    alignItems: 'start',
                    width: '100%', // Aprovechar todo el ancho
                    maxWidth: '100%'
                }
            },

            // Columna de items
            React.createElement('div', null,
                React.createElement('h3',
                    {
                        style: {
                            marginBottom: '20px',
                            color: '#333'
                        }
                    },
                    '📋 Productos en tu carrito'
                ),
                
                // Lista de items
                cartItems.map(item =>
                    React.createElement(CartItem, {
                        key: item.productId,
                        item: item,
                        onUpdateQuantity: handleUpdateQuantity,
                        onRemoveItem: handleRemoveItem
                    })
                )
            ),

            // Columna de resumen
            React.createElement(CartSummary, {
                items: cartItems,
                onClearCart: handleClearCart,
                onCheckout: handleCheckout
            })
        )
    );
}

// Exportar globalmente
window.CartView = CartView;

console.log('✅ Vista detallada del carrito cargada');
console.log('🛒 Componente disponible: CartView');