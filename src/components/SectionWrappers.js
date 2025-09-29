// Section Wrappers - Componentes que replican exactamente el patrón exitoso
// Basado en el análisis del console.log exitoso

console.log('🎯 Cargando Section Wrappers...');

// Wrapper genérico que replica el patrón exitoso
window.createSectionWrapper = function(sectionName, ContentComponent, customStyles = {}) {
    return function(props = {}) {
        console.log(`📦 ${sectionName} Wrapper: Iniciando renderizado`);
        console.log(`📦 ${sectionName} Wrapper: ContentComponent disponible:`, !!ContentComponent);
        
        // ESTRUCTURA PARA VIEWPORT VISUAL COMPLETO
        return React.createElement('div',
            {
                className: `${sectionName.toLowerCase()}-content section-viewport-full`,
                style: {
                    width: '100vw', // VIEWPORT COMPLETO
                    maxWidth: '100vw', // SIN LIMITACIONES
                    minWidth: '100vw', // GARANTIZAR ANCHO
                    minHeight: 'calc(100vh - 80px)',
                    padding: '0', // Sin padding inicial
                    margin: '0',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'transparent',
                    position: 'relative',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    ...customStyles // Estilos personalizados por sección
                }
            },
            
            // Renderizar el componente de contenido si existe
            ContentComponent ? React.createElement(ContentComponent, props) :
            React.createElement('div',
                {
                    style: {
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '400px',
                        flexDirection: 'column',
                        gap: '20px'
                    }
                },
                React.createElement('div',
                    {
                        style: {
                            width: '50px',
                            height: '50px',
                            border: '4px solid #f3f3f3',
                            borderTop: '4px solid #E45A84',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }
                    }
                ),
                React.createElement('p',
                    { style: { color: '#666', fontSize: '16px' } },
                    `Cargando ${sectionName}...`
                )
            )
        );
    };
};

// WRAPPERS ESPECÍFICOS PARA CADA SECCIÓN

// Cart Wrapper - Replica el comportamiento exitoso
window.CartWrapper = window.createSectionWrapper('Cart', null, {
    padding: '20px' // Cart necesita un poco de padding
});

// Profile Wrapper - Replica el comportamiento exitoso  
window.ProfileWrapper = window.createSectionWrapper('Profile', null, {
    padding: '20px'
});

// Admin Wrapper - Replica el comportamiento exitoso
window.AdminWrapper = window.createSectionWrapper('Admin', null, {
    padding: '15px'
});

// Checkout Wrapper - Replica el comportamiento exitoso
window.CheckoutWrapper = window.createSectionWrapper('Checkout', null, {
    padding: '20px',
    maxWidth: '800px', // Checkout centrado
    margin: '0 auto'
});

// Dashboard Wrapper - Replica el comportamiento exitoso
window.DashboardWrapper = window.createSectionWrapper('Dashboard', null, {
    padding: '20px'
});

// Función para actualizar wrappers dinámicamente
window.updateSectionWrapper = function(sectionName, ContentComponent) {
    const wrapperName = `${sectionName}Wrapper`;
    console.log(`🔄 Actualizando ${wrapperName} con componente:`, !!ContentComponent);
    
    window[wrapperName] = function(props = {}) {
        console.log(`📦 ${sectionName} Wrapper (actualizado): Renderizando`);
        
        return React.createElement('div',
            {
                className: `${sectionName.toLowerCase()}-content section-viewport-full`,
                style: {
                    width: '100vw', // VIEWPORT COMPLETO
                    maxWidth: '100vw', // SIN LIMITACIONES
                    minWidth: '100vw', // GARANTIZAR ANCHO
                    minHeight: 'calc(100vh - 80px)',
                    padding: sectionName === 'Cart' || sectionName === 'Profile' || sectionName === 'Dashboard' ? '20px 2rem' : 
                             sectionName === 'Checkout' ? '20px 2rem' : '15px 1.5rem',
                    margin: '0',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'transparent',
                    position: 'relative',
                    left: '50%',
                    transform: 'translateX(-50%)'
                }
            },
            ContentComponent ? React.createElement(ContentComponent, props) :
            React.createElement('div',
                { style: { textAlign: 'center', padding: '40px', color: '#666' } },
                React.createElement('h3', null, `Cargando ${sectionName}...`)
            )
        );
    };
};

console.log('✅ Section Wrappers cargados');
console.log('🔍 Wrappers disponibles:', {
    CartWrapper: !!window.CartWrapper,
    ProfileWrapper: !!window.ProfileWrapper, 
    AdminWrapper: !!window.AdminWrapper,
    CheckoutWrapper: !!window.CheckoutWrapper,
    DashboardWrapper: !!window.DashboardWrapper,
    updateSectionWrapper: !!window.updateSectionWrapper
});