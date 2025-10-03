// VentasPet - Gestión de Favoritos
// Sistema de favoritos con persistencia en localStorage

console.log('❤️ Cargando sistema de favoritos...');

// ======================
// GESTIÓN DE FAVORITOS
// ======================

class FavoritesManager {
    constructor() {
        this.favorites = [];
        this.listeners = [];
        this.loadFavoritesFromStorage();
        console.log('❤️ FavoritesManager inicializado:', { favoriteCount: this.favorites.length });
    }

    loadFavoritesFromStorage() {
        try {
            const favoritesData = localStorage.getItem('ventaspet_favorites');
            if (favoritesData) {
                this.favorites = JSON.parse(favoritesData);
                console.log('✅ Favoritos cargados desde localStorage:', this.favorites.length, 'productos');
            }
        } catch (error) {
            console.warn('⚠️ Error cargando favoritos:', error.message);
            localStorage.removeItem('ventaspet_favorites');
        }
    }

    saveFavoritesToStorage() {
        try {
            localStorage.setItem('ventaspet_favorites', JSON.stringify(this.favorites));
            console.log('💾 Favoritos guardados en localStorage');
        } catch (error) {
            console.error('❌ Error guardando favoritos:', error.message);
        }
    }

    addFavorite(product) {
        const productId = product.Id || product.IdProducto;
        
        // Verificar si ya está en favoritos
        if (this.isFavorite(productId)) {
            console.log('ℹ️ Producto ya está en favoritos:', productId);
            return false;
        }

        // Guardar información completa del producto
        this.favorites.push({
            productId: productId,
            name: product.Name || product.NombreBase,
            price: product.Price || 0,
            image: product.ImageUrl || product.URLImagen,
            description: product.Description || product.Descripcion,
            category: product.Category || product.NombreCategoria,
            stock: product.Stock || 0,
            // Guardar el producto completo para poder usarlo después
            fullProduct: product
        });
        
        this.saveFavoritesToStorage();
        this.notifyListeners();
        console.log('❤️ Producto agregado a favoritos:', product.Name || product.NombreBase);
        return true;
    }

    removeFavorite(productId) {
        const initialLength = this.favorites.length;
        this.favorites = this.favorites.filter(fav => fav.productId !== productId);
        
        if (this.favorites.length < initialLength) {
            this.saveFavoritesToStorage();
            this.notifyListeners();
            console.log('💔 Producto eliminado de favoritos:', productId);
            return true;
        }
        return false;
    }

    toggleFavorite(product) {
        const productId = product.Id || product.IdProducto;
        
        if (this.isFavorite(productId)) {
            return this.removeFavorite(productId);
        } else {
            return this.addFavorite(product);
        }
    }

    isFavorite(productId) {
        return this.favorites.some(fav => fav.productId === productId);
    }

    getFavorites() {
        return this.favorites;
    }

    getTotalFavorites() {
        return this.favorites.length;
    }

