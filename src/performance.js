// VentasPet - Sistema de Análisis de Rendimiento
// Monitoreo de Core Web Vitals, métricas de carga y optimización

console.log('📊 Cargando Performance Analytics...');

window.PerformanceAnalyzer = {
    metrics: {
        pageLoad: {},
        coreWebVitals: {},
        userInteractions: {},
        resourceTiming: {},
        customMetrics: {}
    },
    
    // Inicializar el sistema de métricas
    init() {
        console.log('🚀 Inicializando Performance Analyzer...');
        
        // Medir tiempo de carga inicial
        this.measurePageLoad();
        
        // Monitorear Core Web Vitals
        this.initCoreWebVitals();
        
        // Analizar recursos cargados
        this.analyzeResources();
        
        // Monitorear interacciones de usuario
        this.trackUserInteractions();
        
        // Reportar métricas iniciales
        setTimeout(() => {
            this.generateReport();
        }, 3000);
        
        return this;
    },
    
    // Medir métricas de carga de página
    measurePageLoad() {
        const perfData = performance.getEntriesByType('navigation')[0];
        
        if (perfData) {
            this.metrics.pageLoad = {
                // Tiempos críticos
                domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
                
                // Fases de carga
                dnsLookup: perfData.domainLookupEnd - perfData.domainLookupStart,
                tcpConnection: perfData.connectEnd - perfData.connectStart,
                serverResponse: perfData.responseEnd - perfData.requestStart,
                domProcessing: perfData.domComplete - perfData.responseEnd,
                
                // Tiempos totales
                totalTime: perfData.loadEventEnd - perfData.navigationStart,
                firstByte: perfData.responseStart - perfData.requestStart,
                
                // Timestamps
                timestamp: Date.now()
            };
        }
        
        // Marcar cuando React se renderiza
        if (window.React) {
            this.metrics.pageLoad.reactReady = performance.now();
        }
    },
    
    // Monitorear Core Web Vitals
    initCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    this.metrics.coreWebVitals.lcp = {
                        value: lastEntry.startTime,
                        rating: this.rateLCP(lastEntry.startTime),
                        element: lastEntry.element?.tagName || 'unknown'
                    };
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
                
                // First Input Delay (FID)
                const fidObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        this.metrics.coreWebVitals.fid = {
                            value: entry.processingStart - entry.startTime,
                            rating: this.rateFID(entry.processingStart - entry.startTime)
                        };
                    });
                });
                fidObserver.observe({ entryTypes: ['first-input'] });
                
            } catch (error) {
                console.warn('⚠️ PerformanceObserver no soportado:', error);
            }
        }
        
        // Cumulative Layout Shift (CLS) - simulado
        this.measureLayoutShift();
    },
    
    // Analizar recursos cargados
    analyzeResources() {
        const resources = performance.getEntriesByType('resource');
        
        const analysis = {
            scripts: [],
            stylesheets: [],
            images: [],
            fonts: [],
            other: [],
            totalSize: 0,
            totalRequests: resources.length
        };
        
        resources.forEach(resource => {
            const item = {
                name: resource.name.split('/').pop(),
                url: resource.name,
                duration: resource.responseEnd - resource.startTime,
                size: resource.transferSize || 0,
                cached: resource.transferSize === 0 && resource.decodedBodySize > 0
            };
            
            analysis.totalSize += item.size;
            
            if (resource.name.includes('.js')) {
                analysis.scripts.push(item);
            } else if (resource.name.includes('.css')) {
                analysis.stylesheets.push(item);
            } else if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
                analysis.images.push(item);
            } else if (resource.name.includes('font')) {
                analysis.fonts.push(item);
            } else {
                analysis.other.push(item);
            }
        });
        
        // Ordenar por duración descendente
        Object.keys(analysis).forEach(key => {
            if (Array.isArray(analysis[key])) {
                analysis[key].sort((a, b) => b.duration - a.duration);
            }
        });
        
        this.metrics.resourceTiming = analysis;
    },
    
    // Rastrear interacciones de usuario
    trackUserInteractions() {
        const interactions = {
            clicks: 0,
            scrolls: 0,
            keystrokes: 0,
            startTime: Date.now()
        };
        
        // Click tracking
        document.addEventListener('click', (e) => {
            interactions.clicks++;
            const target = e.target.tagName.toLowerCase();
            if (['button', 'a'].includes(target)) {
                this.measureInteractionLatency('click', target);
            }
        }, { passive: true });
        
        // Scroll tracking
        let scrollTimeout;
        document.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                interactions.scrolls++;
            }, 100);
        }, { passive: true });
        
        // Keystroke tracking
        document.addEventListener('keydown', () => {
            interactions.keystrokes++;
        }, { passive: true });
        
        this.metrics.userInteractions = interactions;
    },
    
    // Medir latencia de interacciones
    measureInteractionLatency(type, element) {
        const start = performance.now();
        
        requestAnimationFrame(() => {
            const latency = performance.now() - start;
            
            if (!this.metrics.userInteractions.latencies) {
                this.metrics.userInteractions.latencies = [];
            }
            
            this.metrics.userInteractions.latencies.push({
                type,
                element,
                latency,
                timestamp: Date.now()
            });
        });
    },
    
    // Simular medición de Layout Shift
    measureLayoutShift() {
        let clsScore = 0;
        
        // Observer para detectar cambios de layout
        if ('ResizeObserver' in window) {
            const observer = new ResizeObserver((entries) => {
                entries.forEach(entry => {
                    // Simular score CLS basado en cambios
                    const impact = (entry.contentRect.width * entry.contentRect.height) / (window.innerWidth * window.innerHeight);
                    clsScore += impact * 0.01; // Factor reducido para simulación
                });
                
                this.metrics.coreWebVitals.cls = {
                    value: clsScore,
                    rating: this.rateCLS(clsScore)
                };
            });
            
            // Observar elementos principales
            const mainElements = document.querySelectorAll('main, .main-content, #root > div');
            mainElements.forEach(el => observer.observe(el));
        }
    },
    
    // Rating functions para Core Web Vitals
    rateLCP(value) {
        if (value <= 2500) return 'good';
        if (value <= 4000) return 'needs-improvement';
        return 'poor';
    },
    
    rateFID(value) {
        if (value <= 100) return 'good';
        if (value <= 300) return 'needs-improvement';
        return 'poor';
    },
    
    rateCLS(value) {
        if (value <= 0.1) return 'good';
        if (value <= 0.25) return 'needs-improvement';
        return 'poor';
    },
    
    // Métricas personalizadas
    addCustomMetric(name, value, unit = 'ms') {
        this.metrics.customMetrics[name] = {
            value,
            unit,
            timestamp: Date.now()
        };
    },
    
    // Marcar inicio de operación
    markStart(operation) {
        performance.mark(`${operation}-start`);
    },
    
    // Marcar fin de operación y medir
    markEnd(operation) {
        performance.mark(`${operation}-end`);
        performance.measure(operation, `${operation}-start`, `${operation}-end`);
        
        const measure = performance.getEntriesByName(operation, 'measure')[0];
        if (measure) {
            this.addCustomMetric(operation, Math.round(measure.duration));
        }
        
        return measure;
    },
    
    // Generar reporte completo
    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            connection: this.getConnectionInfo(),
            metrics: this.metrics,
            recommendations: this.generateRecommendations()
        };
        
        console.log('📊 Performance Report:', report);
        
        // Mostrar resumen en consola
        this.logSummary();
        
        // Guardar en localStorage para análisis posterior
        try {
            localStorage.setItem('ventaspet-performance-report', JSON.stringify(report));
        } catch (error) {
            console.warn('⚠️ No se pudo guardar el reporte:', error);
        }
        
        return report;
    },
    
    // Obtener información de conexión
    getConnectionInfo() {
        if ('connection' in navigator) {
            return {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt,
                saveData: navigator.connection.saveData
            };
        }
        return null;
    },
    
    // Generar recomendaciones de optimización
    generateRecommendations() {
        const recommendations = [];
        const resources = this.metrics.resourceTiming;
        const cwv = this.metrics.coreWebVitals;
        
        // Recomendaciones basadas en recursos
        if (resources.scripts.length > 10) {
            recommendations.push({
                type: 'scripts',
                priority: 'high',
                message: `Demasiados scripts (${resources.scripts.length}). Considera bundling o lazy loading.`,
                impact: 'Reduce el tiempo de carga inicial'
            });
        }
        
        if (resources.totalSize > 2000000) { // 2MB
            recommendations.push({
                type: 'bundle-size',
                priority: 'high',
                message: `Bundle muy grande (${Math.round(resources.totalSize / 1024)}KB). Implementa code splitting.`,
                impact: 'Mejora significativamente el tiempo de carga'
            });
        }
        
        // Recomendaciones Core Web Vitals
        if (cwv.lcp && cwv.lcp.rating !== 'good') {
            recommendations.push({
                type: 'lcp',
                priority: 'high',
                message: `LCP ${cwv.lcp.rating} (${Math.round(cwv.lcp.value)}ms). Optimiza imágenes y recursos críticos.`,
                impact: 'Mejora la percepción de velocidad'
            });
        }
        
        if (cwv.fid && cwv.fid.rating !== 'good') {
            recommendations.push({
                type: 'fid',
                priority: 'medium',
                message: `FID ${cwv.fid.rating} (${Math.round(cwv.fid.value)}ms). Reduce el JavaScript que bloquea el hilo principal.`,
                impact: 'Mejora la interactividad'
            });
        }
        
        // Recomendaciones de imágenes
        const largeImages = resources.images.filter(img => img.size > 500000); // 500KB
        if (largeImages.length > 0) {
            recommendations.push({
                type: 'images',
                priority: 'medium',
                message: `${largeImages.length} imagen(es) muy grandes. Considera compresión y lazy loading.`,
                impact: 'Reduce el peso total de la página'
            });
        }
        
        return recommendations;
    },
    
    // Mostrar resumen en consola
    logSummary() {
        console.log('\n🎯 === RESUMEN DE RENDIMIENTO VENTASPET ===');
        
        // Page Load
        const pl = this.metrics.pageLoad;
        if (pl.totalTime) {
            console.log(`⏱️  Tiempo total de carga: ${Math.round(pl.totalTime)}ms`);
            console.log(`🔄 DOM Content Loaded: ${Math.round(pl.domContentLoaded)}ms`);
            console.log(`📡 Primer byte (TTFB): ${Math.round(pl.firstByte)}ms`);
        }
        
        // Core Web Vitals
        const cwv = this.metrics.coreWebVitals;
        console.log('\n📊 Core Web Vitals:');
        
        if (cwv.lcp) {
            const emoji = cwv.lcp.rating === 'good' ? '✅' : cwv.lcp.rating === 'needs-improvement' ? '⚠️' : '❌';
            console.log(`${emoji} LCP: ${Math.round(cwv.lcp.value)}ms (${cwv.lcp.rating})`);
        }
        
        if (cwv.fid) {
            const emoji = cwv.fid.rating === 'good' ? '✅' : cwv.fid.rating === 'needs-improvement' ? '⚠️' : '❌';
            console.log(`${emoji} FID: ${Math.round(cwv.fid.value)}ms (${cwv.fid.rating})`);
        }
        
        if (cwv.cls) {
            const emoji = cwv.cls.rating === 'good' ? '✅' : cwv.cls.rating === 'needs-improvement' ? '⚠️' : '❌';
            console.log(`${emoji} CLS: ${cwv.cls.value.toFixed(3)} (${cwv.cls.rating})`);
        }
        
        // Recursos
        const rt = this.metrics.resourceTiming;
        console.log('\n📦 Recursos:');
        console.log(`📄 Scripts: ${rt.scripts.length} (${Math.round(rt.scripts.reduce((sum, s) => sum + s.size, 0) / 1024)}KB)`);
        console.log(`🎨 CSS: ${rt.stylesheets.length} (${Math.round(rt.stylesheets.reduce((sum, s) => sum + s.size, 0) / 1024)}KB)`);
        console.log(`🖼️  Imágenes: ${rt.images.length} (${Math.round(rt.images.reduce((sum, s) => sum + s.size, 0) / 1024)}KB)`);
        console.log(`📊 Total: ${rt.totalRequests} requests, ${Math.round(rt.totalSize / 1024)}KB`);
        
        // Recomendaciones
        const recs = this.generateRecommendations();
        if (recs.length > 0) {
            console.log('\n💡 Recomendaciones principales:');
            recs.slice(0, 3).forEach((rec, i) => {
                const emoji = rec.priority === 'high' ? '🔥' : rec.priority === 'medium' ? '⚠️' : '💡';
                console.log(`${emoji} ${rec.message}`);
            });
        }
        
        console.log('\n✨ Reporte completo guardado en localStorage');
        console.log('==========================================\n');
    }
};

// Auto-inicializar cuando se carga
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => window.PerformanceAnalyzer.init(), 100);
    });
} else {
    setTimeout(() => window.PerformanceAnalyzer.init(), 100);
}

console.log('✅ Performance Analyzer cargado');