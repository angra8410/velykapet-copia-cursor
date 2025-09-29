// VentasPet - Sistema de Checkout Completo
// Proceso de compra con pasarelas de pago colombianas

console.log('💳 Cargando sistema de checkout...');

// ======================
// CONSTANTES Y CONFIGURACIÓN
// ======================

const CHECKOUT_STEPS = {
    SHIPPING: 'shipping',
    PAYMENT: 'payment', 
    REVIEW: 'review',
    PROCESSING: 'processing',
    CONFIRMATION: 'confirmation'
};

const PAYMENT_METHODS = {
    MERCADOPAGO: {
        id: 'mercadopago',
        name: 'MercadoPago',
        icon: '💳',
        description: 'Tarjetas de crédito y débito',
        fee: 0.039, // 3.9%
        available: true
    },
    WOMPI: {
        id: 'wompi',
        name: 'Wompi',
        icon: '🏦',
        description: 'Tarjetas y transferencias',
        fee: 0.029, // 2.9%
        available: true
    },
    PSE: {
        id: 'pse',
        name: 'PSE',
        icon: '🏛️',
        description: 'Pagos Seguros en Línea',
        fee: 0.015, // 1.5%
        available: true
    },
    NEQUI: {
        id: 'nequi',
        name: 'Nequi',
        icon: '📱',
        description: 'Pago con QR',
        fee: 0.01, // 1%
        available: false // Por implementar
    }
};

const COLOMBIAN_DEPARTMENTS = [
    'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bogotá D.C.', 'Bolívar',
    'Boyacá', 'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó',
    'Córdoba', 'Cundinamarca', 'Guainía', 'Guaviare', 'Huila', 'La Guajira',
    'Magdalena', 'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío',
    'Risaralda', 'San Andrés y Providencia', 'Santander', 'Sucre', 'Tolima',
    'Valle del Cauca', 'Vaupés', 'Vichada'
];

// ======================
// COMPONENTE DE DATOS DE ENVÍO
// ======================

