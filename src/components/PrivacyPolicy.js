// Privacy Policy - Política de Privacidad Profesional para VelyKapet
console.log('🔒 Iniciando carga de Privacy Policy Component...');

// Componente profesional y completo con navegación
window.PrivacyPolicyComponent = function() {
    const [activeSection, setActiveSection] = React.useState('overview');
    const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
    
    // Manejar cambios de tamaño de ventana para responsividad
    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const sections = [
        { id: 'overview', title: 'Resumen', icon: '📋' },
        { id: 'collection', title: 'Recolección', icon: '📊' },
        { id: 'usage', title: 'Uso de Datos', icon: '🎯' },
        { id: 'sharing', title: 'Compartir', icon: '🤝' },
        { id: 'cookies', title: 'Cookies', icon: '🍪' },
        { id: 'security', title: 'Seguridad', icon: '🔐' },
        { id: 'rights', title: 'Tus Derechos', icon: '⚖️' },
        { id: 'contact', title: 'Contacto', icon: '📞' }
    ];
    
    const renderSectionContent = () => {
        switch (activeSection) {
            case 'overview':
                return React.createElement('div', null,
                    React.createElement('h3', { style: { color: '#E45A84', marginBottom: '20px' } }, '📋 Resumen de Privacidad'),
                    React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6' } },
                        'En VelyKapet, valoramos tu privacidad y estamos comprometidos con la protección de tu información personal. Esta política de privacidad explica cómo recopilamos, utilizamos, compartimos y protegemos tu información.'
                    ),
                    React.createElement('div', 
                        { style: { background: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '20px' } },
                        React.createElement('h4', { style: { color: '#333', marginTop: 0 } }, '🎯 Puntos Clave'),
                        React.createElement('ul', { style: { lineHeight: '1.6', paddingLeft: '20px', margin: 0 } },
                            React.createElement('li', null, 'Recopilamos información para mejorar tu experiencia de compra'),
                            React.createElement('li', null, 'Nunca vendemos tu información personal a terceros'),
                            React.createElement('li', null, 'Utilizamos cookies para personalizar tu experiencia'),
                            React.createElement('li', null, 'Puedes controlar tus preferencias de privacidad en cualquier momento'),
                            React.createElement('li', null, 'Cumplimos con las leyes de protección de datos de Colombia')
                        )
                    ),
                    React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6', fontStyle: 'italic', color: '#666' } },
                        'Última actualización: ' + new Date().toLocaleDateString() + '. Te notificaremos sobre cambios importantes en esta política.'
                    )
                );
                
            case 'collection':
                return React.createElement('div', null,
                    React.createElement('h3', { style: { color: '#E45A84', marginBottom: '20px' } }, '📊 Información que Recopilamos'),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Información que Proporcionas Directamente'),
                    React.createElement('ul', { style: { lineHeight: '1.6', paddingLeft: '20px', marginBottom: '20px' } },
                        React.createElement('li', null, React.createElement('strong', null, 'Cuenta:'), ' Nombre, email, teléfono, dirección'),
                        React.createElement('li', null, React.createElement('strong', null, 'Compras:'), ' Historial de pedidos, preferencias de productos'),
                        React.createElement('li', null, React.createElement('strong', null, 'Comunicaciones:'), ' Mensajes, reseñas, consultas al servicio al cliente'),
                        React.createElement('li', null, React.createElement('strong', null, 'Encuestas:'), ' Opiniones sobre productos y servicios')
                    ),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Información Recopilada Automáticamente'),
                    React.createElement('ul', { style: { lineHeight: '1.6', paddingLeft: '20px', marginBottom: '20px' } },
                        React.createElement('li', null, React.createElement('strong', null, 'Navegación:'), ' Páginas visitadas, tiempo en el sitio, clicks'),
                        React.createElement('li', null, React.createElement('strong', null, 'Dispositivo:'), ' Tipo de dispositivo, navegador, sistema operativo'),
                        React.createElement('li', null, React.createElement('strong', null, 'Ubicación:'), ' Dirección IP, ubicación aproximada (con tu consentimiento)'),
                        React.createElement('li', null, React.createElement('strong', null, 'Cookies:'), ' Identificadores únicos, preferencias, sesiones')
                    ),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Información de Mascotas (Opcional)'),
                    React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6' } },
                        'Puedes proporcionarnos información sobre tus mascotas (raza, edad, peso, necesidades especiales) para recibir recomendaciones personalizadas. Esta información siempre es opcional.'
                    )
                );
                
            case 'usage':
                return React.createElement('div', null,
                    React.createElement('h3', { style: { color: '#E45A84', marginBottom: '20px' } }, '🎯 Cómo Utilizamos tu Información'),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Servicios Principales'),
                    React.createElement('ul', { style: { lineHeight: '1.6', paddingLeft: '20px', marginBottom: '20px' } },
                        React.createElement('li', null, 'Procesar y entregar tus pedidos'),
                        React.createElement('li', null, 'Gestionar tu cuenta y preferencias'),
                        React.createElement('li', null, 'Proporcionar servicio al cliente'),
                        React.createElement('li', null, 'Procesar pagos y prevenir fraude')
                    ),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Mejora y Personalización'),
                    React.createElement('ul', { style: { lineHeight: '1.6', paddingLeft: '20px', marginBottom: '20px' } },
                        React.createElement('li', null, 'Recomendar productos relevantes para tus mascotas'),
                        React.createElement('li', null, 'Personalizar tu experiencia de compra'),
                        React.createElement('li', null, 'Analizar tendencias y mejorar nuestros servicios'),
                        React.createElement('li', null, 'Desarrollar nuevos productos y características')
                    ),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Comunicación (Con tu Consentimiento)'),
                    React.createElement('ul', { style: { lineHeight: '1.6', paddingLeft: '20px', marginBottom: '20px' } },
                        React.createElement('li', null, 'Enviar actualizaciones de pedidos y notificaciones importantes'),
                        React.createElement('li', null, 'Ofertas especiales y promociones (si te suscribiste)'),
                        React.createElement('li', null, 'Newsletter con consejos para el cuidado de mascotas'),
                        React.createElement('li', null, 'Recordatorios de recompra de productos consumibles')
                    ),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Cumplimiento Legal'),
                    React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6' } },
                        'Podemos usar tu información para cumplir con obligaciones legales, resolver disputas, y hacer cumplir nuestros términos de servicio.'
                    )
                );
                
            case 'sharing':
                return React.createElement('div', null,
                    React.createElement('h3', { style: { color: '#E45A84', marginBottom: '20px' } }, '🤝 Cómo Compartimos tu Información'),
                    React.createElement('div', 
                        { style: { background: '#d4edda', padding: '20px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #c3e6cb' } },
                        React.createElement('h4', { style: { color: '#155724', marginTop: 0 } }, '✅ Compromiso Principal'),
                        React.createElement('p', { style: { margin: 0, color: '#155724' } },
                            'NUNCA vendemos, alquilamos o intercambiamos tu información personal con terceros para sus propios fines de marketing.'
                        )
                    ),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Proveedores de Servicios'),
                    React.createElement('p', { style: { marginBottom: '10px', lineHeight: '1.6' } }, 'Compartimos información limitada con:'),
                    React.createElement('ul', { style: { lineHeight: '1.6', paddingLeft: '20px', marginBottom: '20px' } },
                        React.createElement('li', null, React.createElement('strong', null, 'Empresas de envío:'), ' Para entregar tus pedidos'),
                        React.createElement('li', null, React.createElement('strong', null, 'Procesadores de pago:'), ' Para procesar transacciones de forma segura'),
                        React.createElement('li', null, React.createElement('strong', null, 'Servicios en la nube:'), ' Para almacenamiento y análisis de datos'),
                        React.createElement('li', null, React.createElement('strong', null, 'Servicio al cliente:'), ' Para proporcionarte soporte')
                    ),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Requisitos Legales'),
                    React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6' } },
                        'Podemos divulgar información cuando sea requerido por ley, para proteger nuestros derechos, o en casos de emergencia para proteger la seguridad.'
                    ),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Cambios Empresariales'),
                    React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6' } },
                        'En caso de fusión, adquisición o venta de activos, tu información puede transferirse como parte de esa transacción, siempre bajo la misma protección de privacidad.'
                    )
                );
                
            case 'cookies':
                return React.createElement('div', null,
                    React.createElement('h3', { style: { color: '#E45A84', marginBottom: '20px' } }, '🍪 Uso de Cookies'),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, '¿Qué son las Cookies?'),
                    React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6' } },
                        'Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas nuestro sitio web. Nos ayudan a recordar tus preferencias y mejorar tu experiencia.'
                    ),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Tipos de Cookies que Utilizamos'),
                    React.createElement('div', { style: { marginBottom: '20px' } },
                        React.createElement('p', { style: { fontWeight: '600', marginBottom: '10px' } }, '🔧 Cookies Esenciales (Necesarias)'),
                        React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6', paddingLeft: '15px' } },
                            'Necesarias para el funcionamiento básico del sitio (carrito de compras, inicio de sesión, preferencias de idioma).'
                        )
                    ),
                    React.createElement('div', { style: { marginBottom: '20px' } },
                        React.createElement('p', { style: { fontWeight: '600', marginBottom: '10px' } }, '📊 Cookies de Análisis'),
                        React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6', paddingLeft: '15px' } },
                            'Nos ayudan a entender cómo usas el sitio para mejorarlo. Incluye Google Analytics (datos agregados y anónimos).'
                        )
                    ),
                    React.createElement('div', { style: { marginBottom: '20px' } },
                        React.createElement('p', { style: { fontWeight: '600', marginBottom: '10px' } }, '🎯 Cookies de Personalización'),
                        React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6', paddingLeft: '15px' } },
                            'Recuerdan tus preferencias y personalizan tu experiencia (productos favoritos, recomendaciones).'
                        )
                    ),
                    React.createElement('div', { style: { marginBottom: '20px' } },
                        React.createElement('p', { style: { fontWeight: '600', marginBottom: '10px' } }, '📢 Cookies de Marketing'),
                        React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6', paddingLeft: '15px' } },
                            'Para mostrar anuncios relevantes en otros sitios web (solo con tu consentimiento explícito).'
                        )
                    ),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Control de Cookies'),
                    React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6' } },
                        'Puedes controlar las cookies a través de tu navegador o usando nuestro panel de configuración de privacidad. Ten en cuenta que desactivar ciertas cookies puede afectar la funcionalidad del sitio.'
                    )
                );
                
            case 'security':
                return React.createElement('div', null,
                    React.createElement('h3', { style: { color: '#E45A84', marginBottom: '20px' } }, '🔐 Seguridad de tu Información'),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Medidas de Protección'),
                    React.createElement('ul', { style: { lineHeight: '1.6', paddingLeft: '20px', marginBottom: '20px' } },
                        React.createElement('li', null, React.createElement('strong', null, 'Cifrado SSL:'), ' Toda la comunicación está cifrada con SSL/TLS'),
                        React.createElement('li', null, React.createElement('strong', null, 'Servidores seguros:'), ' Infraestructura protegida con firewalls y monitoreo'),
                        React.createElement('li', null, React.createElement('strong', null, 'Acceso limitado:'), ' Solo personal autorizado puede acceder a información personal'),
                        React.createElement('li', null, React.createElement('strong', null, 'Auditorías regulares:'), ' Revisiones de seguridad y actualizaciones constantes')
                    ),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Protección de Pagos'),
                    React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6' } },
                        'No almacenamos información completa de tarjetas de crédito. Los pagos se procesan a través de proveedores seguros certificados PCI DSS.'
                    ),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Retención de Datos'),
                    React.createElement('ul', { style: { lineHeight: '1.6', paddingLeft: '20px', marginBottom: '20px' } },
                        React.createElement('li', null, 'Información de cuenta: Mientras tengas una cuenta activa'),
                        React.createElement('li', null, 'Historial de compras: 5 años para propósitos fiscales'),
                        React.createElement('li', null, 'Logs de navegación: 2 años máximo'),
                        React.createElement('li', null, 'Datos de marketing: Hasta que retires tu consentimiento')
                    ),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Notificación de Incidentes'),
                    React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6' } },
                        'En caso de una violación de seguridad que pueda afectar tu información personal, te notificaremos dentro de 72 horas según lo requiere la ley.'
                    )
                );
                
            case 'rights':
                return React.createElement('div', null,
                    React.createElement('h3', { style: { color: '#E45A84', marginBottom: '20px' } }, '⚖️ Tus Derechos de Privacidad'),
                    React.createElement('p', { style: { marginBottom: '20px', lineHeight: '1.6' } },
                        'Bajo las leyes de protección de datos de Colombia, tienes los siguientes derechos:'
                    ),
                    React.createElement('div', { style: { marginBottom: '20px' } },
                        React.createElement('h4', { style: { color: '#333', marginBottom: '10px' } }, '📋 Derecho de Acceso'),
                        React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6', paddingLeft: '15px' } },
                            'Puedes solicitar una copia de toda la información personal que tenemos sobre ti.'
                        )
                    ),
                    React.createElement('div', { style: { marginBottom: '20px' } },
                        React.createElement('h4', { style: { color: '#333', marginBottom: '10px' } }, '✏️ Derecho de Rectificación'),
                        React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6', paddingLeft: '15px' } },
                            'Puedes corregir información incorrecta o incompleta en cualquier momento desde tu cuenta.'
                        )
                    ),
                    React.createElement('div', { style: { marginBottom: '20px' } },
                        React.createElement('h4', { style: { color: '#333', marginBottom: '10px' } }, '🗑️ Derecho de Eliminación'),
                        React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6', paddingLeft: '15px' } },
                            'Puedes solicitar la eliminación de tu información personal (sujeto a obligaciones legales).'
                        )
                    ),
                    React.createElement('div', { style: { marginBottom: '20px' } },
                        React.createElement('h4', { style: { color: '#333', marginBottom: '10px' } }, '🚫 Derecho de Oposición'),
                        React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6', paddingLeft: '15px' } },
                            'Puedes oponerte al procesamiento de tus datos para marketing directo en cualquier momento.'
                        )
                    ),
                    React.createElement('div', { style: { marginBottom: '20px' } },
                        React.createElement('h4', { style: { color: '#333', marginBottom: '10px' } }, '📤 Derecho de Portabilidad'),
                        React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6', paddingLeft: '15px' } },
                            'Puedes solicitar tus datos en un formato estructurado para transferir a otro servicio.'
                        )
                    ),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, '⚡ Cómo Ejercer tus Derechos'),
                    React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6' } },
                        'Puedes ejercer estos derechos contactándonos en privacidad@velykapet.com o a través de tu configuración de cuenta. Responderemos dentro de 15 días hábiles.'
                    )
                );
                
            case 'contact':
                return React.createElement('div', null,
                    React.createElement('h3', { style: { color: '#E45A84', marginBottom: '20px' } }, '📞 Contacto de Privacidad'),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Oficial de Protección de Datos'),
                    React.createElement('div', { style: { background: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '20px' } },
                        React.createElement('p', { style: { margin: '0 0 10px 0', fontWeight: '600' } }, 'Equipo de Privacidad - VelyKapet'),
                        React.createElement('p', { style: { margin: '0 0 8px 0' } }, '📧 Email: privacidad@velykapet.com'),
                        React.createElement('p', { style: { margin: '0 0 8px 0' } }, '📞 Teléfono: +57 (1) 555-PRIVACY'),
                        React.createElement('p', { style: { margin: '0 0 8px 0' } }, '🏢 Dirección: Calle 123 #45-67, Bogotá, Colombia'),
                        React.createElement('p', { style: { margin: '0' } }, '⏰ Horario: Lunes a Viernes, 9:00 AM - 5:00 PM')
                    ),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Autoridad de Control'),
                    React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6' } },
                        'Si no estás satisfecho con nuestra respuesta, puedes presentar una queja ante la Superintendencia de Industria y Comercio (SIC) de Colombia.'
                    ),
                    React.createElement('div', { style: { background: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '20px' } },
                        React.createElement('p', { style: { margin: '0 0 8px 0', fontWeight: '600' } }, 'Superintendencia de Industria y Comercio'),
                        React.createElement('p', { style: { margin: '0 0 8px 0' } }, '🌐 Website: www.sic.gov.co'),
                        React.createElement('p', { style: { margin: '0 0 8px 0' } }, '📞 Línea gratuita: 01 8000 910165'),
                        React.createElement('p', { style: { margin: '0' } }, '📧 Email: contactenos@sic.gov.co')
                    ),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Cambios a esta Política'),
                    React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6' } },
                        'Te notificaremos sobre cambios significativos a esta política por email y mediante un aviso prominente en nuestro sitio web. Los cambios menores se actualizarán aquí con una nueva fecha.'
                    ),
                    React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6', fontStyle: 'italic' } },
                        'Versión actual: 1.0 | Última actualización: ' + new Date().toLocaleDateString()
                    )
                );
                
            default:
                return React.createElement('div', null, 'Sección no encontrada');
        }
    };
    
    return React.createElement('div',
        {
            className: 'privacy-policy-container',
            style: {
                maxWidth: '1200px',
                margin: '0 auto',
                padding: isMobile ? '15px' : '30px 20px',
                minHeight: 'calc(100vh - 100px)'
            }
        },
        
        // Header profesional con gradiente
        React.createElement('div',
            {
                style: {
                    background: 'linear-gradient(135deg, #E45A84 0%, #D94876 50%, #C43E6B 100%)',
                    color: 'white',
                    padding: isMobile ? '30px 20px' : '50px 40px',
                    borderRadius: '20px',
                    marginBottom: '30px',
                    textAlign: 'center',
                    boxShadow: '0 10px 30px rgba(228, 90, 132, 0.3)',
                    position: 'relative',
                    overflow: 'hidden'
                }
            },
            // Decoración de fondo
            React.createElement('div', {
                style: {
                    position: 'absolute',
                    top: '-50%',
                    right: '-5%',
                    width: '300px',
                    height: '300px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    filter: 'blur(60px)'
                }
            }),
            React.createElement('div', {
                style: {
                    position: 'absolute',
                    bottom: '-30%',
                    left: '-5%',
                    width: '250px',
                    height: '250px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    filter: 'blur(50px)'
                }
            }),
            // Contenido del header
            React.createElement('div', { 
                style: { 
                    position: 'relative', 
                    zIndex: 1 
                } 
            },
                React.createElement('div', { 
                    style: { 
                        fontSize: isMobile ? '2.5rem' : '3.5rem', 
                        marginBottom: '15px',
                        animation: 'pulse 2s ease-in-out infinite'
                    } 
                }, '🔒'),
                React.createElement('h1', { 
                    style: { 
                        margin: '0 0 15px 0', 
                        fontSize: isMobile ? '1.8rem' : '2.8rem',
                        fontWeight: '700',
                        letterSpacing: '-0.5px'
                    } 
                }, 'Política de Privacidad'),
                React.createElement('p', { 
                    style: { 
                        margin: 0, 
                        opacity: 0.95, 
                        fontSize: isMobile ? '1rem' : '1.2rem',
                        fontWeight: '500'
                    } 
                }, 
                    'VelyKapet - Protección de tu Información Personal'
                ),
                React.createElement('p', { 
                    style: { 
                        margin: '15px 0 0 0', 
                        opacity: 0.85, 
                        fontSize: isMobile ? '0.85rem' : '0.95rem',
                        fontWeight: '400'
                    } 
                }, 
                    'Última actualización: ' + new Date().toLocaleDateString('es-ES', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                    })
                )
            )
        ),
        
        // Navegación por secciones con tabs profesionales
        React.createElement('div',
            {
                className: 'policy-navigation',
                role: 'navigation',
                'aria-label': 'Navegación de secciones de política',
                style: {
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                    marginBottom: '30px',
                    background: 'white',
                    padding: isMobile ? '15px' : '20px',
                    borderRadius: '15px',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(228, 90, 132, 0.1)'
                }
            },
            ...sections.map(section =>
                React.createElement('button',
                    {
                        key: section.id,
                        onClick: () => setActiveSection(section.id),
                        'aria-label': `Ver sección: ${section.title}`,
                        'aria-pressed': activeSection === section.id,
                        role: 'tab',
                        tabIndex: 0,
                        onKeyDown: (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setActiveSection(section.id);
                            }
                        },
                        style: {
                            padding: isMobile ? '8px 12px' : '12px 18px',
                            background: activeSection === section.id 
                                ? 'linear-gradient(135deg, #E45A84, #D94876)' 
                                : 'transparent',
                            color: activeSection === section.id ? 'white' : '#666',
                            border: activeSection === section.id ? 'none' : '2px solid #e0e0e0',
                            borderRadius: '30px',
                            cursor: 'pointer',
                            fontSize: isMobile ? '13px' : '14px',
                            fontWeight: activeSection === section.id ? '600' : '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            minWidth: 'auto',
                            outline: 'none',
                            boxShadow: activeSection === section.id 
                                ? '0 4px 12px rgba(228, 90, 132, 0.3)' 
                                : 'none',
                            transform: activeSection === section.id ? 'translateY(-2px)' : 'translateY(0)'
                        },
                        onMouseEnter: (e) => {
                            if (activeSection !== section.id) {
                                e.currentTarget.style.background = '#f8f9fa';
                                e.currentTarget.style.borderColor = '#E45A84';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }
                        },
                        onMouseLeave: (e) => {
                            if (activeSection !== section.id) {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.borderColor = '#e0e0e0';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }
                        },
                        onFocus: (e) => {
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(228, 90, 132, 0.2)';
                        },
                        onBlur: (e) => {
                            if (activeSection !== section.id) {
                                e.currentTarget.style.boxShadow = 'none';
                            }
                        }
                    },
                    React.createElement('span', { 
                        style: { 
                            fontSize: isMobile ? '1.1rem' : '1.2rem',
                            lineHeight: 1 
                        } 
                    }, section.icon),
                    !isMobile && React.createElement('span', null, section.title)
                )
            )
        ),
        
        // Contenido de la sección activa con animación
        React.createElement('div',
            {
                className: 'policy-content',
                role: 'region',
                'aria-live': 'polite',
                'aria-label': `Contenido de ${sections.find(s => s.id === activeSection)?.title || 'sección'}`,
                style: {
                    background: 'white',
                    padding: isMobile ? '20px' : '40px',
                    borderRadius: '15px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    minHeight: isMobile ? '400px' : '500px',
                    color: '#333',
                    fontSize: isMobile ? '14px' : '16px',
                    lineHeight: '1.8',
                    border: '1px solid rgba(228, 90, 132, 0.1)',
                    animation: 'fadeIn 0.4s ease-in-out'
                }
            },
            renderSectionContent()
        ),
        
        // Footer de compromiso con diseño mejorado
        React.createElement('div',
            {
                style: {
                    background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
                    padding: isMobile ? '20px' : '30px',
                    borderRadius: '15px',
                    border: '2px solid #a3d9b1',
                    marginTop: '30px',
                    textAlign: 'center',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)'
                }
            },
            React.createElement('div', {
                style: {
                    fontSize: '2.5rem',
                    marginBottom: '15px'
                }
            }, '🛡️'),
            React.createElement('p',
                { 
                    style: { 
                        margin: '0 0 15px 0', 
                        color: '#155724', 
                        fontWeight: '700',
                        fontSize: isMobile ? '1.1rem' : '1.3rem',
                        letterSpacing: '-0.3px'
                    } 
                },
                'Nuestro Compromiso: Tu privacidad es nuestra prioridad'
            ),
            React.createElement('p',
                { 
                    style: { 
                        margin: 0, 
                        color: '#155724', 
                        fontSize: isMobile ? '0.9rem' : '1rem',
                        opacity: 0.9,
                        maxWidth: '700px',
                        marginLeft: 'auto',
                        marginRight: 'auto'
                    } 
                },
                'Trabajamos continuamente para proteger tu información y ser transparentes sobre nuestras prácticas. Si tienes alguna pregunta, no dudes en contactarnos.'
            )
        )
    );
};

