// VentasPet - Admin Panel Component
// Interfaz de administración para gestión de productos

console.log('🔧 Cargando Admin Panel Component...');

function AdminPanel() {
    const [currentTab, setCurrentTab] = React.useState('products');
    const [products, setProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [showUploadModal, setShowUploadModal] = React.useState(false);
    const [uploadProgress, setUploadProgress] = React.useState(0);
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [stats, setStats] = React.useState({
        totalProducts: 0,
        lowStock: 0,
        categories: 0,
        pendingOrders: 0
    });

    // Cargar datos iniciales
    React.useEffect(() => {
        loadAdminData();
    }, []);

    const loadAdminData = async () => {
        setLoading(true);
        try {
            // Simular carga de datos administrativos
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Datos de ejemplo
            const mockProducts = [
                { id: 1, name: 'Royal Canin Adult', category: 'Alimento', stock: 15, price: 89000, status: 'active' },
                { id: 2, name: 'Hills Science Diet', category: 'Alimento', stock: 3, price: 95000, status: 'active' },
                { id: 3, name: 'Pro Plan Puppy', category: 'Alimento', stock: 0, price: 75000, status: 'inactive' },
                { id: 4, name: 'Whiskas Adult', category: 'Alimento', stock: 25, price: 25000, status: 'active' },
                { id: 5, name: 'Kong Classic', category: 'Juguetes', stock: 12, price: 45000, status: 'active' }
            ];

            setProducts(mockProducts);
            setStats({
                totalProducts: mockProducts.length,
                lowStock: mockProducts.filter(p => p.stock < 5).length,
                categories: [...new Set(mockProducts.map(p => p.category))].length,
                pendingOrders: 8
            });

        } catch (error) {
            console.error('Error cargando datos admin:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (file) => {
        if (!file) return;

        setUploadProgress(0);
        try {
            console.log('📤 Iniciando carga de archivo:', file.name);
            
            // Simular progreso de carga
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 200);

            // Procesar archivo con el PDF Processor
            if (window.PDFProductProcessor) {
                const result = await window.PDFProductProcessor.processPDFCatalog(file, {
                    category: 'Alimento',
                    petType: 'General'
                });

                clearInterval(progressInterval);
                setUploadProgress(100);

                if (result.success) {
                    // Guardar productos
                    const saveResult = await window.PDFProductProcessor.saveProductsToDatabase(result.products);
                    
                    alert(`✅ ${result.totalProducts} productos procesados exitosamente!`);
                    loadAdminData(); // Recargar datos
                } else {
                    alert(`❌ Error procesando archivo: ${result.error}`);
                }
            } else {
                alert('❌ Procesador de archivos no disponible');
            }

        } catch (error) {
            console.error('Error en carga:', error);
            alert(`❌ Error: ${error.message}`);
        } finally {
            setTimeout(() => {
                setShowUploadModal(false);
                setUploadProgress(0);
                setSelectedFile(null);
            }, 2000);
        }
    };

    const renderDashboard = () => React.createElement('div',
        { className: 'admin-dashboard' },
        
        // Estadísticas
        React.createElement('div',
            {
                style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '20px',
                    marginBottom: '30px'
                }
            },
            
            // Total productos
            React.createElement('div',
                {
                    className: 'stat-card',
                    style: {
                        background: 'linear-gradient(135deg, #E45A84, #D94876)',
                        color: 'white',
                        padding: '25px',
                        borderRadius: '15px',
                        textAlign: 'center',
                        boxShadow: '0 8px 25px rgba(228, 90, 132, 0.3)'
                    }
                },
                React.createElement('div', { style: { fontSize: '3rem', marginBottom: '10px' } }, '📦'),
                React.createElement('h3', { style: { fontSize: '2rem', margin: '0 0 5px' } }, stats.totalProducts),
                React.createElement('p', { style: { margin: 0, opacity: 0.9 } }, 'Productos Totales')
            ),

            // Stock bajo
            React.createElement('div',
                {
                    className: 'stat-card',
                    style: {
                        background: 'linear-gradient(135deg, #FF6B35, #E55A2B)',
                        color: 'white',
                        padding: '25px',
                        borderRadius: '15px',
                        textAlign: 'center',
                        boxShadow: '0 8px 25px rgba(255, 107, 53, 0.3)'
                    }
                },
                React.createElement('div', { style: { fontSize: '3rem', marginBottom: '10px' } }, '⚠️'),
                React.createElement('h3', { style: { fontSize: '2rem', margin: '0 0 5px' } }, stats.lowStock),
                React.createElement('p', { style: { margin: 0, opacity: 0.9 } }, 'Stock Bajo')
            ),

            // Categorías
            React.createElement('div',
                {
                    className: 'stat-card',
                    style: {
                        background: 'linear-gradient(135deg, #4A90E2, #357ABD)',
                        color: 'white',
                        padding: '25px',
                        borderRadius: '15px',
                        textAlign: 'center',
                        boxShadow: '0 8px 25px rgba(74, 144, 226, 0.3)'
                    }
                },
                React.createElement('div', { style: { fontSize: '3rem', marginBottom: '10px' } }, '📂'),
                React.createElement('h3', { style: { fontSize: '2rem', margin: '0 0 5px' } }, stats.categories),
                React.createElement('p', { style: { margin: 0, opacity: 0.9 } }, 'Categorías')
            ),

            // Órdenes pendientes
            React.createElement('div',
                {
                    className: 'stat-card',
                    style: {
                        background: 'linear-gradient(135deg, #28A745, #20A53A)',
                        color: 'white',
                        padding: '25px',
                        borderRadius: '15px',
                        textAlign: 'center',
                        boxShadow: '0 8px 25px rgba(40, 167, 69, 0.3)'
                    }
                },
                React.createElement('div', { style: { fontSize: '3rem', marginBottom: '10px' } }, '🛍️'),
                React.createElement('h3', { style: { fontSize: '2rem', margin: '0 0 5px' } }, stats.pendingOrders),
                React.createElement('p', { style: { margin: 0, opacity: 0.9 } }, 'Órdenes Pendientes')
            )
        ),

        // Acciones rápidas
        React.createElement('div',
            {
                className: 'quick-actions',
                style: {
                    background: 'white',
                    padding: '25px',
                    borderRadius: '15px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    marginBottom: '30px'
                }
            },
            React.createElement('h3', 
                { style: { marginBottom: '20px', color: '#333' } },
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
                        onClick: () => setShowUploadModal(true),
                        style: {
                            padding: '15px 20px',
                            background: 'linear-gradient(135deg, #E45A84, #D94876)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px'
                        }
                    },
                    '📄', 'Importar Catálogo'
                ),
                React.createElement('button',
                    {
                        onClick: () => setCurrentTab('products'),
                        style: {
                            padding: '15px 20px',
                            background: 'linear-gradient(135deg, #4A90E2, #357ABD)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px'
                        }
                    },
                    '📦', 'Gestionar Productos'
                ),
                React.createElement('button',
                    {
                        onClick: loadAdminData,
                        style: {
                            padding: '15px 20px',
                            background: 'linear-gradient(135deg, #28A745, #20A53A)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px'
                        }
                    },
                    '🔄', 'Actualizar Datos'
                )
            )
        )
    );

    const renderProductsManager = () => React.createElement('div',
        { className: 'products-manager' },
        
        React.createElement('div',
            {
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '25px'
                }
            },
            React.createElement('h3', null, '📦 Gestión de Productos'),
            React.createElement('button',
                {
                    onClick: () => alert('Funcionalidad de agregar producto próximamente'),
                    style: {
                        padding: '10px 20px',
                        background: '#E45A84',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }
                },
                '➕ Agregar Producto'
            )
        ),

        // Tabla de productos
        React.createElement('div',
            {
                style: {
                    background: 'white',
                    borderRadius: '10px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    overflow: 'hidden'
                }
            },
            React.createElement('div',
                {
                    style: {
                        overflowX: 'auto'
                    }
                },
                React.createElement('table',
                    {
                        style: {
                            width: '100%',
                            borderCollapse: 'collapse'
                        }
                    },
                    React.createElement('thead',
                        {
                            style: {
                                background: '#f8f9fa'
                            }
                        },
                        React.createElement('tr', null,
                            React.createElement('th', { style: { padding: '15px', textAlign: 'left', color: '#333' } }, 'ID'),
                            React.createElement('th', { style: { padding: '15px', textAlign: 'left', color: '#333' } }, 'Nombre'),
                            React.createElement('th', { style: { padding: '15px', textAlign: 'left', color: '#333' } }, 'Categoría'),
                            React.createElement('th', { style: { padding: '15px', textAlign: 'left', color: '#333' } }, 'Stock'),
                            React.createElement('th', { style: { padding: '15px', textAlign: 'left', color: '#333' } }, 'Precio'),
                            React.createElement('th', { style: { padding: '15px', textAlign: 'left', color: '#333' } }, 'Estado'),
                            React.createElement('th', { style: { padding: '15px', textAlign: 'left', color: '#333' } }, 'Acciones')
                        )
                    ),
                    React.createElement('tbody', null,
                        products.map(product => 
                            React.createElement('tr',
                                {
                                    key: product.id,
                                    style: {
                                        borderBottom: '1px solid #eee'
                                    }
                                },
                                React.createElement('td', { style: { padding: '15px' } }, product.id),
                                React.createElement('td', { style: { padding: '15px', fontWeight: '600' } }, product.name),
                                React.createElement('td', { style: { padding: '15px' } }, product.category),
                                React.createElement('td', 
                                    { 
                                        style: { 
                                            padding: '15px',
                                            color: product.stock < 5 ? '#dc3545' : '#28a745',
                                            fontWeight: product.stock < 5 ? '700' : 'normal'
                                        } 
                                    }, 
                                    product.stock
                                ),
                                React.createElement('td', { style: { padding: '15px' } }, 
                                    window.formatCOP ? window.formatCOP(product.price) : `$${product.price.toLocaleString()}`
                                ),
                                React.createElement('td', { style: { padding: '15px' } },
                                    React.createElement('span',
                                        {
                                            style: {
                                                padding: '4px 8px',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                background: product.status === 'active' ? '#d4edda' : '#f8d7da',
                                                color: product.status === 'active' ? '#155724' : '#721c24'
                                            }
                                        },
                                        product.status === 'active' ? '✅ Activo' : '❌ Inactivo'
                                    )
                                ),
                                React.createElement('td', { style: { padding: '15px' } },
                                    React.createElement('div',
                                        { style: { display: 'flex', gap: '8px' } },
                                        React.createElement('button',
                                            {
                                                onClick: () => alert(`Editar ${product.name}`),
                                                style: {
                                                    padding: '6px 12px',
                                                    background: '#17a2b8',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '12px'
                                                }
                                            },
                                            '✏️'
                                        ),
                                        React.createElement('button',
                                            {
                                                onClick: () => {
                                                    if (confirm(`¿Eliminar ${product.name}?`)) {
                                                        setProducts(prev => prev.filter(p => p.id !== product.id));
                                                    }
                                                },
                                                style: {
                                                    padding: '6px 12px',
                                                    background: '#dc3545',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '12px'
                                                }
                                            },
                                            '🗑️'
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            )
        )
    );

    const renderUploadModal = () => {
        if (!showUploadModal) return null;

        return React.createElement('div',
            {
                style: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                },
                onClick: (e) => {
                    if (e.target === e.currentTarget) {
                        setShowUploadModal(false);
                    }
                }
            },
            React.createElement('div',
                {
                    style: {
                        background: 'white',
                        padding: '30px',
                        borderRadius: '15px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                        maxWidth: '500px',
                        width: '90%'
                    }
                },
                React.createElement('h3',
                    { style: { marginBottom: '20px', color: '#333' } },
                    '📄 Importar Catálogo de Productos'
                ),
                React.createElement('p',
                    { style: { color: '#666', marginBottom: '20px' } },
                    'Selecciona un archivo PDF, Excel o CSV con tu catálogo de productos:'
                ),
                React.createElement('input',
                    {
                        type: 'file',
                        accept: '.pdf,.xlsx,.xls,.csv',
                        onChange: (e) => setSelectedFile(e.target.files[0]),
                        style: {
                            width: '100%',
                            padding: '10px',
                            border: '2px dashed #E45A84',
                            borderRadius: '8px',
                            marginBottom: '20px'
                        }
                    }
                ),
                selectedFile && React.createElement('div',
                    {
                        style: {
                            background: '#f8f9fa',
                            padding: '10px',
                            borderRadius: '8px',
                            marginBottom: '20px'
                        }
                    },
                    React.createElement('p', { style: { margin: 0, fontSize: '14px' } },
                        `📎 ${selectedFile.name} (${(selectedFile.size / 1024 / 1024).toFixed(2)} MB)`
                    )
                ),
                uploadProgress > 0 && React.createElement('div',
                    { style: { marginBottom: '20px' } },
                    React.createElement('div',
                        { style: { fontSize: '14px', marginBottom: '5px' } },
                        `Procesando... ${uploadProgress}%`
                    ),
                    React.createElement('div',
                        {
                            style: {
                                background: '#e9ecef',
                                borderRadius: '10px',
                                overflow: 'hidden'
                            }
                        },
                        React.createElement('div',
                            {
                                style: {
                                    background: 'linear-gradient(90deg, #E45A84, #D94876)',
                                    height: '8px',
                                    width: `${uploadProgress}%`,
                                    transition: 'width 0.3s ease'
                                }
                            }
                        )
                    )
                ),
                React.createElement('div',
                    {
                        style: {
                            display: 'flex',
                            gap: '15px',
                            justifyContent: 'flex-end'
                        }
                    },
                    React.createElement('button',
                        {
                            onClick: () => setShowUploadModal(false),
                            style: {
                                padding: '10px 20px',
                                background: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }
                        },
                        'Cancelar'
                    ),
                    React.createElement('button',
                        {
                            onClick: () => selectedFile && handleFileUpload(selectedFile),
                            disabled: !selectedFile || uploadProgress > 0,
                            style: {
                                padding: '10px 20px',
                                background: selectedFile && uploadProgress === 0 ? '#E45A84' : '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: selectedFile && uploadProgress === 0 ? 'pointer' : 'not-allowed'
                            }
                        },
                        'Procesar'
                    )
                )
            )
        );
    };

    return React.createElement('div',
        {
            className: 'admin-panel',
            style: {
                maxWidth: '100%',
                width: '100%',
                margin: '0',
                padding: '20px 2rem',
                background: '#f8f9fa',
                minHeight: 'calc(100vh - 80px)'
            }
        },

        // Header del admin
        React.createElement('div',
            {
                className: 'admin-header',
                style: {
                    marginBottom: '30px'
                }
            },
            React.createElement('h1',
                {
                    style: {
                        color: '#333',
                        marginBottom: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px'
                    }
                },
                '🔧', 'Panel de Administración - VelyKapet'
            ),
            React.createElement('p',
                { style: { color: '#666', margin: 0 } },
                'Gestiona productos, inventario y configuraciones de la tienda'
            )
        ),

        // Navigation tabs
        React.createElement('div',
            {
                className: 'admin-tabs',
                style: {
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '30px'
                }
            },
            ['dashboard', 'products', 'orders', 'analytics'].map(tab => 
                React.createElement('button',
                    {
                        key: tab,
                        onClick: () => setCurrentTab(tab),
                        style: {
                            padding: '12px 24px',
                            background: currentTab === tab ? '#E45A84' : 'white',
                            color: currentTab === tab ? 'white' : '#666',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            textTransform: 'capitalize'
                        }
                    },
                    tab === 'dashboard' ? '📊 Dashboard' :
                    tab === 'products' ? '📦 Productos' :
                    tab === 'orders' ? '🛍️ Órdenes' :
                    '📈 Analíticas'
                )
            )
        ),

        // Content area
        React.createElement('div',
            { className: 'admin-content' },
            loading ? React.createElement('div',
                {
                    style: {
                        textAlign: 'center',
                        padding: '60px',
                        color: '#666'
                    }
                },
                React.createElement('div', { className: 'loader' }),
                React.createElement('p', null, 'Cargando datos...')
            ) : 
            currentTab === 'dashboard' ? renderDashboard() :
            currentTab === 'products' ? renderProductsManager() :
            React.createElement('div',
                {
                    style: {
                        textAlign: 'center',
                        padding: '60px',
                        background: 'white',
                        borderRadius: '15px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                    }
                },
                React.createElement('h3', { style: { color: '#666' } }, `${currentTab.toUpperCase()} - Próximamente`),
                React.createElement('p', { style: { color: '#999' } }, 'Esta funcionalidad estará disponible pronto.')
            )
        ),

        // Upload Modal
        renderUploadModal()
    );
}

// Registrar el componente globalmente
window.AdminPanel = AdminPanel;

console.log('✅ Admin Panel Component cargado');