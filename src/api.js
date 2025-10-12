// VentasPet - Servicio API para comunicación con Backend .NET
// Backend URL: http://localhost:5135

console.log('🔌 Cargando servicio API...');

// Configuración de la API
const API_CONFIG = {
    baseUrl: '/api', // Usar proxy del servidor frontend para evitar CORS
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

    // Mapear propiedades del backend (español) al frontend
    // Ahora incluye las variaciones del producto
    mapProductFromBackend(producto) {
        if (!producto) return null;
        
        // El backend devuelve ProductoDto con la siguiente estructura:
        // - IdProducto, NombreBase, Descripcion, NombreCategoria, TipoMascota, URLImagen
        // - Variaciones: array de VariacionProductoDto con IdVariacion, Peso, Precio, Stock
        // - Campos de filtros avanzados: IdMascotaTipo, IdCategoriaAlimento, IdSubcategoria, IdPresentacion
        
        return {
            IdProducto: producto.IdProducto,
            NombreBase: producto.NombreBase,
            Descripcion: producto.Descripcion,
            NombreCategoria: producto.NombreCategoria,
            TipoMascota: producto.TipoMascota,
            URLImagen: producto.URLImagen,
            Activo: producto.Activo,
            // Campos de filtros avanzados
            IdMascotaTipo: producto.IdMascotaTipo,
            NombreMascotaTipo: producto.NombreMascotaTipo,
            IdCategoriaAlimento: producto.IdCategoriaAlimento,
            NombreCategoriaAlimento: producto.NombreCategoriaAlimento,
            IdSubcategoria: producto.IdSubcategoria,
            NombreSubcategoria: producto.NombreSubcategoria,
            IdPresentacion: producto.IdPresentacion,
            NombrePresentacion: producto.NombrePresentacion,
            // IMPORTANTE: Mantener las variaciones tal como vienen del backend
            Variaciones: producto.Variaciones || []
        };
    }

    async getProducts(filters = {}) {
        console.log('📦 Obteniendo productos', filters);
        const queryParams = new URLSearchParams();
        
        // Filtros legacy (compatibilidad)
        if (filters.search) queryParams.append('busqueda', filters.search);
        if (filters.category) queryParams.append('categoria', filters.category);
        if (filters.petType) queryParams.append('tipoMascota', filters.petType);
        
        // Nuevos filtros avanzados con IDs
        if (filters.idMascotaTipo) queryParams.append('idMascotaTipo', filters.idMascotaTipo);
        if (filters.idCategoriaAlimento) queryParams.append('idCategoriaAlimento', filters.idCategoriaAlimento);
        if (filters.idSubcategoria) queryParams.append('idSubcategoria', filters.idSubcategoria);
        if (filters.idPresentacion) queryParams.append('idPresentacion', filters.idPresentacion);
        
        const endpoint = queryParams.toString() ? `/Productos?${queryParams}` : '/Productos';
        
        try {
            const productos = await this.get(endpoint);
            // Mapear array de productos del backend
            const mappedProducts = Array.isArray(productos) 
                ? productos.map(p => this.mapProductFromBackend(p))
                : [];
            console.log('✅ Productos mapeados:', mappedProducts.length);
            console.log('📦 Primer producto con variaciones:', mappedProducts[0]);
            return mappedProducts;
        } catch (error) {
            console.error('❌ Error obteniendo productos:', error.message);
            throw error;
        }
    }

    async getProduct(id) {
        console.log('📦 Obteniendo producto:', id);
        try {
            const producto = await this.get(`/Productos/${id}`);
            // Mapear producto individual del backend
            const mapped = this.mapProductFromBackend(producto);
            console.log('✅ Producto mapeado con variaciones:', mapped);
            return mapped;
        } catch (error) {
            console.error('❌ Error obteniendo producto:', error.message);
            throw error;
        }
    }

    // ======================
    // ENDPOINTS DE FILTROS AVANZADOS
    // ======================

    async getMascotaTipos() {
        console.log('🐾 Obteniendo tipos de mascotas');
        try {
            return await this.get('/Productos/filtros/mascotas');
        } catch (error) {
            console.error('❌ Error obteniendo tipos de mascotas:', error.message);
            throw error;
        }
    }

    async getCategoriasAlimento(idMascotaTipo = null) {
        console.log('🍖 Obteniendo categorías de alimento', { idMascotaTipo });
        try {
            const endpoint = idMascotaTipo 
                ? `/Productos/filtros/categorias-alimento?idMascotaTipo=${idMascotaTipo}`
                : '/Productos/filtros/categorias-alimento';
            return await this.get(endpoint);
        } catch (error) {
            console.error('❌ Error obteniendo categorías de alimento:', error.message);
            throw error;
        }
    }

    async getSubcategorias(idCategoriaAlimento = null) {
        console.log('📋 Obteniendo subcategorías', { idCategoriaAlimento });
        try {
            const endpoint = idCategoriaAlimento 
                ? `/Productos/filtros/subcategorias?idCategoriaAlimento=${idCategoriaAlimento}`
                : '/Productos/filtros/subcategorias';
            return await this.get(endpoint);
        } catch (error) {
            console.error('❌ Error obteniendo subcategorías:', error.message);
            throw error;
        }
    }

    async getPresentaciones() {
        console.log('📦 Obteniendo presentaciones');
        try {
            return await this.get('/Productos/filtros/presentaciones');
        } catch (error) {
            console.error('❌ Error obteniendo presentaciones:', error.message);
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
        
        // Usar el endpoint correcto en español: /api/Productos
        const testUrl = '/api/Productos';
        console.log(`🔍 Probando endpoint: ${testUrl}`);
        
        try {
            const response = await fetch(testUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            console.log(`📨 Respuesta recibida:`, {
                status: response.status,
                statusText: response.statusText
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log(`✅ ¡CONEXIÓN EXITOSA!`, data);
                
                return { 
                    connected: true, 
                    message: `Backend conectado exitosamente (vía proxy)`,
                    data: Array.isArray(data) ? data : [data],
                    baseUrl: this.baseUrl,
                    testUrl: testUrl
                };
            } else {
                console.error(`❌ HTTP Error: ${response.status} ${response.statusText}`);
                let errorData;
                try {
                    errorData = await response.json();
                } catch {
                    errorData = { message: response.statusText };
                }
                return {
                    connected: false,
                    message: `Error HTTP ${response.status}: ${response.statusText}`,
                    error: `HTTP_${response.status}`,
                    details: errorData
                };
            }
            
        } catch (error) {
            console.error('❌ ERROR EN FETCH:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            
            return {
                connected: false,
                message: `Error de conexión: ${error.message}. Verifica que el servidor frontend esté corriendo en localhost:3333 y el backend en localhost:5135`,
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