// Confirmar inmediatamente que se registró
console.log('📝 PrivacyPolicyComponent definido:', typeof window.PrivacyPolicyComponent);

console.log('✅ Privacy Policy Component cargado');
console.log('🔍 PrivacyPolicyComponent disponible:', !!window.PrivacyPolicyComponent);

// Test del componente
if (window.PrivacyPolicyComponent) {
    console.log('✅ PrivacyPolicyComponent se registró correctamente');
} else {
    console.error('❌ ERROR: PrivacyPolicyComponent no se registró');
}

// Inyectar estilos CSS para animaciones y mejoras visuales
if (typeof document !== 'undefined' && !document.getElementById('privacy-policy-styles')) {
    const style = document.createElement('style');
    style.id = 'privacy-policy-styles';
    style.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
        }
        
        /* Mejoras de accesibilidad para lectores de pantalla */
        .privacy-policy-container *:focus {
            outline: 2px solid #E45A84;
            outline-offset: 2px;
        }
        
        /* Scroll suave para navegación entre secciones */
        .privacy-policy-container {
            scroll-behavior: smooth;
        }
        
        /* Estilos adicionales para mejorar la tipografía */
        .policy-content h3 {
            font-weight: 700;
            margin-top: 0;
            line-height: 1.3;
        }
        
        .policy-content h4 {
            font-weight: 600;
            line-height: 1.4;
            color: #333;
        }
        
        .policy-content p {
            margin-bottom: 15px;
        }
        
        .policy-content ul, .policy-content ol {
            margin-bottom: 20px;
        }
        
        .policy-content li {
            margin-bottom: 8px;
        }
        
        /* Mejora de contraste para accesibilidad */
        .policy-content strong {
            font-weight: 600;
            color: #222;
        }
        
        /* Responsividad adicional */
        @media (max-width: 768px) {
            .policy-navigation {
                justify-content: center;
            }
            
            .policy-content {
                padding: 20px !important;
            }
        }
        
        /* Transiciones suaves para botones */
        .policy-navigation button {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
    `;
    document.head.appendChild(style);
    console.log('✅ Estilos CSS de Privacy Policy inyectados');
}

