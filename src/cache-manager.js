// VentasPet - Sistema de Cache Inteligente y Gestión de Almacenamiento
// Implementa estrategias de cache, localStorage, sessionStorage y cache de API

console.log('💾 Cargando Cache Manager...');

window.CacheManager = {
    // Configuración de cache
    config: {
        // TTL por defecto en minutos
        defaultTTL: 60,
        // Límite de tamaño de cache en MB
        maxCacheSize: 10,
        // Versión del cache para invalidación
        cacheVersion: '1.0.0',
        // Prefijos para diferentes tipos de datos
        prefixes: {
            api: 'vp_api_',
            user: 'vp_user_',
            temp: 'vp_temp_',
            images: 'vp_img_',
            config: 'vp_config_'
        }
    },
    
    // Estadísticas de uso
    stats: {
        hits: 0,
        misses: 0,
        expired: 0,
        errors: 0,
        totalSize: 0
    },
    
    init() {
        console.log('🚀 Inicializando Cache Manager...');
        
        // Limpiar cache expirado al inicio
        this.cleanExpiredCache();
        
        // Configurar limpieza automática
        this.setupAutoCleanup();
        
        // Monitorear uso de almacenamiento
        this.setupStorageMonitoring();
        
        // Configurar cache de Service Worker si está disponible
        this.setupServiceWorkerCache();
        
        return this;
    },
    
    // ========= MÉTODOS DE CACHE GENÉRICOS =========
    
    // Obtener elemento del cache
    get(key, type = 'api') {
        try {
            const fullKey = this.config.prefixes[type] + key;
            const cached = localStorage.getItem(fullKey);
            
            if (!cached) {
                this.stats.misses++;
                return null;
            }
            
            const parsedData = JSON.parse(cached);
            
            // Verificar si ha expirado
            if (this._isExpired(parsedData)) {
                this.remove(key, type);
                this.stats.expired++;
                return null;
            }
            
            this.stats.hits++;
            return parsedData.data;
            
        } catch (error) {
            console.warn(`⚠️ Error obteniendo cache ${key}:`, error);
            this.stats.errors++;
            return null;
        }
    },
    
    // Guardar elemento en cache
    set(key, data, ttlMinutes = null, type = 'api') {
        try {
            const fullKey = this.config.prefixes[type] + key;
            const ttl = ttlMinutes || this.config.defaultTTL;
            
            const cacheItem = {
                data: data,
                timestamp: Date.now(),
                ttl: ttl * 60 * 1000, // Convertir a millisegundos
                version: this.config.cacheVersion,
                size: JSON.stringify(data).length
            };
            
            // Verificar espacio disponible
            if (!this._hasStorageSpace(cacheItem.size)) {
                this._freeUpSpace(cacheItem.size);
            }
            
            localStorage.setItem(fullKey, JSON.stringify(cacheItem));
            this.stats.totalSize += cacheItem.size;
            
            console.log(`💾 Cache guardado: ${key} (${this._formatBytes(cacheItem.size)}, TTL: ${ttl}min)`);
            return true;
            
        } catch (error) {
            console.warn(`⚠️ Error guardando cache ${key}:`, error);
            this.stats.errors++;
            return false;
        }
    },
    
    // Remover elemento del cache
    remove(key, type = 'api') {
        try {
            const fullKey = this.config.prefixes[type] + key;
            const cached = localStorage.getItem(fullKey);
            
            if (cached) {
                const parsedData = JSON.parse(cached);
                this.stats.totalSize -= parsedData.size || 0;
            }
            
            localStorage.removeItem(fullKey);
            return true;
        } catch (error) {
            console.warn(`⚠️ Error removiendo cache ${key}:`, error);
            return false;
        }
    },
    
    // ========= CACHE ESPECÍFICO PARA API =========
    
    // Cache de respuestas de API
    cacheApiResponse(endpoint, data, ttl = 30) {
        const key = this._generateApiKey(endpoint);
        return this.set(key, {
            endpoint: endpoint,
            data: data,
            cached_at: new Date().toISOString()
        }, ttl, 'api');
    },
    
    // Obtener respuesta de API del cache
    getCachedApiResponse(endpoint) {
        const key = this._generateApiKey(endpoint);
        const cached = this.get(key, 'api');
        
        if (cached) {
            console.log(`📡 API Cache Hit: ${endpoint}`);
            return cached.data;
        }
        
        console.log(`📡 API Cache Miss: ${endpoint}`);
        return null;
    },
    
    // Generar key para API
    _generateApiKey(endpoint) {
        // Normalizar endpoint para cache
        return endpoint.replace(/[^\w]/g, '_').toLowerCase();
    },
    
    // ========= CACHE DE IMÁGENES =========
    
    // Cache de imágenes con compresión
    async cacheImage(url, compressionLevel = 0.8) {
        try {
            const key = this._generateImageKey(url);
            
            // Verificar si ya está en cache
            const cached = this.get(key, 'images');
            if (cached) {
                return cached;
            }
            
            // Descargar y comprimir imagen
            const compressedImage = await this._compressImage(url, compressionLevel);
            
            if (compressedImage) {
                this.set(key, compressedImage, 1440, 'images'); // TTL 24 horas
                return compressedImage;
            }
            
            return null;
        } catch (error) {
            console.error(`❌ Error cacheando imagen ${url}:`, error);
            return null;
        }
    },
    
    // Obtener imagen del cache
    getCachedImage(url) {
        const key = this._generateImageKey(url);
        return this.get(key, 'images');
    },
    
    // Generar key para imagen
    _generateImageKey(url) {
        return btoa(url).replace(/[^a-zA-Z0-9]/g, '').substring(0, 50);
    },
    
    // Comprimir imagen (simulado)
    async _compressImage(url, quality) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Redimensionar si es muy grande
                    const maxWidth = 800;
                    const maxHeight = 600;
                    let { width, height } = img;
                    
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                    
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                    
                    resolve({
                        original: url,
                        compressed: compressedDataUrl,
                        originalSize: url.length,
                        compressedSize: compressedDataUrl.length,
                        ratio: compressedDataUrl.length / url.length,
                        width: width,
                        height: height
                    });
                } catch (error) {
                    console.error('Error comprimiendo imagen:', error);
                    resolve(null);
                }
            };
            
            img.onerror = () => resolve(null);
            img.src = url;
        });
    },
    
    // ========= GESTIÓN DE DATOS USUARIO =========
    
    // Guardar datos de usuario persistentes
    setUserData(key, data, persistent = true) {
        const storage = persistent ? localStorage : sessionStorage;
        const fullKey = this.config.prefixes.user + key;
        
        try {
            const userData = {
                data: data,
                timestamp: Date.now(),
                persistent: persistent
            };
            
            storage.setItem(fullKey, JSON.stringify(userData));
            return true;
        } catch (error) {
            console.error(`❌ Error guardando datos usuario ${key}:`, error);
            return false;
        }
    },
    
    // Obtener datos de usuario
    getUserData(key, persistent = true) {
        const storage = persistent ? localStorage : sessionStorage;
        const fullKey = this.config.prefixes.user + key;
        
        try {
            const cached = storage.getItem(fullKey);
            if (cached) {
                return JSON.parse(cached).data;
            }
            return null;
        } catch (error) {
            console.error(`❌ Error obteniendo datos usuario ${key}:`, error);
            return null;
        }
    },
    
    // ========= DATOS TEMPORALES =========
    
    // Guardar datos temporales (se limpian automáticamente)
    setTempData(key, data, ttlMinutes = 60) {
        return this.set(key, data, ttlMinutes, 'temp');
    },
    
    // Obtener datos temporales
    getTempData(key) {
        return this.get(key, 'temp');
    },
    
    // ========= CONFIGURACIÓN Y PREFERENCIAS =========
    
    // Guardar configuración de la app
    setAppConfig(key, config) {
        return this.set(key, config, null, 'config'); // Sin TTL para configuración
    },
    
    // Obtener configuración de la app
    getAppConfig(key) {
        return this.get(key, 'config');
    },
    
    // ========= MÉTODOS DE UTILIDAD =========
    
    // Verificar si un elemento ha expirado
    _isExpired(cacheItem) {
        if (!cacheItem.ttl) return false; // Sin TTL = no expira
        return Date.now() > (cacheItem.timestamp + cacheItem.ttl);
    },
    
    // Verificar espacio disponible
    _hasStorageSpace(newItemSize) {
        const maxSizeBytes = this.config.maxCacheSize * 1024 * 1024; // MB a bytes
        return (this.stats.totalSize + newItemSize) < maxSizeBytes;
    },
    
    // Liberar espacio eliminando elementos antiguos
    _freeUpSpace(requiredSpace) {
        console.log('🧹 Liberando espacio en cache...');
        
        const allKeys = this._getAllCacheKeys();
        const itemsWithAge = [];
        
        // Obtener edad de cada elemento
        allKeys.forEach(key => {
            try {
                const item = JSON.parse(localStorage.getItem(key));
                if (item && item.timestamp) {
                    itemsWithAge.push({
                        key: key,
                        age: Date.now() - item.timestamp,
                        size: item.size || 0
                    });
                }
            } catch (error) {
                // Item corrupto, marcarlo para eliminación
                itemsWithAge.push({
                    key: key,
                    age: Infinity,
                    size: 0
                });
            }
        });
        
        // Ordenar por edad (más viejo primero)
        itemsWithAge.sort((a, b) => b.age - a.age);
        
        let freedSpace = 0;
        let removedItems = 0;
        
        // Eliminar elementos hasta liberar el espacio necesario
        for (const item of itemsWithAge) {
            localStorage.removeItem(item.key);
            freedSpace += item.size;
            removedItems++;
            
            if (freedSpace >= requiredSpace) {
                break;
            }
        }
        
        this.stats.totalSize -= freedSpace;
        console.log(`✅ Espacio liberado: ${this._formatBytes(freedSpace)} (${removedItems} elementos)`);
    },
    
    // Obtener todas las keys del cache
    _getAllCacheKeys() {
        const keys = [];
        const prefixes = Object.values(this.config.prefixes);
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (prefixes.some(prefix => key.startsWith(prefix))) {
                keys.push(key);
            }
        }
        
        return keys;
    },
    
    // Limpiar cache expirado
    cleanExpiredCache() {
        console.log('🧹 Limpiando cache expirado...');
        
        const allKeys = this._getAllCacheKeys();
        let cleanedItems = 0;
        let freedSpace = 0;
        
        allKeys.forEach(key => {
            try {
                const item = JSON.parse(localStorage.getItem(key));
                if (item && this._isExpired(item)) {
                    localStorage.removeItem(key);
                    cleanedItems++;
                    freedSpace += item.size || 0;
                }
            } catch (error) {
                // Item corrupto, eliminarlo
                localStorage.removeItem(key);
                cleanedItems++;
            }
        });
        
        this.stats.totalSize -= freedSpace;
        
        if (cleanedItems > 0) {
            console.log(`✅ Cache limpiado: ${cleanedItems} elementos, ${this._formatBytes(freedSpace)} liberados`);
        }
    },
    
    // Configurar limpieza automática
    setupAutoCleanup() {
        // Limpiar cada 30 minutos
        setInterval(() => {
            this.cleanExpiredCache();
        }, 30 * 60 * 1000);
        
        // Limpiar antes de cerrar la página
        window.addEventListener('beforeunload', () => {
            this.cleanExpiredCache();
        });
    },
    
    // Monitorear uso de almacenamiento
    setupStorageMonitoring() {
        // Verificar espacio cada 5 minutos
        setInterval(() => {
            this._checkStorageUsage();
        }, 5 * 60 * 1000);
    },
    
    // Verificar uso de almacenamiento
    _checkStorageUsage() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            navigator.storage.estimate().then(estimate => {
                const usedMB = estimate.usage / (1024 * 1024);
                const quotaMB = estimate.quota / (1024 * 1024);
                const usagePercent = (estimate.usage / estimate.quota) * 100;
                
                console.log(`💾 Storage: ${usedMB.toFixed(2)}MB / ${quotaMB.toFixed(2)}MB (${usagePercent.toFixed(1)}%)`);
                
                // Si el uso es muy alto, limpiar cache agresivamente
                if (usagePercent > 80) {
                    console.warn('⚠️ Almacenamiento casi lleno, limpiando cache...');
                    this._aggressiveCleanup();
                }
            });
        }
    },
    
    // Limpieza agresiva de cache
    _aggressiveCleanup() {
        const allKeys = this._getAllCacheKeys();
        let cleanedItems = 0;
        
        // Eliminar elementos más viejos de 1 hora
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        
        allKeys.forEach(key => {
            try {
                const item = JSON.parse(localStorage.getItem(key));
                if (item && item.timestamp < oneHourAgo) {
                    localStorage.removeItem(key);
                    cleanedItems++;
                }
            } catch (error) {
                localStorage.removeItem(key);
                cleanedItems++;
            }
        });
        
        console.log(`🧹 Limpieza agresiva completada: ${cleanedItems} elementos removidos`);
    },
    
    // Configurar cache de Service Worker - DESACTIVADO TEMPORALMENTE
    setupServiceWorkerCache() {
        console.log('⚠️ Service Worker cache DESACTIVADO para evitar problemas de caché');
        // COMENTADO: Causaba problemas con endpoints cacheados incorrectamente
        /*
        if ('serviceWorker' in navigator && 'caches' in window) {
            // Registrar service worker para cache de recursos estáticos
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('✅ Service Worker registrado para cache');
                })
                .catch(error => {
                    console.log('⚠️ Service Worker no disponible');
                });
        }
        */
    },
    
    // Formatear bytes para display
    _formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    
    // ========= MÉTRICAS Y DEBUG =========
    
    // Obtener estadísticas del cache
    getStats() {
        const hitRate = this.stats.hits / (this.stats.hits + this.stats.misses) * 100;
        
        return {
            ...this.stats,
            hitRate: isNaN(hitRate) ? 0 : hitRate.toFixed(2) + '%',
            formattedSize: this._formatBytes(this.stats.totalSize),
            totalKeys: this._getAllCacheKeys().length
        };
    },
    
    // Mostrar resumen en consola
    showStats() {
        const stats = this.getStats();
        
        console.log('\n💾 === ESTADÍSTICAS DE CACHE ===');
        console.log(`📊 Hit Rate: ${stats.hitRate}`);
        console.log(`✅ Hits: ${stats.hits}`);
        console.log(`❌ Misses: ${stats.misses}`);
        console.log(`⏰ Expired: ${stats.expired}`);
        console.log(`🚫 Errors: ${stats.errors}`);
        console.log(`📦 Total Size: ${stats.formattedSize}`);
        console.log(`🔑 Total Keys: ${stats.totalKeys}`);
        console.log('===============================\n');
    },
    
    // Limpiar todo el cache
    clearAll() {
        const allKeys = this._getAllCacheKeys();
        allKeys.forEach(key => localStorage.removeItem(key));
        
        this.stats = {
            hits: 0,
            misses: 0,
            expired: 0,
            errors: 0,
            totalSize: 0
        };
        
        console.log('🗑️ Cache completamente limpiado');
    },
    
    // Exportar cache para debug
    exportCache() {
        const allKeys = this._getAllCacheKeys();
        const exportData = {};
        
        allKeys.forEach(key => {
            try {
                exportData[key] = JSON.parse(localStorage.getItem(key));
            } catch (error) {
                exportData[key] = 'CORRUPTED';
            }
        });
        
        return exportData;
    }
};

// Inicializar automáticamente
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.CacheManager.init();
    });
} else {
    window.CacheManager.init();
}

// Exponer métodos globales para debug
window.showCacheStats = () => window.CacheManager.showStats();
window.clearCache = () => window.CacheManager.clearAll();

console.log('✅ Cache Manager cargado');