function ShippingForm({ shippingData, onShippingChange, onNext }) {
    const [formData, setFormData] = React.useState({
        firstName: (shippingData && shippingData.firstName) || '',
        lastName: (shippingData && shippingData.lastName) || '',
        email: (shippingData && shippingData.email) || '',
        phone: (shippingData && shippingData.phone) || '',
        address: (shippingData && shippingData.address) || '',
        city: (shippingData && shippingData.city) || '',
        department: (shippingData && shippingData.department) || 'Bogotá D.C.',
        postalCode: (shippingData && shippingData.postalCode) || '',
        instructions: (shippingData && shippingData.instructions) || ''
    });
    
    const [errors, setErrors] = React.useState({});

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Limpiar error del campo al escribir
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.firstName.trim()) newErrors.firstName = 'Nombre requerido';
        if (!formData.lastName.trim()) newErrors.lastName = 'Apellido requerido';
        if (!formData.email.trim()) newErrors.email = 'Email requerido';
        if (!formData.phone.trim()) newErrors.phone = 'Teléfono requerido';
        if (!formData.address.trim()) newErrors.address = 'Dirección requerida';
        if (!formData.city.trim()) newErrors.city = 'Ciudad requerida';
        
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }
        
        // Validar teléfono colombiano
        const phoneRegex = /^(\+57|57)?[0-9]{10}$/;
        if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Teléfono inválido (10 dígitos)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('📦 ShippingForm - handleSubmit:', formData);
        if (validateForm()) {
            console.log('✅ Validación exitosa, enviando datos:', formData);
            onShippingChange(formData); // Guardar los datos
            onNext(); // Ir al siguiente paso
        } else {
            console.log('❌ Validación fallida');
        }
    };

    return React.createElement('div',
        {
            style: {
                background: 'white',
                padding: '30px',
                borderRadius: '15px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                maxWidth: '600px',
                margin: '0 auto'
            }
        },

        React.createElement('h2',
            {
                style: {
                    color: '#333',
                    textAlign: 'center',
                    marginBottom: '30px',
                    fontSize: '1.8rem'
                }
            },
            '📦 Datos de Envío'
        ),

        React.createElement('form', { onSubmit: handleSubmit },
            
            // Fila: Nombre y Apellido
            React.createElement('div',
                {
                    style: {
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '15px',
                        marginBottom: '20px'
                    }
                },
                
                // Nombre
                React.createElement('div', null,
                    React.createElement('label',
                        { style: { display: 'block', marginBottom: '8px', fontWeight: 'bold' } },
                        '👤 Nombre *'
                    ),
                    React.createElement('input', {
                        type: 'text',
                        value: formData.firstName,
                        onChange: (e) => handleChange('firstName', e.target.value),
                        placeholder: 'Tu nombre',
                        style: {
                            width: '100%',
                            padding: '12px',
                            border: errors.firstName ? '2px solid #dc3545' : '2px solid #e0e0e0',
                            borderRadius: '8px',
                            fontSize: '16px',
                            boxSizing: 'border-box'
                        }
                    }),
                    errors.firstName && React.createElement('div',
                        { style: { color: '#dc3545', fontSize: '14px', marginTop: '5px' } },
                        errors.firstName
                    )
                ),
                
                // Apellido
                React.createElement('div', null,
                    React.createElement('label',
                        { style: { display: 'block', marginBottom: '8px', fontWeight: 'bold' } },
                        '👥 Apellido *'
                    ),
                    React.createElement('input', {
                        type: 'text',
                        value: formData.lastName,
                        onChange: (e) => handleChange('lastName', e.target.value),
                        placeholder: 'Tu apellido',
                        style: {
                            width: '100%',
                            padding: '12px',
                            border: errors.lastName ? '2px solid #dc3545' : '2px solid #e0e0e0',
                            borderRadius: '8px',
                            fontSize: '16px',
                            boxSizing: 'border-box'
                        }
                    }),
                    errors.lastName && React.createElement('div',
                        { style: { color: '#dc3545', fontSize: '14px', marginTop: '5px' } },
                        errors.lastName
                    )
                )
            ),
            
            // Email y Teléfono
            React.createElement('div',
                {
                    style: {
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '15px',
                        marginBottom: '20px'
                    }
                },
                
                React.createElement('div', null,
                    React.createElement('label',
                        { style: { display: 'block', marginBottom: '8px', fontWeight: 'bold' } },
                        '📧 Email *'
                    ),
                    React.createElement('input', {
                        type: 'email',
                        value: formData.email,
                        onChange: (e) => handleChange('email', e.target.value),
                        placeholder: 'tu@email.com',
                        style: {
                            width: '100%',
                            padding: '12px',
                            border: errors.email ? '2px solid #dc3545' : '2px solid #e0e0e0',
                            borderRadius: '8px',
                            fontSize: '16px',
                            boxSizing: 'border-box'
                        }
                    }),
                    errors.email && React.createElement('div',
                        { style: { color: '#dc3545', fontSize: '14px', marginTop: '5px' } },
                        errors.email
                    )
                ),
                
                React.createElement('div', null,
                    React.createElement('label',
                        { style: { display: 'block', marginBottom: '8px', fontWeight: 'bold' } },
                        '📱 Teléfono *'
                    ),
                    React.createElement('input', {
                        type: 'tel',
                        value: formData.phone,
                        onChange: (e) => handleChange('phone', e.target.value),
                        placeholder: '3001234567',
                        style: {
                            width: '100%',
                            padding: '12px',
                            border: errors.phone ? '2px solid #dc3545' : '2px solid #e0e0e0',
                            borderRadius: '8px',
                            fontSize: '16px',
                            boxSizing: 'border-box'
                        }
                    }),
                    errors.phone && React.createElement('div',
                        { style: { color: '#dc3545', fontSize: '14px', marginTop: '5px' } },
                        errors.phone
                    )
                )
            ),
            
            // Dirección
            React.createElement('div', { style: { marginBottom: '20px' } },
                React.createElement('label',
                    { style: { display: 'block', marginBottom: '8px', fontWeight: 'bold' } },
                    '🏠 Dirección *'
                ),
                React.createElement('input', {
                    type: 'text',
                    value: formData.address,
                    onChange: (e) => handleChange('address', e.target.value),
                    placeholder: 'Calle 123 # 45-67, Apto 89',
                    style: {
                        width: '100%',
                        padding: '12px',
                        border: errors.address ? '2px solid #dc3545' : '2px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                    }
                }),
                errors.address && React.createElement('div',
                    { style: { color: '#dc3545', fontSize: '14px', marginTop: '5px' } },
                    errors.address
                )
            ),
            
            // Ciudad, Departamento y Código Postal
            React.createElement('div',
                {
                    style: {
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 100px',
                        gap: '15px',
                        marginBottom: '20px'
                    }
                },
                
                React.createElement('div', null,
                    React.createElement('label',
                        { style: { display: 'block', marginBottom: '8px', fontWeight: 'bold' } },
                        '🏙️ Ciudad *'
                    ),
                    React.createElement('input', {
                        type: 'text',
                        value: formData.city,
                        onChange: (e) => handleChange('city', e.target.value),
                        placeholder: 'Bogotá',
                        style: {
                            width: '100%',
                            padding: '12px',
                            border: errors.city ? '2px solid #dc3545' : '2px solid #e0e0e0',
                            borderRadius: '8px',
                            fontSize: '16px',
                            boxSizing: 'border-box'
                        }
                    }),
                    errors.city && React.createElement('div',
                        { style: { color: '#dc3545', fontSize: '14px', marginTop: '5px' } },
                        errors.city
                    )
                ),
                
                React.createElement('div', null,
                    React.createElement('label',
                        { style: { display: 'block', marginBottom: '8px', fontWeight: 'bold' } },
                        '🗺️ Departamento'
                    ),
                    React.createElement('select', {
                        value: formData.department,
                        onChange: (e) => handleChange('department', e.target.value),
                        style: {
                            width: '100%',
                            padding: '12px',
                            border: '2px solid #e0e0e0',
                            borderRadius: '8px',
                            fontSize: '16px',
                            boxSizing: 'border-box'
                        }
                    },
                        COLOMBIAN_DEPARTMENTS.map(dept =>
                            React.createElement('option', { key: dept, value: dept }, dept)
                        )
                    )
                ),
                
                React.createElement('div', null,
                    React.createElement('label',
                        { style: { display: 'block', marginBottom: '8px', fontWeight: 'bold' } },
                        '📮 C.P.'
                    ),
                    React.createElement('input', {
                        type: 'text',
                        value: formData.postalCode,
                        onChange: (e) => handleChange('postalCode', e.target.value),
                        placeholder: '11001',
                        maxLength: 5,
                        style: {
                            width: '100%',
                            padding: '12px',
                            border: '2px solid #e0e0e0',
                            borderRadius: '8px',
                            fontSize: '16px',
                            boxSizing: 'border-box'
                        }
                    })
                )
            ),
            
            // Instrucciones especiales
            React.createElement('div', { style: { marginBottom: '30px' } },
                React.createElement('label',
                    { style: { display: 'block', marginBottom: '8px', fontWeight: 'bold' } },
                    '📝 Instrucciones de entrega (opcional)'
                ),
                React.createElement('textarea', {
                    value: formData.instructions,
                    onChange: (e) => handleChange('instructions', e.target.value),
                    placeholder: 'Instrucciones especiales para la entrega...',
                    rows: 3,
                    style: {
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '16px',
                        boxSizing: 'border-box',
                        resize: 'vertical'
                    }
                })
            ),
            
            // Botón continuar
            React.createElement('button', {
                type: 'submit',
                style: {
                    width: '100%',
                    padding: '15px',
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                }
            }, '➡️ Continuar al Pago')
        )
    );
}

