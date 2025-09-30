// VentasPet - Sistema de Variaciones de Productos
// Maneja diferentes tamaños, pesos y opciones de productos

console.log('📦 Cargando Product Variations Component...');

window.ProductVariationsComponent = function({ product, onVariationChange, selectedVariation }) {
    const [variations, setVariations] = React.useState([]);
    const [currentVariation, setCurrentVariation] = React.useState(selectedVariation || null);
    
    // Generar variaciones basadas en el producto
    React.useEffect(() => {
        if (product) {
            const productVariations = generateProductVariations(product);
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
    
    const generateProductVariations = (product) => {
        const baseProduct = {
            id: product.Id || product.id,
            name: product.Name || product.name,
            description: product.Description || product.description,
            category: product.Category || product.category,
            petType: product.PetType || product.petType || 'General',
            brand: product.Brand || product.brand || 'Sin marca',
            rating: product.Rating || product.rating || 4.0
        };
        
        // Generar variaciones basadas en el tipo de producto
        const variations = [];
        
        // Para alimentos, generar variaciones de peso
        if (baseProduct.category?.toLowerCase().includes('alimento') || 
            baseProduct.name?.toLowerCase().includes('alimento')) {
            
            const weightVariations = [
                { weight: '500g', price: (product.Price || product.price || 15000) * 0.6, stock: 50 },
                { weight: '1.5kg', price: (product.Price || product.price || 15000) * 1.0, stock: 30 },
                { weight: '3kg', price: (product.Price || product.price || 15000) * 1.8, stock: 20 }
            ];
            
            weightVariations.forEach((variation, index) => {
                variations.push({
                    ...baseProduct,
                    id: `${baseProduct.id}_${variation.weight}`,
                    name: `${baseProduct.name} ${variation.weight}`,
                    price: variation.price,
                    stock: variation.stock,
                    weight: variation.weight,
                    size: variation.weight,
                    image: product.image || product.ImageUrl || product.imageUrl,
                    isVariation: true,
                    parentId: baseProduct.id
                });
            });
        }
        // Para snacks, generar variaciones de cantidad
        else if (baseProduct.category?.toLowerCase().includes('snack') || 
                 baseProduct.name?.toLowerCase().includes('snack')) {
            
            const quantityVariations = [
                { quantity: '1 unidad', price: product.Price || product.price || 5000, stock: 100 },
                { quantity: 'Pack 3', price: (product.Price || product.price || 5000) * 2.5, stock: 50 },
                { quantity: 'Pack 6', price: (product.Price || product.price || 5000) * 4.5, stock: 25 }
            ];
            
            quantityVariations.forEach((variation, index) => {
                variations.push({
                    ...baseProduct,
                    id: `${baseProduct.id}_${variation.quantity.replace(' ', '_')}`,
                    name: `${baseProduct.name} (${variation.quantity})`,
                    price: variation.price,
                    stock: variation.stock,
                    quantity: variation.quantity,
                    image: product.image || product.ImageUrl || product.imageUrl,
                    isVariation: true,
                    parentId: baseProduct.id
                });
            });
        }
        // Para otros productos, crear una variación única
        else {
            variations.push({
                ...baseProduct,
                price: product.Price || product.price || 10000,
                stock: product.Stock || product.stock || 10,
                image: product.image || product.ImageUrl || product.imageUrl,
                isVariation: false
            });
        }
        
        return variations;
    };
    
    const handleVariationSelect = (variation) => {
        setCurrentVariation(variation);
        if (onVariationChange) {
            onVariationChange(variation);
        }
    };
    
    if (!product || variations.length === 0) {
        return null;
    }
    
    // Si solo hay una variación, no mostrar selector
    if (variations.length === 1) {
        return null;
    }
    
    return React.createElement('div',
        {
            className: 'product-variations',
            style: {
                marginBottom: '15px'
            }
        },
        
        // Título de variaciones
        React.createElement('div',
            {
                style: {
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: '8px'
                }
            },
            'Opciones disponibles:'
        ),
        
        // Selector de variaciones
        React.createElement('div',
            {
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                }
            },
            
            variations.map((variation, index) => 
                React.createElement('div',
                    {
                        key: variation.id,
                        onClick: () => handleVariationSelect(variation),
                        style: {
                            padding: '10px 12px',
                            border: currentVariation?.id === variation.id ? 
                                '2px solid #4A90E2' : '1px solid #ddd',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            backgroundColor: currentVariation?.id === variation.id ? 
                                '#f0f8ff' : 'white',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        },
                        onMouseEnter: (e) => {
                            if (currentVariation?.id !== variation.id) {
                                e.target.style.borderColor = '#4A90E2';
                                e.target.style.backgroundColor = '#f8f9fa';
                            }
                        },
                        onMouseLeave: (e) => {
                            if (currentVariation?.id !== variation.id) {
                                e.target.style.borderColor = '#ddd';
                                e.target.style.backgroundColor = 'white';
                            }
                        }
                    },
                    
                    // Información de la variación
                    React.createElement('div',
                        {
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '2px'
                            }
                        },
                        React.createElement('div',
                            {
                                style: {
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: '#333'
                                }
                            },
                            variation.weight || variation.quantity || 'Estándar'
                        ),
                        React.createElement('div',
                            {
                                style: {
                                    fontSize: '11px',
                                    color: '#666'
                                }
                            },
                            variation.stock > 0 ? `${variation.stock} disponibles` : 'Agotado'
                        )
                    ),
                    
                    // Precio de la variación
                    React.createElement('div',
                        {
                            style: {
                                fontSize: '14px',
                                fontWeight: 'bold',
                                color: '#4A90E2'
                            }
                        },
                        window.formatCOP ? window.formatCOP(variation.price) : `$${variation.price.toLocaleString()}`
                    )
                )
            )
        )
    );
};

// Función helper para obtener variaciones de un producto
window.getProductVariations = function(product) {
    if (!product) return [];
    
    // Lógica similar a la del componente pero como función independiente
    const baseProduct = {
        id: product.Id || product.id,
        name: product.Name || product.name,
        description: product.Description || product.description,
        category: product.Category || product.category,
        petType: product.PetType || product.petType || 'General',
        brand: product.Brand || product.brand || 'Sin marca',
        rating: product.Rating || product.rating || 4.0
    };
    
    const variations = [];
    
    // Para alimentos, generar variaciones de peso
    if (baseProduct.category?.toLowerCase().includes('alimento') || 
        baseProduct.name?.toLowerCase().includes('alimento')) {
        
        const weightVariations = [
            { weight: '500g', price: (product.Price || product.price || 15000) * 0.6, stock: 50 },
            { weight: '1.5kg', price: (product.Price || product.price || 15000) * 1.0, stock: 30 },
            { weight: '3kg', price: (product.Price || product.price || 15000) * 1.8, stock: 20 }
        ];
        
        weightVariations.forEach((variation, index) => {
            variations.push({
                ...baseProduct,
                id: `${baseProduct.id}_${variation.weight}`,
                name: `${baseProduct.name} ${variation.weight}`,
                price: variation.price,
                stock: variation.stock,
                weight: variation.weight,
                size: variation.weight,
                image: product.image || product.ImageUrl || product.imageUrl,
                isVariation: true,
                parentId: baseProduct.id
            });
        });
    }
    // Para snacks, generar variaciones de cantidad
    else if (baseProduct.category?.toLowerCase().includes('snack') || 
             baseProduct.name?.toLowerCase().includes('snack')) {
        
        const quantityVariations = [
            { quantity: '1 unidad', price: product.Price || product.price || 5000, stock: 100 },
            { quantity: 'Pack 3', price: (product.Price || product.price || 5000) * 2.5, stock: 50 },
            { quantity: 'Pack 6', price: (product.Price || product.price || 5000) * 4.5, stock: 25 }
        ];
        
        quantityVariations.forEach((variation, index) => {
            variations.push({
                ...baseProduct,
                id: `${baseProduct.id}_${variation.quantity.replace(' ', '_')}`,
                name: `${baseProduct.name} (${variation.quantity})`,
                price: variation.price,
                stock: variation.stock,
                quantity: variation.quantity,
                image: product.image || product.ImageUrl || product.imageUrl,
                isVariation: true,
                parentId: baseProduct.id
            });
        });
    }
    // Para otros productos, crear una variación única
    else {
        variations.push({
            ...baseProduct,
            price: product.Price || product.price || 10000,
            stock: product.Stock || product.stock || 10,
            image: product.image || product.ImageUrl || product.imageUrl,
            isVariation: false
        });
    }
    
    return variations;
};

console.log('✅ Product Variations Component cargado');
