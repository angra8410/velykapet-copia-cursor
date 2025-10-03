// VentasPet - Sistema de Variaciones de Productos
// Maneja diferentes tamaños, pesos y opciones de productos desde el backend

console.log('📦 Cargando Product Variations Component...');

window.ProductVariationsComponent = function({ product, onVariationChange, selectedVariation }) {
    const [variations, setVariations] = React.useState([]);
    const [currentVariation, setCurrentVariation] = React.useState(selectedVariation || null);
    
    // Cargar variaciones desde el producto del backend
    React.useEffect(() => {
        if (product) {
            const productVariations = getBackendVariations(product);
            setVariations(productVariations);
            
            // Seleccionar la primera variación por defecto si no hay selección
            if (!currentVariation && productVariations.length > 0) {
                setCurrentVariation(productVariations[0]);
                if (onVariationChange) {
                    onVariationChange(productVariations[0]);
                }
            }
        }
    }, [product]);
    
    const getBackendVariations = (product) => {
        // Si el producto tiene variaciones del backend, usarlas
        if (product.Variaciones && Array.isArray(product.Variaciones) && product.Variaciones.length > 0) {
            console.log('📦 Usando variaciones del backend:', product.Variaciones.length);
            return product.Variaciones.map(variacion => ({
                id: variacion.IdVariacion,
                idVariacion: variacion.IdVariacion,
                idProducto: variacion.IdProducto,
                name: `${product.NombreBase || product.Name || product.name} - ${variacion.Peso}`,
                peso: variacion.Peso,
                price: variacion.Precio,
                stock: variacion.Stock,
                activa: variacion.Activa,
                // Campos adicionales del producto base
                description: product.Descripcion || product.Description || product.description,
                category: product.NombreCategoria || product.Category || product.category,
                petType: product.TipoMascota || product.PetType || product.petType || 'General',
                image: product.URLImagen || product.ImageUrl || product.image || product.imageUrl,
                isVariation: true
            }));
        }
        
        // Si no hay variaciones, crear una variación única con los datos del producto
        console.log('⚠️ Producto sin variaciones del backend, creando variación única');
        return [{
            id: product.IdProducto || product.Id || product.id,
            idProducto: product.IdProducto || product.Id || product.id,
            name: product.NombreBase || product.Name || product.name,
            peso: 'Estándar',
            price: product.Price || product.price || 0,
            stock: product.Stock || product.stock || 0,
            activa: true,
            description: product.Descripcion || product.Description || product.description,
            category: product.NombreCategoria || product.Category || product.category,
            petType: product.TipoMascota || product.PetType || product.petType || 'General',
            image: product.URLImagen || product.ImageUrl || product.image || product.imageUrl,
            isVariation: false
        }];
    };

    
    const handleVariationSelect = (e) => {
        // Prevenir que el evento de cambio de variación navegue a la vista de producto
        e.stopPropagation();
        
        const selectedId = parseInt(e.target.value);
        const variation = variations.find(v => v.id === selectedId || v.idVariacion === selectedId);
        if (variation) {
            setCurrentVariation(variation);
            if (onVariationChange) {
                onVariationChange(variation);
            }
        }
    };
    
    if (!product || variations.length === 0) {
        return null;
    }
    
    // Si solo hay una variación, no mostrar selector
    if (variations.length === 1) {
        return null;
    }
    
    // Selector de variaciones como dropdown (estilo e-commerce moderno)
    return React.createElement('div',
        {
            className: 'product-variations',
            onClick: (e) => {
                // Prevenir que el click en el dropdown navegue a la vista de producto
                e.stopPropagation();
            },
            style: {
                marginBottom: '15px'
            }
        },
        
        // Título de variaciones
        React.createElement('label',
            {
                style: {
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: '6px',
                    display: 'block'
                }
            },
            'Selecciona un peso:'
        ),
        
        // Dropdown selector
        React.createElement('select',
            {
                value: currentVariation?.id || currentVariation?.idVariacion || '',
                onChange: handleVariationSelect,
                onClick: (e) => {
                    // Prevenir que el click en el dropdown navegue a la vista de producto
                    e.stopPropagation();
                },
                style: {
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#333',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    appearance: 'none',
                    backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 10px center',
                    backgroundSize: '20px',
                    paddingRight: '40px'
                },
                onFocus: (e) => {
                    e.target.style.borderColor = '#4A90E2';
                    e.target.style.boxShadow = '0 0 0 3px rgba(74, 144, 226, 0.1)';
                },
                onBlur: (e) => {
                    e.target.style.borderColor = '#e0e0e0';
                    e.target.style.boxShadow = 'none';
                }
            },
            
            variations.map((variation) => 
                React.createElement('option',
                    {
                        key: variation.id || variation.idVariacion,
                        value: variation.id || variation.idVariacion,
                        disabled: !variation.stock || variation.stock === 0
                    },
                    `${variation.peso} — ${window.formatCOP ? window.formatCOP(variation.price) : '$' + variation.price.toLocaleString()} ${variation.stock > 0 ? `(${variation.stock} disp.)` : '(Agotado)'}`
                )
            )
        )
    );
};

// Función helper para obtener variaciones de un producto desde el backend
window.getProductVariations = function(product) {
    if (!product) return [];
    
    // Si el producto tiene variaciones del backend, usarlas directamente
    if (product.Variaciones && Array.isArray(product.Variaciones) && product.Variaciones.length > 0) {
        return product.Variaciones.map(variacion => ({
            id: variacion.IdVariacion,
            idVariacion: variacion.IdVariacion,
            idProducto: variacion.IdProducto,
            name: `${product.NombreBase || product.Name || product.name} - ${variacion.Peso}`,
            peso: variacion.Peso,
            price: variacion.Precio,
            stock: variacion.Stock,
            activa: variacion.Activa,
            description: product.Descripcion || product.Description || product.description,
            category: product.NombreCategoria || product.Category || product.category,
            petType: product.TipoMascota || product.PetType || product.petType || 'General',
            image: product.URLImagen || product.ImageUrl || product.image || product.imageUrl,
            isVariation: true
        }));
    }
    
    // Si no hay variaciones del backend, retornar array vacío o variación única
    return [{
        id: product.IdProducto || product.Id || product.id,
        idProducto: product.IdProducto || product.Id || product.id,
        name: product.NombreBase || product.Name || product.name,
        peso: 'Estándar',
        price: product.Price || product.price || 0,
        stock: product.Stock || product.stock || 0,
        activa: true,
        description: product.Descripcion || product.Description || product.description,
        category: product.NombreCategoria || product.Category || product.category,
        petType: product.TipoMascota || product.PetType || product.petType || 'General',
        image: product.URLImagen || product.ImageUrl || product.image || product.imageUrl,
        isVariation: false
    }];
};

console.log('✅ Product Variations Component cargado');