// ======================
// COMPONENTE DE MÉTODOS DE PAGO
// ======================

function PaymentMethodSelector({ paymentData, onPaymentChange, onNext, onBack, total }) {
    const [selectedMethod, setSelectedMethod] = React.useState((paymentData && paymentData.method) || '');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleMethodSelect = (methodId) => {
        setSelectedMethod(methodId);
        setError('');
        
        // Calcular comisión
        const method = PAYMENT_METHODS[Object.keys(PAYMENT_METHODS).find(key => 
            PAYMENT_METHODS[key].id === methodId
        )];
        
        const fee = method ? total * method.fee : 0;
        
        onPaymentChange({
            method: methodId,
            methodName: method ? method.name : '',
            fee: fee,
            finalTotal: total + fee
        });
    };

    const handleContinue = async () => {
        if (!selectedMethod) {
            setError('Por favor selecciona un método de pago');
            return;
        }

        setLoading(true);
        try {
            // Simular procesamiento
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Obtener los datos actuales de pago
            const method = PAYMENT_METHODS[Object.keys(PAYMENT_METHODS).find(key => 
                PAYMENT_METHODS[key].id === selectedMethod
            )];
            
            const currentPaymentData = {
                method: selectedMethod,
                methodName: method ? method.name : '',
                fee: method ? total * method.fee : 0,
                finalTotal: total + (method ? total * method.fee : 0)
            };
            
            console.log('💳 PaymentMethodSelector - Enviando datos:', currentPaymentData);
            
            // Enviar los datos al componente padre
            onPaymentChange(currentPaymentData);
            onNext();
        } catch (error) {
            setError('Error procesando el pago. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return React.createElement('div',
        {
            style: {
                background: 'white',
                padding: '30px',
                borderRadius: '15px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                maxWidth: '600px',
                margin: '0 auto'
            }
        },

        React.createElement('h2',
            {
                style: {
                    color: '#333',
                    textAlign: 'center',
                    marginBottom: '30px',
                    fontSize: '1.8rem'
                }
            },
            '💳 Métodos de Pago'
        ),

        React.createElement('p',
            {
                style: {
                    textAlign: 'center',
                    color: '#666',
                    marginBottom: '30px'
                }
            },
            'Selecciona tu método de pago preferido:'
        ),

        // Lista de métodos de pago
        React.createElement('div',
            { style: { marginBottom: '30px' } },
            
            Object.values(PAYMENT_METHODS)
                .filter(method => method.available)
                .map(method => {
                    const isSelected = selectedMethod === method.id;
                    const fee = total * method.fee;
                    
                    return React.createElement('div',
                        {
                            key: method.id,
                            onClick: () => handleMethodSelect(method.id),
                            style: {
                                border: isSelected ? '2px solid #007bff' : '2px solid #e0e0e0',
                                borderRadius: '12px',
                                padding: '20px',
                                marginBottom: '15px',
                                cursor: 'pointer',
                                background: isSelected ? '#f0f8ff' : 'white',
                                transition: 'all 0.3s ease',
                                position: 'relative'
                            }
                        },
                        
                        React.createElement('div',
                            {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }
                            },
                            
                            React.createElement('div',
                                {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '15px'
                                    }
                                },
                                
                                React.createElement('div',
                                    {
                                        style: {
                                            fontSize: '2.5rem',
                                            minWidth: '60px',
                                            textAlign: 'center'
                                        }
                                    },
                                    method.icon
                                ),
                                
                                React.createElement('div', null,
                                    React.createElement('h4',
                                        {
                                            style: {
                                                margin: '0 0 5px 0',
                                                fontSize: '1.2rem',
                                                color: '#333'
                                            }
                                        },
                                        method.name
                                    ),
                                    React.createElement('p',
                                        {
                                            style: {
                                                margin: '0 0 5px 0',
                                                color: '#666',
                                                fontSize: '0.9rem'
                                            }
                                        },
                                        method.description
                                    ),
                                    React.createElement('div',
                                        {
                                            style: {
                                                fontSize: '0.8rem',
                                                color: method.fee > 0 ? '#dc3545' : '#28a745'
                                            }
                                        },
                                        method.fee > 0 ? 
                                            `Comisión: ${(method.fee * 100).toFixed(1)}% (${window.formatCOP ? window.formatCOP(fee) : '$' + fee})` :
                                            'Sin comisión'
                                    )
                                )
                            ),
                            
                            React.createElement('div',
                                {
                                    style: {
                                        width: '20px',
                                        height: '20px',
                                        border: '2px solid ' + (isSelected ? '#007bff' : '#ccc'),
                                        borderRadius: '50%',
                                        background: isSelected ? '#007bff' : 'white',
                                        position: 'relative'
                                    }
                                },
                                isSelected && React.createElement('div',
                                    {
                                        style: {
                                            width: '8px',
                                            height: '8px',
                                            background: 'white',
                                            borderRadius: '50%',
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)'
                                        }
                                    }
                                )
                            )
                        )
                    );
                })
        ),

        // Mostrar total con comisión
        selectedMethod && React.createElement('div',
            {
                style: {
                    background: '#f8f9fa',
                    padding: '20px',
                    borderRadius: '10px',
                    marginBottom: '20px',
                    border: '1px solid #e0e0e0'
                }
            },
            React.createElement('h4',
                {
                    style: {
                        margin: '0 0 10px 0',
                        color: '#333'
                    }
                },
                '💰 Resumen del Pago'
            ),
            React.createElement('div',
                {
                    style: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '8px'
                    }
                },
                React.createElement('span', null, 'Subtotal del pedido:'),
                React.createElement('span', { style: { fontWeight: 'bold' } }, 
                    window.formatCOP ? window.formatCOP(total) : '$' + total
                )
            ),
            paymentData && paymentData.fee > 0 && React.createElement('div',
                {
                    style: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '8px',
                        color: '#dc3545'
                    }
                },
                React.createElement('span', null, `Comisión ${paymentData.methodName || 'Método'}:`),
                React.createElement('span', { style: { fontWeight: 'bold' } },
                    window.formatCOP ? window.formatCOP(paymentData.fee) : '$' + paymentData.fee
                )
            ),
            React.createElement('div',
                {
                    style: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingTop: '10px',
                        borderTop: '2px solid #007bff',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        color: '#007bff'
                    }
                },
                React.createElement('span', null, 'Total a pagar:'),
                React.createElement('span', null,
                    window.formatCOP ? window.formatCOP((paymentData && paymentData.finalTotal) || total) : '$' + ((paymentData && paymentData.finalTotal) || total)
                )
            )
        ),

        // Error message
        error && React.createElement('div',
            {
                style: {
                    background: '#f8d7da',
                    color: '#721c24',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    border: '1px solid #f5c6cb'
                }
            },
            '❌ ' + error
        ),

        // Botones de navegación
        React.createElement('div',
            {
                style: {
                    display: 'flex',
                    gap: '15px',
                    justifyContent: 'space-between'
                }
            },
            
            React.createElement('button',
                {
                    onClick: onBack,
                    style: {
                        padding: '12px 24px',
                        background: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        flex: '0 0 auto'
                    }
                },
                '← Volver a Envío'
            ),
            
            React.createElement('button',
                {
                    onClick: handleContinue,
                    disabled: loading || !selectedMethod,
                    style: {
                        padding: '12px 24px',
                        background: loading || !selectedMethod ? '#6c757d' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        cursor: loading || !selectedMethod ? 'not-allowed' : 'pointer',
                        flex: '1'
                    }
                },
                loading ? '⏳ Procesando...' : '✅ Confirmar Pago'
            )
        )
    );
}

