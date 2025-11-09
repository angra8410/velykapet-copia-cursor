// VentasPet - Sistema de Optimizacion de Imagenes y Recursos Multimedia
// Implementa compresion, lazy loading, formatos modernos y optimizacion automatica

console.log('[ICON:IMAGE] Cargando Image Optimizer...');

window.ImageOptimizer = {
    // Configuracion de optimizacion
    config: {
        // Calidades de compresion por tipo de imagen
        quality: {
            thumbnail: 0.6,
            product: 0.8,
            hero: 0.9,
            avatar: 0.7
        },
        
        // Tamanos maximos por tipo
        maxSizes: {
            thumbnail: { width: 150, height: 150 },
            product: { width: 400, height: 400 },
            hero: { width: 1200, height: 600 },
            avatar: { width: 100, height: 100 }
        },
        
        // Formatos soportados en orden de preferencia
        formats: ['webp', 'jpeg', 'png'],
        
        // Lazy loading settings
        lazyLoading: {
            threshold: 0.1,
            rootMargin: '50px',
            fadeInDuration: 300
        },
        
        // Cache settings
        cacheExpiry: 24 * 60 * 60 * 1000 // 24 horas
    },
    
    // Estadisticas de optimizacion
    stats: {
        imagesProcessed: 0,
        totalOriginalSize: 0,
        totalOptimizedSize: 0,
        averageCompression: 0,
        lazyLoadedImages: 0,
        webpSupported: false
    },
    
    init() {
        console.log('[ICON:ROCKET] Inicializando Image Optimizer...');
        
        // Detectar soporte para formatos modernos
        this.detectFormatSupport();
        
        // Configurar lazy loading de imagenes
        this.setupLazyLoading();
        
        // Optimizar imagenes existentes
        this.optimizeExistingImages();
        
        // Configurar optimizacion automatica para nuevas imagenes
        this.setupAutoOptimization();
        
        // Configurar preloading inteligente
        this.setupIntelligentPreloading();
        
        return this;
    },
    
    // ========= DETECCIÓN DE SOPORTE DE FORMATOS =========
    
    // Detectar soporte para formatos modernos
    async detectFormatSupport() {
        // Verificar soporte WebP
        this.stats.webpSupported = await this._checkWebPSupport();
        
        // Verificar soporte AVIF (formato futuro)
        this.stats.avifSupported = await this._checkAVIFSupport();
        
        console.log('[ICON:CLIPBOARD] Formatos soportados:', {
            webp: this.stats.webpSupported,
            avif: this.stats.avifSupported
        });
    },
    
    // Verificar soporte WebP
    _checkWebPSupport() {
        return new Promise(resolve => {
            const webp = new Image();
            webp.onload = webp.onerror = () => {
                resolve(webp.height === 2);
            };
            webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    },
    
    // Verificar soporte AVIF
    _checkAVIFSupport() {
        return new Promise(resolve => {
            const avif = new Image();
            avif.onload = avif.onerror = () => {
                resolve(avif.height === 2);
            };
            avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
        });
    },
    
    // ========= LAZY LOADING =========
    
    // Configurar lazy loading para todas las imagenes
    setupLazyLoading() {
        if (!('IntersectionObserver' in window)) {
            console.warn('[WARNING] IntersectionObserver no soportado, cargando todas las imagenes');
            this.loadAllImages();
            return;
        }
        
        // Crear observer para lazy loading
        this.lazyObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadLazyImage(entry.target);
                    }
                });
            },
            {
                threshold: this.config.lazyLoading.threshold,
                rootMargin: this.config.lazyLoading.rootMargin
            }
        );
        
        // Observar imagenes existentes
        this.observeExistingImages();
        
        // Configurar observer para nuevas imagenes
        this.setupNewImageObserver();
    },
    
    // Observar imagenes existentes
    observeExistingImages() {
        const images = document.querySelectorAll('img[data-src], img[src]:not([data-optimized])');
        
        images.forEach(img => {
            // Si tiene data-src, es para lazy loading
            if (img.hasAttribute('data-src')) {
                this.prepareLazyImage(img);
                this.lazyObserver.observe(img);
            } else {
                // Optimizar imagen que ya esta cargada
                this.optimizeLoadedImage(img);
            }
        });
        
        console.log(`👀 Observando ${images.length} imagenes para lazy loading`);
    },
    
    // Preparar imagen para lazy loading
    prepareLazyImage(img) {
        // Agregar clases CSS
        img.classList.add('lazy-image', 'loading');
        
        // Crear placeholder si no tiene src
        if (!img.src || img.src === '') {
            img.src = this.generatePlaceholder(
                img.getAttribute('width') || 300,
                img.getAttribute('height') || 200,
                img.getAttribute('data-type') || 'product'
            );
        }
        
        // Agregar atributo de carga
        img.setAttribute('loading', 'lazy');
    },
    
    // Cargar imagen lazy
    async loadLazyImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) return;
        
        try {
            // Generar imagen optimizada
            const optimizedSrc = await this.getOptimizedImageUrl(src, img.getAttribute('data-type') || 'product');
            
            // Precargar imagen
            const tempImg = new Image();
            
            tempImg.onload = () => {
                // Aplicar imagen optimizada
                img.src = optimizedSrc;
                img.classList.remove('loading');
                img.classList.add('loaded');
                img.removeAttribute('data-src');
                img.setAttribute('data-optimized', 'true');
                
                // Efecto fade-in
                this.addFadeInEffect(img);
                
                this.stats.lazyLoadedImages++;
                console.log(`[OK] Imagen lazy cargada y optimizada: ${src}`);
            };
            
            tempImg.onerror = () => {
                console.error(`[ERROR] Error cargando imagen: ${src}`);
                img.classList.remove('loading');
                img.classList.add('error');
                img.alt = img.alt || 'Error cargando imagen';
            };
            
            tempImg.src = optimizedSrc;
            
        } catch (error) {
            console.error(`[ERROR] Error optimizando imagen ${src}:`, error);
            img.src = src; // Fallback a imagen original
            img.classList.remove('loading');
            img.classList.add('loaded');
        }
        
        // Dejar de observar
        this.lazyObserver.unobserve(img);
    },
    
    // ========= OPTIMIZACIÓN DE IMÁGENES =========
    
    // Obtener URL de imagen optimizada
    async getOptimizedImageUrl(originalUrl, type = 'product') {
        // Verificar cache primero
        const cached = window.CacheManager?.getCachedImage(originalUrl);
        if (cached) {
            return cached.compressed;
        }
        
        try {
            // Determinar formato optimo
            const optimalFormat = this.getOptimalFormat();
            
            // Si es una imagen externa, intentar optimizar
            if (originalUrl.startsWith('http')) {
                const optimized = await this.optimizeExternalImage(originalUrl, type, optimalFormat);
                if (optimized) {
                    // Cachear resultado
                    if (window.CacheManager) {
                        window.CacheManager.cacheImage(originalUrl, optimized);
                    }
                    return optimized.compressed;
                }
            }
            
            // Fallback: retornar URL original con parametros de optimizacion
            return this.addOptimizationParams(originalUrl, type);
            
        } catch (error) {
            console.warn(`[WARNING] Error optimizando ${originalUrl}:`, error);
            return originalUrl;
        }
    },
    
    // Determinar formato optimo segun soporte del navegador
    getOptimalFormat() {
        if (this.stats.avifSupported) return 'avif';
        if (this.stats.webpSupported) return 'webp';
        return 'jpeg';
    },
    
    // Optimizar imagen externa
    async optimizeExternalImage(url, type, format) {
        try {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            return new Promise((resolve, reject) => {
                img.onload = () => {
                    try {
                        const optimized = this.compressImage(img, type, format);
                        
                        // Actualizar estadisticas
                        this.updateCompressionStats(url, optimized);
                        
                        resolve(optimized);
                    } catch (error) {
                        reject(error);
                    }
                };
                
                img.onerror = () => reject(new Error(`No se pudo cargar la imagen: ${url}`));
                img.src = url;
            });
            
        } catch (error) {
            console.error(`Error optimizando imagen externa ${url}:`, error);
            return null;
        }
    },
    
    // Comprimir imagen usando canvas
    compressImage(img, type = 'product', format = 'jpeg') {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Obtener configuracion para el tipo
        const maxSize = this.config.maxSizes[type] || this.config.maxSizes.product;
        const quality = this.config.quality[type] || this.config.quality.product;
        
        // Calcular nuevas dimensiones
        const { width, height } = this.calculateOptimalSize(img.width, img.height, maxSize);
        
        // Configurar canvas
        canvas.width = width;
        canvas.height = height;
        
        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height);
        
        // Determinar tipo MIME
        const mimeType = format === 'webp' ? 'image/webp' :
                        format === 'avif' ? 'image/avif' :
                        'image/jpeg';
        
        // Comprimir
        const compressedDataUrl = canvas.toDataURL(mimeType, quality);
        
        return {
            original: img.src,
            compressed: compressedDataUrl,
            format: format,
            quality: quality,
            originalSize: this.estimateImageSize(img.width, img.height),
            compressedSize: compressedDataUrl.length,
            width: width,
            height: height,
            compressionRatio: compressedDataUrl.length / this.estimateImageSize(img.width, img.height)
        };
    },
    
    // Calcular tamano optimo manteniendo aspect ratio
    calculateOptimalSize(originalWidth, originalHeight, maxSize) {
        let { width, height } = { width: originalWidth, height: originalHeight };
        
        // Redimensionar si excede los limites
        if (width > maxSize.width) {
            height = (height * maxSize.width) / width;
            width = maxSize.width;
        }
        
        if (height > maxSize.height) {
            width = (width * maxSize.height) / height;
            height = maxSize.height;
        }
        
        return { 
            width: Math.floor(width), 
            height: Math.floor(height) 
        };
    },
    
    // Estimar tamano de imagen
    estimateImageSize(width, height) {
        // Estimacion aproximada basada en dimensiones
        return width * height * 3; // 3 bytes por pixel (RGB)
    },
    
    // Agregar parametros de optimizacion a URL
    addOptimizationParams(url, type) {
        const maxSize = this.config.maxSizes[type] || this.config.maxSizes.product;
        const quality = Math.floor((this.config.quality[type] || 0.8) * 100);
        
        // Para servicios como Cloudinary, Imgix, etc.
        if (url.includes('cloudinary.com')) {
            return url.replace('/upload/', `/upload/w_${maxSize.width},h_${maxSize.height},c_fill,q_${quality},f_auto/`);
        }
        
        // Para otros servicios, agregar parametros query
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}w=${maxSize.width}&h=${maxSize.height}&q=${quality}&auto=format`;
    },
    
    // ========= EFECTOS VISUALES =========
    
    // Agregar efecto fade-in
    addFadeInEffect(img) {
        img.style.opacity = '0';
        img.style.transition = `opacity ${this.config.lazyLoading.fadeInDuration}ms ease`;
        
        // Trigger fade-in
        requestAnimationFrame(() => {
            img.style.opacity = '1';
        });
    },
    
    // ========= PLACEHOLDERS =========
    
    // Generar placeholder SVG
    generatePlaceholder(width, height, type = 'product') {
        const colors = {
            product: '#f0f0f0',
            thumbnail: '#e8e8e8',
            hero: '#f5f5f5',
            avatar: '#ddd'
        };
        
        const color = colors[type] || colors.product;
        
        const svg = `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#fff;stop-opacity:0.8" />
                    </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#grad)"/>
                <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.min(width, height) / 10}" 
                      fill="#999" text-anchor="middle" dy=".3em">📸</text>
            </svg>
        `;
        
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    },
    
    // ========= PRELOADING INTELIGENTE =========
    
    // Configurar preloading basado en interacciones
    setupIntelligentPreloading() {
        // Precargar imagenes cuando el usuario hace hover sobre enlaces
        document.addEventListener('mouseover', (e) => {
            this.handleHoverPreloading(e.target);
        }, { passive: true });
        
        // Precargar imagenes en viewport expandido
        this.preloadNearbyImages();
    },
    
    // Manejar preloading en hover
    handleHoverPreloading(element) {
        // Buscar enlaces que puedan tener imagenes
        const link = element.closest('a[href]');
        if (!link) return;
        
        const href = link.getAttribute('href');
        
        // Si es un enlace a producto, precargar imagen
        if (href.includes('/product/') || link.querySelector('img')) {
            const img = link.querySelector('img');
            if (img && img.hasAttribute('data-src')) {
                this.loadLazyImage(img);
            }
        }
    },
    
    // Precargar imagenes cercanas al viewport
    preloadNearbyImages() {
        const extendedObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.hasAttribute('data-src')) {
                            // Precargar con baja prioridad
                            setTimeout(() => {
                                this.loadLazyImage(img);
                            }, 1000);
                        }
                    }
                });
            },
            {
                threshold: 0,
                rootMargin: '200px' // Margen mas amplio para preloading
            }
        );
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            extendedObserver.observe(img);
        });
    },
    
    // ========= OPTIMIZACIÓN DE RECURSOS =========
    
    // Optimizar imagenes existentes
    optimizeExistingImages() {
        const images = document.querySelectorAll('img[src]:not([data-optimized])');
        
        images.forEach(img => {
            this.optimizeLoadedImage(img);
        });
    },
    
    // Optimizar imagen ya cargada
    optimizeLoadedImage(img) {
        if (img.complete && img.naturalWidth > 0) {
            const type = img.getAttribute('data-type') || this.guessImageType(img);
            const maxSize = this.config.maxSizes[type];
            
            // Si la imagen es muy grande, sugerir redimensionamiento
            if (img.naturalWidth > maxSize.width || img.naturalHeight > maxSize.height) {
                console.log(`[ICON:IDEA] Imagen ${img.src} podria optimizarse (${img.naturalWidth}x${img.naturalHeight} > ${maxSize.width}x${maxSize.height})`);
            }
            
            img.setAttribute('data-optimized', 'true');
        }
    },
    
    // Adivinar tipo de imagen basado en contexto
    guessImageType(img) {
        if (img.classList.contains('thumbnail') || img.closest('.thumbnail')) return 'thumbnail';
        if (img.classList.contains('hero') || img.closest('.hero')) return 'hero';
        if (img.classList.contains('avatar') || img.closest('.avatar')) return 'avatar';
        return 'product';
    },
    
    // ========= OBSERVER PARA NUEVAS IMÁGENES =========
    
    setupNewImageObserver() {
        if ('MutationObserver' in window) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Element node
                            const images = node.tagName === 'IMG' ? [node] : node.querySelectorAll('img');
                            images.forEach(img => {
                                if (!img.hasAttribute('data-optimized')) {
                                    if (img.hasAttribute('data-src')) {
                                        this.prepareLazyImage(img);
                                        this.lazyObserver.observe(img);
                                    } else {
                                        this.optimizeLoadedImage(img);
                                    }
                                }
                            });
                        }
                    });
                });
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    },
    
    // ========= UTILIDADES =========
    
    // Actualizar estadisticas de compresion
    updateCompressionStats(originalUrl, optimizedData) {
        this.stats.imagesProcessed++;
        this.stats.totalOriginalSize += optimizedData.originalSize;
        this.stats.totalOptimizedSize += optimizedData.compressedSize;
        
        const totalReduction = (this.stats.totalOriginalSize - this.stats.totalOptimizedSize) / this.stats.totalOriginalSize;
        this.stats.averageCompression = (totalReduction * 100).toFixed(1);
        
        console.log(`📊 Imagen optimizada: ${originalUrl} (${(optimizedData.compressionRatio * 100).toFixed(1)}% del tamano original)`);
    },
    
    // Fallback para navegadores sin IntersectionObserver
    loadAllImages() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            const src = img.getAttribute('data-src');
            if (src) {
                img.src = src;
                img.removeAttribute('data-src');
                img.setAttribute('data-optimized', 'true');
            }
        });
    },
    
    // Configurar optimizacion automatica
    setupAutoOptimization() {
        // Interceptar creacion de nuevas imagenes
        const originalCreateElement = document.createElement;
        document.createElement = function(tagName) {
            const element = originalCreateElement.call(document, tagName);
            
            if (tagName.toLowerCase() === 'img') {
                // Configurar optimizacion automatica para nuevas imagenes
                element.addEventListener('load', function() {
                    if (!this.hasAttribute('data-optimized')) {
                        window.ImageOptimizer.optimizeLoadedImage(this);
                    }
                });
            }
            
            return element;
        };
    },
    
    // ========= MÉTRICAS Y DEBUG =========
    
    // Obtener estadisticas de optimizacion
    getStats() {
        const savingsBytes = this.stats.totalOriginalSize - this.stats.totalOptimizedSize;
        const savingsMB = (savingsBytes / (1024 * 1024)).toFixed(2);
        
        return {
            ...this.stats,
            totalSavingsMB: savingsMB,
            averageCompressionPercent: this.stats.averageCompression + '%'
        };
    },
    
    // Mostrar estadisticas en consola
    showStats() {
        const stats = this.getStats();
        
        console.log('\
[ICON:IMAGE] === ESTADÍSTICAS DE OPTIMIZACIÓN ===');
        console.log(`📊 Imagenes procesadas: ${stats.imagesProcessed}`);
        console.log(`👀 Imagenes lazy loaded: ${stats.lazyLoadedImages}`);
        console.log(`💾 Reduccion promedio: ${stats.averageCompressionPercent}`);
        console.log(`🗜️ Espacio ahorrado: ${stats.totalSavingsMB}MB`);
        console.log(`🌐 WebP soportado: ${stats.webpSupported ? 'Si' : 'No'}`);
        console.log(`[ICON:ROCKET] AVIF soportado: ${stats.avifSupported ? 'Si' : 'No'}`);
        console.log('========================================\
');
    },
    
    // Limpiar recursos
    cleanup() {
        this.lazyObserver?.disconnect();
    }
};

// Inicializar automaticamente
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.ImageOptimizer.init();
    });
} else {
    window.ImageOptimizer.init();
}

// Exponer funcion global para debug
window.showImageStats = () => window.ImageOptimizer.showStats();

console.log('[OK] Image Optimizer cargado');