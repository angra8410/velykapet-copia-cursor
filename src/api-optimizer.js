// VentasPet - Sistema de Optimización de API Calls
// Implementa debounce, throttle, cache de respuestas y optimización de requests

console.log('📡 Cargando API Optimizer...');

window.ApiOptimizer = {
    // Configuración
    config: {
        // Tiempos de debounce por tipo de operación (ms)
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
        
        // Configuración de batch requests
        batchConfig: {
            enabled: true,
            maxBatchSize: 10,
            batchDelay: 100, // ms para agrupar requests
            enabledEndpoints: ['products', 'users', 'orders']
        },
        
        // Configuración de retry
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
    
    // Estadísticas
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
        console.log('🚀 Inicializando API Optimizer...');
        
        // Configurar interceptores de requests
        this.setupRequestInterceptors();
        
        // Configurar batch processing
        this.setupBatchProcessing();
        
        // Configurar métricas automáticas
        this.setupMetrics();
        
        // Configurar cache de API responses
        this.setupApiCache();
        
        return this;
    },
    
    // ========= DEBOUNCE =========
    
    // Crear función debounced
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
    
    // Crear función debounced para búsqueda
    createDebouncedSearch(searchFunction, delay = null) {
        const searchDelay = delay || this.config.debounceDelays.search;
        return this.debounce(searchFunction, searchDelay, 'search');
    },
    
    // Crear función debounced para filtros
    createDebouncedFilter(filterFunction, delay = null) {
        const filterDelay = delay || this.config.debounceDelays.filter;
        return this.debounce(filterFunction, filterDelay, 'filter');
    },
    
    // ========= THROTTLE =========
    
    // Crear función throttled
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
                // Programar ejecución si no existe
                if (!this.timers.has(timerId)) {\n                    const timer = setTimeout(() => {\n                        func.apply(this, args);\n                        lastRun = Date.now();\n                        this.timers.delete(timerId);\n                        this.stats.throttledRequests++;\n                    }, delay - (now - lastRun));\n                    \n                    this.timers.set(timerId, timer);\n                }\n            }\n        };\n    },\n    \n    // Crear función throttled para scroll\n    createThrottledScroll(scrollFunction, delay = null) {\n        const scrollDelay = delay || this.config.throttleDelays.scroll;\n        return this.throttle(scrollFunction, scrollDelay, 'scroll');\n    },\n    \n    // ========= CACHE DE API =========\n    \n    // Realizar request con cache inteligente\n    async cachedRequest(url, options = {}, cacheTtl = null) {\n        const cacheKey = this._generateCacheKey(url, options);\n        const ttl = cacheTtl || this._getTtlForUrl(url);\n        \n        // Intentar obtener de cache primero\n        const cached = window.CacheManager?.getCachedApiResponse(cacheKey);\n        if (cached && this._isCacheValid(cached, ttl)) {\n            this.stats.cachedRequests++;\n            console.log(`📡 Cache Hit: ${url}`);\n            return cached;\n        }\n        \n        try {\n            // Realizar request\n            const startTime = performance.now();\n            const response = await this._performRequest(url, options);\n            const endTime = performance.now();\n            \n            // Actualizar métricas\n            this._updateMetrics(endTime - startTime, response);\n            \n            // Cachear si es exitoso y cacheable\n            if (response && this._isCacheable(response)) {\n                window.CacheManager?.cacheApiResponse(cacheKey, response, ttl);\n            }\n            \n            return response;\n            \n        } catch (error) {\n            this.stats.failedRequests++;\n            throw error;\n        }\n    },\n    \n    // Realizar request con retry automático\n    async requestWithRetry(url, options = {}, maxRetries = null) {\n        const retries = maxRetries || this.config.retryConfig.maxRetries;\n        let lastError;\n        \n        for (let attempt = 0; attempt <= retries; attempt++) {\n            try {\n                if (attempt > 0) {\n                    // Delay antes del retry\n                    const delay = this._calculateRetryDelay(attempt);\n                    await this._sleep(delay);\n                    this.stats.retriedRequests++;\n                    console.log(`🔄 Reintentando request (${attempt}/${retries}): ${url}`);\n                }\n                \n                return await this._performRequest(url, options);\n                \n            } catch (error) {\n                lastError = error;\n                \n                // Solo reintentar para errores específicos\n                if (!this._isRetryableError(error) || attempt === retries) {\n                    break;\n                }\n            }\n        }\n        \n        throw lastError;\n    },\n    \n    // ========= BATCH REQUESTS =========\n    \n    // Agregar request al batch\n    batchRequest(endpoint, params, callback) {\n        if (!this.config.batchConfig.enabled) {\n            // Si batch está deshabilitado, hacer request inmediato\n            return this.cachedRequest(endpoint, { params }).then(callback);\n        }\n        \n        const batchKey = this._getBatchKey(endpoint);\n        \n        if (!this.batchQueue.has(batchKey)) {\n            this.batchQueue.set(batchKey, {\n                requests: [],\n                timer: null\n            });\n        }\n        \n        const batch = this.batchQueue.get(batchKey);\n        \n        // Agregar request al batch\n        batch.requests.push({ params, callback });\n        \n        // Si es el primer request del batch, programar ejecución\n        if (!batch.timer && batch.requests.length === 1) {\n            batch.timer = setTimeout(() => {\n                this._processBatch(batchKey);\n            }, this.config.batchConfig.batchDelay);\n        }\n        \n        // Si se alcanzó el tamaño máximo, procesar inmediatamente\n        if (batch.requests.length >= this.config.batchConfig.maxBatchSize) {\n            clearTimeout(batch.timer);\n            this._processBatch(batchKey);\n        }\n    },\n    \n    // Procesar batch de requests\n    async _processBatch(batchKey) {\n        const batch = this.batchQueue.get(batchKey);\n        if (!batch || batch.requests.length === 0) return;\n        \n        const { requests } = batch;\n        this.batchQueue.delete(batchKey);\n        \n        console.log(`📦 Procesando batch de ${requests.length} requests para ${batchKey}`);\n        \n        try {\n            // Construir request batch\n            const batchParams = requests.map(r => r.params);\n            const batchUrl = this._buildBatchUrl(batchKey, batchParams);\n            \n            // Realizar request batch\n            const batchResponse = await this.cachedRequest(batchUrl);\n            \n            // Distribuir respuestas\n            requests.forEach((request, index) => {\n                const individualResponse = this._extractIndividualResponse(batchResponse, index);\n                request.callback(individualResponse);\n            });\n            \n            this.stats.batchedRequests += requests.length;\n            \n        } catch (error) {\n            console.error(`❌ Error en batch ${batchKey}:`, error);\n            \n            // Ejecutar callbacks con error\n            requests.forEach(request => {\n                request.callback(null, error);\n            });\n        }\n    },\n    \n    // ========= REQUEST QUEUE Y CONTROL DE CONCURRENCIA =========\n    \n    // Crear cola de requests con control de concurrencia\n    createRequestQueue(concurrencyLimit = 5) {\n        return {\n            queue: [],\n            running: 0,\n            limit: concurrencyLimit,\n            \n            async add(requestFn) {\n                return new Promise((resolve, reject) => {\n                    this.queue.push({ requestFn, resolve, reject });\n                    this._processQueue();\n                }.bind(this));\n            },\n            \n            async _processQueue() {\n                if (this.running >= this.limit || this.queue.length === 0) {\n                    return;\n                }\n                \n                this.running++;\n                const { requestFn, resolve, reject } = this.queue.shift();\n                \n                try {\n                    const result = await requestFn();\n                    resolve(result);\n                } catch (error) {\n                    reject(error);\n                } finally {\n                    this.running--;\n                    this._processQueue();\n                }\n            }\n        };\n    },\n    \n    // ========= INTERCEPTORES =========\n    \n    // Configurar interceptores de requests\n    setupRequestInterceptors() {\n        // Interceptar fetch global\n        const originalFetch = window.fetch;\n        \n        window.fetch = async (url, options = {}) => {\n            const startTime = performance.now();\n            \n            try {\n                // Aplicar optimizaciones automáticas\n                const optimizedOptions = this._optimizeRequestOptions(options);\n                \n                // Realizar request\n                const response = await originalFetch(url, optimizedOptions);\n                \n                // Actualizar métricas\n                const endTime = performance.now();\n                this._updateMetrics(endTime - startTime, response);\n                \n                return response;\n                \n            } catch (error) {\n                this.stats.failedRequests++;\n                throw error;\n            }\n        };\n        \n        console.log('✅ Interceptores de fetch configurados');\n    },\n    \n    // ========= UTILIDADES =========\n    \n    // Generar key para cache\n    _generateCacheKey(url, options) {\n        const method = options.method || 'GET';\n        const body = options.body || '';\n        const params = new URL(url).searchParams.toString();\n        \n        return `${method}_${url}_${params}_${btoa(body).substring(0, 50)}`;\n    },\n    \n    // Obtener TTL para URL\n    _getTtlForUrl(url) {\n        for (const [pattern, ttl] of Object.entries(this.config.cacheTtl)) {\n            if (url.includes(pattern)) {\n                return ttl;\n            }\n        }\n        return this.config.cacheTtl.static; // TTL por defecto\n    },\n    \n    // Verificar si el cache es válido\n    _isCacheValid(cached, ttlMinutes) {\n        const now = Date.now();\n        const cacheTime = new Date(cached.cached_at).getTime();\n        const ttlMs = ttlMinutes * 60 * 1000;\n        \n        return (now - cacheTime) < ttlMs;\n    },\n    \n    // Verificar si la respuesta es cacheable\n    _isCacheable(response) {\n        // Solo cachear respuestas exitosas GET\n        return response && response.status >= 200 && response.status < 300;\n    },\n    \n    // Realizar request HTTP\n    async _performRequest(url, options = {}) {\n        this.stats.totalRequests++;\n        \n        const response = await fetch(url, options);\n        \n        if (!response.ok) {\n            throw new Error(`HTTP ${response.status}: ${response.statusText}`);\n        }\n        \n        return await response.json();\n    },\n    \n    // Calcular delay para retry\n    _calculateRetryDelay(attempt) {\n        const baseDelay = this.config.retryConfig.retryDelay;\n        \n        if (this.config.retryConfig.exponentialBackoff) {\n            return baseDelay * Math.pow(2, attempt - 1);\n        }\n        \n        return baseDelay;\n    },\n    \n    // Verificar si el error es reintentable\n    _isRetryableError(error) {\n        if (error.status) {\n            return this.config.retryConfig.retryableStatusCodes.includes(error.status);\n        }\n        \n        // Errores de red son reinventables\n        return error.name === 'NetworkError' || error.name === 'TypeError';\n    },\n    \n    // Sleep utility\n    _sleep(ms) {\n        return new Promise(resolve => setTimeout(resolve, ms));\n    },\n    \n    // Obtener key para batch\n    _getBatchKey(endpoint) {\n        return endpoint.split('/')[0]; // Primer segmento del endpoint\n    },\n    \n    // Construir URL para batch\n    _buildBatchUrl(batchKey, batchParams) {\n        return `/api/batch/${batchKey}?batch=${encodeURIComponent(JSON.stringify(batchParams))}`;\n    },\n    \n    // Extraer respuesta individual del batch\n    _extractIndividualResponse(batchResponse, index) {\n        if (Array.isArray(batchResponse) && batchResponse[index]) {\n            return batchResponse[index];\n        }\n        return batchResponse;\n    },\n    \n    // Optimizar opciones de request\n    _optimizeRequestOptions(options) {\n        const optimized = { ...options };\n        \n        // Agregar headers de optimización\n        optimized.headers = {\n            'Accept-Encoding': 'gzip, br',\n            'Accept': 'application/json',\n            ...optimized.headers\n        };\n        \n        // Configurar timeout por defecto\n        if (!optimized.timeout) {\n            optimized.timeout = 30000; // 30 segundos\n        }\n        \n        return optimized;\n    },\n    \n    // Actualizar métricas\n    _updateMetrics(responseTime, response) {\n        // Actualizar tiempo de respuesta promedio\n        this.stats.averageResponseTime = (\n            (this.stats.averageResponseTime * (this.stats.totalRequests - 1)) + responseTime\n        ) / this.stats.totalRequests;\n        \n        // Estimar bytes transferidos\n        if (response) {\n            try {\n                const responseSize = JSON.stringify(response).length;\n                this.stats.bytesTransferred += responseSize;\n            } catch (e) {\n                // Ignore si no se puede serializar\n            }\n        }\n    },\n    \n    // ========= CONFIGURACIÓN Y SETUP =========\n    \n    // Configurar batch processing\n    setupBatchProcessing() {\n        if (!this.config.batchConfig.enabled) {\n            console.log('⚠️ Batch processing deshabilitado');\n            return;\n        }\n        \n        console.log('📦 Batch processing configurado');\n    },\n    \n    // Configurar métricas automáticas\n    setupMetrics() {\n        // Reportar métricas cada 5 minutos\n        setInterval(() => {\n            this._logMetrics();\n        }, 5 * 60 * 1000);\n    },\n    \n    // Configurar cache de API\n    setupApiCache() {\n        if (!window.CacheManager) {\n            console.warn('⚠️ CacheManager no disponible para API cache');\n            return;\n        }\n        \n        console.log('💾 Cache de API configurado');\n    },\n    \n    // ========= MÉTRICAS Y DEBUG =========\n    \n    // Obtener estadísticas\n    getStats() {\n        const hitRate = this.stats.cachedRequests / this.stats.totalRequests * 100;\n        const avgResponseTime = Math.round(this.stats.averageResponseTime);\n        const bytesTransferredMB = (this.stats.bytesTransferred / (1024 * 1024)).toFixed(2);\n        \n        return {\n            ...this.stats,\n            hitRate: isNaN(hitRate) ? 0 : hitRate.toFixed(2) + '%',\n            averageResponseTime: avgResponseTime + 'ms',\n            bytesTransferredMB: bytesTransferredMB + 'MB'\n        };\n    },\n    \n    // Log de métricas\n    _logMetrics() {\n        const stats = this.getStats();\n        \n        console.log('\\n📡 === ESTADÍSTICAS DE API ===');\n        console.log(`🔢 Total requests: ${stats.totalRequests}`);\n        console.log(`💾 Cache hits: ${stats.cachedRequests} (${stats.hitRate})`);\n        console.log(`⏱️  Tiempo promedio: ${stats.averageResponseTime}`);\n        console.log(`🗜️ Debounced: ${stats.debouncedRequests}`);\n        console.log(`⚡ Throttled: ${stats.throttledRequests}`);\n        console.log(`📦 Batched: ${stats.batchedRequests}`);\n        console.log(`🔄 Retried: ${stats.retriedRequests}`);\n        console.log(`❌ Failed: ${stats.failedRequests}`);\n        console.log(`📊 Data transferred: ${stats.bytesTransferredMB}`);\n        console.log('=============================\\n');\n    },\n    \n    // Mostrar estadísticas\n    showStats() {\n        this._logMetrics();\n    },\n    \n    // Limpiar timers y recursos\n    cleanup() {\n        // Limpiar todos los timers\n        this.timers.forEach(timer => clearTimeout(timer));\n        this.timers.clear();\n        \n        // Limpiar batches pendientes\n        this.batchQueue.forEach(batch => {\n            if (batch.timer) clearTimeout(batch.timer);\n        });\n        this.batchQueue.clear();\n        \n        console.log('🧹 API Optimizer limpiado');\n    }\n};\n\n// Inicializar automáticamente\nif (document.readyState === 'loading') {\n    document.addEventListener('DOMContentLoaded', () => {\n        window.ApiOptimizer.init();\n    });\n} else {\n    window.ApiOptimizer.init();\n}\n\n// Exponer funciones globales útiles\nwindow.showApiStats = () => window.ApiOptimizer.showStats();\nwindow.debouncedSearch = (fn, delay) => window.ApiOptimizer.createDebouncedSearch(fn, delay);\nwindow.throttledScroll = (fn, delay) => window.ApiOptimizer.createThrottledScroll(fn, delay);\n\nconsole.log('✅ API Optimizer cargado');