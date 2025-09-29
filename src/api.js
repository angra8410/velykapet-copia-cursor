// VentasPet - Servicio API para comunicación con Backend .NET
// Backend URL: http://localhost:5135

console.log('🔌 Cargando servicio API...');

// Configuración de la API
const API_CONFIG = {
    baseUrl: 'http://localhost:5135/api', // Conectar directo al backend .NET
    timeout: 10000, // 10 segundos
    retries: 3
};

// Clase para manejar errores de la API
class ApiError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

// Servicio principal de API
class ApiService {
    constructor() {
        this.baseUrl = API_CONFIG.baseUrl;
        this.token = this.getStoredToken();
        console.log('🔧 ApiService inicializado:', { baseUrl: this.baseUrl, hasToken: !!this.token });
    }

    // ======================
    // GESTIÓN DE TOKENS JWT
    // ======================
    
    getStoredToken() {
        try {
            return localStorage.getItem('ventaspet_token');
        } catch (e) {
            console.warn('⚠️ No se pudo acceder a localStorage:', e.message);
            return null;
        }
    }

    setToken(token) {
        this.token = token;
        try {
            localStorage.setItem('ventaspet_token', token);
            console.log('✅ Token JWT guardado');
        } catch (e) {
            console.error('❌ Error guardando token:', e.message);
        }
    }

    clearToken() {
        this.token = null;
        try {
            localStorage.removeItem('ventaspet_token');
            console.log('🗑️ Token JWT eliminado');
        } catch (e) {
            console.error('❌ Error eliminando token:', e.message);
        }
    }

    // ======================
    // CLIENTE HTTP BASE
    // ======================

    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        
        // Headers por defecto
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        // Agregar token JWT si está disponible
        if (this.token) {
            headers.Authorization = `Bearer ${this.token}`;
        }

        // Configuración de la petición
        const requestConfig = {
            method: options.method || 'GET',
            headers,
            ...options
        };

        // Agregar body si es necesario
        if (options.body && typeof options.body === 'object') {
            requestConfig.body = JSON.stringify(options.body);
        }

        console.log(`📡 ${requestConfig.method} ${url}`, { headers: headers, body: options.body });

        try {
            const response = await fetch(url, requestConfig);
            
            console.log(`📨 Respuesta: ${response.status} ${response.statusText}`);

            // Si la respuesta no es exitosa, lanzar error
            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch {
                    errorData = { message: response.statusText };
                }
                
                console.error('❌ Error de API:', { status: response.status, data: errorData });
                throw new ApiError(
                    errorData.message || `Error ${response.status}`,
                    response.status,
                    errorData
                );
            }

            // Intentar parsear JSON
            let data;
            try {
                data = await response.json();
                console.log('✅ Datos recibidos:', data);
            } catch {
                // Si no es JSON válido, retornar respuesta vacía
                data = {};
                console.log('✅ Respuesta sin JSON');
            }

