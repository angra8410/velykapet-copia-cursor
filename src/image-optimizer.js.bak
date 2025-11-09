// VentasPet - Sistema de Optimización de Imágenes y Recursos Multimedia
// Implementa compresión, lazy loading, formatos modernos y optimización automática

console.log('🖼️ Cargando Image Optimizer...');

window.ImageOptimizer = {
    // Configuración de optimización
    config: {
        // Calidades de compresión por tipo de imagen
        quality: {
            thumbnail: 0.6,
            product: 0.8,
            hero: 0.9,
            avatar: 0.7
        },
        
        // Tamaños máximos por tipo
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
    
    // Estadísticas de optimización
    stats: {
        imagesProcessed: 0,
        totalOriginalSize: 0,
        totalOptimizedSize: 0,
        averageCompression: 0,
        lazyLoadedImages: 0,
        webpSupported: false
    },
    
    init() {
        console.log('🚀 Inicializando Image Optimizer...');
        
        // Detectar soporte para formatos modernos
        this.detectFormatSupport();
        
        // Configurar lazy loading de imágenes
        this.setupLazyLoading();
        
        // Optimizar imágenes existentes
        this.optimizeExistingImages();
        
        // Configurar optimización automática para nuevas imágenes
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
        
        console.log('📋 Formatos soportados:', {
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
    
    // Configurar lazy loading para todas las imágenes
    setupLazyLoading() {
        if (!('IntersectionObserver' in window)) {
            console.warn('⚠️ IntersectionObserver no soportado, cargando todas las imágenes');
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
        
        // Observar imágenes existentes
        this.observeExistingImages();
        
        // Configurar observer para nuevas imágenes
        this.setupNewImageObserver();
    },
    
    // Observar imágenes existentes
    observeExistingImages() {
        const images = document.querySelectorAll('img[data-src], img[src]:not([data-optimized])');\n        \n        images.forEach(img => {\n            // Si tiene data-src, es para lazy loading\n            if (img.hasAttribute('data-src')) {\n                this.prepareLazyImage(img);\n                this.lazyObserver.observe(img);\n            } else {\n                // Optimizar imagen que ya está cargada\n                this.optimizeLoadedImage(img);\n            }\n        });\n        \n        console.log(`👀 Observando ${images.length} imágenes para lazy loading`);\n    },\n    \n    // Preparar imagen para lazy loading\n    prepareLazyImage(img) {\n        // Agregar clases CSS\n        img.classList.add('lazy-image', 'loading');\n        \n        // Crear placeholder si no tiene src\n        if (!img.src || img.src === '') {\n            img.src = this.generatePlaceholder(\n                img.getAttribute('width') || 300,\n                img.getAttribute('height') || 200,\n                img.getAttribute('data-type') || 'product'\n            );\n        }\n        \n        // Agregar atributo de carga\n        img.setAttribute('loading', 'lazy');\n    },\n    \n    // Cargar imagen lazy\n    async loadLazyImage(img) {\n        const src = img.getAttribute('data-src');\n        if (!src) return;\n        \n        try {\n            // Generar imagen optimizada\n            const optimizedSrc = await this.getOptimizedImageUrl(src, img.getAttribute('data-type') || 'product');\n            \n            // Precargar imagen\n            const tempImg = new Image();\n            \n            tempImg.onload = () => {\n                // Aplicar imagen optimizada\n                img.src = optimizedSrc;\n                img.classList.remove('loading');\n                img.classList.add('loaded');\n                img.removeAttribute('data-src');\n                img.setAttribute('data-optimized', 'true');\n                \n                // Efecto fade-in\n                this.addFadeInEffect(img);\n                \n                this.stats.lazyLoadedImages++;\n                console.log(`✅ Imagen lazy cargada y optimizada: ${src}`);\n            };\n            \n            tempImg.onerror = () => {\n                console.error(`❌ Error cargando imagen: ${src}`);\n                img.classList.remove('loading');\n                img.classList.add('error');\n                img.alt = img.alt || 'Error cargando imagen';\n            };\n            \n            tempImg.src = optimizedSrc;\n            \n        } catch (error) {\n            console.error(`❌ Error optimizando imagen ${src}:`, error);\n            img.src = src; // Fallback a imagen original\n            img.classList.remove('loading');\n            img.classList.add('loaded');\n        }\n        \n        // Dejar de observar\n        this.lazyObserver.unobserve(img);\n    },\n    \n    // ========= OPTIMIZACIÓN DE IMÁGENES =========\n    \n    // Obtener URL de imagen optimizada\n    async getOptimizedImageUrl(originalUrl, type = 'product') {\n        // Verificar cache primero\n        const cached = window.CacheManager?.getCachedImage(originalUrl);\n        if (cached) {\n            return cached.compressed;\n        }\n        \n        try {\n            // Determinar formato óptimo\n            const optimalFormat = this.getOptimalFormat();\n            \n            // Si es una imagen externa, intentar optimizar\n            if (originalUrl.startsWith('http')) {\n                const optimized = await this.optimizeExternalImage(originalUrl, type, optimalFormat);\n                if (optimized) {\n                    // Cachear resultado\n                    if (window.CacheManager) {\n                        window.CacheManager.cacheImage(originalUrl, optimized);\n                    }\n                    return optimized.compressed;\n                }\n            }\n            \n            // Fallback: retornar URL original con parámetros de optimización\n            return this.addOptimizationParams(originalUrl, type);\n            \n        } catch (error) {\n            console.warn(`⚠️ Error optimizando ${originalUrl}:`, error);\n            return originalUrl;\n        }\n    },\n    \n    // Determinar formato óptimo según soporte del navegador\n    getOptimalFormat() {\n        if (this.stats.avifSupported) return 'avif';\n        if (this.stats.webpSupported) return 'webp';\n        return 'jpeg';\n    },\n    \n    // Optimizar imagen externa\n    async optimizeExternalImage(url, type, format) {\n        try {\n            const img = new Image();\n            img.crossOrigin = 'anonymous';\n            \n            return new Promise((resolve, reject) => {\n                img.onload = () => {\n                    try {\n                        const optimized = this.compressImage(img, type, format);\n                        \n                        // Actualizar estadísticas\n                        this.updateCompressionStats(url, optimized);\n                        \n                        resolve(optimized);\n                    } catch (error) {\n                        reject(error);\n                    }\n                };\n                \n                img.onerror = () => reject(new Error(`No se pudo cargar la imagen: ${url}`));\n                img.src = url;\n            });\n            \n        } catch (error) {\n            console.error(`Error optimizando imagen externa ${url}:`, error);\n            return null;\n        }\n    },\n    \n    // Comprimir imagen usando canvas\n    compressImage(img, type = 'product', format = 'jpeg') {\n        const canvas = document.createElement('canvas');\n        const ctx = canvas.getContext('2d');\n        \n        // Obtener configuración para el tipo\n        const maxSize = this.config.maxSizes[type] || this.config.maxSizes.product;\n        const quality = this.config.quality[type] || this.config.quality.product;\n        \n        // Calcular nuevas dimensiones\n        const { width, height } = this.calculateOptimalSize(img.width, img.height, maxSize);\n        \n        // Configurar canvas\n        canvas.width = width;\n        canvas.height = height;\n        \n        // Dibujar imagen redimensionada\n        ctx.drawImage(img, 0, 0, width, height);\n        \n        // Determinar tipo MIME\n        const mimeType = format === 'webp' ? 'image/webp' :\n                        format === 'avif' ? 'image/avif' :\n                        'image/jpeg';\n        \n        // Comprimir\n        const compressedDataUrl = canvas.toDataURL(mimeType, quality);\n        \n        return {\n            original: img.src,\n            compressed: compressedDataUrl,\n            format: format,\n            quality: quality,\n            originalSize: this.estimateImageSize(img.width, img.height),\n            compressedSize: compressedDataUrl.length,\n            width: width,\n            height: height,\n            compressionRatio: compressedDataUrl.length / this.estimateImageSize(img.width, img.height)\n        };\n    },\n    \n    // Calcular tamaño óptimo manteniendo aspect ratio\n    calculateOptimalSize(originalWidth, originalHeight, maxSize) {\n        let { width, height } = { width: originalWidth, height: originalHeight };\n        \n        // Redimensionar si excede los límites\n        if (width > maxSize.width) {\n            height = (height * maxSize.width) / width;\n            width = maxSize.width;\n        }\n        \n        if (height > maxSize.height) {\n            width = (width * maxSize.height) / height;\n            height = maxSize.height;\n        }\n        \n        return { \n            width: Math.floor(width), \n            height: Math.floor(height) \n        };\n    },\n    \n    // Estimar tamaño de imagen\n    estimateImageSize(width, height) {\n        // Estimación aproximada basada en dimensiones\n        return width * height * 3; // 3 bytes por pixel (RGB)\n    },\n    \n    // Agregar parámetros de optimización a URL\n    addOptimizationParams(url, type) {\n        const maxSize = this.config.maxSizes[type] || this.config.maxSizes.product;\n        const quality = Math.floor((this.config.quality[type] || 0.8) * 100);\n        \n        // Para servicios como Cloudinary, Imgix, etc.\n        if (url.includes('cloudinary.com')) {\n            return url.replace('/upload/', `/upload/w_${maxSize.width},h_${maxSize.height},c_fill,q_${quality},f_auto/`);\n        }\n        \n        // Para otros servicios, agregar parámetros query\n        const separator = url.includes('?') ? '&' : '?';\n        return `${url}${separator}w=${maxSize.width}&h=${maxSize.height}&q=${quality}&auto=format`;\n    },\n    \n    // ========= EFECTOS VISUALES =========\n    \n    // Agregar efecto fade-in\n    addFadeInEffect(img) {\n        img.style.opacity = '0';\n        img.style.transition = `opacity ${this.config.lazyLoading.fadeInDuration}ms ease`;\n        \n        // Trigger fade-in\n        requestAnimationFrame(() => {\n            img.style.opacity = '1';\n        });\n    },\n    \n    // ========= PLACEHOLDERS =========\n    \n    // Generar placeholder SVG\n    generatePlaceholder(width, height, type = 'product') {\n        const colors = {\n            product: '#f0f0f0',\n            thumbnail: '#e8e8e8',\n            hero: '#f5f5f5',\n            avatar: '#ddd'\n        };\n        \n        const color = colors[type] || colors.product;\n        \n        const svg = `\n            <svg width=\"${width}\" height=\"${height}\" xmlns=\"http://www.w3.org/2000/svg\">\n                <defs>\n                    <linearGradient id=\"grad\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\">\n                        <stop offset=\"0%\" style=\"stop-color:${color};stop-opacity:1\" />\n                        <stop offset=\"100%\" style=\"stop-color:#fff;stop-opacity:0.8\" />\n                    </linearGradient>\n                </defs>\n                <rect width=\"100%\" height=\"100%\" fill=\"url(#grad)\"/>\n                <text x=\"50%\" y=\"50%\" font-family=\"Arial, sans-serif\" font-size=\"${Math.min(width, height) / 10}\" \n                      fill=\"#999\" text-anchor=\"middle\" dy=\".3em\">📸</text>\n            </svg>\n        `;\n        \n        return `data:image/svg+xml;base64,${btoa(svg)}`;\n    },\n    \n    // ========= PRELOADING INTELIGENTE =========\n    \n    // Configurar preloading basado en interacciones\n    setupIntelligentPreloading() {\n        // Precargar imágenes cuando el usuario hace hover sobre enlaces\n        document.addEventListener('mouseover', (e) => {\n            this.handleHoverPreloading(e.target);\n        }, { passive: true });\n        \n        // Precargar imágenes en viewport expandido\n        this.preloadNearbyImages();\n    },\n    \n    // Manejar preloading en hover\n    handleHoverPreloading(element) {\n        // Buscar enlaces que puedan tener imágenes\n        const link = element.closest('a[href]');\n        if (!link) return;\n        \n        const href = link.getAttribute('href');\n        \n        // Si es un enlace a producto, precargar imagen\n        if (href.includes('/product/') || link.querySelector('img')) {\n            const img = link.querySelector('img');\n            if (img && img.hasAttribute('data-src')) {\n                this.loadLazyImage(img);\n            }\n        }\n    },\n    \n    // Precargar imágenes cercanas al viewport\n    preloadNearbyImages() {\n        const extendedObserver = new IntersectionObserver(\n            (entries) => {\n                entries.forEach(entry => {\n                    if (entry.isIntersecting) {\n                        const img = entry.target;\n                        if (img.hasAttribute('data-src')) {\n                            // Precargar con baja prioridad\n                            setTimeout(() => {\n                                this.loadLazyImage(img);\n                            }, 1000);\n                        }\n                    }\n                });\n            },\n            {\n                threshold: 0,\n                rootMargin: '200px' // Margen más amplio para preloading\n            }\n        );\n        \n        document.querySelectorAll('img[data-src]').forEach(img => {\n            extendedObserver.observe(img);\n        });\n    },\n    \n    // ========= OPTIMIZACIÓN DE RECURSOS =========\n    \n    // Optimizar imágenes existentes\n    optimizeExistingImages() {\n        const images = document.querySelectorAll('img[src]:not([data-optimized])');\n        \n        images.forEach(img => {\n            this.optimizeLoadedImage(img);\n        });\n    },\n    \n    // Optimizar imagen ya cargada\n    optimizeLoadedImage(img) {\n        if (img.complete && img.naturalWidth > 0) {\n            const type = img.getAttribute('data-type') || this.guessImageType(img);\n            const maxSize = this.config.maxSizes[type];\n            \n            // Si la imagen es muy grande, sugerir redimensionamiento\n            if (img.naturalWidth > maxSize.width || img.naturalHeight > maxSize.height) {\n                console.log(`💡 Imagen ${img.src} podría optimizarse (${img.naturalWidth}x${img.naturalHeight} > ${maxSize.width}x${maxSize.height})`);\n            }\n            \n            img.setAttribute('data-optimized', 'true');\n        }\n    },\n    \n    // Adivinar tipo de imagen basado en contexto\n    guessImageType(img) {\n        if (img.classList.contains('thumbnail') || img.closest('.thumbnail')) return 'thumbnail';\n        if (img.classList.contains('hero') || img.closest('.hero')) return 'hero';\n        if (img.classList.contains('avatar') || img.closest('.avatar')) return 'avatar';\n        return 'product';\n    },\n    \n    // ========= OBSERVER PARA NUEVAS IMÁGENES =========\n    \n    setupNewImageObserver() {\n        if ('MutationObserver' in window) {\n            const observer = new MutationObserver((mutations) => {\n                mutations.forEach(mutation => {\n                    mutation.addedNodes.forEach(node => {\n                        if (node.nodeType === 1) { // Element node\n                            const images = node.tagName === 'IMG' ? [node] : node.querySelectorAll('img');\n                            images.forEach(img => {\n                                if (!img.hasAttribute('data-optimized')) {\n                                    if (img.hasAttribute('data-src')) {\n                                        this.prepareLazyImage(img);\n                                        this.lazyObserver.observe(img);\n                                    } else {\n                                        this.optimizeLoadedImage(img);\n                                    }\n                                }\n                            });\n                        }\n                    });\n                });\n            });\n            \n            observer.observe(document.body, {\n                childList: true,\n                subtree: true\n            });\n        }\n    },\n    \n    // ========= UTILIDADES =========\n    \n    // Actualizar estadísticas de compresión\n    updateCompressionStats(originalUrl, optimizedData) {\n        this.stats.imagesProcessed++;\n        this.stats.totalOriginalSize += optimizedData.originalSize;\n        this.stats.totalOptimizedSize += optimizedData.compressedSize;\n        \n        const totalReduction = (this.stats.totalOriginalSize - this.stats.totalOptimizedSize) / this.stats.totalOriginalSize;\n        this.stats.averageCompression = (totalReduction * 100).toFixed(1);\n        \n        console.log(`📊 Imagen optimizada: ${originalUrl} (${(optimizedData.compressionRatio * 100).toFixed(1)}% del tamaño original)`);\n    },\n    \n    // Fallback para navegadores sin IntersectionObserver\n    loadAllImages() {\n        const lazyImages = document.querySelectorAll('img[data-src]');\n        lazyImages.forEach(img => {\n            const src = img.getAttribute('data-src');\n            if (src) {\n                img.src = src;\n                img.removeAttribute('data-src');\n                img.setAttribute('data-optimized', 'true');\n            }\n        });\n    },\n    \n    // Configurar optimización automática\n    setupAutoOptimization() {\n        // Interceptar creación de nuevas imágenes\n        const originalCreateElement = document.createElement;\n        document.createElement = function(tagName) {\n            const element = originalCreateElement.call(document, tagName);\n            \n            if (tagName.toLowerCase() === 'img') {\n                // Configurar optimización automática para nuevas imágenes\n                element.addEventListener('load', function() {\n                    if (!this.hasAttribute('data-optimized')) {\n                        window.ImageOptimizer.optimizeLoadedImage(this);\n                    }\n                });\n            }\n            \n            return element;\n        };\n    },\n    \n    // ========= MÉTRICAS Y DEBUG =========\n    \n    // Obtener estadísticas de optimización\n    getStats() {\n        const savingsBytes = this.stats.totalOriginalSize - this.stats.totalOptimizedSize;\n        const savingsMB = (savingsBytes / (1024 * 1024)).toFixed(2);\n        \n        return {\n            ...this.stats,\n            totalSavingsMB: savingsMB,\n            averageCompressionPercent: this.stats.averageCompression + '%'\n        };\n    },\n    \n    // Mostrar estadísticas en consola\n    showStats() {\n        const stats = this.getStats();\n        \n        console.log('\\n🖼️ === ESTADÍSTICAS DE OPTIMIZACIÓN ===');\n        console.log(`📊 Imágenes procesadas: ${stats.imagesProcessed}`);\n        console.log(`👀 Imágenes lazy loaded: ${stats.lazyLoadedImages}`);\n        console.log(`💾 Reducción promedio: ${stats.averageCompressionPercent}`);\n        console.log(`🗜️ Espacio ahorrado: ${stats.totalSavingsMB}MB`);\n        console.log(`🌐 WebP soportado: ${stats.webpSupported ? 'Sí' : 'No'}`);\n        console.log(`🚀 AVIF soportado: ${stats.avifSupported ? 'Sí' : 'No'}`);\n        console.log('========================================\\n');\n    },\n    \n    // Limpiar recursos\n    cleanup() {\n        this.lazyObserver?.disconnect();\n    }\n};\n\n// Inicializar automáticamente\nif (document.readyState === 'loading') {\n    document.addEventListener('DOMContentLoaded', () => {\n        window.ImageOptimizer.init();\n    });\n} else {\n    window.ImageOptimizer.init();\n}\n\n// Exponer función global para debug\nwindow.showImageStats = () => window.ImageOptimizer.showStats();\n\nconsole.log('✅ Image Optimizer cargado');