// VentasPet - Sistema de Testing y Validacion de Rendimiento
// Implementa tests automatizados, lighthouse integration y validacion de optimizaciones

console.log('🧪 Cargando Performance Testing Suite...');

window.PerformanceTesting = {
    // Configuracion de testing
    config: {
        // Umbrales de rendimiento (milisegundos)
        thresholds: {
            // Core Web Vitals
            lcp: { good: 2500, poor: 4000 },
            fid: { good: 100, poor: 300 },
            cls: { good: 0.1, poor: 0.25 },
            
            // Metricas personalizadas
            pageLoad: { good: 3000, poor: 5000 },
            domReady: { good: 1500, poor: 3000 },
            firstPaint: { good: 1000, poor: 2000 },
            
            // API performance
            apiResponse: { good: 500, poor: 2000 },
            
            // Bundle sizes (KB)
            bundleSize: { good: 500, poor: 1000 },
            imageSize: { good: 200, poor: 500 }
        },
        
        // Configuracion de tests
        testConfig: {
            iterations: 3,
            warmupIterations: 1,
            cooldownDelay: 1000, // ms entre tests
            timeoutMs: 30000
        },
        
        // URLs para testing
        testUrls: [
            { name: 'Home', url: '/', weight: 1.0 },
            { name: 'Products', url: '/products', weight: 0.8 },
            { name: 'Cart', url: '/cart', weight: 0.6 },
            { name: 'Checkout', url: '/checkout', weight: 0.4 }
        ]
    },
    
    // Resultados de tests
    testResults: {
        baseline: null,
        current: null,
        history: []
    },
    
    // Estado del testing
    isRunning: false,
    currentTest: null,
    
    init() {
        console.log('[ICON:ROCKET] Inicializando Performance Testing Suite...');
        
        // Configurar listeners para metricas automaticas
        this.setupAutomaticTesting();
        
        // Configurar reportes automaticos
        this.setupAutomaticReporting();
        
        // Cargar baseline si existe
        this.loadBaseline();
        
        return this;
    },
    
    // ========= TESTS PRINCIPALES =========
    
    // Ejecutar suite completa de tests
    async runFullTestSuite() {
        if (this.isRunning) {
            console.warn('[WARNING] Tests ya en ejecucion');
            return;
        }
        
        console.log('🧪 Iniciando suite completa de tests de rendimiento...');
        this.isRunning = true;
        
        const startTime = Date.now();
        const results = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            connection: this._getConnectionInfo(),
            tests: {},
            summary: {}
        };
        
        try {
            // Tests de metricas basicas
            console.log('📊 Ejecutando tests de metricas basicas...');
            results.tests.basicMetrics = await this.testBasicMetrics();
            
            // Tests de Core Web Vitals
            console.log('🎯 Ejecutando tests de Core Web Vitals...');
            results.tests.coreWebVitals = await this.testCoreWebVitals();
            
            // Tests de cache y almacenamiento
            console.log('💾 Ejecutando tests de cache...');
            results.tests.cachePerformance = await this.testCachePerformance();
            
            // Tests de API
            console.log('📡 Ejecutando tests de API...');
            results.tests.apiPerformance = await this.testApiPerformance();
            
            // Tests de imagenes
            console.log('[ICON:IMAGE] Ejecutando tests de imagenes...');
            results.tests.imageOptimization = await this.testImageOptimization();
            
            // Tests de componentes React
            console.log('⚛️ Ejecutando tests de React...');
            results.tests.reactPerformance = await this.testReactPerformance();
            
            // Generar resumen
            results.summary = this._generateSummary(results.tests);
            
            // Guardar resultados
            this.testResults.current = results;
            this._saveResults(results);
            
            const duration = Date.now() - startTime;
            console.log(`[OK] Suite de tests completada en ${duration}ms`);
            
            // Mostrar resumen
            this.showTestReport();
            
            return results;
            
        } catch (error) {
            console.error('[ERROR] Error ejecutando tests:', error);
            throw error;
        } finally {
            this.isRunning = false;
        }
    },
    
    // Test de metricas basicas
    async testBasicMetrics() {
        const results = {};
        
        // Navigation Timing API
        const navigationEntry = performance.getEntriesByType('navigation')[0];
        if (navigationEntry) {
            results.pageLoadTime = navigationEntry.loadEventEnd - navigationEntry.navigationStart;
            results.domContentLoaded = navigationEntry.domContentLoadedEventEnd - navigationEntry.navigationStart;
            results.firstPaint = this._getFirstPaint();
            results.domInteractive = navigationEntry.domInteractive - navigationEntry.navigationStart;
            results.dnsTime = navigationEntry.domainLookupEnd - navigationEntry.domainLookupStart;
            results.connectTime = navigationEntry.connectEnd - navigationEntry.connectStart;
            results.serverResponseTime = navigationEntry.responseEnd - navigationEntry.requestStart;
        }
        
        // Resource timing
        const resources = performance.getEntriesByType('resource');
        results.totalResources = resources.length;
        results.totalTransferSize = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
        results.averageResourceTime = resources.reduce((sum, r) => sum + r.duration, 0) / resources.length;
        
        // Memory usage (si esta disponible)
        if (performance.memory) {
            results.memoryUsage = {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            };
        }
        
        return this._evaluateResults(results, {
            pageLoadTime: this.config.thresholds.pageLoad,
            domContentLoaded: this.config.thresholds.domReady,
            firstPaint: this.config.thresholds.firstPaint
        });
    },
    
    // Test de Core Web Vitals
    async testCoreWebVitals() {
        const results = {};
        
        // Obtener metricas del PerformanceAnalyzer si esta disponible
        if (window.PerformanceAnalyzer && window.PerformanceAnalyzer.metrics) {
            const cwv = window.PerformanceAnalyzer.metrics.coreWebVitals;
            
            if (cwv.lcp) results.lcp = cwv.lcp;
            if (cwv.fid) results.fid = cwv.fid;
            if (cwv.cls) results.cls = cwv.cls;
        }
        
        // Medir FCP manualmente
        results.fcp = this._getFirstContentfulPaint();
        
        // Calcular CLS manualmente si no esta disponible
        if (!results.cls) {
            results.cls = await this._measureCLS();
        }
        
        return this._evaluateResults(results, {
            lcp: this.config.thresholds.lcp,
            fid: this.config.thresholds.fid,
            cls: this.config.thresholds.cls
        });
    },
    
    // Test de rendimiento de cache
    async testCachePerformance() {
        const results = {};
        
        if (window.CacheManager) {
            const stats = window.CacheManager.getStats();
            results.cacheStats = stats;
            results.hitRate = parseFloat(stats.hitRate) || 0;
            results.totalKeys = stats.totalKeys;
            results.cacheSize = stats.formattedSize;
        }
        
        // Test de velocidad de cache
        const cacheSpeedTest = await this._testCacheSpeed();
        results.cacheSpeed = cacheSpeedTest;
        
        return this._evaluateResults(results, {
            hitRate: { good: 70, poor: 30 }, // porcentaje
            cacheSpeed: { good: 10, poor: 50 } // ms
        });
    },
    
    // Test de rendimiento de API
    async testApiPerformance() {
        const results = {};
        
        if (window.ApiOptimizer) {
            const stats = window.ApiOptimizer.getStats();
            results.apiStats = stats;
            results.averageResponseTime = parseFloat(stats.averageResponseTime) || 0;
            results.hitRate = parseFloat(stats.hitRate) || 0;
            results.failureRate = (stats.failedRequests / stats.totalRequests * 100) || 0;
        }
        
        // Test de endpoints criticos
        const endpointTests = await this._testCriticalEndpoints();
        results.endpointTests = endpointTests;
        
        return this._evaluateResults(results, {
            averageResponseTime: this.config.thresholds.apiResponse,
            hitRate: { good: 60, poor: 20 },
            failureRate: { good: 5, poor: 15 }
        });
    },
    
    // Test de optimizacion de imagenes
    async testImageOptimization() {
        const results = {};
        
        if (window.ImageOptimizer) {
            const stats = window.ImageOptimizer.getStats();
            results.imageStats = stats;
            results.compressionRatio = parseFloat(stats.averageCompressionPercent) || 0;
            results.lazyLoadedImages = stats.lazyLoadedImages;
            results.webpSupported = stats.webpSupported;
        }
        
        // Analizar imagenes en pagina
        const imageAnalysis = this._analyzePageImages();
        results.imageAnalysis = imageAnalysis;
        
        return this._evaluateResults(results, {
            compressionRatio: { good: 70, poor: 90 }, // menor es mejor
            averageImageSize: this.config.thresholds.imageSize
        });
    },
    
    // Test de rendimiento de React
    async testReactPerformance() {
        const results = {};
        
        // Contar componentes y renders
        results.componentCount = this._countReactComponents();
        
        // Medir tiempo de render
        const renderTime = await this._measureRenderTime();
        results.averageRenderTime = renderTime;
        
        // Detectar re-renders innecesarios
        const rerenderAnalysis = this._analyzeReRenders();
        results.rerenderAnalysis = rerenderAnalysis;
        
        return this._evaluateResults(results, {
            averageRenderTime: { good: 16, poor: 50 }, // 60fps = 16ms por frame
            unnecessaryRerenders: { good: 5, poor: 20 }
        });
    },
    
    // ========= MÉTODOS DE MEDICIÓN =========
    
    // Obtener First Paint
    _getFirstPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? firstPaint.startTime : null;
    },
    
    // Obtener First Contentful Paint
    _getFirstContentfulPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        return fcp ? fcp.startTime : null;
    },
    
    // Medir Cumulative Layout Shift
    async _measureCLS() {
        return new Promise((resolve) => {
            let clsScore = 0;
            
            if ('PerformanceObserver' in window) {
                try {
                    const observer = new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        entries.forEach(entry => {
                            if (!entry.hadRecentInput) {
                                clsScore += entry.value;
                            }
                        });
                    });
                    
                    observer.observe({ entryTypes: ['layout-shift'] });
                    
                    // Observar por 2 segundos
                    setTimeout(() => {
                        observer.disconnect();
                        resolve({ value: clsScore, rating: this._rateCLS(clsScore) });
                    }, 2000);
                } catch (error) {
                    resolve({ value: 0, rating: 'unknown', error: error.message });
                }
            } else {
                resolve({ value: 0, rating: 'unsupported' });
            }
        });
    },
    
    // Test de velocidad de cache
    async _testCacheSpeed() {
        const iterations = 10;
        const testKey = 'performance_test_' + Date.now();
        const testData = { test: 'data', timestamp: Date.now() };
        
        // Test de escritura
        const writeStart = performance.now();
        for (let i = 0; i < iterations; i++) {
            if (window.CacheManager) {
                window.CacheManager.set(`${testKey}_${i}`, testData, 1, 'temp');
            }
        }
        const writeTime = (performance.now() - writeStart) / iterations;
        
        // Test de lectura
        const readStart = performance.now();
        for (let i = 0; i < iterations; i++) {
            if (window.CacheManager) {
                window.CacheManager.get(`${testKey}_${i}`, 'temp');
            }
        }
        const readTime = (performance.now() - readStart) / iterations;
        
        // Limpiar datos de test
        for (let i = 0; i < iterations; i++) {
            if (window.CacheManager) {
                window.CacheManager.remove(`${testKey}_${i}`, 'temp');
            }
        }
        
        return {
            writeTime: writeTime,
            readTime: readTime,
            averageTime: (writeTime + readTime) / 2
        };
    },
    
    // Test de endpoints criticos
    async _testCriticalEndpoints() {
        const endpoints = [
            { name: 'Products', url: '/api/products' },
            { name: 'Categories', url: '/api/categories' },
            { name: 'Health Check', url: '/api/health' }
        ];
        
        const results = {};
        
        for (const endpoint of endpoints) {
            try {
                const startTime = performance.now();
                const response = await fetch(endpoint.url);
                const endTime = performance.now();
                
                results[endpoint.name] = {
                    responseTime: endTime - startTime,
                    status: response.status,
                    ok: response.ok,
                    size: response.headers.get('content-length') || 0
                };
            } catch (error) {
                results[endpoint.name] = {
                    responseTime: null,
                    status: null,
                    ok: false,
                    error: error.message
                };
            }
        }
        
        return results;
    },
    
    // Analizar imagenes en la pagina
    _analyzePageImages() {
        const images = document.querySelectorAll('img');
        const analysis = {
            totalImages: images.length,
            lazyImages: 0,
            optimizedImages: 0,
            largeImages: 0,
            totalEstimatedSize: 0
        };
        
        images.forEach(img => {
            if (img.hasAttribute('data-src') || img.loading === 'lazy') {
                analysis.lazyImages++;
            }
            
            if (img.hasAttribute('data-optimized')) {
                analysis.optimizedImages++;
            }
            
            if (img.naturalWidth > 800 || img.naturalHeight > 600) {
                analysis.largeImages++;
            }
            
            // Estimar tamano
            analysis.totalEstimatedSize += (img.naturalWidth * img.naturalHeight * 3) / 8; // bytes estimados
        });
        
        analysis.lazyPercentage = (analysis.lazyImages / analysis.totalImages * 100) || 0;
        analysis.optimizedPercentage = (analysis.optimizedImages / analysis.totalImages * 100) || 0;
        analysis.averageImageSize = analysis.totalEstimatedSize / analysis.totalImages / 1024; // KB
        
        return analysis;
    },
    
    // Contar componentes React
    _countReactComponents() {
        // Heuristica simple para contar componentes
        const reactRoots = document.querySelectorAll('[data-reactroot]');
        const componentElements = document.querySelectorAll('[data-react-component]');
        
        return {
            roots: reactRoots.length,
            components: componentElements.length,
            estimatedTotal: Math.max(componentElements.length, 10) // minimo estimado
        };
    },
    
    // Medir tiempo de render
    async _measureRenderTime() {
        return new Promise((resolve) => {
            const measurements = [];
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.name.includes('react') || entry.name.includes('render')) {
                        measurements.push(entry.duration);
                    }
                });
            });
            
            observer.observe({ entryTypes: ['measure'] });
            
            setTimeout(() => {
                observer.disconnect();
                const average = measurements.length > 0 ? 
                    measurements.reduce((sum, time) => sum + time, 0) / measurements.length : 0;
                resolve(average);
            }, 2000);
        });
    },
    
    // Analizar re-renders
    _analyzeReRenders() {
        // Placeholder para analisis de re-renders
        // En una implementacion real, esto requeriria instrumentacion especifica de React
        return {
            detected: false,
            count: 0,
            components: [],
            note: 'Analisis de re-renders requiere instrumentacion especifica'
        };
    },
    
    // ========= EVALUACIÓN Y RATING =========
    
    // Evaluar resultados contra umbrales
    _evaluateResults(results, thresholds) {
        const evaluation = {
            raw: results,
            scores: {},
            overall: 'unknown'
        };
        
        let totalScore = 0;
        let scoreCount = 0;
        
        for (const [metric, value] of Object.entries(results)) {
            if (thresholds[metric] && typeof value === 'number') {
                const threshold = thresholds[metric];
                let score;
                
                if (value <= threshold.good) {
                    score = 'good';
                } else if (value <= threshold.poor) {
                    score = 'needs-improvement';
                } else {
                    score = 'poor';
                }
                
                evaluation.scores[metric] = {
                    value: value,
                    score: score,
                    threshold: threshold
                };
                
                // Convertir a numero para promedio
                const numScore = score === 'good' ? 3 : score === 'needs-improvement' ? 2 : 1;
                totalScore += numScore;
                scoreCount++;
            }
        }
        
        // Calcular score general
        if (scoreCount > 0) {
            const avgScore = totalScore / scoreCount;
            evaluation.overall = avgScore >= 2.5 ? 'good' : avgScore >= 1.5 ? 'needs-improvement' : 'poor';
        }
        
        return evaluation;
    },
    
    // Rating para CLS
    _rateCLS(value) {
        if (value <= 0.1) return 'good';
        if (value <= 0.25) return 'needs-improvement';
        return 'poor';
    },
    
    // ========= UTILIDADES =========
    
    // Obtener informacion de conexion
    _getConnectionInfo() {
        if ('connection' in navigator) {
            return {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt
            };
        }
        return null;
    },
    
    // Generar resumen de todos los tests
    _generateSummary(tests) {
        const summary = {
            totalTests: Object.keys(tests).length,
            passedTests: 0,
            failedTests: 0,
            overallScore: 'unknown',
            criticalIssues: [],
            recommendations: []
        };
        
        let totalScore = 0;
        let scoreCount = 0;
        
        for (const [testName, testResult] of Object.entries(tests)) {
            if (testResult.overall === 'good') {
                summary.passedTests++;
                totalScore += 3;
            } else if (testResult.overall === 'needs-improvement') {
                totalScore += 2;
            } else if (testResult.overall === 'poor') {
                summary.failedTests++;
                totalScore += 1;
                summary.criticalIssues.push(`${testName}: ${testResult.overall}`);
            }
            scoreCount++;
        }
        
        if (scoreCount > 0) {
            const avgScore = totalScore / scoreCount;
            summary.overallScore = avgScore >= 2.5 ? 'good' : avgScore >= 1.5 ? 'needs-improvement' : 'poor';
        }
        
        // Generar recomendaciones basadas en resultados
        summary.recommendations = this._generateRecommendations(tests);
        
        return summary;
    },
    
    // Generar recomendaciones
    _generateRecommendations(tests) {
        const recommendations = [];
        
        // Recomendaciones basadas en Core Web Vitals
        if (tests.coreWebVitals) {
            const cwv = tests.coreWebVitals;
            if (cwv.scores.lcp && cwv.scores.lcp.score !== 'good') {
                recommendations.push('Optimizar LCP: Reducir tamano de imagenes hero y mejorar tiempo de servidor');
            }
            if (cwv.scores.cls && cwv.scores.cls.score !== 'good') {
                recommendations.push('Reducir CLS: Especificar dimensiones de imagenes y evitar contenido dinamico');
            }
        }
        
        // Recomendaciones de cache
        if (tests.cachePerformance) {
            const cache = tests.cachePerformance;
            if (cache.scores.hitRate && cache.scores.hitRate.score !== 'good') {
                recommendations.push('Mejorar estrategia de cache: Incrementar TTL para recursos estaticos');
            }
        }
        
        // Recomendaciones de API
        if (tests.apiPerformance) {
            const api = tests.apiPerformance;
            if (api.scores.averageResponseTime && api.scores.averageResponseTime.score !== 'good') {
                recommendations.push('Optimizar APIs: Implementar paginacion y reducir payload de respuestas');
            }
        }
        
        return recommendations;
    },
    
    // ========= PERSISTENCIA Y REPORTES =========
    
    // Guardar resultados
    _saveResults(results) {
        try {
            // Guardar en localStorage
            const key = 'ventaspet_performance_results';
            const existing = JSON.parse(localStorage.getItem(key) || '[]');
            existing.push(results);
            
            // Mantener solo los ultimos 10 resultados
            if (existing.length > 10) {
                existing.shift();
            }
            
            localStorage.setItem(key, JSON.stringify(existing));
            this.testResults.history = existing;
            
        } catch (error) {
            console.warn('[WARNING] No se pudieron guardar los resultados:', error);
        }
    },
    
    // Cargar baseline
    loadBaseline() {
        try {
            const baseline = localStorage.getItem('ventaspet_performance_baseline');
            if (baseline) {
                this.testResults.baseline = JSON.parse(baseline);
                console.log('📊 Baseline de rendimiento cargado');
            }
        } catch (error) {
            console.warn('[WARNING] No se pudo cargar baseline:', error);
        }
    },
    
    // Establecer baseline
    setBaseline() {
        if (this.testResults.current) {
            this.testResults.baseline = this.testResults.current;
            localStorage.setItem('ventaspet_performance_baseline', JSON.stringify(this.testResults.baseline));
            console.log('[OK] Baseline establecido');
        } else {
            console.warn('[WARNING] No hay resultados actuales para establecer baseline');
        }
    },
    
    // Mostrar reporte de tests
    showTestReport() {
        if (!this.testResults.current) {
            console.log('[WARNING] No hay resultados de tests para mostrar');
            return;
        }
        
        const results = this.testResults.current;
        
        console.log('\
🧪 === REPORTE DE RENDIMIENTO VENTASPET ===');
        console.log(`📅 Timestamp: ${results.timestamp}`);
        console.log(`🌐 URL: ${results.url}`);
        console.log(`📱 Viewport: ${results.viewport.width}x${results.viewport.height}`);
        
        if (results.connection) {
            console.log(`📡 Conexion: ${results.connection.effectiveType}`);
        }
        
        console.log(`\
📊 Resumen General:`);
        console.log(`[OK] Tests pasados: ${results.summary.passedTests}`);
        console.log(`[ERROR] Tests fallidos: ${results.summary.failedTests}`);
        console.log(`🎯 Score general: ${results.summary.overallScore}`);
        
        if (results.summary.criticalIssues.length > 0) {
            console.log('\
🚨 Problemas criticos:');
            results.summary.criticalIssues.forEach(issue => {
                console.log(`  • ${issue}`);
            });
        }
        
        if (results.summary.recommendations.length > 0) {
            console.log('\
[ICON:IDEA] Recomendaciones:');
            results.summary.recommendations.forEach(rec => {
                console.log(`  • ${rec}`);
            });
        }
        
        console.log('\
==========================================\
');
        
        return results;
    },
    
    // Comparar con baseline
    compareWithBaseline() {
        if (!this.testResults.current || !this.testResults.baseline) {
            console.log('[WARNING] Se requieren resultados actuales y baseline para comparar');
            return null;
        }
        
        const comparison = {
            timestamp: new Date().toISOString(),
            improvements: [],
            regressions: [],
            summary: {}
        };
        
        // Comparar metricas clave
        const keyMetrics = ['pageLoadTime', 'domContentLoaded', 'lcp', 'fid', 'cls'];
        
        keyMetrics.forEach(metric => {
            const currentValue = this._extractMetricValue(this.testResults.current, metric);
            const baselineValue = this._extractMetricValue(this.testResults.baseline, metric);
            
            if (currentValue !== null && baselineValue !== null) {
                const difference = currentValue - baselineValue;
                const percentChange = (difference / baselineValue) * 100;
                
                if (Math.abs(percentChange) > 5) { // Solo cambios significativos
                    const item = {
                        metric,
                        current: currentValue,
                        baseline: baselineValue,
                        difference,
                        percentChange: percentChange.toFixed(1) + '%'
                    };
                    
                    if (difference < 0) {
                        comparison.improvements.push(item);
                    } else {
                        comparison.regressions.push(item);
                    }
                }
            }
        });
        
        console.log('\
📈 === COMPARACIÓN CON BASELINE ===');
        
        if (comparison.improvements.length > 0) {
            console.log('[OK] Mejoras detectadas:');
            comparison.improvements.forEach(item => {
                console.log(`  • ${item.metric}: ${item.baseline} → ${item.current} (${item.percentChange})`);
            });
        }
        
        if (comparison.regressions.length > 0) {
            console.log('[ERROR] Regresiones detectadas:');
            comparison.regressions.forEach(item => {
                console.log(`  • ${item.metric}: ${item.baseline} → ${item.current} (${item.percentChange})`);
            });
        }
        
        if (comparison.improvements.length === 0 && comparison.regressions.length === 0) {
            console.log('📊 No se detectaron cambios significativos');
        }
        
        console.log('=====================================\
');
        
        return comparison;
    },
    
    // Extraer valor de metrica de resultados
    _extractMetricValue(results, metric) {
        // Buscar en diferentes secciones de los resultados
        const sections = ['basicMetrics', 'coreWebVitals', 'cachePerformance', 'apiPerformance'];
        
        for (const section of sections) {
            const sectionData = results.tests[section];
            if (sectionData && sectionData.raw && sectionData.raw[metric] !== undefined) {
                return sectionData.raw[metric];
            }
            
            // Tambien buscar en scores
            if (sectionData && sectionData.scores && sectionData.scores[metric]) {
                return sectionData.scores[metric].value;
            }
        }
        
        return null;
    },
    
    // ========= CONFIGURACIÓN AUTOMÁTICA =========
    
    // Configurar testing automatico
    setupAutomaticTesting() {
        // Ejecutar tests ligeros cada 5 minutos
        setInterval(() => {
            if (!this.isRunning) {
                this._runLightweightTest();
            }
        }, 5 * 60 * 1000);
    },
    
    // Test ligero automatico
    async _runLightweightTest() {
        try {
            const basicMetrics = await this.testBasicMetrics();
            const timestamp = new Date().toISOString();
            
            // Guardar metricas basicas
            const lightResults = {
                timestamp,
                type: 'lightweight',
                metrics: basicMetrics
            };
            
            // Guardar en historial ligero
            const key = 'ventaspet_light_metrics';
            const existing = JSON.parse(localStorage.getItem(key) || '[]');
            existing.push(lightResults);
            
            // Mantener solo las ultimas 50 mediciones
            if (existing.length > 50) {
                existing.shift();
            }
            
            localStorage.setItem(key, JSON.stringify(existing));
            
        } catch (error) {
            console.warn('[WARNING] Error en test automatico:', error);
        }
    },
    
    // Configurar reportes automaticos
    setupAutomaticReporting() {
        // Reporte automatico cuando el rendimiento empeora significativamente
        window.addEventListener('beforeunload', () => {
            if (this.testResults.current && this.testResults.baseline) {
                const comparison = this.compareWithBaseline();
                if (comparison && comparison.regressions.length > 0) {
                    console.warn('[WARNING] Detectadas regresiones de rendimiento al cerrar pagina');
                }
            }
        });
    }
};

// Inicializar automaticamente
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.PerformanceTesting.init();
    });
} else {
    window.PerformanceTesting.init();
}

// Exponer funciones globales para testing manual
window.runPerformanceTests = () => window.PerformanceTesting.runFullTestSuite();
window.showPerformanceReport = () => window.PerformanceTesting.showTestReport();
window.setPerformanceBaseline = () => window.PerformanceTesting.setBaseline();
window.comparePerformance = () => window.PerformanceTesting.compareWithBaseline();

console.log('[OK] Performance Testing Suite cargado');
console.log('[ICON:IDEA] Usa runPerformanceTests() para ejecutar la suite completa');