// ======================
// COMPONENTE DE CONFIRMACIÓN DE PEDIDO
// ======================

function OrderConfirmation({ cartItems, shippingData, paymentData, total, onConfirm, onBack }) {
    const [processing, setProcessing] = React.useState(false);
    const [orderPlaced, setOrderPlaced] = React.useState(false);
    const [orderNumber, setOrderNumber] = React.useState('');
    
    // Debug: Log de datos recibidos
    console.log('🗋 OrderConfirmation - Datos recibidos:', {
        cartItems: cartItems?.length || 0,
        shippingData: shippingData ? Object.keys(shippingData) : 'undefined',
        paymentData: paymentData ? Object.keys(paymentData) : 'undefined',
        total
    });

    const handleConfirmOrder = async () => {
        setProcessing(true);
        
        try {
            // Simular procesamiento del pedido
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Generar número de orden
            const orderNum = 'VP-' + Date.now().toString().slice(-8);
            setOrderNumber(orderNum);
            setOrderPlaced(true);
            
            // Limpiar carrito
            if (window.cartManager) {
                window.cartManager.clearCart();
            }
            
            console.log('✅ Pedido confirmado:', {
                orderNumber: orderNum,
                items: cartItems,
                shipping: shippingData,
                payment: paymentData,
                total: paymentData.finalTotal || total
            });
            
        } catch (error) {
            console.error('❌ Error procesando pedido:', error);
            alert('❌ Error procesando el pedido. Por favor intenta nuevamente.');
        } finally {
            setProcessing(false);
        }
    };
    
    if (orderPlaced) {
        return React.createElement('div',
            {
                style: {
                    background: 'white',
                    padding: '40px',
                    borderRadius: '15px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    maxWidth: '600px',
                    margin: '0 auto',
                    textAlign: 'center'
                }
            },
            
            React.createElement('div',
                {
                    style: {
                        fontSize: '4rem',
                        marginBottom: '20px'
                    }
                },
                '✅'
            ),
            
            React.createElement('h2',
                {
                    style: {
                        color: '#28a745',
                        marginBottom: '20px',
                        fontSize: '2rem'
                    }
                },
                '¡Pedido Confirmado!'
            ),
            
            React.createElement('div',
                {
                    style: {
                        background: '#d4edda',
                        color: '#155724',
                        padding: '20px',
                        borderRadius: '10px',
                        marginBottom: '30px',
                        border: '1px solid #c3e6cb'
                    }
                },
                React.createElement('h3', { style: { margin: '0 0 10px 0' } }, 'Número de Pedido:'),
                React.createElement('div', 
                    { style: { fontSize: '1.5rem', fontWeight: 'bold' } }, 
                    orderNumber
                ),
                React.createElement('p', 
                    { style: { margin: '15px 0 0 0', fontSize: '0.9rem' } },
                    'Guarda este número para seguimiento'
                )
            ),
            
            React.createElement('div',
                {
                    style: {
                        marginBottom: '30px',
                        textAlign: 'left'
                    }
                },
                React.createElement('h4', { style: { marginBottom: '15px' } }, '📧 Próximos pasos:'),
                React.createElement('ul',
                    { style: { paddingLeft: '20px', lineHeight: '1.8' } },
                    React.createElement('li', null, 'Recibirás un email de confirmación'),
                    React.createElement('li', null, 'El pedido será procesado en 24-48 horas'),
                    React.createElement('li', null, 'Te contactaremos para coordinar la entrega'),
                    React.createElement('li', null, 'Tiempo estimado de entrega: 3-5 días hábiles')
                )
            ),
            
            React.createElement('div',
                {
                    style: {
                        display: 'flex',
                        gap: '15px',
                        justifyContent: 'center'
                    }
                },
                React.createElement('button',
                    {
                        onClick: () => {
                            if (window.setCurrentView) {
                                window.setCurrentView('catalog');
                            }
                        },
                        style: {
                            padding: '12px 24px',
                            background: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }
                    },
                    '🛍️ Seguir Comprando'
                ),
                React.createElement('button',
                    {
                        onClick: () => {
                            if (window.setCurrentView) {
                                window.setCurrentView('dashboard');
                            }
                        },
                        style: {
                            padding: '12px 24px',
                            background: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }
                    },
                    '🏠 Ir al Dashboard'
                )
            )
        );
    }

    return React.createElement('div',
        {
            style: {
                background: 'white',
                padding: '30px',
                borderRadius: '15px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                maxWidth: '600px',
                margin: '0 auto'
            }
        },

        React.createElement('h2',
            {
                style: {
                    color: '#333',
                    textAlign: 'center',
                    marginBottom: '30px',
                    fontSize: '1.8rem'
                }
            },
            '✅ Confirmar Pedido'
        ),

        // Resumen del pedido
        React.createElement('div',
            {
                style: {
                    marginBottom: '25px'
                }
            },
            React.createElement('h4', { style: { marginBottom: '15px' } }, '📎 Productos:'),
            cartItems.map(item =>
                React.createElement('div',
                    {
                        key: item.productId,
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '8px 0',
                            borderBottom: '1px solid #e0e0e0'
                        }
                    },
                    React.createElement('span', null, `${item.name} x ${item.quantity}`),
                    React.createElement('span', { style: { fontWeight: 'bold' } },
                        window.formatCOP ? window.formatCOP(item.subtotal) : '$' + item.subtotal
                    )
                )
            )
        ),

        // Datos de envío
        shippingData && Object.keys(shippingData).length > 0 && React.createElement('div',
            {
                style: {
                    marginBottom: '25px',
                    background: '#f8f9fa',
                    padding: '15px',
                    borderRadius: '8px'
                }
            },
            React.createElement('h4', { style: { marginBottom: '10px' } }, '📦 Datos de Envío:'),
            React.createElement('p', { style: { margin: '5px 0' } }, 
                `${shippingData.firstName || 'N/A'} ${shippingData.lastName || 'N/A'}`
            ),
            React.createElement('p', { style: { margin: '5px 0' } }, shippingData.email || 'N/A'),
            React.createElement('p', { style: { margin: '5px 0' } }, shippingData.phone || 'N/A'),
            React.createElement('p', { style: { margin: '5px 0' } }, 
                `${shippingData.address || 'N/A'}, ${shippingData.city || 'N/A'}, ${shippingData.department || 'N/A'}`
            ),
            shippingData.instructions && React.createElement('p', 
                { style: { margin: '5px 0', fontStyle: 'italic' } }, 
                `Instrucciones: ${shippingData.instructions}`
            )
        ),

        // Método de pago
        paymentData && Object.keys(paymentData).length > 0 && React.createElement('div',
            {
                style: {
                    marginBottom: '25px',
                    background: '#f8f9fa',
                    padding: '15px',
                    borderRadius: '8px'
                }
            },
            React.createElement('h4', { style: { marginBottom: '10px' } }, '💳 Método de Pago:'),
            React.createElement('p', { style: { margin: '5px 0' } }, paymentData.methodName || 'Método no seleccionado'),
            paymentData.fee > 0 && React.createElement('p', 
                { style: { margin: '5px 0', color: '#dc3545' } }, 
                `Comisión: ${window.formatCOP ? window.formatCOP(paymentData.fee) : '$' + paymentData.fee}`
            )
        ),

        // Total final
        React.createElement('div',
            {
                style: {
                    background: '#e7f3ff',
                    padding: '20px',
                    borderRadius: '10px',
                    marginBottom: '25px',
                    textAlign: 'center'
                }
            },
            React.createElement('h3',
                {
                    style: {
                        margin: '0 0 10px 0',
                        color: '#007bff'
                    }
                },
                'Total a Pagar:'
            ),
            React.createElement('div',
                {
                    style: {
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: '#007bff'
                    }
                },
                window.formatCOP ? window.formatCOP(paymentData.finalTotal || total) : '$' + (paymentData.finalTotal || total)
            )
        ),

        // Botones
        React.createElement('div',
            {
                style: {
                    display: 'flex',
                    gap: '15px',
                    justifyContent: 'space-between'
                }
            },
            
            React.createElement('button',
                {
                    onClick: onBack,
                    disabled: processing,
                    style: {
                        padding: '12px 24px',
                        background: processing ? '#6c757d' : '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        cursor: processing ? 'not-allowed' : 'pointer',
                        flex: '0 0 auto'
                    }
                },
                '← Volver al Pago'
            ),
            
            React.createElement('button',
                {
                    onClick: handleConfirmOrder,
                    disabled: processing,
                    style: {
                        padding: '12px 24px',
                        background: processing ? '#ffc107' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        cursor: processing ? 'wait' : 'pointer',
                        flex: '1'
                    }
                },
                processing ? '⏳ Procesando Pedido...' : '🚀 Confirmar y Pagar'
            )
        )
    );
}

