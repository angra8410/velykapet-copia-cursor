// Checkout Moderno para VentasPet
// Múltiples métodos de pago estilo Rappi/Uber

console.log('💳 Cargando Modern Checkout Component...');

window.ModernCheckoutComponent = function() {
    const [currentStep, setCurrentStep] = React.useState(1); // 1: Info, 2: Pago, 3: Confirmación
    const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState(null);
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [orderData, setOrderData] = React.useState({
        email: '',
        phone: '',
        address: '',
        city: '',
        notes: ''
    });

    // Métodos de pago disponibles
    const paymentMethods = [
        {
            id: 'credit_card',
            name: 'Tarjeta de Crédito/Débito',
            icon: '💳',
            description: 'Visa, MasterCard, American Express',
            fee: 0,
            popular: true
        },
        {
            id: 'pse',
            name: 'PSE',
            icon: '🏦',
            description: 'Pagos Seguros en Línea',
            fee: 0,
            secure: true
        },
        {
            id: 'nequi',
            name: 'Nequi',
            icon: '📱',
            description: 'Pago con tu app Nequi',
            fee: 0,
            instant: true
        },
        {
            id: 'daviplata',
            name: 'DaviPlata',
            icon: '📲',
            description: 'Pago con tu app DaviPlata',
            fee: 0,
            instant: true
        },
        {
            id: 'efecty',
            name: 'Efecty',
            icon: '🏪',
            description: 'Paga en puntos Efecty',
            fee: 2500,
            offline: true
        },
        {
            id: 'baloto',
            name: 'Baloto',
            icon: '🎲',
            description: 'Paga en puntos Baloto',
            fee: 3000,
            offline: true
        },
        {
            id: 'mercadopago',
            name: 'MercadoPago',
            icon: '🌟',
            description: 'Checkout seguro MercadoPago',
            fee: 0,
            recommended: true
        }
    ];

    const handleInputChange = (field, value) => {
        setOrderData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePaymentSelect = (methodId) => {
        setSelectedPaymentMethod(methodId);
    };

    const handleContinueToPayment = () => {
        if (orderData.email && orderData.phone && orderData.address) {
            setCurrentStep(2);
        } else {
            alert('Por favor completa todos los campos obligatorios');
        }
    };

    const handleProcessPayment = async () => {
        if (!selectedPaymentMethod) {
            alert('Por favor selecciona un método de pago');
            return;
        }

        setIsProcessing(true);

        try {
            // Simular procesamiento de pago
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Crear orden
            const cartItems = window.cartManager ? window.cartManager.getItems() : [];
            const total = window.cartManager ? window.cartManager.getTotalPrice() : 0;
            
            const orderPayload = {
                items: cartItems,
                customerInfo: orderData,
                paymentMethod: selectedPaymentMethod,
                total: total
            };

            console.log('💳 Procesando orden:', orderPayload);
            
            // Integración con la API para guardar la orden
            if (window.ApiService && typeof window.ApiService.createOrder === 'function') {
                await window.ApiService.createOrder(orderPayload);
                console.log('✅ Orden guardada en el backend');
            } else {
                console.warn('⚠️ API no disponible, no se guardó la orden');
            }
            
            setCurrentStep(3);
            
            // Limpiar carrito después del pago exitoso
            if (window.cartManager) {
                window.cartManager.clearCart();
            }
            
        } catch (error) {
            console.error('❌ Error procesando pago:', error);
            alert('Error procesando el pago. Intenta nuevamente.');
        } finally {
            setIsProcessing(false);
        }
    };

    const getStepIndicator = () => {
        const steps = [
            { number: 1, title: 'Información', icon: '📝' },
            { number: 2, title: 'Pago', icon: '💳' },
            { number: 3, title: 'Confirmación', icon: '✅' }
        ];

        return React.createElement('div',
            {
                className: 'checkout-steps',
                style: {
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '40px',
                    gap: '20px'
                }
            },
            steps.map((step, index) =>
                React.createElement('div',
                    {
                        key: step.number,
                        className: 'step-indicator',
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 20px',
                            borderRadius: '25px',
                            background: currentStep >= step.number ? 
                                'linear-gradient(135deg, var(--primary-color), var(--primary-hover))' : 
                                'var(--gray-100)',
                            color: currentStep >= step.number ? 'white' : 'var(--gray-600)',
                            transition: 'all var(--transition-normal)',
                            opacity: currentStep < step.number ? 0.6 : 1
                        }
                    },
                    React.createElement('span', { style: { fontSize: '18px' } }, step.icon),
                    React.createElement('span', 
                        { className: 'font-secondary font-medium' }, 
                        step.title
                    ),
                    index < steps.length - 1 && React.createElement('span', 
                        { style: { margin: '0 10px', opacity: 0.5 } }, 
                        '→'
                    )
                )
            )
        );
    };

    // Paso 1: Información del cliente
    const renderCustomerInfo = () => {
        return React.createElement('div',
            {
                className: 'customer-info animate-fadeIn card',
                style: { padding: '30px' }
            },
            
            React.createElement('h2',
                { className: 'heading-2', style: { marginBottom: '20px', textAlign: 'center' } },
                '📝 Información de Entrega'
            ),
            
            React.createElement('div',
                { 
                    className: 'form-grid',
                    style: {
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '20px',
                        marginBottom: '30px'
                    }
                },
                
                // Email
                React.createElement('div',
                    { className: 'form-group' },
                    React.createElement('label',
                        { className: 'body-small font-medium', style: { marginBottom: '8px', display: 'block' } },
                        '📧 Email *'
                    ),
                    React.createElement('input',
                        {
                            type: 'email',
                            value: orderData.email,
                            onChange: (e) => handleInputChange('email', e.target.value),
                            placeholder: 'tu@email.com',
                            className: 'font-primary',
                            style: {
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid var(--gray-300)',
                                borderRadius: 'var(--border-radius-lg)',
                                fontSize: 'var(--font-size-base)',
                                transition: 'border-color var(--transition-fast)'
                            },
                            onFocus: (e) => { e.target.style.borderColor = 'var(--primary-color)'; },
                            onBlur: (e) => { e.target.style.borderColor = 'var(--gray-300)'; }
                        }
                    )
                ),
                
                // Teléfono
                React.createElement('div',
                    { className: 'form-group' },
                    React.createElement('label',
                        { className: 'body-small font-medium', style: { marginBottom: '8px', display: 'block' } },
                        '📱 Teléfono *'
                    ),
                    React.createElement('input',
                        {
                            type: 'tel',
                            value: orderData.phone,
                            onChange: (e) => handleInputChange('phone', e.target.value),
                            placeholder: '+57 300 123 4567',
                            className: 'font-primary',
                            style: {
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid var(--gray-300)',
                                borderRadius: 'var(--border-radius-lg)',
                                fontSize: 'var(--font-size-base)',
                                transition: 'border-color var(--transition-fast)'
                            },
                            onFocus: (e) => { e.target.style.borderColor = 'var(--primary-color)'; },
                            onBlur: (e) => { e.target.style.borderColor = 'var(--gray-300)'; }
                        }
                    )
                )
            ),
            
            // Dirección
            React.createElement('div',
                { className: 'form-group', style: { marginBottom: '20px' } },
                React.createElement('label',
                    { className: 'body-small font-medium', style: { marginBottom: '8px', display: 'block' } },
                    '🏠 Dirección de Entrega *'
                ),
                React.createElement('input',
                    {
                        type: 'text',
                        value: orderData.address,
                        onChange: (e) => handleInputChange('address', e.target.value),
                        placeholder: 'Calle 123 # 45-67, Apartamento 101',
                        className: 'font-primary',
                        style: {
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid var(--gray-300)',
                            borderRadius: 'var(--border-radius-lg)',
                            fontSize: 'var(--font-size-base)',
                            transition: 'border-color var(--transition-fast)'
                        },
                        onFocus: (e) => { e.target.style.borderColor = 'var(--primary-color)'; },
                        onBlur: (e) => { e.target.style.borderColor = 'var(--gray-300)'; }
                    }
                )
            ),
            
            // Ciudad
            React.createElement('div',
                { className: 'form-group', style: { marginBottom: '30px' } },
                React.createElement('label',
                    { className: 'body-small font-medium', style: { marginBottom: '8px', display: 'block' } },
                    '🌆 Ciudad'
                ),
                React.createElement('select',
                    {
                        value: orderData.city,
                        onChange: (e) => handleInputChange('city', e.target.value),
                        className: 'font-primary',
                        style: {
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid var(--gray-300)',
                            borderRadius: 'var(--border-radius-lg)',
                            fontSize: 'var(--font-size-base)',
                            background: 'white',
                            transition: 'border-color var(--transition-fast)'
                        },
                        onFocus: (e) => { e.target.style.borderColor = 'var(--primary-color)'; },
                        onBlur: (e) => { e.target.style.borderColor = 'var(--gray-300)'; }
                    },
                    React.createElement('option', { value: '' }, 'Selecciona tu ciudad'),
                    React.createElement('option', { value: 'bogota' }, 'Bogotá'),
                    React.createElement('option', { value: 'medellin' }, 'Medellín'),
                    React.createElement('option', { value: 'cali' }, 'Cali'),
                    React.createElement('option', { value: 'barranquilla' }, 'Barranquilla'),
                    React.createElement('option', { value: 'cartagena' }, 'Cartagena')
                )
            ),
            
            // Botón continuar
            React.createElement('div',
                { style: { textAlign: 'center' } },
                React.createElement('button',
                    {
                        onClick: handleContinueToPayment,
                        className: 'btn btn-primary btn-lg',
                        style: { minWidth: '200px' }
                    },
                    React.createElement('span', { style: { marginRight: '8px' } }, '💳'),
                    'Continuar al Pago'
                )
            )
        );
    };

    // Paso 2: Selección de método de pago
    const renderPaymentMethods = () => {
        return React.createElement('div',
            {
                className: 'payment-methods animate-fadeIn',
                style: { maxWidth: '800px', margin: '0 auto' }
            },
            
            React.createElement('h2',
                { className: 'heading-2', style: { marginBottom: '30px', textAlign: 'center' } },
                '💳 Método de Pago'
            ),
            
            React.createElement('div',
                {
                    className: 'payment-grid',
                    style: {
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '16px',
                        marginBottom: '30px'
                    }
                },
                
                paymentMethods.map((method, index) =>
                    React.createElement('div',
                        {
                            key: method.id,
                            className: `payment-method card hover-lift animate-fadeIn animate-delay-${index * 100}`,
                            onClick: () => handlePaymentSelect(method.id),
                            style: {
                                padding: '20px',
                                cursor: 'pointer',
                                border: selectedPaymentMethod === method.id ? 
                                    '3px solid var(--primary-color)' : 
                                    '2px solid var(--gray-200)',
                                background: selectedPaymentMethod === method.id ? 
                                    'var(--primary-ultra-light)' : 
                                    'white',
                                position: 'relative',
                                transition: 'all var(--transition-normal)',
                                animationFillMode: 'both'
                            }
                        },
                        
                        // Badge especial
                        (method.popular || method.recommended || method.secure) && React.createElement('div',
                            {
                                style: {
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    background: method.popular ? '#FF6B35' : 
                                               method.recommended ? '#28a745' : '#17a2b8',
                                    color: 'white',
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    fontSize: '11px',
                                    fontWeight: '600'
                                }
                            },
                            method.popular ? 'POPULAR' : 
                            method.recommended ? 'RECOMENDADO' : 
                            method.secure ? 'SEGURO' : ''
                        ),
                        
                        // Header del método
                        React.createElement('div',
                            {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: '12px'
                                }
                            },
                            React.createElement('span', { style: { fontSize: '24px', marginRight: '12px' } }, method.icon),
                            React.createElement('h4',
                                { className: 'heading-4', style: { margin: 0 } },
                                method.name
                            )
                        ),
                        
                        // Descripción
                        React.createElement('p',
                            {
                                className: 'body-small',
                                style: { color: 'var(--gray-600)', marginBottom: '12px' }
                            },
                            method.description
                        ),
                        
                        // Fee
                        React.createElement('div',
                            {
                                className: 'payment-fee',
                                style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
                            },
                            React.createElement('span',
                                {
                                    className: method.instant ? 'text-success' : method.offline ? 'text-warning' : 'body-small',
                                    style: { fontSize: '12px', fontWeight: '500' }
                                },
                                method.instant ? '⚡ Inmediato' : 
                                method.offline ? '🏪 Presencial' : 
                                '🔒 Seguro'
                            ),
                            React.createElement('span',
                                {
                                    className: 'price',
                                    style: { 
                                        color: method.fee === 0 ? 'var(--success-color)' : 'var(--warning-color)',
                                        fontSize: '14px'
                                    }
                                },
                                method.fee === 0 ? 'GRATIS' : `+ ${window.formatCOP ? window.formatCOP(method.fee) : '$' + method.fee}`
                            )
                        )
                    )
                )
            ),
            
            // Botones
            React.createElement('div',
                {
                    style: {
                        display: 'flex',
                        gap: '16px',
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                    }
                },
                React.createElement('button',
                    {
                        onClick: () => setCurrentStep(1),
                        className: 'btn btn-secondary',
                        style: { minWidth: '120px' }
                    },
                    React.createElement('span', { style: { marginRight: '8px' } }, '←'),
                    'Atrás'
                ),
                React.createElement('button',
                    {
                        onClick: handleProcessPayment,
                        disabled: !selectedPaymentMethod || isProcessing,
                        className: 'btn btn-primary btn-lg',
                        style: { minWidth: '200px', opacity: !selectedPaymentMethod ? 0.6 : 1 }
                    },
                    isProcessing ? [
                        React.createElement('div', { key: 'spinner', className: 'loader', style: { width: '16px', height: '16px', marginRight: '8px' } }),
                        'Procesando...'
                    ] : [
                        React.createElement('span', { key: 'icon', style: { marginRight: '8px' } }, '🚀'),
                        'Pagar Ahora'
                    ]
                )
            )
        );
    };

    // Paso 3: Confirmación
    const renderConfirmation = () => {
        return React.createElement('div',
            {
                className: 'payment-confirmation animate-fadeIn card',
                style: { padding: '40px', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }
            },
            
            React.createElement('div',
                { className: 'success-icon animate-bounce', style: { fontSize: '4rem', marginBottom: '20px' } },
                '✅'
            ),
            
            React.createElement('h2',
                { className: 'heading-2', style: { marginBottom: '16px', color: 'var(--success-color)' } },
                '¡Pago Exitoso!'
            ),
            
            React.createElement('p',
                { className: 'body-large', style: { marginBottom: '30px', color: 'var(--gray-700)' } },
                'Tu orden ha sido procesada correctamente. Recibirás un email de confirmación en breve.'
            ),
            
            React.createElement('div',
                {
                    style: {
                        background: 'var(--gray-50)',
                        padding: '20px',
                        borderRadius: 'var(--border-radius-lg)',
                        marginBottom: '30px'
                    }
                },
                React.createElement('p',
                    { className: 'body-small', style: { marginBottom: '8px' } },
                    'Número de Orden:'
                ),
                React.createElement('p',
                    { className: 'font-mono font-bold', style: { fontSize: '18px' } },
                    '#VP' + Date.now().toString().slice(-6)
                )
            ),
            
            React.createElement('button',
                {
                    onClick: () => {
                        setCurrentStep(1);
                        setSelectedPaymentMethod(null);
                        setOrderData({ email: '', phone: '', address: '', city: '', notes: '' });
                        if (window.setCurrentView) {
                            window.setCurrentView('catalog');
                        }
                    },
                    className: 'btn btn-primary btn-lg'
                },
                React.createElement('span', { style: { marginRight: '8px' } }, '🛍️'),
                'Seguir Comprando'
            )
        );
    };

    return React.createElement('div',
        {
            className: 'modern-checkout',
            style: {
                maxWidth: '1000px',
                margin: '0 auto',
                padding: '20px'
            }
        },
        
        getStepIndicator(),
        
        currentStep === 1 && renderCustomerInfo(),
        currentStep === 2 && renderPaymentMethods(),
        currentStep === 3 && renderConfirmation()
    );
};

console.log('✅ Modern Checkout Component cargado');