// Privacy Settings - Configuración de Privacidad para VelyKapet
// Incluye términos, cookies, datos personales, etc.

console.log('🔒 Cargando Privacy Settings Component...');

window.PrivacySettingsComponent = function() {
    const [activeTab, setActiveTab] = React.useState('general');
    const [settings, setSettings] = React.useState({
        cookies: {
            necessary: true,
            analytics: false,
            marketing: false,
            personalization: true
        },
        data: {
            shareWithPartners: false,
            emailMarketing: true,
            smsMarketing: false,
            personalizedAds: false
        },
        account: {
            publicProfile: false,
            showPurchases: false,
            showReviews: true
        }
    });
    
    React.useEffect(() => {
        // Cargar configuraciones guardadas
        const savedSettings = localStorage.getItem('velykapet_privacy_settings');
        if (savedSettings) {
            try {
                setSettings(JSON.parse(savedSettings));
            } catch (e) {
                console.warn('Error cargando configuraciones de privacidad:', e);
            }
        }
    }, []);
    
    const handleSettingChange = (category, setting, value) => {
        console.log(`🔒 Cambiando configuración: ${category}.${setting} = ${value}`);
        const newSettings = {
            ...settings,
            [category]: {
                ...settings[category],
                [setting]: value
            }
        };
        setSettings(newSettings);
        localStorage.setItem('velykapet_privacy_settings', JSON.stringify(newSettings));
    };
    
    const tabs = [
        { id: 'general', label: 'General', icon: '🔒' },
        { id: 'cookies', label: 'Cookies', icon: '🍪' },
        { id: 'data', label: 'Datos', icon: '📊' },
        { id: 'account', label: 'Cuenta', icon: '👤' }
    ];
    
    const renderToggle = (category, setting, label, description) => {
        const isChecked = settings[category][setting];
        const isDisabled = category === 'cookies' && setting === 'necessary'; // Cookies necesarias no se pueden desactivar
        
        return React.createElement('div',
            {
                key: `${category}_${setting}`,
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    marginBottom: '15px'
                }
            },
            React.createElement('div',
                { style: { flex: 1, marginRight: '20px' } },
                React.createElement('h4',
                    { 
                        style: { 
                            margin: '0 0 8px 0',
                            color: '#333',
                            fontSize: '16px',
                            fontWeight: '600'
                        } 
                    },
                    label
                ),
                React.createElement('p',
                    { 
                        style: { 
                            margin: 0,
                            color: '#666',
                            fontSize: '14px',
                            lineHeight: '1.4'
                        } 
                    },
                    description
                ),
                isDisabled && React.createElement('p',
                    {
                        style: {
                            margin: '5px 0 0 0',
                            color: '#999',
                            fontSize: '12px',
                            fontStyle: 'italic'
                        }
                    },
                    'Requerido para el funcionamiento básico'
                )
            ),
            React.createElement('div',
                {
                    className: 'toggle-switch',
                    onClick: isDisabled ? null : () => handleSettingChange(category, setting, !isChecked),
                    style: {
                        width: '50px',
                        height: '26px',
                        borderRadius: '13px',
                        background: isChecked ? '#E45A84' : '#ddd',
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        opacity: isDisabled ? 0.6 : 1
                    }
                },
                React.createElement('div',
                    {
                        style: {
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            background: 'white',
                            position: 'absolute',
                            top: '2px',
                            left: isChecked ? '26px' : '2px',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                        }
                    }
                )
            )
        );
    };
    
    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return React.createElement('div',
                    { className: 'tab-content' },
                    React.createElement('div',
                        {
                            style: {
                                background: 'linear-gradient(135deg, #E45A84, #D94876)',
                                color: 'white',
                                padding: '30px',
                                borderRadius: '15px',
                                marginBottom: '30px',
                                textAlign: 'center'
                            }
                        },
                        React.createElement('div', { style: { fontSize: '3rem', marginBottom: '15px' } }, '🔒'),
                        React.createElement('h2', { style: { margin: '0 0 10px 0' } }, 'Configuración de Privacidad'),
                        React.createElement('p', { style: { margin: 0, opacity: 0.9 } }, 
                            'Controla cómo VelyKapet maneja tu información personal'
                        )
                    ),
                    React.createElement('div',
                        {
                            style: {
                                background: 'white',
                                padding: '25px',
                                borderRadius: '12px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                            }
                        },
                        React.createElement('h3', { style: { marginTop: 0, color: '#333' } }, '📋 Información General'),
                        React.createElement('ul',
                            { style: { color: '#666', lineHeight: '1.6' } },
                            React.createElement('li', null, 'Recopilamos información para mejorar tu experiencia de compra'),
                            React.createElement('li', null, 'Nunca vendemos tu información personal a terceros'),
                            React.createElement('li', null, 'Puedes modificar estas configuraciones en cualquier momento'),
                            React.createElement('li', null, 'Algunas funciones pueden requerir ciertos permisos')
                        )
                    )
                );
                
            case 'cookies':
                return React.createElement('div',
                    { className: 'tab-content' },
                    React.createElement('div',
                        {
                            style: {
                                background: 'white',
                                padding: '25px',
                                borderRadius: '12px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                marginBottom: '20px'
                            }
                        },
                        React.createElement('h3', { style: { marginTop: 0, color: '#333', display: 'flex', alignItems: 'center', gap: '10px' } }, 
                            React.createElement('span', null, '🍪'),
                            React.createElement('span', null, 'Configuración de Cookies')
                        ),
                        React.createElement('p', { style: { color: '#666', marginBottom: '25px' } }, 
                            'Las cookies nos ayudan a personalizar tu experiencia. Puedes elegir qué tipos de cookies aceptar.'
                        )
                    ),
                    renderToggle('cookies', 'necessary', 'Cookies Necesarias', 
                        'Requeridas para el funcionamiento básico del sitio web (carrito, login, etc.)'),
                    renderToggle('cookies', 'analytics', 'Cookies de Análisis', 
                        'Nos ayudan a entender cómo usas el sitio para mejorar la experiencia'),
                    renderToggle('cookies', 'marketing', 'Cookies de Marketing', 
                        'Utilizadas para mostrar anuncios relevantes y medir su efectividad'),
                    renderToggle('cookies', 'personalization', 'Cookies de Personalización', 
                        'Recuerdan tus preferencias para personalizar el contenido')
                );
                
            case 'data':
                return React.createElement('div',
                    { className: 'tab-content' },
                    React.createElement('div',
                        {
                            style: {
                                background: 'white',
                                padding: '25px',
                                borderRadius: '12px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                marginBottom: '20px'
                            }
                        },
                        React.createElement('h3', { style: { marginTop: 0, color: '#333', display: 'flex', alignItems: 'center', gap: '10px' } }, 
                            React.createElement('span', null, '📊'),
                            React.createElement('span', null, 'Uso de Datos')
                        ),
                        React.createElement('p', { style: { color: '#666', marginBottom: '25px' } }, 
                            'Controla cómo utilizamos tus datos para comunicaciones y mejoras del servicio.'
                        )
                    ),
                    renderToggle('data', 'shareWithPartners', 'Compartir con Socios', 
                        'Permitir que compartamos datos agregados (no personales) con socios comerciales'),
                    renderToggle('data', 'emailMarketing', 'Marketing por Email', 
                        'Recibir ofertas especiales y novedades por correo electrónico'),
                    renderToggle('data', 'smsMarketing', 'Marketing por SMS', 
                        'Recibir promociones y actualizaciones por mensaje de texto'),
                    renderToggle('data', 'personalizedAds', 'Anuncios Personalizados', 
                        'Mostrar anuncios basados en tus intereses y historial de compras')
                );
                
            case 'account':
                return React.createElement('div',
                    { className: 'tab-content' },
                    React.createElement('div',
                        {
                            style: {
                                background: 'white',
                                padding: '25px',
                                borderRadius: '12px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                marginBottom: '20px'
                            }
                        },
                        React.createElement('h3', { style: { marginTop: 0, color: '#333', display: 'flex', alignItems: 'center', gap: '10px' } }, 
                            React.createElement('span', null, '👤'),
                            React.createElement('span', null, 'Privacidad de Cuenta')
                        ),
                        React.createElement('p', { style: { color: '#666', marginBottom: '25px' } }, 
                            'Gestiona la visibilidad de tu información de perfil y actividad.'
                        )
                    ),
                    renderToggle('account', 'publicProfile', 'Perfil Público', 
                        'Permitir que otros usuarios vean información básica de tu perfil'),
                    renderToggle('account', 'showPurchases', 'Mostrar Compras', 
                        'Hacer visibles tus compras en tu perfil público (solo productos, no precios)'),
                    renderToggle('account', 'showReviews', 'Mostrar Reseñas', 
                        'Mostrar las reseñas que escribes con tu nombre de usuario'),
                    
                    // Acciones de cuenta
                    React.createElement('div',
                        {
                            style: {
                                background: '#fff3cd',
                                padding: '20px',
                                borderRadius: '12px',
                                border: '1px solid #ffeaa7',
                                marginTop: '20px'
                            }
                        },
                        React.createElement('h4', { style: { margin: '0 0 15px 0', color: '#856404' } }, '⚠️ Acciones de Cuenta'),
                        React.createElement('div',
                            { style: { display: 'flex', gap: '10px', flexWrap: 'wrap' } },
                            React.createElement('button',
                                {
                                    style: {
                                        padding: '10px 20px',
                                        background: '#6c757d',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '14px'
                                    },
                                    onClick: () => {
                                        alert('📧 Se enviará una copia de todos tus datos al correo registrado en 24-48 horas.');
                                    }
                                },
                                '📧 Descargar Mis Datos'
                            ),
                            React.createElement('button',
                                {
                                    style: {
                                        padding: '10px 20px',
                                        background: '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '14px'
                                    },
                                    onClick: () => {
                                        if (confirm('⚠️ ¿Estás seguro? Esta acción eliminará permanentemente tu cuenta y todos tus datos.')) {
                                            alert('🗑️ Solicitud de eliminación enviada. Tu cuenta será eliminada en 7 días. Puedes cancelar contactando soporte.');
                                        }
                                    }
                                },
                                '🗑️ Eliminar Cuenta'
                            )
                        )
                    )
                );
                
            default:
                return React.createElement('div', null, 'Contenido no encontrado');
        }
    };
    
    return React.createElement('div',
        {
            className: 'privacy-settings-container',
            style: {
                maxWidth: '800px',
                margin: '0 auto',
                padding: '20px'
            }
        },
        
        // Tabs
        React.createElement('div',
            {
                className: 'privacy-tabs',
                style: {
                    display: 'flex',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    marginBottom: '25px',
                    overflow: 'hidden',
                    flexWrap: 'wrap'
                }
            },
            ...tabs.map(tab =>
                React.createElement('button',
                    {
                        key: tab.id,
                        onClick: () => setActiveTab(tab.id),
                        style: {
                            flex: 1,
                            minWidth: '120px',
                            padding: '15px 10px',
                            background: activeTab === tab.id ? '#E45A84' : 'transparent',
                            color: activeTab === tab.id ? 'white' : '#666',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: activeTab === tab.id ? '600' : '400',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'all 0.3s ease'
                        },
                        onMouseEnter: (e) => {
                            if (activeTab !== tab.id) {
                                e.target.style.background = '#f8f9fa';
                            }
                        },
                        onMouseLeave: (e) => {
                            if (activeTab !== tab.id) {
                                e.target.style.background = 'transparent';
                            }
                        }
                    },
                    React.createElement('span', { style: { fontSize: '16px' } }, tab.icon),
                    React.createElement('span', null, tab.label)
                )
            )
        ),
        
        // Contenido de la tab activa
        React.createElement('div',
            {
                className: 'tab-content-container',
                style: {
                    minHeight: '400px'
                }
            },
            renderTabContent()
        ),
        
        // Footer con información legal
        React.createElement('div',
            {
                style: {
                    background: 'white',
                    padding: '20px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    marginTop: '25px',
                    textAlign: 'center'
                }
            },
            React.createElement('p',
                { style: { margin: '0 0 15px 0', fontSize: '14px', color: '#666' } },
                '📄 Para más información, consulta nuestros ',
                React.createElement('a',
                    { 
                        href: '#',
                        style: { color: '#E45A84', textDecoration: 'none' },
                        onClick: (e) => {
                            e.preventDefault();
                            if (window.setCurrentView) {
                                window.setCurrentView('terms');
                            }
                        }
                    },
                    'Términos y Condiciones'
                ),
                ' y ',
                React.createElement('a',
                    { 
                        href: '#',
                        style: { color: '#E45A84', textDecoration: 'none' },
                        onClick: (e) => {
                            e.preventDefault();
                            if (window.setCurrentView) {
                                window.setCurrentView('policy');
                            }
                        }
                    },
                    'Política de Privacidad'
                )
            ),
            React.createElement('p',
                { style: { margin: 0, fontSize: '12px', color: '#999' } },
                'Última actualización: ' + new Date().toLocaleDateString()
            )
        )
    );
};

console.log('✅ Privacy Settings Component cargado');
console.log('🔍 PrivacySettingsComponent disponible:', !!window.PrivacySettingsComponent);