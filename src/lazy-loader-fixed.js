// VentasPet - Sistema de Carga Lazy y Optimización de Recursos
// Implementa lazy loading inteligente y gestión optimizada de recursos

console.log('🚀 Cargando Lazy Loader System...');

window.LazyLoader = {
    // Cache de componentes cargados
    loadedComponents: new Set(),
    loadingPromises: new Map(),
    
    // Configuration
    config: {
        // Timeout para cargas de componentes
        componentTimeout: 5000,
        // Threshold para intersection observer
        intersectionThreshold: 0.1,
        // Margin para pre-carga
        rootMargin: '50px',
        // Delay para debounce de scroll
        scrollDebounce: 100
    },
    
    init() {
        console.log('⚡ Inicializando Lazy Loader...');
        
        // Configurar Intersection Observer para elementos
        this.setupIntersectionObserver();
        
        // Configurar lazy loading de imágenes
        this.setupImageLazyLoading();
        
        // Optimizar orden de carga de scripts
        this.optimizeScriptLoading();
        
        // Implementar preloading inteligente
        this.setupIntelligentPreloading();
        
        return this;
    },
    
    // Cargar componente de manera lazy
    async loadComponent(componentName, fallback = null) {
        // Si ya está cargado, retornarlo
        if (window[componentName]) {
            return window[componentName];
        }
        
        // Si ya se está cargando, esperar
        if (this.loadingPromises.has(componentName)) {
            return this.loadingPromises.get(componentName);
        }
        
        const loadPromise = this._loadComponentScript(componentName, fallback);
        this.loadingPromises.set(componentName, loadPromise);
        
        try {
            const component = await loadPromise;
            this.loadedComponents.add(componentName);
            this.loadingPromises.delete(componentName);
            return component;
        } catch (error) {
            this.loadingPromises.delete(componentName);
            throw error;
        }
    },
    
    // Cargar script de componente
    async _loadComponentScript(componentName, fallback) {
        return new Promise((resolve, reject) => {
            // Medir tiempo de carga
            if (window.PerformanceAnalyzer) {
                window.PerformanceAnalyzer.markStart(`component-load-${componentName}`);
            }
            
            const script = document.createElement('script');
            const timeout = setTimeout(() => {
                reject(new Error(`Timeout loading component: ${componentName}`));
            }, this.config.componentTimeout);
            
            script.onload = () => {
                clearTimeout(timeout);
                
                // Marcar fin de carga
                if (window.PerformanceAnalyzer) {
                    window.PerformanceAnalyzer.markEnd(`component-load-${componentName}`);
                }
                
                // Verificar que el componente se cargó
                if (window[componentName]) {
                    console.log(`✅ Componente cargado: ${componentName}`);
                    resolve(window[componentName]);
                } else if (fallback) {
                    console.warn(`⚠️ Componente ${componentName} no encontrado, usando fallback`);
                    resolve(fallback);
                } else {
                    reject(new Error(`Component ${componentName} not found after loading`));
                }
            };
            
            script.onerror = () => {
                clearTimeout(timeout);
                console.error(`❌ Error cargando componente: ${componentName}`);
                
                if (fallback) {
                    resolve(fallback);
                } else {
                    reject(new Error(`Failed to load component: ${componentName}`));
                }
            };
            
            // Determinar ruta del script
            const scriptPath = this._getComponentPath(componentName);
            script.src = scriptPath;
            script.defer = true;
            
            document.head.appendChild(script);
        });
    },
    
    // Obtener ruta del componente
    _getComponentPath(componentName) {
        const componentMap = {
            'ProductCatalog': 'src/components/ProductCatalog.js',
            'CartView': 'src/components/CartView.js',
            'ModernCheckoutComponent': 'src/components/ModernCheckout.js',
            'AuthComponent': 'src/components/AuthComponent.js',
            'ModernLayoutComponent': 'src/components/ModernLayout.js',
            'ProductCard': 'src/components/ProductCard.js',
            'CategoryNav': 'src/components/CategoryNav.js',
            'Header': 'src/components/Header.js'
        };
        
        return componentMap[componentName] || `src/components/${componentName}.js`;
    },
    
    // Configurar Intersection Observer
    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) {
            console.warn('⚠️ IntersectionObserver no soportado');
            return;
        }
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this._handleIntersection(entry.target);
                    }
                });
            },
            {
                threshold: this.config.intersectionThreshold,
                rootMargin: this.config.rootMargin
            }
        );
        
        // Observar elementos con data-lazy-load
        const lazyElements = document.querySelectorAll('[data-lazy-load]');
        lazyElements.forEach(el => observer.observe(el));
        
        this.intersectionObserver = observer;
    },
    
    // Manejar intersección de elementos
    _handleIntersection(element) {
        const componentName = element.getAttribute('data-lazy-load');
        const placeholder = element.getAttribute('data-lazy-placeholder');
        
        if (componentName) {
            this.loadComponent(componentName)
                .then(component => {
                    // Reemplazar placeholder con componente real
                    if (component && element.parentNode) {
                        const componentElement = document.createElement('div');
                        componentElement.innerHTML = placeholder || 'Cargando...';
                        element.parentNode.replaceChild(componentElement, element);
                    }
                })
                .catch(error => {
                    console.error(`❌ Error cargando componente lazy: ${componentName}`, error);
                    element.innerHTML = '<div class="error">Error cargando componente</div>';
                });
        }
        
        // Dejar de observar el elemento
        this.intersectionObserver?.unobserve(element);
    },
    
    // Configurar lazy loading de imágenes
    setupImageLazyLoading() {
        if (!('IntersectionObserver' in window)) {
            // Fallback para navegadores antiguos
            this._loadAllImages();
            return;
        }
        
        const imageObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this._loadImage(entry.target);
                        imageObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '50px'
            }
        );
        
        // Observar imágenes con data-src
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            // Agregar placeholder si no tiene src
            if (!img.src) {
                img.src = this._generatePlaceholder(img.width || 300, img.height || 200);
            }
            imageObserver.observe(img);
        });
        
        this.imageObserver = imageObserver;
    },
    
    // Cargar imagen lazy
    _loadImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) return;
        
        // Crear nueva imagen para precargar
        const newImg = new Image();
        
        newImg.onload = () => {
            img.src = src;
            img.classList.add('lazy-loaded');
            img.removeAttribute('data-src');
            
            // Agregar animación de fade-in
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            
            requestAnimationFrame(() => {
                img.style.opacity = '1';
            });
        };
        
        newImg.onerror = () => {
            console.error(`❌ Error cargando imagen: ${src}`);
            img.alt = 'Error cargando imagen';
            img.classList.add('lazy-error');
        };
        
        newImg.src = src;
    },
    
    // Generar placeholder SVG
    _generatePlaceholder(width, height) {
        const svg = `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f0f0f0"/>
                <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" 
                      fill="#999" text-anchor="middle" dy=".3em">Cargando...</text>
            </svg>
        `;
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    },
    
    // Fallback para navegadores sin IntersectionObserver
    _loadAllImages() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => this._loadImage(img));
    },
    
    // Optimizar orden de carga de scripts
    optimizeScriptLoading() {
        // Scripts críticos ya están cargados en index.html (currency.js, api.js, auth.js)
        // Solo cargar scripts de componentes que no estén ya cargados
        const criticalScripts = [
            // Removidos currency.js, api.js, auth.js para evitar duplicados
        ];
        
        // Scripts de componentes (pueden cargarse después)
        const componentScripts = [
            'src/components/Header.js',
            'src/components/CategoryNav.js',
            'src/components/ProductCard.js'
        ];
        
        // Scripts opcionales (pueden cargarse en idle)
        const optionalScripts = [
            'src/performance.js'
        ];
        
        this._loadScriptsInOrder(criticalScripts, 'critical')
            .then(() => this._loadScriptsInOrder(componentScripts, 'components'))
            .then(() => {
                // Cargar scripts opcionales cuando el navegador esté idle
                this._loadScriptsWhenIdle(optionalScripts);
            });
    },
    
    // Cargar scripts en orden
    async _loadScriptsInOrder(scripts, category) {
        console.log(`📦 Cargando scripts ${category}...`);
        
        for (const scriptPath of scripts) {
            try {
                await this._loadScript(scriptPath);
            } catch (error) {
                console.warn(`⚠️ Error cargando script ${scriptPath}:`, error);
            }
        }
    },
    
    // Cargar script individual
    _loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            
            script.onload = resolve;
            script.onerror = reject;
            script.src = src;
            script.defer = true;
            
            document.head.appendChild(script);
        });
    },
    
    // Cargar scripts cuando el navegador esté idle
    _loadScriptsWhenIdle(scripts) {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                this._loadScriptsInOrder(scripts, 'optional');
            });
        } else {
            // Fallback: cargar después de un timeout
            setTimeout(() => {
                this._loadScriptsInOrder(scripts, 'optional');
            }, 2000);
        }
    },
    
    // Configurar preloading inteligente
    setupIntelligentPreloading() {
        // Precargar recursos basado en las rutas más visitadas
        const commonRoutes = [
            'ProductCatalog',
            'CartView'
        ];
        
        // Precargar en idle time
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                this._preloadPopularComponents(commonRoutes);
            });
        }
        
        // Precargar basado en interacciones del usuario
        this._setupHoverPreloading();
    },
    
    // Precargar componentes populares
    _preloadPopularComponents(components) {
        components.forEach(componentName => {
            if (!window[componentName] && !this.loadedComponents.has(componentName)) {
                this.loadComponent(componentName)
                    .then(() => {
                        console.log(`✨ Preloaded: ${componentName}`);
                    })
                    .catch(error => {
                        console.warn(`⚠️ Preload failed: ${componentName}`, error);
                    });
            }
        });
    },
    
    // Configurar preloading en hover
    _setupHoverPreloading() {
        const hoverPreloadElements = {
            '[data-view="catalog"]': 'ProductCatalog',
            '[data-view="cart"]': 'CartView',
            '[data-view="checkout"]': 'ModernCheckoutComponent'
        };
        
        Object.entries(hoverPreloadElements).forEach(([selector, componentName]) => {
            document.addEventListener('mouseover', (e) => {
                if (e.target.matches(selector) || e.target.closest(selector)) {
                    if (!window[componentName] && !this.loadedComponents.has(componentName)) {
                        this.loadComponent(componentName)
                            .catch(error => console.warn(`Hover preload failed: ${componentName}`, error));
                    }
                }
            }, { passive: true });
        });
    },
    
    // Crear componente con lazy loading
    createLazyComponent(componentName, placeholder = null) {
        return {
            render: async (container) => {
                // Mostrar placeholder mientras carga
                if (placeholder) {
                    container.innerHTML = placeholder;
                }
                
                try {
                    const component = await this.loadComponent(componentName);
                    
                    // Renderizar componente real
                    if (component && React.isValidElement(component())) {
                        const root = ReactDOM.createRoot(container);
                        root.render(React.createElement(component));
                    } else {
                        container.innerHTML = '<div class="error">Error renderizando componente</div>';
                    }
                    
                } catch (error) {
                    console.error(`Error loading lazy component ${componentName}:`, error);
                    container.innerHTML = '<div class="error">Error cargando componente</div>';
                }
            }
        };
    },
    
    // Obtener métricas de lazy loading
    getMetrics() {
        return {
            loadedComponents: Array.from(this.loadedComponents),
            loadingPromises: Array.from(this.loadingPromises.keys()),
            totalComponents: this.loadedComponents.size,
            config: this.config
        };
    },
    
    // Limpiar recursos
    cleanup() {
        this.intersectionObserver?.disconnect();
        this.imageObserver?.disconnect();
        this.loadingPromises.clear();
    }
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.LazyLoader.init();
    });
} else {
    window.LazyLoader.init();
}

console.log('✅ Lazy Loader System cargado');