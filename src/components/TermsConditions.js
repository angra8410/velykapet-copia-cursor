// Terms and Conditions - Términos y Condiciones para VelyKapet
// Documento legal completo y profesional

console.log('📄 Cargando Terms and Conditions Component...');

window.TermsConditionsComponent = function() {
    const [activeSection, setActiveSection] = React.useState('general');
    
    const sections = [
        { id: 'general', title: 'General', icon: '📋' },
        { id: 'services', title: 'Servicios', icon: '🛍️' },
        { id: 'accounts', title: 'Cuentas', icon: '👤' },
        { id: 'payments', title: 'Pagos', icon: '💳' },
        { id: 'shipping', title: 'Envíos', icon: '🚚' },
        { id: 'returns', title: 'Devoluciones', icon: '↩️' },
        { id: 'liability', title: 'Responsabilidad', icon: '⚖️' },
        { id: 'contact', title: 'Contacto', icon: '📞' }
    ];
    
    const renderSectionContent = () => {
        switch (activeSection) {
            case 'general':
                return React.createElement('div', null,
                    React.createElement('h3', { style: { color: '#E45A84', marginBottom: '20px' } }, '📋 Información General'),
                    React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6' } },
                        'Bienvenido a VelyKapet. Estos términos y condiciones describen las reglas y regulaciones para el uso del sitio web de VelyKapet, ubicado en www.velykapet.com.'
                    ),
                    React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6' } },
                        'Al acceder a este sitio web, asumimos que aceptas estos términos y condiciones. No continúes usando VelyKapet si no aceptas todos los términos y condiciones establecidos en esta página.'
                    ),
                    React.createElement('h4', { style: { color: '#333', marginTop: '25px', marginBottom: '15px' } }, 'Definiciones'),
                    React.createElement('ul', { style: { lineHeight: '1.6', paddingLeft: '20px' } },
                        React.createElement('li', { style: { marginBottom: '8px' } }, 
                            React.createElement('strong', null, 'Empresa:'), ' Se refiere a VelyKapet'
                        ),
                        React.createElement('li', { style: { marginBottom: '8px' } }, 
                            React.createElement('strong', null, 'Usuario:'), ' Se refiere a cualquier persona que accede al sitio web'
                        ),
                        React.createElement('li', { style: { marginBottom: '8px' } }, 
                            React.createElement('strong', null, 'Servicios:'), ' Se refiere a la venta de productos para mascotas'
                        ),
                        React.createElement('li', { style: { marginBottom: '8px' } }, 
                            React.createElement('strong', null, 'Contenido:'), ' Incluye texto, imágenes, audio, video, o cualquier otro material'
                        )
                    )
                );
                
            case 'services':
                return React.createElement('div', null,
                    React.createElement('h3', { style: { color: '#E45A84', marginBottom: '20px' } }, '🛍️ Uso de Nuestros Servicios'),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Descripción del Servicio'),
                    React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6' } },
                        'VelyKapet es una plataforma de comercio electrónico especializada en productos para mascotas. Ofrecemos:'
                    ),
                    React.createElement('ul', { style: { lineHeight: '1.6', paddingLeft: '20px', marginBottom: '20px' } },
                        React.createElement('li', null, 'Alimentos para perros y gatos'),
                        React.createElement('li', null, 'Medicamentos y suplementos veterinarios'),
                        React.createElement('li', null, 'Accesorios y juguetes'),
                        React.createElement('li', null, 'Servicios de entrega a domicilio')
                    ),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Elegibilidad'),
                    React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6' } },
                        'Para usar nuestros servicios, debes tener al menos 18 años de edad y tener la capacidad legal para celebrar contratos.'
                    ),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Uso Apropiado'),
                    React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6' } },
                        'Te comprometes a usar nuestros servicios solo para fines legítimos y de acuerdo con estos términos. No puedes:'
                    ),
                    React.createElement('ul', { style: { lineHeight: '1.6', paddingLeft: '20px' } },
                        React.createElement('li', null, 'Usar el sitio para propósitos ilegales'),
                        React.createElement('li', null, 'Intentar acceder a sistemas no autorizados'),
                        React.createElement('li', null, 'Interferir con el funcionamiento del sitio'),
                        React.createElement('li', null, 'Transmitir contenido malicioso o virus')
                    )
                );
                
            case 'accounts':
                return React.createElement('div', null,
                    React.createElement('h3', { style: { color: '#E45A84', marginBottom: '20px' } }, '👤 Cuentas de Usuario'),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Creación de Cuenta'),
                    React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6' } },
                        'Para realizar compras, debes crear una cuenta proporcionando información precisa y completa. Eres responsable de:'
                    ),
                    React.createElement('ul', { style: { lineHeight: '1.6', paddingLeft: '20px', marginBottom: '20px' } },
                        React.createElement('li', null, 'Mantener la confidencialidad de tu contraseña'),
                        React.createElement('li', null, 'Todas las actividades que ocurran en tu cuenta'),
                        React.createElement('li', null, 'Notificarnos inmediatamente sobre uso no autorizado')
                    ),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Información de la Cuenta'),
                    React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6' } },
                        'Debes proporcionar información verdadera, precisa y completa. Si proporcionas información falsa, podemos suspender o cancelar tu cuenta.'
                    ),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Suspensión de Cuenta'),
                    React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6' } },
                        'Nos reservamos el derecho de suspender o cancelar cuentas que violen estos términos, sin previo aviso.'
                    )
                );
                
            case 'payments':
                return React.createElement('div', null,
                    React.createElement('h3', { style: { color: '#E45A84', marginBottom: '20px' } }, '💳 Pagos y Precios'),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Precios'),
                    React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6' } },
                        'Todos los precios están expresados en pesos colombianos (COP) e incluyen IVA cuando aplique. Los precios pueden cambiar sin previo aviso.'
                    ),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Métodos de Pago'),
                    React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6' } }, 'Aceptamos los siguientes métodos de pago:'),
                    React.createElement('ul', { style: { lineHeight: '1.6', paddingLeft: '20px', marginBottom: '20px' } },
                        React.createElement('li', null, 'Tarjetas de crédito (Visa, MasterCard, American Express)'),
                        React.createElement('li', null, 'Tarjetas débito'),
                        React.createElement('li', null, 'PSE (Pagos Seguros en Línea)'),
                        React.createElement('li', null, 'Transferencias bancarias'),
                        React.createElement('li', null, 'Efectivo contra entrega (donde esté disponible)')
                    ),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Facturación'),
                    React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6' } },
                        'Al realizar una compra, autorizas el cargo a tu método de pago. Si el pago es rechazado, la orden será cancelada automáticamente.'
                    ),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Reembolsos'),
                    React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6' } },
                        'Los reembolsos se procesarán al método de pago original en un plazo de 5-10 días hábiles tras la aprobación.'
                    )
                );
                
            case 'shipping':
                return React.createElement('div', null,
                    React.createElement('h3', { style: { color: '#E45A84', marginBottom: '20px' } }, '🚚 Envíos y Entrega'),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Áreas de Cobertura'),
                    React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6' } },
                        'Realizamos envíos a nivel nacional en Colombia. Algunas áreas remotas pueden tener restricciones o costos adicionales.'
                    ),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Tiempos de Entrega'),
                    React.createElement('ul', { style: { lineHeight: '1.6', paddingLeft: '20px', marginBottom: '20px' } },
                        React.createElement('li', null, 'Ciudades principales: 2-3 días hábiles'),
                        React.createElement('li', null, 'Ciudades intermedias: 3-5 días hábiles'),
                        React.createElement('li', null, 'Municipios y zonas rurales: 5-8 días hábiles')
                    ),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Costos de Envío'),
                    React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6' } },
                        'Los costos de envío se calculan según el peso, dimensiones y destino. Ofrecemos envío gratuito en compras superiores a $50,000 COP.'
                    ),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Responsabilidad'),
                    React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6' } },
                        'Una vez entregado el paquete, la responsabilidad del producto se transfiere al cliente. Recomendamos inspeccionar el paquete al momento de la entrega.'
                    )
                );
                
            case 'returns':
                return React.createElement('div', null,
                    React.createElement('h3', { style: { color: '#E45A84', marginBottom: '20px' } }, '↩️ Devoluciones y Cambios'),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Política de Devolución'),
                    React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6' } },
                        'Aceptamos devoluciones dentro de los 30 días posteriores a la entrega, siempre que se cumplan las siguientes condiciones:'
                    ),
                    React.createElement('ul', { style: { lineHeight: '1.6', paddingLeft: '20px', marginBottom: '20px' } },
                        React.createElement('li', null, 'El producto debe estar en su empaque original'),
                        React.createElement('li', null, 'No debe haber sido usado o consumido'),
                        React.createElement('li', null, 'Debe incluir todos los accesorios originales'),
                        React.createElement('li', null, 'Debe tener la etiqueta y códigos de barras intactos')
                    ),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Productos No Retornables'),
                    React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6' } }, 'Los siguientes productos no pueden ser devueltos:'),
                    React.createElement('ul', { style: { lineHeight: '1.6', paddingLeft: '20px', marginBottom: '20px' } },
                        React.createElement('li', null, 'Medicamentos y productos farmacéuticos'),
                        React.createElement('li', null, 'Alimentos abiertos o consumidos parcialmente'),
                        React.createElement('li', null, 'Productos personalizados'),
                        React.createElement('li', null, 'Productos perecederos')
                    ),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Proceso de Devolución'),
                    React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6' } },
                        'Para iniciar una devolución, contacta nuestro servicio al cliente con tu número de orden. Te proporcionaremos instrucciones detalladas y una etiqueta de envío prepagada cuando sea aplicable.'
                    )
                );
                
            case 'liability':
                return React.createElement('div', null,
                    React.createElement('h3', { style: { color: '#E45A84', marginBottom: '20px' } }, '⚖️ Limitación de Responsabilidad'),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Exención de Garantías'),
                    React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6' } },
                        'Nuestros servicios se proporcionan "tal como están". No garantizamos que el servicio sea ininterrumpido o libre de errores.'
                    ),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Limitación de Daños'),
                    React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6' } },
                        'En ningún caso seremos responsables de daños indirectos, incidentales, especiales, consecuentes o punitivos, incluida la pérdida de beneficios.'
                    ),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Uso de Productos Veterinarios'),
                    React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6' } },
                        'Los medicamentos y suplementos para mascotas deben ser utilizados bajo supervisión veterinaria. No somos responsables del uso inadecuado de estos productos.'
                    ),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Indemnización'),
                    React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6' } },
                        'Te comprometes a indemnizar y mantener indemne a VelyKapet de cualquier reclamación, daño o gasto que surja de tu uso del servicio.'
                    )
                );
                
            case 'contact':
                return React.createElement('div', null,
                    React.createElement('h3', { style: { color: '#E45A84', marginBottom: '20px' } }, '📞 Contacto y Modificaciones'),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Información de Contacto'),
                    React.createElement('div', { style: { background: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '20px' } },
                        React.createElement('p', { style: { margin: '0 0 10px 0', fontWeight: '600' } }, 'VelyKapet'),
                        React.createElement('p', { style: { margin: '0 0 8px 0' } }, '📧 Email: soporte@velykapet.com'),
                        React.createElement('p', { style: { margin: '0 0 8px 0' } }, '📞 Teléfono: +57 (1) 555-KAPET'),
                        React.createElement('p', { style: { margin: '0 0 8px 0' } }, '📱 WhatsApp: +57 300 555 5555'),
                        React.createElement('p', { style: { margin: '0' } }, '🏢 Dirección: Calle 123 #45-67, Bogotá, Colombia')
                    ),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Horarios de Atención'),
                    React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6' } },
                        'Lunes a Viernes: 8:00 AM - 6:00 PM | Sábados: 9:00 AM - 2:00 PM | Domingos: Cerrado'
                    ),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Modificaciones a los Términos'),
                    React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6' } },
                        'Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigencia inmediatamente después de su publicación.'
                    ),
                    React.createElement('h4', { style: { color: '#333', marginBottom: '15px' } }, 'Ley Aplicable'),
                    React.createElement('p', { style: { marginBottom: '15px', lineHeight: '1.6' } },
                        'Estos términos se regirán e interpretarán de acuerdo con las leyes de Colombia. Cualquier disputa se resolverá en los tribunales competentes de Bogotá, Colombia.'
                    )
                );
                
            default:
                return React.createElement('div', null, 'Sección no encontrada');
        }
    };
    
    return React.createElement('div',
        {
            className: 'terms-conditions-container',
            style: {
                maxWidth: '1000px',
                margin: '0 auto',
                padding: '20px'
            }
        },
        
        // Header
        React.createElement('div',
            {
                style: {
                    background: 'linear-gradient(135deg, #E45A84, #D94876)',
                    color: 'white',
                    padding: '40px 30px',
                    borderRadius: '15px',
                    marginBottom: '30px',
                    textAlign: 'center'
                }
            },
            React.createElement('div', { style: { fontSize: '3rem', marginBottom: '15px' } }, '📄'),
            React.createElement('h1', { style: { margin: '0 0 10px 0', fontSize: '2.5rem' } }, 'Términos y Condiciones'),
            React.createElement('p', { style: { margin: 0, opacity: 0.9, fontSize: '1.1rem' } }, 
                'VelyKapet - Tienda Online de Productos para Mascotas'
            ),
            React.createElement('p', { style: { margin: '10px 0 0 0', opacity: 0.8, fontSize: '0.9rem' } }, 
                'Última actualización: ' + new Date().toLocaleDateString()
            )
        ),
        
        // Navegación por secciones
        React.createElement('div',
            {
                className: 'terms-navigation',
                style: {
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                    marginBottom: '30px',
                    background: 'white',
                    padding: '20px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }
            },
            ...sections.map(section =>
                React.createElement('button',
                    {
                        key: section.id,
                        onClick: () => setActiveSection(section.id),
                        style: {
                            padding: '10px 15px',
                            background: activeSection === section.id ? '#E45A84' : 'transparent',
                            color: activeSection === section.id ? 'white' : '#666',
                            border: activeSection === section.id ? 'none' : '1px solid #ddd',
                            borderRadius: '25px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: activeSection === section.id ? '600' : '400',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.3s ease',
                            minWidth: 'auto'
                        },
                        onMouseEnter: (e) => {
                            if (activeSection !== section.id) {
                                e.target.style.background = '#f8f9fa';
                            }
                        },
                        onMouseLeave: (e) => {
                            if (activeSection !== section.id) {
                                e.target.style.background = 'transparent';
                            }
                        }
                    },
                    React.createElement('span', null, section.icon),
                    React.createElement('span', null, section.title)
                )
            )
        ),
        
        // Contenido de la sección activa
        React.createElement('div',
            {
                className: 'terms-content',
                style: {
                    background: 'white',
                    padding: '30px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    minHeight: '500px',
                    color: '#333',
                    fontSize: '15px'
                }
            },
            renderSectionContent()
        ),
        
        // Footer de aceptación
        React.createElement('div',
            {
                style: {
                    background: '#fff3cd',
                    padding: '25px',
                    borderRadius: '12px',
                    border: '1px solid #ffeaa7',
                    marginTop: '30px',
                    textAlign: 'center'
                }
            },
            React.createElement('p',
                { style: { margin: '0 0 15px 0', color: '#856404', fontWeight: '600' } },
                '✋ Al usar nuestros servicios, confirmas que has leído y aceptado estos términos y condiciones.'
            ),
            React.createElement('p',
                { style: { margin: 0, color: '#856404', fontSize: '14px' } },
                'Si tienes preguntas sobre estos términos, no dudes en contactarnos.'
            )
        )
    );
};

console.log('✅ Terms and Conditions Component cargado');
console.log('🔍 TermsConditionsComponent disponible:', !!window.TermsConditionsComponent);