// ======================
// COMPONENTE PRINCIPAL DE CHECKOUT
// ======================

function CheckoutView() {
    const [currentStep, setCurrentStep] = React.useState(CHECKOUT_STEPS.SHIPPING);
    const [cartItems, setCartItems] = React.useState([]);
    const [shippingData, setShippingData] = React.useState({});
    const [paymentData, setPaymentData] = React.useState({});
    const [orderData, setOrderData] = React.useState(null);
    
    // Debug: Log inicial
    console.log('🛜 CheckoutView - Estado inicial:', {
        currentStep,
        shippingData: shippingData ? Object.keys(shippingData) : 'undefined',
        paymentData: paymentData ? Object.keys(paymentData) : 'undefined'
    });
    
    // Monitor cambios en paymentData
    React.useEffect(() => {
        console.log('📋 PaymentData actualizado:', paymentData ? Object.keys(paymentData) : 'undefined');
    }, [paymentData]);
    
    // Cargar items del carrito
    React.useEffect(() => {
        if (window.cartManager) {
            const items = window.cartManager.getItems();
            setCartItems(items);
            
            if (items.length === 0) {
                alert('🛒 Tu carrito está vacío. Agrega algunos productos antes de continuar.');
                if (window.setCurrentView) {
                    window.setCurrentView('catalog');
                }
            }
        }
    }, []);
    
    // Calcular totales
    const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    const taxes = subtotal * 0.19; // 19% IVA
    const shipping = subtotal > 100000 ? 0 : 15000;
    const total = subtotal + taxes + shipping;

    const handlePaymentBack = () => {
        setCurrentStep(CHECKOUT_STEPS.SHIPPING);
    };
    
    const handleConfirmBack = () => {
        setCurrentStep(CHECKOUT_STEPS.PAYMENT);
    };

    const handleBackToCart = () => {
        if (window.setCurrentView) {
            window.setCurrentView('cart');
        }
    };

    // Renderizar paso actual
    const renderCurrentStep = () => {
        switch (currentStep) {
            case CHECKOUT_STEPS.SHIPPING:
                return React.createElement(ShippingForm, {
                    shippingData,
                    onShippingChange: setShippingData,
                    onNext: () => setCurrentStep(CHECKOUT_STEPS.PAYMENT)
                });
                
            case CHECKOUT_STEPS.PAYMENT:
                return React.createElement(PaymentMethodSelector, {
                    paymentData,
                    onPaymentChange: setPaymentData,
                    onNext: () => setCurrentStep(CHECKOUT_STEPS.REVIEW),
                    onBack: handlePaymentBack,
                    total
                });
                
            case CHECKOUT_STEPS.REVIEW:
                // Verificar que tenemos los datos necesarios
                if (!shippingData || Object.keys(shippingData).length === 0) {
                    console.error('❌ Error: Datos de envío perdidos, regresando a paso de envío');
                    setCurrentStep(CHECKOUT_STEPS.SHIPPING);
                    return React.createElement('div',
                        { style: { textAlign: 'center', padding: '40px' } },
                        React.createElement('h3', null, '⚠️ Redirigiendo...'),
                        React.createElement('p', null, 'Faltan datos de envío')
                    );
                }
                
                if (!paymentData || Object.keys(paymentData).length === 0) {
                    console.error('❌ Error: Datos de pago perdidos, regresando a paso de pago');
                    setCurrentStep(CHECKOUT_STEPS.PAYMENT);
                    return React.createElement('div',
                        { style: { textAlign: 'center', padding: '40px' } },
                        React.createElement('h3', null, '⚠️ Redirigiendo...'),
                        React.createElement('p', null, 'Faltan datos de pago')
                    );
                }
                
                return React.createElement(OrderConfirmation, {
                    cartItems,
                    shippingData,
                    paymentData,
                    total,
                    onBack: handleConfirmBack
                });
                
            default:
                return React.createElement('div',
                    { style: { textAlign: 'center', padding: '40px' } },
                    React.createElement('h2', null, '😧 En construcción'),
                    React.createElement('p', null, `Paso: ${currentStep}`)
                );
        }
    };

    if (cartItems.length === 0) {
        return React.createElement('div',
            { style: { textAlign: 'center', padding: '40px' } },
            React.createElement('h2', null, '🛒 Carrito Vacío'),
            React.createElement('p', null, 'Agrega productos antes de continuar al checkout.')
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

        // Header del checkout
        React.createElement('div',
            {
                style: {
                    background: 'white',
                    padding: '20px',
                    borderRadius: '15px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    marginBottom: '30px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }
            },
            
            React.createElement('h1',
                { style: { color: '#333', margin: 0 } },
                '🛒 Checkout - VentasPet'
            ),
            
            React.createElement('button',
                {
                    onClick: handleBackToCart,
                    style: {
                        padding: '10px 20px',
                        background: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }
                },
                '← Volver al Carrito'
            )
        ),

        // Indicador de pasos
        React.createElement('div',
            {
                style: {
                    background: 'white',
                    padding: '20px',
                    borderRadius: '15px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    marginBottom: '30px',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '20px'
                }
            },
            
            Object.values(CHECKOUT_STEPS).slice(0, 3).map((step, index) => {
                const isActive = step === currentStep;
                const isCompleted = Object.values(CHECKOUT_STEPS).indexOf(currentStep) > index;
                
                return React.createElement('div',
                    {
                        key: step,
                        style: {
                            padding: '10px 20px',
                            borderRadius: '20px',
                            background: isActive ? '#007bff' : (isCompleted ? '#28a745' : '#e0e0e0'),
                            color: isActive || isCompleted ? 'white' : '#666',
                            fontWeight: 'bold',
                            fontSize: '14px'
                        }
                    },
                    `${index + 1}. ${step === 'shipping' ? 'Envío' : step === 'payment' ? 'Pago' : 'Confirmación'}`
                );
            })
        ),

        // Layout principal
        React.createElement('div',
            {
                style: {
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr',
                    gap: '30px'
                }
            },
            
            // Contenido principal (formularios)
            React.createElement('div', null, renderCurrentStep()),
            
            // Resumen del pedido
            React.createElement('div',
                {
                    style: {
                        background: 'white',
                        padding: '30px',
                        borderRadius: '15px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        height: 'fit-content',
                        position: 'sticky',
                        top: '20px'
                    }
                },
                
                React.createElement('h3',
                    { style: { marginBottom: '20px', color: '#333' } },
                    '📋 Resumen del Pedido'
                ),
                
                // Items del carrito
                cartItems.map(item =>
                    React.createElement('div',
                        {
                            key: item.productId,
                            style: {
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '10px 0',
                                borderBottom: '1px solid #e0e0e0'
                            }
                        },
                        React.createElement('div', null,
                            React.createElement('div', { style: { fontWeight: 'bold' } }, item.name),
                            React.createElement('div', { style: { fontSize: '14px', color: '#666' } }, `${item.quantity} x ${window.formatCOP ? window.formatCOP(item.price) : '$' + item.price}`)
                        ),
                        React.createElement('div', { style: { fontWeight: 'bold' } }, window.formatCOP ? window.formatCOP(item.subtotal) : '$' + item.subtotal)
                    )
                ),
                
                // Totales
                React.createElement('div', { style: { marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #e0e0e0' } },
                    React.createElement('div',
                        { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' } },
                        React.createElement('span', null, 'Subtotal:'),
                        React.createElement('span', { style: { fontWeight: 'bold' } }, window.formatCOP ? window.formatCOP(subtotal) : '$' + subtotal)
                    ),
                    React.createElement('div',
                        { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' } },
                        React.createElement('span', null, 'IVA (19%):'),
                        React.createElement('span', { style: { fontWeight: 'bold' } }, window.formatCOP ? window.formatCOP(taxes) : '$' + taxes)
                    ),
                    React.createElement('div',
                        { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px' } },
                        React.createElement('span', null, 'Envío:'),
                        React.createElement('span', 
                            { style: { fontWeight: 'bold', color: shipping === 0 ? '#28a745' : '#333' } }, 
                            shipping === 0 ? 'GRATIS' : (window.formatCOP ? window.formatCOP(shipping) : '$' + shipping)
                        )
                    ),
                    React.createElement('div',
                        { 
                            style: { 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                color: '#007bff',
                                paddingTop: '15px',
                                borderTop: '2px solid #007bff'
                            } 
                        },
                        React.createElement('span', null, 'Total:'),
                        React.createElement('span', null, window.formatCOP ? window.formatCOP(total) : '$' + total)
                    )
                )
            )
        )
    );
}

// Exportar globalmente
window.CheckoutView = CheckoutView;

console.log('✅ Sistema de checkout cargado');
console.log('💳 Componente disponible: CheckoutView');