            return data;

        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            
            console.error('❌ Error de red:', error.message);
            throw new ApiError('Error de conexión con el servidor', 0, { originalError: error.message });
        }
    }

    // ======================
    // MÉTODOS HTTP
    // ======================

    async get(endpoint, options = {}) {
        return this.makeRequest(endpoint, { ...options, method: 'GET' });
    }

    async post(endpoint, body, options = {}) {
        return this.makeRequest(endpoint, { ...options, method: 'POST', body });
    }

    async put(endpoint, body, options = {}) {
        return this.makeRequest(endpoint, { ...options, method: 'PUT', body });
    }

    async delete(endpoint, options = {}) {
        return this.makeRequest(endpoint, { ...options, method: 'DELETE' });
    }

    // ======================
    // ENDPOINTS DE AUTENTICACIÓN
    // ======================

    async register(userData) {
        console.log('👤 Registrando usuario:', userData.email);
        try {
            const response = await this.post('/Auth/register', userData);
            
            if (response.token) {
                this.setToken(response.token);
                console.log('✅ Registro exitoso, token guardado');
            }
            
            return response;
        } catch (error) {
            console.error('❌ Error en registro:', error.message);
            throw error;
        }
    }

    async login(credentials) {
        console.log('🔐 Iniciando sesión:', credentials.email);
        try {
            const response = await this.post('/Auth/login', credentials);
            
            if (response.token) {
                this.setToken(response.token);
                console.log('✅ Login exitoso, token guardado');
            }
            
            return response;
        } catch (error) {
            console.error('❌ Error en login:', error.message);
            throw error;
        }
    }

    async logout() {
        console.log('👋 Cerrando sesión');
        this.clearToken();
        return { message: 'Sesión cerrada exitosamente' };
    }

    async getCurrentUser() {
        console.log('👤 Obteniendo usuario actual');
        try {
            return await this.get('/Auth/me');
        } catch (error) {
            console.error('❌ Error obteniendo usuario:', error.message);
            // Si hay error de auth, limpiar token
            if (error.status === 401) {
                this.clearToken();
            }
            throw error;
        }
    }

    // ======================
    // ENDPOINTS DE PRODUCTOS
    // ======================

    async getProducts(filters = {}) {
        console.log('📦 Obteniendo productos', filters);
        const queryParams = new URLSearchParams();
        
        if (filters.search) queryParams.append('search', filters.search);
        if (filters.category) queryParams.append('category', filters.category);
        if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
        if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
        
        const endpoint = queryParams.toString() ? `/Products?${queryParams}` : '/Products';
        
        try {
            return await this.get(endpoint);
        } catch (error) {
            console.error('❌ Error obteniendo productos:', error.message);
            throw error;
        }
    }

    async getProduct(id) {
        console.log('📦 Obteniendo producto:', id);
        try {
            return await this.get(`/Products/${id}`);
        } catch (error) {
            console.error('❌ Error obteniendo producto:', error.message);
            throw error;
        }
    }

    // ======================
    // ENDPOINTS DE ÓRDENES
    // ======================

    async createOrder(orderData) {
        console.log('🛍 Creando orden:', orderData);
        try {
            return await this.post('/Orders', orderData);
        } catch (error) {
            console.error('❌ Error creando orden:', error.message);
            throw error;
        }
    }

    async getOrders() {
        console.log('📋 Obteniendo órdenes');
        try {
            return await this.get('/Orders');
        } catch (error) {
            console.error('❌ Error obteniendo órdenes:', error.message);
            throw error;
        }
    }

    // ======================
    // MÉTODO DE PRUEBA
    // ======================

    async testConnection() {
        console.log('🔍 ===== INICIANDO TEST DE CONEXIÓN =====');
        console.log('🔍 Configuración actual:', {
            baseUrl: this.baseUrl,
            hasToken: !!this.token
        });
        
        // URL a través del proxy (para evitar CORS)
        const proxyUrl = 'http://localhost:3333/api/Products';
        console.log(`🔍 Probando URL a través del proxy: ${proxyUrl}`);
        
        try {
            console.log('🔍 Intentando diferentes métodos de conexión...');
            
            // Método 1: Intentar con el proxy
            console.log('Método 1: Proxy');
            let response;
            try {
                response = await fetch(proxyUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors'
                });
                console.log('✅ Proxy funcionando');
            } catch (proxyError) {
                console.log('❌ Proxy fallo:', proxyError.message);
                
                // Método 2: Intentar directo (fallará por CORS pero podemos detectarlo)
                console.log('Método 2: Directo al backend (detectar CORS)');
                try {
                    response = await fetch('http://localhost:5135/api/Products', {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        mode: 'no-cors' // Esto permite la petición pero no podemos leer la respuesta
                    });
                    console.log('✅ Backend responde (modo no-cors)');
                    
                    // Si llegamos aquí, el backend está corriendo
                    return {
                        connected: true,
                        message: 'Backend detectado (CORS bloqueado). Instala CORS extension o configura CORS en el backend.',
                        data: [
                            { Id: 1, Name: 'Producto 1 (simulado)', Price: 29.99, Stock: 10 },
                            { Id: 2, Name: 'Producto 2 (simulado)', Price: 45.50, Stock: 20 },
                            { Id: 3, Name: 'Producto 3 (simulado)', Price: 12.00, Stock: 30 }
                        ],
                        baseUrl: 'http://localhost:5135/api',
                        corsBlocked: true
                    };
                    
                } catch (directError) {
                    console.log('❌ Conexión directa fallo:', directError.message);
                    throw new Error('Backend no disponible');
                }
            }
            
            console.log(`📨 Respuesta recibida:`, {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries())
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log(`✅ ¡CONEXIÓN EXITOSA!`, data);
                
                // Actualizar configuración
                this.baseUrl = 'http://localhost:3333/api';
                API_CONFIG.baseUrl = this.baseUrl;
                
                return { 
                    connected: true, 
                    message: `Backend conectado exitosamente (vía proxy)`,
                    data: Array.isArray(data) ? data : [data],
                    baseUrl: this.baseUrl,
                    testUrl: proxyUrl
                };
            } else {
                console.error(`❌ HTTP Error: ${response.status} ${response.statusText}`);
                return {
                    connected: false,
                    message: `Error HTTP ${response.status}: ${response.statusText}`,
                    error: `HTTP_${response.status}`
                };
            }
            
        } catch (error) {
            console.error('❌ ERROR EN FETCH:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            
            // Verificar tipo de error
            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                return {
                    connected: false,
                    message: 'Error CORS o backend no disponible. Verifica que el backend esté corriendo en localhost:5135',
                    error: 'FETCH_FAILED'
                };
            }
            
            return {
                connected: false,
                message: `Error de conexión: ${error.message}`,
                error: error.name
            };
        }
    }

    // ======================
    // UTILIDADES
    // ======================

    isAuthenticated() {
        return !!this.token;
    }

    getApiStatus() {
        return {
            baseUrl: this.baseUrl,
            authenticated: this.isAuthenticated(),
            tokenPresent: !!this.token
        };
    }
}

// Crear instancia global del servicio API
const apiService = new ApiService();

// Exportar para uso global (ya que no usamos módulos ES6)
window.ApiService = apiService;

console.log('✅ Servicio API cargado y disponible globalmente');
console.log('📊 Estado inicial:', apiService.getApiStatus());