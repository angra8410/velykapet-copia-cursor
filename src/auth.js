// VentasPet - Sistema de Autenticación
// Componentes de Login, Registro y gestión de usuarios

console.log('Cargando sistema de autenticación...');

// ======================
// GESTIÓN DE ESTADO DE USUARIO
// ======================

class AuthManager {
    constructor() {
        this.user = null;
        this.listeners = [];
        this.loadUserFromStorage();
        console.log('👤 AuthManager inicializado:', { hasUser: !!this.user });
    }

    loadUserFromStorage() {
        try {
            const userData = localStorage.getItem('ventaspet_user');
            if (userData) {
                this.user = JSON.parse(userData);
                console.log('✅ Usuario cargado desde localStorage:', this.user.email);
            }
        } catch (error) {
            console.warn('⚠️ Error cargando usuario:', error.message);
            localStorage.removeItem('ventaspet_user');
        }
    }

    saveUserToStorage(user) {
        try {
            localStorage.setItem('ventaspet_user', JSON.stringify(user));
            console.log('💾 Usuario guardado en localStorage');
        } catch (error) {
            console.error('❌ Error guardando usuario:', error.message);
        }
    }

    setUser(user) {
        this.user = user;
        if (user) {
            this.saveUserToStorage(user);
        } else {
            localStorage.removeItem('ventaspet_user');
        }
        this.notifyListeners();
    }

    getUser() {
        return this.user;
    }

    isAuthenticated() {
        return !!this.user;
    }

    logout() {
        console.log('👋 Cerrando sesión...');
        this.setUser(null);
        window.ApiService.clearToken();
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    unsubscribe(listener) {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    notifyListeners() {
        this.listeners.forEach(listener => listener(this.user));
    }
}

// Instancia global
const authManager = new AuthManager();

// ======================
// COMPONENTE DE LOGIN
// ======================

function LoginComponent() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        console.log('🔐 Intentando login:', { email });

        try {
            const response = await window.ApiService.login({ email, password });
            
            console.log('✅ Login exitoso:', response);
            
            // Guardar usuario
            const userData = {
                id: response.user?.id,
                email: response.user?.email || email,
                name: response.user?.name || 'Usuario',
                token: response.token
            };
            
            authManager.setUser(userData);
            
            // No redirigir automáticamente, mantener la vista actual
            console.log('✅ Login exitoso - manteniendo vista actual');
            
            // Si estaba en la vista de auth, regresar a home
            if (window.setCurrentView && window.getCurrentView && window.getCurrentView() === 'auth') {
                window.setCurrentView('home');
            }
        } catch (error) {
            console.error('❌ Error en login:', error);
            setError(error.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return React.createElement('div', 
        { 
            style: { 
                maxWidth: '400px', 
                margin: '20px auto', 
                padding: '30px', 
                background: 'white', 
                borderRadius: '15px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            } 
        },
        
        // Título
        React.createElement('h2', 
            { style: { textAlign: 'center', color: '#007bff', marginBottom: '30px' } },
            '🔐 Iniciar Sesión'
        ),
        
        // Formulario
        React.createElement('form', { onSubmit: handleLogin },
            
            // Email
            React.createElement('div', { style: { marginBottom: '20px' } },
                React.createElement('label', 
                    { style: { display: 'block', marginBottom: '8px', fontWeight: 'bold' } },
                    '📧 Email:'
                ),
                React.createElement('input', {
                    type: 'email',
                    value: email,
                    onChange: (e) => setEmail(e.target.value),
                    required: true,
                    placeholder: 'tu@email.com',
                    style: {
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                    }
                })
            ),
            
            // Password
            React.createElement('div', { style: { marginBottom: '20px' } },
                React.createElement('label', 
                    { style: { display: 'block', marginBottom: '8px', fontWeight: 'bold' } },
                    '🔒 Contraseña:'
                ),
                React.createElement('div', 
                    {
                        style: {
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center'
                        }
                    },
                    React.createElement('input', {
                        type: showPassword ? 'text' : 'password',
                        value: password,
                        onChange: (e) => setPassword(e.target.value),
                        required: true,
                        placeholder: '••••••••',
                        style: {
                            width: '100%',
                            padding: '12px 50px 12px 12px', // Espacio extra a la derecha para el botón
                            border: '2px solid #e0e0e0',
                            borderRadius: '8px',
                            fontSize: '16px',
                            boxSizing: 'border-box'
                        }
                    }),
                    React.createElement('button', 
                        {
                            type: 'button',
                            onClick: () => setShowPassword(!showPassword),
                            style: {
                                position: 'absolute',
                                right: '10px',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '18px',
                                color: '#666',
                                padding: '5px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '30px',
                                height: '30px'
                            },
                            title: showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                        },
                        showPassword ? '🙈' : '👁️'
                    )
                )
            ),
            
            // Error message
            error && React.createElement('div', {
                style: {
                    background: '#f8d7da',
                    color: '#721c24',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    border: '1px solid #f5c6cb'
                }
            }, '❌ ' + error),
            
            // Submit button
            React.createElement('button', {
                type: 'submit',
                disabled: loading,
                style: {
                    width: '100%',
                    padding: '15px',
                    background: loading ? '#6c757d' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: loading ? 'wait' : 'pointer'
                }
            }, loading ? '⏳ Iniciando sesión...' : '🚀 Iniciar Sesión')
        )
    );
}

// ======================
// COMPONENTE DE REGISTRO
// ======================

function RegisterComponent() {
    const [formData, setFormData] = React.useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: ''
    });
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError(''); // Clear error when user types
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validaciones
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            setLoading(false);
            return;
        }

        console.log('👤 Intentando registro:', { email: formData.email, firstName: formData.firstName });

        try {
            const response = await window.ApiService.register({
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword, // Agregar confirmPassword
                firstName: formData.firstName,
                lastName: formData.lastName
            });
            
            console.log('✅ Registro exitoso:', response);
            
            // Guardar usuario
            const userData = {
                id: response.user?.id,
                email: response.user?.email || formData.email,
                name: `${formData.firstName} ${formData.lastName}`,
                token: response.token
            };
            
            authManager.setUser(userData);
            
            // No redirigir automáticamente, mantener la vista actual
            console.log('✅ Registro exitoso - manteniendo vista actual');
            
            // Si estaba en la vista de auth, regresar a home
            if (window.setCurrentView && window.getCurrentView && window.getCurrentView() === 'auth') {
                window.setCurrentView('home');
            }
        } catch (error) {
            console.error('❌ Error en registro:', error);
            setError(error.message || 'Error al registrar usuario');
        } finally {
            setLoading(false);
        }
    };

