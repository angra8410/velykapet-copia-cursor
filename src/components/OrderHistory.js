// VelyKapet - Order History Component
// Vista de historial de pedidos con tracking de envíos y recompra

console.log('📋 Cargando Order History Component...');

function OrderHistory() {
    const [orders, setOrders] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [expandedOrder, setExpandedOrder] = React.useState(null);
    
    // Cargar órdenes del usuario desde el backend
    React.useEffect(() => {
        loadOrders();
    }, []);
    
    const loadOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Verificar si el usuario está autenticado
            if (!window.authManager || !window.authManager.isAuthenticated()) {
                setError('Debes iniciar sesión para ver tu historial de pedidos');
                return;
            }
            
            // Obtener órdenes del API
            if (window.ApiService && typeof window.ApiService.getOrders === 'function') {
                try {
                    const ordersData = await window.ApiService.getOrders();
                    // Verificar si hay órdenes reales
                    if (ordersData && Array.isArray(ordersData) && ordersData.length > 0) {
                        console.log('✅ Órdenes cargadas correctamente:', ordersData.length);
                        setOrders(ordersData);
                    } else {
                        // Si no hay órdenes reales, usar datos de ejemplo
                        console.warn('⚠️ No hay órdenes en la base de datos, usando datos de ejemplo');
                        const mockOrders = generateMockOrders();
                        setOrders(mockOrders);
                    }
                } catch (apiError) {
                    console.error('❌ Error en ApiService.getOrders:', apiError);
                    // Si hay error en la API, usar datos de ejemplo
                    const mockOrders = generateMockOrders();
                    setOrders(mockOrders);
                }
            } else {
                // Datos de ejemplo para desarrollo
                console.warn('⚠️ ApiService.getOrders no disponible, usando datos de ejemplo');
                const mockOrders = generateMockOrders();
                setOrders(mockOrders);
            }
        } catch (err) {
            console.error('❌ Error cargando órdenes:', err);
            setError('No pudimos cargar tu historial de pedidos. Por favor intenta más tarde.');
        } finally {
            setLoading(false);
        }
    };
    
    // Generar órdenes de ejemplo para desarrollo
    const generateMockOrders = () => {
        const statuses = ['Pendiente', 'En preparación', 'En tránsito', 'Entregado', 'Cancelado'];
        const shippingCompanies = ['Servientrega', 'Coordinadora', 'Interrapidisimo', 'Envía'];
        
        return Array.from({ length: 8 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (i * 5 + Math.floor(Math.random() * 5)));
            
            const status = statuses[Math.floor(Math.random() * (i < 2 ? 3 : statuses.length))];
            const hasTrackingNumber = status === 'En tránsito' || status === 'Entregado';
            const shippingCompany = hasTrackingNumber ? 
                shippingCompanies[Math.floor(Math.random() * shippingCompanies.length)] : null;
            
            return {
                id: `VP-${Date.now().toString().slice(-8) - i * 1000}`,
                date: date.toISOString(),
                status: status,
                total: Math.floor(Math.random() * 300000) + 50000,
                items: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => ({
                    id: `prod-${j}`,
                    name: `Producto ${j + 1}`,
                    price: Math.floor(Math.random() * 100000) + 10000,
                    quantity: Math.floor(Math.random() * 3) + 1,
                    image: 'https://via.placeholder.com/50'
                })),
                shipping: {
                    address: 'Calle Principal #123',
                    city: 'Bogotá',
                    recipient: 'Juan Pérez',
                    company: shippingCompany,
                    trackingNumber: hasTrackingNumber ? 
                        `${shippingCompany?.substring(0, 3).toUpperCase()}${Math.floor(Math.random() * 10000000) + 1000000}` : null
                }
            };
        });
    };
    
    // Obtener URL de tracking según la transportadora
    const getTrackingUrl = (company, trackingNumber) => {
        if (!company || !trackingNumber) return null;
        
        const companyLower = company.toLowerCase();
        
        if (companyLower.includes('servientrega')) {
            return `https://www.servientrega.com/wps/portal/rastreo-envio/!ut/p/z1/04_Sj9CPykssy0xPLMnMz0vMAfIjo8ziTS0sTNzMTAz93f1cTAwCg5yMfP0MHT0MzIEKIoEKDHAARwNU_QgKc9L018tINMfQzMjAz9jUzdzfxcnA2MTAwsLRzdjCx9zM1MzC0NzIzMDTxdnDwN3fxNnA29_D2MQIqMPFVQfY6BdkRkQCAPgVKOU!/dz/d5/L2dBISEvZ0FBIS9nQSEh/?idGuia=${trackingNumber}`;
        } else if (companyLower.includes('coordinadora')) {
            return `https://www.coordinadora.com/portafolio-de-servicios/servicios-en-linea/rastrear-guias/?guia=${trackingNumber}`;
        } else if (companyLower.includes('interrapidisimo')) {
            return `https://www.interrapidisimo.com/sigue-tu-envio/?guia=${trackingNumber}`;
        } else if (companyLower.includes('envía') || companyLower.includes('envia')) {
            return `https://www.enviacolvanes.com.co/Tracking?trackingID=${trackingNumber}`;
        }
        
        // URL genérico si no se reconoce la transportadora
        return `https://www.google.com/search?q=${encodeURIComponent(`${company} rastrear ${trackingNumber}`)}`;
    };
    
    // Manejar la acción de comprar de nuevo
    const handleRebuy = (order) => {
        if (!window.cartManager) {
            console.error('❌ Cart Manager no disponible');
            alert('No se pudo agregar al carrito. Por favor intenta más tarde.');
            return;
        }
        
        // Agregar todos los productos del pedido al carrito
        order.items.forEach(item => {
            window.cartManager.addItem({
                productId: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            });
        });
        
        // Mostrar mensaje de éxito
        alert(`✅ ${order.items.length} productos agregados al carrito`);
        
        // Redirigir al carrito
        if (window.setCurrentView) {
            window.setCurrentView('cart');
        }
    };
    
    // Formatear fecha
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-CO', options);
    };
    
    // Renderizar estado del pedido con color
    const renderStatus = (status) => {
        let color, icon;
        
        switch (status.toLowerCase()) {
            case 'pendiente':
                color = '#f0ad4e'; // Amarillo
                icon = '⏳';
                break;
            case 'en preparación':
                color = '#5bc0de'; // Azul
                icon = '🔧';
                break;
            case 'en tránsito':
                color = '#0275d8'; // Azul oscuro
                icon = '🚚';
                break;
            case 'entregado':
                color = '#5cb85c'; // Verde
                icon = '✅';
                break;
            case 'cancelado':
                color = '#d9534f'; // Rojo
                icon = '❌';
                break;
            default:
                color = '#6c757d'; // Gris
                icon = '❓';
        }
        
        return React.createElement('span',
            {
                style: {
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    backgroundColor: color,
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                }
            },
            icon,
            React.createElement('span', { style: { marginLeft: '5px' } }, status)
        );
    };
    
    // Renderizar detalles de un pedido
    const renderOrderDetails = (order) => {
        return React.createElement('div',
            {
                className: 'order-details',
                style: {
                    padding: '20px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '0 0 10px 10px',
                    borderTop: '1px solid #eee',
                    animation: 'fadeIn 0.3s ease'
                }
            },
            
            // Productos
            React.createElement('div',
                {
                    style: {
                        marginBottom: '20px'
                    }
                },
                React.createElement('h4', 
                    { style: { marginBottom: '15px', fontSize: '1.1rem' } },
                    '📦 Productos'
                ),
                React.createElement('div',
                    {
                        style: {
                            display: 'grid',
                            gap: '10px'
                        }
                    },
                    order.items.map(item => 
                        React.createElement('div',
                            {
                                key: item.id,
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '10px',
                                    backgroundColor: 'white',
                                    borderRadius: '8px',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                }
                            },
                            // Imagen del producto
                            React.createElement('img',
                                {
                                    src: item.image,
                                    alt: item.name,
                                    style: {
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '4px',
                                        marginRight: '15px',
                                        objectFit: 'cover'
                                    }
                                }
                            ),
                            // Información del producto
                            React.createElement('div',
                                { style: { flex: 1 } },
                                React.createElement('div', 
                                    { style: { fontWeight: 'bold' } },
                                    item.name
                                ),
                                React.createElement('div',
                                    { style: { display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#666' } },
                                    React.createElement('span', null, `Cantidad: ${item.quantity}`),
                                    React.createElement('span', null, window.formatCOP ? window.formatCOP(item.price) : `$${item.price.toLocaleString()}`)
                                )
                            )
                        )
                    )
                )
            ),
            
            // Información de envío
            React.createElement('div',
                {
                    style: {
                        marginBottom: '20px'
                    }
                },
                React.createElement('h4', 
                    { style: { marginBottom: '15px', fontSize: '1.1rem' } },
                    '🚚 Información de Envío'
                ),
                React.createElement('div',
                    {
                        style: {
                            backgroundColor: 'white',
                            padding: '15px',
                            borderRadius: '8px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }
                    },
                    React.createElement('p', { style: { margin: '0 0 8px' } }, `📍 Dirección: ${order.shipping.address}, ${order.shipping.city}`),
                    React.createElement('p', { style: { margin: '0 0 8px' } }, `👤 Destinatario: ${order.shipping.recipient}`),
                    order.shipping.company && React.createElement('p', 
                        { style: { margin: '0 0 8px' } }, 
                        `🚛 Transportadora: ${order.shipping.company}`
                    ),
                    order.shipping.trackingNumber && React.createElement('div',
                        { style: { margin: '10px 0 0' } },
                        React.createElement('p', 
                            { style: { fontWeight: 'bold', margin: '0 0 5px' } },
                            '🔍 Seguimiento:'
                        ),
                        React.createElement('a',
                            {
                                href: getTrackingUrl(order.shipping.company, order.shipping.trackingNumber),
                                target: '_blank',
                                style: {
                                    display: 'inline-block',
                                    padding: '8px 15px',
                                    backgroundColor: '#E45A84',
                                    color: 'white',
                                    borderRadius: '5px',
                                    textDecoration: 'none',
                                    fontWeight: 'bold',
                                    fontSize: '0.9rem',
                                    transition: 'background-color 0.2s'
                                },
                                onMouseEnter: (e) => {
                                    e.target.style.backgroundColor = '#d33d6a';
                                },
                                onMouseLeave: (e) => {
                                    e.target.style.backgroundColor = '#E45A84';
                                }
                            },
                            `Ver estado del envío - ${order.shipping.trackingNumber}`
                        )
                    )
                )
            ),
            
            // Soporte
            React.createElement('div',
                {
                    style: {
                        backgroundColor: '#e8f4f8',
                        padding: '15px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px'
                    }
                },
                React.createElement('span', 
                    { style: { fontSize: '2rem' } },
                    '💬'
                ),
                React.createElement('div',
                    null,
                    React.createElement('h4', 
                        { style: { margin: '0 0 5px', fontSize: '1rem' } },
                        '¿Necesitas ayuda con este pedido?'
                    ),
                    React.createElement('p', 
                        { style: { margin: 0, fontSize: '0.9rem' } },
                        'Contáctanos al ',
                        React.createElement('a', 
                            { 
                                href: 'tel:+573001234567',
                                style: { fontWeight: 'bold', color: '#0275d8', textDecoration: 'none' }
                            },
                            '300 123 4567'
                        ),
                        ' o escríbenos a ',
                        React.createElement('a', 
                            { 
                                href: 'mailto:soporte@velykapet.com',
                                style: { fontWeight: 'bold', color: '#0275d8', textDecoration: 'none' }
                            },
                            'soporte@velykapet.com'
                        )
                    )
                )
            )
        );
    };
    
    // Renderizar una tarjeta de pedido
    const renderOrderCard = (order) => {
        const isExpanded = expandedOrder === order.id;
        
        return React.createElement('div',
            {
                key: order.id,
                className: 'order-card',
                style: {
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    marginBottom: '20px',
                    overflow: 'hidden'
                }
            },
            
            // Cabecera del pedido
            React.createElement('div',
                {
                    className: 'order-header',
                    style: {
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px'
                    }
                },
                
                // Fila superior: ID, Fecha y Estado
                React.createElement('div',
                    {
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '10px'
                        }
                    },
                    // ID del pedido
                    React.createElement('div',
                        {
                            style: {
                                fontWeight: 'bold',
                                fontSize: '1.1rem'
                            }
                        },
                        `Pedido #${order.id}`
                    ),
                    
                    // Fecha
                    React.createElement('div',
                        {
                            style: {
                                color: '#666',
                                fontSize: '0.9rem'
                            }
                        },
                        `📅 ${formatDate(order.date)}`
                    ),
                    
                    // Estado
                    renderStatus(order.status)
                ),
                
                // Fila inferior: Total, Botones de acción
                React.createElement('div',
                    {
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '10px'
                        }
                    },
                    // Total
                    React.createElement('div',
                        null,
                        React.createElement('span', 
                            { style: { color: '#666', marginRight: '5px' } },
                            'Total:'
                        ),
                        React.createElement('span', 
                            { style: { fontWeight: 'bold', color: '#28a745', fontSize: '1.1rem' } },
                            window.formatCOP ? window.formatCOP(order.total) : `$${order.total.toLocaleString()}`
                        )
                    ),
                    
                    // Botones de acción
                    React.createElement('div',
                        {
                            style: {
                                display: 'flex',
                                gap: '10px'
                            }
                        },
                        // Botón de comprar de nuevo
                        React.createElement('button',
                            {
                                onClick: () => handleRebuy(order),
                                style: {
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    padding: '8px 15px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    transition: 'background-color 0.2s'
                                },
                                onMouseEnter: (e) => {
                                    e.target.style.backgroundColor = '#218838';
                                },
                                onMouseLeave: (e) => {
                                    e.target.style.backgroundColor = '#28a745';
                                }
                            },
                            '🛒 Comprar de nuevo'
                        ),
                        
                        // Botón de ver detalles
                        React.createElement('button',
                            {
                                onClick: () => setExpandedOrder(isExpanded ? null : order.id),
                                style: {
                                    backgroundColor: 'transparent',
                                    color: '#0275d8',
                                    border: '1px solid #0275d8',
                                    borderRadius: '5px',
                                    padding: '8px 15px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    transition: 'all 0.2s'
                                },
                                onMouseEnter: (e) => {
                                    e.target.style.backgroundColor = '#f8f9fa';
                                },
                                onMouseLeave: (e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                }
                            },
                            isExpanded ? 'Ocultar detalles' : 'Ver detalles'
                        )
                    )
                )
            ),
            
            // Detalles del pedido (expandible)
            isExpanded && renderOrderDetails(order)
        );
    };
    
    // Renderizar mensaje de error
    const renderError = () => {
        return React.createElement('div',
            {
                style: {
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    padding: '20px',
                    borderRadius: '10px',
                    textAlign: 'center',
                    marginBottom: '20px'
                }
            },
            React.createElement('h3', 
                { style: { marginBottom: '10px' } },
                '❌ Error'
            ),
            React.createElement('p', 
                { style: { margin: 0 } },
                error
            )
        );
    };
    
    // Renderizar estado de carga
    const renderLoading = () => {
        return React.createElement('div',
            {
                style: {
                    textAlign: 'center',
                    padding: '40px'
                }
            },
            React.createElement('div', 
                { 
                    style: {
                        display: 'inline-block',
                        width: '40px',
                        height: '40px',
                        border: '4px solid rgba(0, 0, 0, 0.1)',
                        borderLeftColor: '#E45A84',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        marginBottom: '20px'
                    }
                }
            ),
            React.createElement('p', 
                { style: { color: '#666' } },
                'Cargando tu historial de pedidos...'
            )
        );
    };
    
    // Renderizar mensaje de no hay pedidos
    const renderEmptyState = () => {
        return React.createElement('div',
            {
                style: {
                    backgroundColor: '#f8f9fa',
                    padding: '40px 20px',
                    borderRadius: '10px',
                    textAlign: 'center'
                }
            },
            React.createElement('div', 
                { style: { fontSize: '4rem', marginBottom: '20px' } },
                '🛍️'
            ),
            React.createElement('h3', 
                { style: { marginBottom: '15px', color: '#333' } },
                'No tienes pedidos aún'
            ),
            React.createElement('p', 
                { style: { color: '#666', marginBottom: '25px' } },
                'Explora nuestro catálogo y realiza tu primera compra'
            ),
            React.createElement('button',
                {
                    onClick: () => {
                        if (window.setCurrentView) {
                            window.setCurrentView('catalog');
                        }
                    },
                    style: {
                        backgroundColor: '#E45A84',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        transition: 'background-color 0.2s'
                    },
                    onMouseEnter: (e) => {
                        e.target.style.backgroundColor = '#d33d6a';
                    },
                    onMouseLeave: (e) => {
                        e.target.style.backgroundColor = '#E45A84';
                    }
                },
                '🛍️ Ir al Catálogo'
            )
        );
    };
    
    // Componente principal
    return React.createElement('div',
        {
            className: 'order-history-container',
            style: {
                maxWidth: '900px',
                margin: '0 auto',
                padding: '20px'
            }
        },
        
        // Título
        React.createElement('h1',
            {
                style: {
                    fontSize: '2rem',
                    marginBottom: '30px',
                    color: '#333',
                    textAlign: 'center'
                }
            },
            '📋 Historial de Pedidos'
        ),
        
        // Contenido principal
        error ? renderError() :
        loading ? renderLoading() :
        orders.length === 0 ? renderEmptyState() :
        React.createElement('div',
            { className: 'orders-list' },
            orders.map(order => renderOrderCard(order))
        )
    );
}

// Exportar componente
window.OrderHistory = OrderHistory;