// VentasPet - Sistema de Optimizacion de API Calls
// Implementa debounce, throttle, cache de respuestas y optimizacion de requests

console.log('📡 Cargando API Optimizer...');

window.ApiOptimizer = {
    // Configuracion
    config: {
        // Tiempos de debounce por tipo de operacion (ms)
        debounceDelays: {
            search: 300,
            filter: 200,
            autocomplete: 150,
            validation: 500
        },
        
        // Tiempos de throttle (ms)
        throttleDelays: {
            scroll: 100,
            resize: 250,
            mousemove: 50,
            analytics: 1000
        },
        
        // Cache TTL por endpoint (minutos)
        cacheTtl: {
            products: 30,
            categories: 60,
            user: 15,
            search: 10,
            static: 120
        },
        
        // Configuracion de batch requests
        batchConfig: {
            enabled: true,
            maxBatchSize: 10,
            batchDelay: 100, // ms para agrupar requests
            enabledEndpoints: ['products', 'users', 'orders']
        },
        
        // Configuracion de retry
        retryConfig: {
            maxRetries: 3,
            retryDelay: 1000, // ms
            exponentialBackoff: true,
            retryableStatusCodes: [408, 429, 500, 502, 503, 504]
        }
    },
    
    // Cache interno para debounce/throttle
    timers: new Map(),
    batchQueue: new Map(),
    requestQueue: new Map(),
    
    // Estadisticas
    stats: {
        totalRequests: 0,
        cachedRequests: 0,
        debouncedRequests: 0,
        throttledRequests: 0,
        batchedRequests: 0,
        retriedRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0,
        bytesTransferred: 0
    },
    
    init() {
        console.log('[ICON:ROCKET] Inicializando API Optimizer...');
        
        // Configurar interceptores de requests
        this.setupRequestInterceptors();
        
        // Configurar batch processing
        this.setupBatchProcessing();
        
        // Configurar metricas automaticas
        this.setupMetrics();
        
        // Configurar cache de API responses
        this.setupApiCache();
        
        return this;
    },
    
    // ========= DEBOUNCE =========
    
    // Crear funcion debounced
    debounce(func, delay, key = 'default') {
        return (...args) => {
            const timerId = `debounce_${key}`;
            
            // Cancelar timer anterior
            if (this.timers.has(timerId)) {
                clearTimeout(this.timers.get(timerId));
            }
            
            // Crear nuevo timer
            const timer = setTimeout(() => {
                func.apply(this, args);
                this.timers.delete(timerId);
                this.stats.debouncedRequests++;
            }, delay);
            
            this.timers.set(timerId, timer);
        };
    },
    
    // Crear funcion debounced para busqueda
    createDebouncedSearch(searchFunction, delay = null) {
        const searchDelay = delay || this.config.debounceDelays.search;
        return this.debounce(searchFunction, searchDelay, 'search');
    },
    
    // Crear funcion debounced para filtros
    createDebouncedFilter(filterFunction, delay = null) {
        const filterDelay = delay || this.config.debounceDelays.filter;
        return this.debounce(filterFunction, filterDelay, 'filter');
    },
    
    // ========= THROTTLE =========
    
    // Crear funcion throttled
    throttle(func, delay, key = 'default') {
        let lastRun = 0;
        
        return (...args) => {
            const now = Date.now();
            const timerId = `throttle_${key}`;
            
            if (now - lastRun >= delay) {
                func.apply(this, args);
                lastRun = now;
                this.stats.throttledRequests++;
            } else {
                // Programar ejecucion si no existe
                if (!this.timers.has(timerId)) {
                    const timer = setTimeout(() => {
                        func.apply(this, args);
                        lastRun = Date.now();
                        this.timers.delete(timerId);
                        this.stats.throttledRequests++;
                    }, delay - (now - lastRun));
                    
                    this.timers.set(timerId, timer);
                }
            }
        };
    },
    
    // Crear funcion throttled para scroll
    createThrottledScroll(scrollFunction, delay = null) {
        const scrollDelay = delay || this.config.throttleDelays.scroll;
        return this.throttle(scrollFunction, scrollDelay, 'scroll');
    },
    
    // ========= CACHE DE API =========
    
    // Realizar request con cache inteligente
    async cachedRequest(url, options = {}, cacheTtl = null) {
        const cacheKey = this._generateCacheKey(url, options);
        const ttl = cacheTtl || this._getTtlForUrl(url);
        
        // Intentar obtener de cache primero
        const cached = window.CacheManager?.getCachedApiResponse(cacheKey);
        if (cached && this._isCacheValid(cached, ttl)) {
            this.stats.cachedRequests++;
            console.log(`📡 Cache Hit: ${url}`);
            return cached;
        }
        
        try {
            // Realizar request
            const startTime = performance.now();
            const response = await this._performRequest(url, options);
            const endTime = performance.now();
            
            // Actualizar metricas
            this._updateMetrics(endTime - startTime, response);
            
            // Cachear si es exitoso y cacheable
            if (response && this._isCacheable(response)) {
                window.CacheManager?.cacheApiResponse(cacheKey, response, ttl);
            }
            
            return response;
            
        } catch (error) {
            this.stats.failedRequests++;
            throw error;
        }
    },
    
    // Realizar request con retry automatico
    async requestWithRetry(url, options = {}, maxRetries = null) {
        const retries = maxRetries || this.config.retryConfig.maxRetries;
        let lastError;
        
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                if (attempt > 0) {
                    // Delay antes del retry
                    const delay = this._calculateRetryDelay(attempt);
                    await this._sleep(delay);
                    this.stats.retriedRequests++;
                    console.log(`🔄 Reintentando request (${attempt}/${retries}): ${url}`);
                }
                
                return await this._performRequest(url, options);
                
            } catch (error) {
                lastError = error;
                
                // Solo reintentar para errores especificos
                if (!this._isRetryableError(error) || attempt === retries) {
                    break;
                }
            }
        }
        
        throw lastError;
    },
    
    // ========= BATCH REQUESTS =========
    
    // Agregar request al batch
    batchRequest(endpoint, params, callback) {
        if (!this.config.batchConfig.enabled) {
            // Si batch esta deshabilitado, hacer request inmediato
            return this.cachedRequest(endpoint, { params }).then(callback);
        }
        
        const batchKey = this._getBatchKey(endpoint);
        
        if (!this.batchQueue.has(batchKey)) {
            this.batchQueue.set(batchKey, {
                requests: [],
                timer: null
            });
        }
        
        const batch = this.batchQueue.get(batchKey);
        
        // Agregar request al batch
        batch.requests.push({ params, callback });
        
        // Si es el primer request del batch, programar ejecucion
        if (!batch.timer && batch.requests.length === 1) {
            batch.timer = setTimeout(() => {
                this._processBatch(batchKey);
            }, this.config.batchConfig.batchDelay);
        }
        
        // Si se alcanzo el tamano maximo, procesar inmediatamente
        if (batch.requests.length >= this.config.batchConfig.maxBatchSize) {
            clearTimeout(batch.timer);
            this._processBatch(batchKey);
        }
    },
    
    // Procesar batch de requests
    async _processBatch(batchKey) {
        const batch = this.batchQueue.get(batchKey);
        if (!batch || batch.requests.length === 0) return;
        
        const { requests } = batch;
        this.batchQueue.delete(batchKey);
        
        console.log(`📦 Procesando batch de ${requests.length} requests para ${batchKey}`);
        
        try {
            // Construir request batch
            const batchParams = requests.map(r => r.params);
            const batchUrl = this._buildBatchUrl(batchKey, batchParams);
            
            // Realizar request batch
            const batchResponse = await this.cachedRequest(batchUrl);
            
            // Distribuir respuestas
            requests.forEach((request, index) => {
                const individualResponse = this._extractIndividualResponse(batchResponse, index);
                request.callback(individualResponse);
            });
            
            this.stats.batchedRequests += requests.length;
            
        } catch (error) {
            console.error(`[ERROR] Error en batch ${batchKey}:`, error);
            
            // Ejecutar callbacks con error
            requests.forEach(request => {
                request.callback(null, error);
            });
        }
    },
    
    // ========= REQUEST QUEUE Y CONTROL DE CONCURRENCIA =========
    
    // Crear cola de requests con control de concurrencia
    createRequestQueue(concurrencyLimit = 5) {
        return {
            queue: [],
            running: 0,
            limit: concurrencyLimit,
            
            async add(requestFn) {
                return new Promise((resolve, reject) => {
                    this.queue.push({ requestFn, resolve, reject });
                    this._processQueue();
                });
            },
            
            async _processQueue() {
                if (this.running >= this.limit || this.queue.length === 0) {
                    return;
                }
                
                this.running++;
                const { requestFn, resolve, reject } = this.queue.shift();
                
                try {
                    const result = await requestFn();
                    resolve(result);
                } catch (error) {
                    reject(error);
                } finally {
                    this.running--;
                    this._processQueue();
                }
            }
        };
    },
    
    // ========= INTERCEPTORES =========
    
    // Configurar interceptores de requests
    setupRequestInterceptors() {
        // Interceptar fetch global
        const originalFetch = window.fetch;
        
        window.fetch = async (url, options = {}) => {
            const startTime = performance.now();
            
            try {
                // Aplicar optimizaciones automaticas
                const optimizedOptions = this._optimizeRequestOptions(options);
                
                // Realizar request
                const response = await originalFetch(url, optimizedOptions);
                
                // Actualizar metricas
                const endTime = performance.now();
                this._updateMetrics(endTime - startTime, response);
                
                return response;
                
            } catch (error) {
                this.stats.failedRequests++;
                throw error;
            }
        };
        
        console.log('[OK] Interceptores de fetch configurados');
    },
    
    // ========= UTILIDADES =========
    
    // Generar key para cache
    _generateCacheKey(url, options) {
        const method = options.method || 'GET';
        const body = options.body || '';
        const params = new URL(url).searchParams.toString();
        
        return `${method}_${url}_${params}_${btoa(body).substring(0, 50)}`;
    },
    
    // Obtener TTL para URL
    _getTtlForUrl(url) {
        for (const [pattern, ttl] of Object.entries(this.config.cacheTtl)) {
            if (url.includes(pattern)) {
                return ttl;
            }
        }
        return this.config.cacheTtl.static; // TTL por defecto
    },
    
    // Verificar si el cache es valido
    _isCacheValid(cached, ttlMinutes) {
        const now = Date.now();
        const cacheTime = new Date(cached.cached_at).getTime();
        const ttlMs = ttlMinutes * 60 * 1000;
        
        return (now - cacheTime) < ttlMs;
    },
    
    // Verificar si la respuesta es cacheable
    _isCacheable(response) {
        // Solo cachear respuestas exitosas GET
        return response && response.status >= 200 && response.status < 300;
    },
    
    // Realizar request HTTP
    async _performRequest(url, options = {}) {
        this.stats.totalRequests++;
        
        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    },
    
    // Calcular delay para retry
    _calculateRetryDelay(attempt) {
        const baseDelay = this.config.retryConfig.retryDelay;
        
        if (this.config.retryConfig.exponentialBackoff) {
            return baseDelay * Math.pow(2, attempt - 1);
        }
        
        return baseDelay;
    },
    
    // Verificar si el error es reintentable
    _isRetryableError(error) {
        if (error.status) {
            return this.config.retryConfig.retryableStatusCodes.includes(error.status);
        }
        
        // Errores de red son reinventables
        return error.name === 'NetworkError' || error.name === 'TypeError';
    },
    
    // Sleep utility
    _sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    
    // Obtener key para batch
    _getBatchKey(endpoint) {
        return endpoint.split('/')[0]; // Primer segmento del endpoint
    },
    
    // Construir URL para batch
    _buildBatchUrl(batchKey, batchParams) {
        return `/api/batch/${batchKey}?batch=${encodeURIComponent(JSON.stringify(batchParams))}`;
    },
    
    // Extraer respuesta individual del batch
    _extractIndividualResponse(batchResponse, index) {
        if (Array.isArray(batchResponse) && batchResponse[index]) {
            return batchResponse[index];
        }
        return batchResponse;
    },
    
    // Optimizar opciones de request
    _optimizeRequestOptions(options) {
        const optimized = { ...options };
        
        // Agregar headers de optimizacion
        optimized.headers = {
            'Accept-Encoding': 'gzip, br',
            'Accept': 'application/json',
            ...optimized.headers
        };
        
        // Configurar timeout por defecto
        if (!optimized.timeout) {
            optimized.timeout = 30000; // 30 segundos
        }
        
        return optimized;
    },
    
    // Actualizar metricas
    _updateMetrics(responseTime, response) {
        // Actualizar tiempo de respuesta promedio
        this.stats.averageResponseTime = (
            (this.stats.averageResponseTime * (this.stats.totalRequests - 1)) + responseTime
        ) / this.stats.totalRequests;
        
        // Estimar bytes transferidos
        if (response) {
            try {
                const responseSize = JSON.stringify(response).length;
                this.stats.bytesTransferred += responseSize;
            } catch (e) {
                // Ignore si no se puede serializar
            }
        }
    },
    
    // ========= CONFIGURACIÓN Y SETUP =========
    
    // Configurar batch processing
    setupBatchProcessing() {
        if (!this.config.batchConfig.enabled) {
            console.log('[WARNING] Batch processing deshabilitado');
            return;
        }
        
        console.log('📦 Batch processing configurado');
    },
    
    // Configurar metricas automaticas
    setupMetrics() {
        // Reportar metricas cada 5 minutos
        setInterval(() => {
            this._logMetrics();
        }, 5 * 60 * 1000);
    },
    
    // Configurar cache de API
    setupApiCache() {
        if (!window.CacheManager) {
            console.warn('[WARNING] CacheManager no disponible para API cache');
            return;
        }
        
        console.log('💾 Cache de API configurado');
    },
    
    // ========= MÉTRICAS Y DEBUG =========
    
    // Obtener estadisticas
    getStats() {
        const hitRate = this.stats.cachedRequests / this.stats.totalRequests * 100;
        const avgResponseTime = Math.round(this.stats.averageResponseTime);
        const bytesTransferredMB = (this.stats.bytesTransferred / (1024 * 1024)).toFixed(2);
        
        return {
            ...this.stats,
            hitRate: isNaN(hitRate) ? 0 : hitRate.toFixed(2) + '%',
            averageResponseTime: avgResponseTime + 'ms',
            bytesTransferredMB: bytesTransferredMB + 'MB'
        };
    },
    
    // Log de metricas
    _logMetrics() {
        const stats = this.getStats();
        
        console.log('\
📡 === ESTADÍSTICAS DE API ===');
        console.log(`🔢 Total requests: ${stats.totalRequests}`);
        console.log(`💾 Cache hits: ${stats.cachedRequests} (${stats.hitRate})`);
        console.log(`⏱️  Tiempo promedio: ${stats.averageResponseTime}`);
        console.log(`🗜️ Debounced: ${stats.debouncedRequests}`);
        console.log(`⚡ Throttled: ${stats.throttledRequests}`);
        console.log(`📦 Batched: ${stats.batchedRequests}`);
        console.log(`🔄 Retried: ${stats.retriedRequests}`);
        console.log(`[ERROR] Failed: ${stats.failedRequests}`);
        console.log(`📊 Data transferred: ${stats.bytesTransferredMB}`);
        console.log('=============================\
');
    },
    
    // Mostrar estadisticas
    showStats() {
        this._logMetrics();
    },
    
    // Limpiar timers y recursos
    cleanup() {
        // Limpiar todos los timers
        this.timers.forEach(timer => clearTimeout(timer));
        this.timers.clear();
        
        // Limpiar batches pendientes
        this.batchQueue.forEach(batch => {
            if (batch.timer) clearTimeout(batch.timer);
        });
        this.batchQueue.clear();
        
        console.log('[ICON:CLEAN] API Optimizer limpiado');
    }
};

// Inicializar automaticamente
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.ApiOptimizer.init();
    });
} else {
    window.ApiOptimizer.init();
}

// Exponer funciones globales utiles
window.showApiStats = () => window.ApiOptimizer.showStats();
window.debouncedSearch = (fn, delay) => window.ApiOptimizer.createDebouncedSearch(fn, delay);
window.throttledScroll = (fn, delay) => window.ApiOptimizer.createThrottledScroll(fn, delay);

console.log('[OK] API Optimizer cargado');