    clearFavorites() {
        this.favorites = [];
        this.saveFavoritesToStorage();
        this.notifyListeners();
        console.log('💔 Favoritos limpiados');
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    unsubscribe(listener) {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    notifyListeners() {
        this.listeners.forEach(listener => listener(this.favorites));
    }
}

// Instancia global de favoritos
const favoritesManager = new FavoritesManager();

// ======================
// VISTA DE FAVORITOS
// ======================

function FavoritesView() {
    const [favorites, setFavorites] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    // Cargar favoritos
    React.useEffect(() => {
        loadFavorites();
        
        // Suscribirse a cambios de favoritos
        const handleFavoritesChange = (favs) => {
            console.log('🔄 Favorites Manager notifica cambio:', favs.length, 'favoritos');
            setFavorites([...favs]); // Crear nuevo array para forzar re-render
        };
        
        if (window.favoritesManager) {
            window.favoritesManager.subscribe(handleFavoritesChange);
            return () => window.favoritesManager.unsubscribe(handleFavoritesChange);
        }
    }, []);
    
    const loadFavorites = () => {
        setLoading(true);
        try {
            if (window.favoritesManager) {
                const favs = window.favoritesManager.getFavorites();
                setFavorites(favs);
                console.log('❤️ Favoritos cargados:', favs.length);
            }
        } catch (error) {
            console.error('Error cargando favoritos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFromFavorites = (productId) => {
        if (window.favoritesManager) {
            window.favoritesManager.removeFavorite(productId);
            // La actualización se hará automáticamente por la suscripción
        }
    };

    const handleAddToCart = (favorite) => {
        if (window.cartManager && favorite.fullProduct) {
            window.cartManager.addItem(favorite.fullProduct, 1);
            console.log('🛒 Producto agregado al carrito desde favoritos:', favorite.name);
            alert(`✅ ${favorite.name} agregado al carrito`);
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
                { style: { fontSize: '48px', marginBottom: '20px' } }, 
                '⏳'
            ),
            React.createElement('h3', null, 'Cargando favoritos...'),
            React.createElement('p', null, 'Espera un momento mientras cargamos tus productos favoritos')
        );
    }

    // Estado vacío
    if (favorites.length === 0) {
        return React.createElement('div',
            {
                style: {
                    maxWidth: '1400px',
                    margin: '0 auto',
                    padding: '40px 20px',
                    textAlign: 'center'
                }
            },
            
            // Título
            React.createElement('h1',
                {
                    style: {
                        fontSize: '2.5rem',
                        color: '#333',
                        marginBottom: '30px'
                    }
                },
                '❤️ Mis Favoritos'
            ),
            
            // Estado vacío
            React.createElement('div',
                {
                    style: {
                        background: 'white',
                        padding: '60px 40px',
                        borderRadius: '20px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        border: '2px dashed #e0e0e0',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }
                },
                React.createElement('div',
                    { style: { fontSize: '80px', marginBottom: '20px' } },
                    '💔'
                ),
                React.createElement('h2',
                    {
                        style: {
                            fontSize: '1.8rem',
                            color: '#666',
                            marginBottom: '15px'
                        }
                    },
                    'No tienes favoritos aún'
                ),
                React.createElement('p',
                    {
                        style: {
                            fontSize: '1.1rem',
                            color: '#999',
                            marginBottom: '30px'
                        }
                    },
                    'Explora nuestro catálogo y marca tus productos favoritos haciendo clic en el corazón ❤️'
                ),
                React.createElement('button',
                    {
                        onClick: () => {
                            if (window.setCurrentView) {
                                window.setCurrentView('catalog');
                            }
                        },
                        style: {
                            background: 'linear-gradient(135deg, #E45A84 0%, #D94876 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '15px 40px',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            boxShadow: '0 4px 15px rgba(228, 90, 132, 0.3)'
                        },
                        onMouseEnter: (e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 20px rgba(228, 90, 132, 0.4)';
                        },
                        onMouseLeave: (e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 15px rgba(228, 90, 132, 0.3)';
                        }
                    },
                    '🛍️ Explorar Catálogo'
                )
            )
        );
    }

    // Vista con favoritos
    return React.createElement('div',
        {
            style: {
                maxWidth: '100%',
                width: '100%',
                margin: '0',
                padding: '20px 2rem',
                minHeight: 'calc(100vh - 120px)'
            }
        },

        // Título principal
        React.createElement('h1',
            {
                style: {
                    textAlign: 'center',
                    color: '#333',
                    marginBottom: '20px',
                    fontSize: '2.5rem'
                }
            },
            '❤️ Mis Favoritos'
        ),

        // Indicador de favoritos
        React.createElement('div',
            {
                style: {
                    background: '#ffe7f0',
                    color: '#c41e3a',
                    padding: '15px 20px',
                    borderRadius: '10px',
                    border: '1px solid #ffcce0',
                    marginBottom: '30px',
                    textAlign: 'center'
                }
            },
            React.createElement('strong', null,
                `❤️ ${favorites.length} producto${favorites.length !== 1 ? 's' : ''} favorito${favorites.length !== 1 ? 's' : ''}`
            )
        ),

        // Grid de productos favoritos
        React.createElement('div',
            {
                style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '25px',
                    marginBottom: '40px'
                }
            },
            favorites.map(favorite =>
                React.createElement('div',
                    {
                        key: favorite.productId,
                        style: {
                            background: 'white',
                            borderRadius: '15px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                            border: '1px solid #e0e0e0',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            position: 'relative'
                        },
                        onMouseEnter: (e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                        },
                        onMouseLeave: (e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                        }
                    },
                    
                    // Botón de quitar de favoritos
                    React.createElement('button',
                        {
                            onClick: () => handleRemoveFromFavorites(favorite.productId),
                            style: {
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'rgba(255, 255, 255, 0.95)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                fontSize: '20px',
                                cursor: 'pointer',
                                zIndex: 10,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                transition: 'transform 0.2s'
                            },
                            onMouseEnter: (e) => {
                                e.target.style.transform = 'scale(1.1)';
                            },
                            onMouseLeave: (e) => {
                                e.target.style.transform = 'scale(1)';
                            },
                            title: 'Quitar de favoritos'
                        },
                        '❤️'
                    ),
                    
                    // Imagen del producto
                    React.createElement('div',
                        {
                            style: {
                                height: '200px',
                                background: favorite.image 
                                    ? `url(${window.transformImageUrl ? window.transformImageUrl(favorite.image) : favorite.image}) center/cover` 
                                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '60px'
                            }
                        },
                        !favorite.image && '📦'
                    ),
                    
                    // Información del producto
                    React.createElement('div',
                        {
                            style: {
                                padding: '20px'
                            }
                        },
                        
                        // Nombre
                        React.createElement('h3',
                            {
                                style: {
                                    fontSize: '1.2rem',
                                    color: '#333',
                                    margin: '0 0 10px 0',
                                    fontWeight: '600',
                                    lineHeight: '1.3'
                                }
                            },
                            favorite.name
                        ),
                        
                        // Categoría
                        favorite.category && React.createElement('div',
                            {
                                style: {
                                    fontSize: '0.85rem',
                                    color: '#999',
                                    marginBottom: '10px'
                                }
                            },
                            `📁 ${favorite.category}`
                        ),
                        
                        // Precio
                        React.createElement('div',
                            {
                                style: {
                                    fontSize: '1.4rem',
                                    color: '#4A90E2',
                                    fontWeight: 'bold',
                                    marginBottom: '15px'
                                }
                            },
                            window.formatCOP ? window.formatCOP(favorite.price) : `$${favorite.price?.toLocaleString() || '0'}`
                        ),
                        
                        // Botón agregar al carrito
                        React.createElement('button',
                            {
                                onClick: () => handleAddToCart(favorite),
                                style: {
                                    width: '100%',
                                    background: 'linear-gradient(135deg, #E45A84 0%, #D94876 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    padding: '12px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    boxShadow: '0 4px 15px rgba(228, 90, 132, 0.3)'
                                },
                                onMouseEnter: (e) => {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 6px 20px rgba(228, 90, 132, 0.4)';
                                },
                                onMouseLeave: (e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 4px 15px rgba(228, 90, 132, 0.3)';
                                }
                            },
                            '🛒 Agregar al Carrito'
                        )
                    )
                )
            )
        )
    );
}

// Exportar globalmente
window.favoritesManager = favoritesManager;
window.FavoritesView = FavoritesView;

console.log('✅ Sistema de favoritos cargado');
console.log('❤️ Componente disponible: FavoritesView');
console.log('❤️ Manager disponible: favoritesManager');