    return React.createElement('div', 
        { 
            style: { 
                maxWidth: '400px', 
                margin: '20px auto', 
                padding: '30px', 
                background: 'white', 
                borderRadius: '15px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            } 
        },
        
        // Título
        React.createElement('h2', 
            { style: { textAlign: 'center', color: '#28a745', marginBottom: '30px' } },
            '👤 Crear Cuenta'
        ),
        
        // Formulario
        React.createElement('form', { onSubmit: handleRegister },
            
            // Nombre
            React.createElement('div', { style: { marginBottom: '15px' } },
                React.createElement('label', 
                    { style: { display: 'block', marginBottom: '8px', fontWeight: 'bold' } },
                    '👤 Nombre:'
                ),
                React.createElement('input', {
                    type: 'text',
                    value: formData.firstName,
                    onChange: (e) => handleChange('firstName', e.target.value),
                    required: true,
                    placeholder: 'Tu nombre',
                    style: {
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                    }
                })
            ),
            
            // Apellido
            React.createElement('div', { style: { marginBottom: '15px' } },
                React.createElement('label', 
                    { style: { display: 'block', marginBottom: '8px', fontWeight: 'bold' } },
                    '👥 Apellido:'
                ),
                React.createElement('input', {
                    type: 'text',
                    value: formData.lastName,
                    onChange: (e) => handleChange('lastName', e.target.value),
                    required: true,
                    placeholder: 'Tu apellido',
                    style: {
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                    }
                })
            ),
            
            // Email
            React.createElement('div', { style: { marginBottom: '15px' } },
                React.createElement('label', 
                    { style: { display: 'block', marginBottom: '8px', fontWeight: 'bold' } },
                    '📧 Email:'
                ),
                React.createElement('input', {
                    type: 'email',
                    value: formData.email,
                    onChange: (e) => handleChange('email', e.target.value),
                    required: true,
                    placeholder: 'tu@email.com',
                    style: {
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                    }
                })
            ),
            
            // Password
            React.createElement('div', { style: { marginBottom: '15px' } },
                React.createElement('label', 
                    { style: { display: 'block', marginBottom: '8px', fontWeight: 'bold' } },
                    '🔒 Contraseña:'
                ),
                React.createElement('div', 
                    {
                        style: {
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center'
                        }
                    },
                    React.createElement('input', {
                        type: showPassword ? 'text' : 'password',
                        value: formData.password,
                        onChange: (e) => handleChange('password', e.target.value),
                        required: true,
                        placeholder: '••••••••',
                        style: {
                            width: '100%',
                            padding: '12px 50px 12px 12px', // Espacio extra a la derecha para el botón
                            border: '2px solid #e0e0e0',
                            borderRadius: '8px',
                            fontSize: '16px',
                            boxSizing: 'border-box'
                        }
                    }),
                    React.createElement('button', 
                        {
                            type: 'button',
                            onClick: () => setShowPassword(!showPassword),
                            style: {
                                position: 'absolute',
                                right: '10px',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '18px',
                                color: '#666',
                                padding: '5px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '30px',
                                height: '30px'
                            },
                            title: showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                        },
                        showPassword ? '🙈' : '👁️'
                    )
                )
            ),
            
            // Confirm Password
            React.createElement('div', { style: { marginBottom: '20px' } },
                React.createElement('label', 
                    { style: { display: 'block', marginBottom: '8px', fontWeight: 'bold' } },
                    '🔒 Confirmar Contraseña:'
                ),
                React.createElement('div', 
                    {
                        style: {
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center'
                        }
                    },
                    React.createElement('input', {
                        type: showConfirmPassword ? 'text' : 'password',
                        value: formData.confirmPassword,
                        onChange: (e) => handleChange('confirmPassword', e.target.value),
                        required: true,
                        placeholder: '••••••••',
                        style: {
                            width: '100%',
                            padding: '12px 50px 12px 12px', // Espacio extra a la derecha para el botón
                            border: '2px solid #e0e0e0',
                            borderRadius: '8px',
                            fontSize: '16px',
                            boxSizing: 'border-box'
                        }
                    }),
                    React.createElement('button', 
                        {
                            type: 'button',
                            onClick: () => setShowConfirmPassword(!showConfirmPassword),
                            style: {
                                position: 'absolute',
                                right: '10px',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '18px',
                                color: '#666',
                                padding: '5px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '30px',
                                height: '30px'
                            },
                            title: showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                        },
                        showConfirmPassword ? '🙈' : '👁️'
                    )
                )
            ),
            
            // Error message
            error && React.createElement('div', {
                style: {
                    background: '#f8d7da',
                    color: '#721c24',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    border: '1px solid #f5c6cb'
                }
            }, '❌ ' + error),
            
            // Submit button
            React.createElement('button', {
                type: 'submit',
                disabled: loading,
                style: {
                    width: '100%',
                    padding: '15px',
                    background: loading ? '#6c757d' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: loading ? 'wait' : 'pointer'
                }
            }, loading ? '⏳ Creando cuenta...' : '✨ Crear Cuenta')
        )
    );
}

// ======================
// COMPONENTE PRINCIPAL DE AUTENTICACIÓN
// ======================

function AuthComponent() {
    const [mode, setMode] = React.useState('login'); // 'login' o 'register'
    const [user, setUser] = React.useState(authManager.getUser());

    // Suscribirse a cambios de usuario
    React.useEffect(() => {
        const handleUserChange = (newUser) => {
            setUser(newUser);
        };

        authManager.subscribe(handleUserChange);
        return () => authManager.unsubscribe(handleUserChange);
    }, []);

    // Si está autenticado, mostrar perfil
    if (user) {
        return React.createElement('div', 
            { 
                style: { 
                    maxWidth: '400px', 
                    margin: '20px auto', 
                    padding: '30px', 
                    background: '#d4edda', 
                    borderRadius: '15px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    border: '1px solid #c3e6cb'
                } 
            },
            
            // Bienvenida
            React.createElement('h2', 
                { style: { textAlign: 'center', color: '#155724', marginBottom: '20px' } },
                `👋 ¡Hola, ${user.name}!`
            ),
            
            React.createElement('div', { style: { textAlign: 'center' } },
                React.createElement('p', { style: { marginBottom: '20px', color: '#155724' } },
                    `📧 ${user.email}`
                ),
                
                React.createElement('button', {
                    onClick: () => authManager.logout(),
                    style: {
                        padding: '12px 24px',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        cursor: 'pointer'
                    }
                }, '👋 Cerrar Sesión')
            )
        );
    }

    // Si no está autenticado, mostrar login/registro
    return React.createElement('div', null,
        
        // Pestañas
        React.createElement('div', 
            { style: { textAlign: 'center', marginBottom: '20px' } },
            
            React.createElement('button', {
                onClick: () => setMode('login'),
                style: {
                    padding: '10px 20px',
                    marginRight: '10px',
                    background: mode === 'login' ? '#007bff' : '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                }
            }, '🔐 Iniciar Sesión'),
            
            React.createElement('button', {
                onClick: () => setMode('register'),
                style: {
                    padding: '10px 20px',
                    background: mode === 'register' ? '#28a745' : '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                }
            }, '👤 Crear Cuenta')
        ),
        
        // Componente activo
        mode === 'login' ? 
            React.createElement(LoginComponent) : 
            React.createElement(RegisterComponent)
    );
}

// Exportar globalmente
window.AuthComponent = AuthComponent;
window.authManager = authManager;

console.log('Sistema de autenticacion cargado');
console.log('AuthManager disponible globalmente');
console.log('Funciones disponibles: login, register, logout, etc.');