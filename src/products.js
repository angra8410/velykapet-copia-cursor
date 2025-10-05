// VentasPet - Catálogo de Productos
// Componente completo con búsqueda, filtros y carrito

console.log('📦 Cargando catálogo de productos...');

// ======================
// GESTIÓN DE CARRITO DE COMPRAS
// ======================

class CartManager {
    constructor() {
        this.items = [];
        this.listeners = [];
        this.loadCartFromStorage();
        console.log('🛒 CartManager inicializado:', { itemCount: this.items.length });
    }

    loadCartFromStorage() {
        try {
            const cartData = localStorage.getItem('ventaspet_cart');
            if (cartData) {
                this.items = JSON.parse(cartData);
                console.log('✅ Carrito cargado desde localStorage:', this.items.length, 'items');
            }
        } catch (error) {
            console.warn('⚠️ Error cargando carrito:', error.message);
            localStorage.removeItem('ventaspet_cart');
        }
    }

    saveCartToStorage() {
        try {
            localStorage.setItem('ventaspet_cart', JSON.stringify(this.items));
            console.log('💾 Carrito guardado en localStorage');
        } catch (error) {
            console.error('❌ Error guardando carrito:', error.message);
        }
    }

    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.productId === product.Id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.subtotal = existingItem.quantity * existingItem.price;
        } else {
            this.items.push({
                productId: product.Id,
                name: product.Name,
                price: product.Price,
                quantity: quantity,
                subtotal: product.Price * quantity,
                stock: product.Stock
            });
        }
        
        this.saveCartToStorage();
        this.notifyListeners();
        console.log('🛒 Producto agregado al carrito:', product.Name, 'x', quantity);
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.productId !== productId);
        this.saveCartToStorage();
        this.notifyListeners();
        console.log('🗑️ Producto eliminado del carrito:', productId);
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.productId === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                item.subtotal = item.quantity * item.price;
                this.saveCartToStorage();
                this.notifyListeners();
            }
        }
    }

    getItems() {
        return this.items;
    }

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    getTotalPrice() {
        return this.items.reduce((total, item) => total + item.subtotal, 0);
    }

    clearCart() {
        this.items = [];
        this.saveCartToStorage();
        this.notifyListeners();
        console.log('🛒 Carrito limpio');
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    unsubscribe(listener) {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    notifyListeners() {
        this.listeners.forEach(listener => listener(this.items));
    }
}

// Instancia global del carrito
const cartManager = new CartManager();

// Verificar si hay productos con precio 0 y limpiarlos
if (cartManager.getItems().some(item => item.price === 0 || item.price === null || item.price === undefined)) {
    console.log('⚠️ Detectados productos con precio incorrecto, limpiando carrito...');
    cartManager.clearCart();
}

// ======================
// COMPONENTE DE TARJETA DE PRODUCTO
// ======================

function ProductCard({ product, onAddToCart }) {
    // Si existe el componente moderno, usarlo
    if (window.ProductCardComponent) {
        // El producto ya viene con el formato del backend (ProductoDto)
        // Pasarlo directamente con las variaciones incluidas
        const modernProduct = {
            // Datos del producto base
            Id: product.IdProducto,
            IdProducto: product.IdProducto,
            name: product.NombreBase,
            Name: product.NombreBase,
            NombreBase: product.NombreBase,
            price: 0, // El precio viene de las variaciones
            Price: 0,
            image: product.URLImagen,
            ImageUrl: product.URLImagen,
            URLImagen: product.URLImagen,
            description: product.Descripcion,
            Description: product.Descripcion,
            Descripcion: product.Descripcion,
            category: product.NombreCategoria,
            Category: product.NombreCategoria,
            NombreCategoria: product.NombreCategoria,
            stock: 0, // El stock viene de las variaciones
            Stock: 0,
            rating: product.Rating,
            Rating: product.Rating,
            petType: product.TipoMascota,
            PetType: product.TipoMascota,
            TipoMascota: product.TipoMascota,
            // IMPORTANTE: Incluir las variaciones del backend
            Variaciones: product.Variaciones || []
        };
        
        return React.createElement(window.ProductCardComponent, {
            product: modernProduct,
            onAddToCart: (modernProd) => {
                // El producto a agregar debe incluir la variación seleccionada
                // Si es una variación, incluir idVariacion
                const backendProduct = {
                    Id: modernProd.idProducto || modernProd.IdProducto || product.IdProducto,
                    IdProducto: modernProd.idProducto || modernProd.IdProducto || product.IdProducto,
                    IdVariacion: modernProd.idVariacion || modernProd.IdVariacion,
                    Name: modernProd.name || product.NombreBase,
                    NombreBase: product.NombreBase,
                    Peso: modernProd.peso || 'Estándar',
                    Price: modernProd.price || 0,
                    Stock: modernProd.stock || 0,
                    Description: modernProd.description || product.Descripcion,
                    Descripcion: product.Descripcion,
                    Category: modernProd.category || product.NombreCategoria,
                    NombreCategoria: product.NombreCategoria,
                    ImageUrl: modernProd.image || product.URLImagen,
                    URLImagen: product.URLImagen,
                    Rating: modernProd.rating || product.Rating
                };
                console.log('🛒 DEBUG - Producto original:', product);
                console.log('🛒 DEBUG - Producto moderno (variación):', modernProd);
                console.log('🛒 DEBUG - Producto convertido:', backendProduct);
                return onAddToCart(backendProduct);
            },
            onViewDetails: (prod) => {
                console.log('👁️ Ver detalles del producto:', prod.name);
                // Cambiar a la vista de producto individual
                if (window.viewProductDetails && typeof window.viewProductDetails === 'function') {
                    window.viewProductDetails(prod);
                } else {
                    console.error('La función viewProductDetails no está disponible');
                }
            }
        });
    }
    
    // Fallback al componente anterior si no está disponible el moderno
    const [isAdding, setIsAdding] = React.useState(false);

    const handleAddToCart = async () => {
        setIsAdding(true);
        try {
            await onAddToCart(product);
        } catch (error) {
            console.error('Error agregando al carrito:', error);
        } finally {
            setIsAdding(false);
        }
    };

    const isOutOfStock = product.Stock <= 0;

    return React.createElement('div',
        {
            style: {
                background: 'white',
                borderRadius: '15px',
                padding: '20px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                border: '1px solid #e0e0e0',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                opacity: isOutOfStock ? 0.7 : 1
            },
            onMouseEnter: (e) => {
                if (!isOutOfStock) {
                    e.target.style.transform = 'translateY(-5px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                }
            },
            onMouseLeave: (e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
            }
        },

        // Imagen del producto (placeholder)
        React.createElement('div',
            {
                style: {
                    width: '100%',
                    height: '200px',
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '15px',
                    position: 'relative'
                }
            },
            React.createElement('div',
                {
                    style: {
                        fontSize: '3rem',
                        color: 'white',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                    }
                },
                '📦'
            ),
            
            // Badge de stock agotado
            isOutOfStock && React.createElement('div',
                {
                    style: {
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: '#dc3545',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '15px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                    }
                },
                'Agotado'
            )
        ),

        // Información del producto
        React.createElement('div', { style: { marginBottom: '15px' } },
            
            // Nombre del producto
            React.createElement('h3',
                {
                    style: {
                        margin: '0 0 10px 0',
                        fontSize: '1.2rem',
                        color: '#333',
                        fontWeight: 'bold'
                    }
                },
                product.Name
            ),
            
            // Precio
            React.createElement('div',
                {
                    style: {
                        fontSize: '1.5rem',
                        color: '#28a745',
                        fontWeight: 'bold',
                        marginBottom: '10px'
                    }
                },
                `${window.formatCOP ? window.formatCOP(product.Price) : '$' + product.Price}`
            ),
            
            // Stock disponible
            React.createElement('div',
                {
                    style: {
                        fontSize: '0.9rem',
                        color: isOutOfStock ? '#dc3545' : '#666',
                        marginBottom: '15px'
                    }
                },
                isOutOfStock ? '❌ Sin stock' : `✅ ${product.Stock} disponibles`
            ),
            
            // Descripción (si existe)
            product.Description && React.createElement('p',
                {
                    style: {
                        color: '#666',
                        fontSize: '0.9rem',
                        lineHeight: '1.4',
                        marginBottom: '15px'
                    }
                },
                product.Description
            )
        ),

        // Botón agregar al carrito
        React.createElement('button',
            {
                onClick: handleAddToCart,
                disabled: isAdding || isOutOfStock,
                style: {
                    width: '100%',
                    padding: '12px',
                    background: isOutOfStock ? '#6c757d' : (isAdding ? '#ffc107' : '#007bff'),
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: isOutOfStock ? 'not-allowed' : (isAdding ? 'wait' : 'pointer'),
                    transition: 'background-color 0.2s'
                }
            },
            isOutOfStock ? '❌ No disponible' : (isAdding ? '⏳ Agregando...' : '🛒 Agregar al carrito')
        )
    );
}

// ======================
// COMPONENTE DE FILTROS Y BÚSQUEDA
// ======================

function ProductFilters({ onSearch, onFilter, totalProducts, isLoading }) {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [priceRange, setPriceRange] = React.useState({ min: '', max: '' });

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    const handlePriceFilter = () => {
        onFilter({
            minPrice: priceRange.min ? parseFloat(priceRange.min) : null,
            maxPrice: priceRange.max ? parseFloat(priceRange.max) : null
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setPriceRange({ min: '', max: '' });
        onSearch('');
        onFilter({});
    };

    return React.createElement('div',
        {
            style: {
                background: 'white',
                padding: '20px',
                borderRadius: '15px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                marginBottom: '30px',
                border: '1px solid #e0e0e0'
            }
        },

        // Título y contador
        React.createElement('div',
            {
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                }
            },
            React.createElement('h2',
                { style: { margin: 0, color: '#333' } },
                '🔍 Filtros y Búsqueda'
            ),
            React.createElement('span',
                { style: { color: '#666', fontSize: '1rem' } },
                isLoading ? 'Cargando...' : `${totalProducts} productos`
            )
        ),

        // Barra de búsqueda
        React.createElement('div', { style: { marginBottom: '20px' } },
            React.createElement('input',
                {
                    type: 'text',
                    placeholder: '🔍 Buscar productos por nombre...',
                    value: searchTerm,
                    onChange: handleSearchChange,
                    style: {
                        width: '100%',
                        padding: '12px 15px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        boxSizing: 'border-box'
                    }
                }
            )
        ),

        // Filtros de precio
        React.createElement('div',
            {
                style: {
                    display: 'flex',
                    gap: '15px',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                }
            },
            
            React.createElement('label',
                { style: { fontWeight: 'bold', color: '#333' } },
                '💰 Rango de precios:'
            ),
            
            React.createElement('input',
                {
                    type: 'number',
                    placeholder: 'Precio mín.',
                    value: priceRange.min,
                    onChange: (e) => setPriceRange(prev => ({ ...prev, min: e.target.value })),
                    style: {
                        padding: '8px 12px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '6px',
                        width: '120px'
                    }
                }
            ),
            
            React.createElement('span', { style: { color: '#666' } }, '-'),
            
            React.createElement('input',
                {
                    type: 'number',
                    placeholder: 'Precio máx.',
                    value: priceRange.max,
                    onChange: (e) => setPriceRange(prev => ({ ...prev, max: e.target.value })),
                    style: {
                        padding: '8px 12px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '6px',
                        width: '120px'
                    }
                }
            ),
            
            React.createElement('button',
                {
                    onClick: handlePriceFilter,
                    style: {
                        padding: '8px 16px',
                        background: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }
                },
                'Filtrar'
            ),
            
            React.createElement('button',
                {
                    onClick: clearFilters,
                    style: {
                        padding: '8px 16px',
                        background: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                    }
                },
                'Limpiar'
            )
        )
    );
}

// ======================
// COMPONENTE PRINCIPAL DEL CATÁLOGO
// ======================

function ProductCatalog() {
    const [products, setProducts] = React.useState([]);
    const [filteredProducts, setFilteredProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');
    const [cartItems, setCartItems] = React.useState(cartManager.getItems());

    // Cargar productos al montar
    React.useEffect(() => {
        loadProducts();
        
        // Suscribirse a cambios del carrito
        const handleCartChange = (items) => {
            setCartItems(items);
        };
        
        cartManager.subscribe(handleCartChange);
        return () => cartManager.unsubscribe(handleCartChange);
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        setError('');
        
        try {
            console.log('📦 Cargando productos desde API...');
            const data = await window.ApiService.getProducts();
            
            console.log('✅ Productos cargados:', data.length);
            console.log('🔍 DEBUG - Primer producto:', data[0]);
            console.log('🔍 DEBUG - Todos los productos:', data);
            
            // DEBUG: Check which products have URLImagen
            const productsWithImages = data.filter(p => p.URLImagen && p.URLImagen.trim() !== '');
            const productsWithoutImages = data.filter(p => !p.URLImagen || p.URLImagen.trim() === '');
            console.log('✅ Products with URLImagen:', productsWithImages.length, productsWithImages.map(p => ({ id: p.IdProducto, name: p.NombreBase, url: p.URLImagen })));
            console.log('❌ Products without URLImagen:', productsWithoutImages.length, productsWithoutImages.map(p => ({ id: p.IdProducto, name: p.NombreBase })));
            
            setProducts(data);
            setFilteredProducts(data);
        } catch (error) {
            console.error('❌ Error cargando productos:', error);
            setError('Error al cargar productos: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (searchTerm) => {
        if (!searchTerm.trim()) {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter(product =>
                (product.NombreBase && product.NombreBase.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (product.Descripcion && product.Descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setFilteredProducts(filtered);
        }
    };

    const handleFilter = (filters) => {
        let filtered = [...products];
        
        if (filters.minPrice !== null && filters.minPrice !== undefined) {
            filtered = filtered.filter(product => product.Price >= filters.minPrice);
        }
        
        if (filters.maxPrice !== null && filters.maxPrice !== undefined) {
            filtered = filtered.filter(product => product.Price <= filters.maxPrice);
        }
        
        setFilteredProducts(filtered);
    };

    const handleAddToCart = async (product) => {
        console.log('🛒 DEBUG - Producto a agregar:', product);
        console.log('🛒 DEBUG - IdVariacion:', product.IdVariacion, 'Price:', product.Price, 'Stock:', product.Stock, 'Name:', product.Name);
        
        // Verificar si es una variación con stock
        if (product.Stock <= 0) {
            alert('❌ Producto sin stock disponible');
            return;
        }
        
        // Agregar al carrito con la información de la variación
        const itemToAdd = {
            productId: product.IdProducto || product.Id,
            variationId: product.IdVariacion,
            name: product.Name || product.NombreBase,
            peso: product.Peso || 'Estándar',
            price: product.Price,
            quantity: 1,
            subtotal: product.Price * 1,
            stock: product.Stock
        };
        
        console.log('🛒 DEBUG - Item a agregar al carrito:', itemToAdd);
        
        // Usar el cartManager para agregar
        if (window.cartManager) {
            // Adaptar el producto para el cartManager existente
            const cartProduct = {
                Id: product.IdProducto || product.Id,
                IdVariacion: product.IdVariacion,
                Name: product.Name || product.NombreBase,
                Peso: product.Peso || 'Estándar',
                Price: product.Price,
                Stock: product.Stock
            };
            cartManager.addItem(cartProduct, 1);
        }
        
        console.log('🛒 DEBUG - Carrito después de agregar:', cartManager.getItems());
        
        // Mostrar notificación
        alert(`✅ ${product.Name || product.NombreBase} agregado al carrito!`);
    };

    if (loading) {
        return React.createElement('div',
            {
                style: {
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '20px'
                }
            },
            
            // Título skeleton
            React.createElement('div',
                {
                    className: 'skeleton skeleton-title animate-pulse',
                    style: {
                        height: '3rem',
                        width: '300px',
                        margin: '0 auto 40px',
                        borderRadius: '8px'
                    }
                }
            ),
            
            // Grid de skeletons
            React.createElement('div',
                {
                    className: 'products-grid',
                    style: {
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: 'var(--spacing-xl)'
                    }
                },
                
                // Crear 6 skeletons de productos
                Array.from({ length: 6 }, (_, index) =>
                    React.createElement('div',
                        {
                            key: index,
                            className: `card animate-pulse animate-delay-${index * 100}`,
                            style: {
                                animationFillMode: 'both'
                            }
                        },
                        
                        // Imagen skeleton
                        React.createElement('div',
                            {
                                className: 'skeleton skeleton-image',
                                style: {
                                    marginBottom: '16px'
                                }
                            }
                        ),
                        
                        // Contenido skeleton
                        React.createElement('div',
                            {
                                style: {
                                    padding: '16px'
                                }
                            },
                            
                            // Título skeleton
                            React.createElement('div',
                                {
                                    className: 'skeleton skeleton-title'
                                }
                            ),
                            
                            // Precio skeleton
                            React.createElement('div',
                                {
                                    className: 'skeleton skeleton-text',
                                    style: {
                                        width: '60%'
                                    }
                                }
                            ),
                            
                            // Botón skeleton
                            React.createElement('div',
                                {
                                    className: 'skeleton',
                                    style: {
                                        height: '40px',
                                        borderRadius: '8px',
                                        marginTop: '16px'
                                    }
                                }
                            )
                        )
                    )
                )
            )
        );
    }

    if (error) {
        return React.createElement('div',
            {
                style: {
                    background: '#f8d7da',
                    color: '#721c24',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '1px solid #f5c6cb',
                    textAlign: 'center',
                    margin: '20px'
                }
            },
            React.createElement('h2', null, '❌ Error'),
            React.createElement('p', null, error),
            React.createElement('button',
                {
                    onClick: loadProducts,
                    style: {
                        padding: '10px 20px',
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginTop: '10px'
                    }
                },
                '🔄 Reintentar'
            )
        );
    }

    return React.createElement('div',
        {
            style: {
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '20px'
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
            '🛍️ Catálogo de Productos'
        ),

        // Resumen del carrito
        cartItems.length > 0 && React.createElement('div',
            {
                style: {
                    background: '#d4edda',
                    color: '#155724',
                    padding: '15px 20px',
                    borderRadius: '8px',
                    border: '1px solid #c3e6cb',
                    marginBottom: '20px',
                    textAlign: 'center'
                }
            },
            React.createElement('strong', null,
                `🛍 Carrito: ${cartManager.getTotalItems()} productos - Total: ${window.formatCOP ? window.formatCOP(cartManager.getTotalPrice()) : '$' + cartManager.getTotalPrice()}`
            )
        ),

        // Filtros y búsqueda
        React.createElement(ProductFilters, {
            onSearch: handleSearch,
            onFilter: handleFilter,
            totalProducts: filteredProducts.length,
            isLoading: loading
        }),

        // Grid de productos
        filteredProducts.length === 0 ? 
            React.createElement('div',
                {
                    className: 'empty-state card',
                    style: {
                        textAlign: 'center',
                        padding: '60px 20px',
                        color: 'var(--gray-600)',
                        background: 'white',
                        borderRadius: 'var(--border-radius-xl)',
                        boxShadow: 'var(--shadow-md)'
                    }
                },
                React.createElement('div',
                    { style: { fontSize: '4rem', marginBottom: '20px', opacity: 0.7 } },
                    '🔍'
                ),
                React.createElement('h3', 
                    { 
                        style: { 
                            fontSize: 'var(--font-size-2xl)', 
                            marginBottom: '10px',
                            color: 'var(--gray-800)'
                        } 
                    }, 
                    'No se encontraron productos'
                ),
                React.createElement('p', 
                    { 
                        style: { 
                            fontSize: 'var(--font-size-lg)', 
                            color: 'var(--gray-600)' 
                        } 
                    }, 
                    'Prueba ajustando los filtros de búsqueda.'
                )
            ) :
            React.createElement('div',
                {
                    className: 'products-grid grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
                    style: {
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: 'var(--spacing-xl)',
                        marginTop: 'var(--spacing-2xl)',
                        // Responsive breakpoints
                        ...(window.innerWidth > 1200 && { gridTemplateColumns: 'repeat(4, 1fr)' }),
                        ...(window.innerWidth <= 1200 && window.innerWidth > 900 && { gridTemplateColumns: 'repeat(3, 1fr)' }),
                        ...(window.innerWidth <= 900 && window.innerWidth > 600 && { gridTemplateColumns: 'repeat(2, 1fr)' }),
                        ...(window.innerWidth <= 600 && { gridTemplateColumns: '1fr' })
                    }
                },
                filteredProducts.map((product, index) =>
                    React.createElement('div',
                        {
                            key: product.Id,
                            className: `animate-fadeIn animate-delay-${Math.min(index * 100, 500)}`,
                            style: {
                                animationFillMode: 'both'
                            }
                        },
                        React.createElement(ProductCard, {
                            product: product,
                            onAddToCart: handleAddToCart
                        })
                    )
                )
            )
    );
}

// Exportar globalmente
window.ProductCatalog = ProductCatalog;
window.cartManager = cartManager;

console.log('✅ Catálogo de productos cargado');
console.log('🛒 CartManager disponible globalmente');
console.log('📦 Componentes disponibles: ProductCatalog');