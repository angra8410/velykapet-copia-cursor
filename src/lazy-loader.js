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
                }\n            };\n            \n            script.onerror = () => {\n                clearTimeout(timeout);\n                console.error(`❌ Error cargando componente: ${componentName}`);\n                \n                if (fallback) {\n                    resolve(fallback);\n                } else {\n                    reject(new Error(`Failed to load component: ${componentName}`));\n                }\n            };\n            \n            // Determinar ruta del script\n            const scriptPath = this._getComponentPath(componentName);\n            script.src = scriptPath;\n            script.defer = true;\n            \n            document.head.appendChild(script);\n        });\n    },\n    \n    // Obtener ruta del componente\n    _getComponentPath(componentName) {\n        const componentMap = {\n            'ProductCatalog': 'src/components/ProductCatalog.js',\n            'CartView': 'src/components/CartView.js',\n            'ModernCheckoutComponent': 'src/components/ModernCheckout.js',\n            'AuthComponent': 'src/components/AuthComponent.js',\n            'ModernLayoutComponent': 'src/components/ModernLayout.js',\n            'ProductCard': 'src/components/ProductCard.js',\n            'CategoryNav': 'src/components/CategoryNav.js',\n            'Header': 'src/components/Header.js'\n        };\n        \n        return componentMap[componentName] || `src/components/${componentName}.js`;\n    },\n    \n    // Configurar Intersection Observer\n    setupIntersectionObserver() {\n        if (!('IntersectionObserver' in window)) {\n            console.warn('⚠️ IntersectionObserver no soportado');\n            return;\n        }\n        \n        const observer = new IntersectionObserver(\n            (entries) => {\n                entries.forEach(entry => {\n                    if (entry.isIntersecting) {\n                        this._handleIntersection(entry.target);\n                    }\n                });\n            },\n            {\n                threshold: this.config.intersectionThreshold,\n                rootMargin: this.config.rootMargin\n            }\n        );\n        \n        // Observar elementos con data-lazy-load\n        const lazyElements = document.querySelectorAll('[data-lazy-load]');\n        lazyElements.forEach(el => observer.observe(el));\n        \n        this.intersectionObserver = observer;\n    },\n    \n    // Manejar intersección de elementos\n    _handleIntersection(element) {\n        const componentName = element.getAttribute('data-lazy-load');\n        const placeholder = element.getAttribute('data-lazy-placeholder');\n        \n        if (componentName) {\n            this.loadComponent(componentName)\n                .then(component => {\n                    // Reemplazar placeholder con componente real\n                    if (component && element.parentNode) {\n                        const componentElement = document.createElement('div');\n                        componentElement.innerHTML = placeholder || 'Cargando...';\n                        element.parentNode.replaceChild(componentElement, element);\n                    }\n                })\n                .catch(error => {\n                    console.error(`❌ Error cargando componente lazy: ${componentName}`, error);\n                    element.innerHTML = '<div class=\"error\">Error cargando componente</div>';\n                });\n        }\n        \n        // Dejar de observar el elemento\n        this.intersectionObserver?.unobserve(element);\n    },\n    \n    // Configurar lazy loading de imágenes\n    setupImageLazyLoading() {\n        if (!('IntersectionObserver' in window)) {\n            // Fallback para navegadores antiguos\n            this._loadAllImages();\n            return;\n        }\n        \n        const imageObserver = new IntersectionObserver(\n            (entries) => {\n                entries.forEach(entry => {\n                    if (entry.isIntersecting) {\n                        this._loadImage(entry.target);\n                        imageObserver.unobserve(entry.target);\n                    }\n                });\n            },\n            {\n                threshold: 0.1,\n                rootMargin: '50px'\n            }\n        );\n        \n        // Observar imágenes con data-src\n        const lazyImages = document.querySelectorAll('img[data-src]');\n        lazyImages.forEach(img => {\n            // Agregar placeholder si no tiene src\n            if (!img.src) {\n                img.src = this._generatePlaceholder(img.width || 300, img.height || 200);\n            }\n            imageObserver.observe(img);\n        });\n        \n        this.imageObserver = imageObserver;\n    },\n    \n    // Cargar imagen lazy\n    _loadImage(img) {\n        const src = img.getAttribute('data-src');\n        if (!src) return;\n        \n        // Crear nueva imagen para precargar\n        const newImg = new Image();\n        \n        newImg.onload = () => {\n            img.src = src;\n            img.classList.add('lazy-loaded');\n            img.removeAttribute('data-src');\n            \n            // Agregar animación de fade-in\n            img.style.opacity = '0';\n            img.style.transition = 'opacity 0.3s ease';\n            \n            requestAnimationFrame(() => {\n                img.style.opacity = '1';\n            });\n        };\n        \n        newImg.onerror = () => {\n            console.error(`❌ Error cargando imagen: ${src}`);\n            img.alt = 'Error cargando imagen';\n            img.classList.add('lazy-error');\n        };\n        \n        newImg.src = src;\n    },\n    \n    // Generar placeholder SVG\n    _generatePlaceholder(width, height) {\n        const svg = `\n            <svg width=\"${width}\" height=\"${height}\" xmlns=\"http://www.w3.org/2000/svg\">\n                <rect width=\"100%\" height=\"100%\" fill=\"#f0f0f0\"/>\n                <text x=\"50%\" y=\"50%\" font-family=\"Arial, sans-serif\" font-size=\"14\" \n                      fill=\"#999\" text-anchor=\"middle\" dy=\".3em\">Cargando...</text>\n            </svg>\n        `;\n        return `data:image/svg+xml;base64,${btoa(svg)}`;\n    },\n    \n    // Fallback para navegadores sin IntersectionObserver\n    _loadAllImages() {\n        const lazyImages = document.querySelectorAll('img[data-src]');\n        lazyImages.forEach(img => this._loadImage(img));\n    },\n    \n    // Optimizar orden de carga de scripts\n    optimizeScriptLoading() {\n        // Scripts críticos (deben cargarse primero)\n        const criticalScripts = [\n            'src/currency.js',\n            'src/api.js',\n            'src/auth.js'\n        ];\n        \n        // Scripts de componentes (pueden cargarse después)\n        const componentScripts = [\n            'src/components/Header.js',\n            'src/components/CategoryNav.js',\n            'src/components/ProductCard.js'\n        ];\n        \n        // Scripts opcionales (pueden cargarse en idle)\n        const optionalScripts = [\n            'src/performance.js'\n        ];\n        \n        this._loadScriptsInOrder(criticalScripts, 'critical')\n            .then(() => this._loadScriptsInOrder(componentScripts, 'components'))\n            .then(() => {\n                // Cargar scripts opcionales cuando el navegador esté idle\n                this._loadScriptsWhenIdle(optionalScripts);\n            });\n    },\n    \n    // Cargar scripts en orden\n    async _loadScriptsInOrder(scripts, category) {\n        console.log(`📦 Cargando scripts ${category}...`);\n        \n        for (const scriptPath of scripts) {\n            try {\n                await this._loadScript(scriptPath);\n            } catch (error) {\n                console.warn(`⚠️ Error cargando script ${scriptPath}:`, error);\n            }\n        }\n    },\n    \n    // Cargar script individual\n    _loadScript(src) {\n        return new Promise((resolve, reject) => {\n            const script = document.createElement('script');\n            \n            script.onload = resolve;\n            script.onerror = reject;\n            script.src = src;\n            script.defer = true;\n            \n            document.head.appendChild(script);\n        });\n    },\n    \n    // Cargar scripts cuando el navegador esté idle\n    _loadScriptsWhenIdle(scripts) {\n        if ('requestIdleCallback' in window) {\n            requestIdleCallback(() => {\n                this._loadScriptsInOrder(scripts, 'optional');\n            });\n        } else {\n            // Fallback: cargar después de un timeout\n            setTimeout(() => {\n                this._loadScriptsInOrder(scripts, 'optional');\n            }, 2000);\n        }\n    },\n    \n    // Configurar preloading inteligente\n    setupIntelligentPreloading() {\n        // Precargar recursos basado en las rutas más visitadas\n        const commonRoutes = [\n            'ProductCatalog',\n            'CartView'\n        ];\n        \n        // Precargar en idle time\n        if ('requestIdleCallback' in window) {\n            requestIdleCallback(() => {\n                this._preloadPopularComponents(commonRoutes);\n            });\n        }\n        \n        // Precargar basado en interacciones del usuario\n        this._setupHoverPreloading();\n    },\n    \n    // Precargar componentes populares\n    _preloadPopularComponents(components) {\n        components.forEach(componentName => {\n            if (!window[componentName] && !this.loadedComponents.has(componentName)) {\n                this.loadComponent(componentName)\n                    .then(() => {\n                        console.log(`✨ Preloaded: ${componentName}`);\n                    })\n                    .catch(error => {\n                        console.warn(`⚠️ Preload failed: ${componentName}`, error);\n                    });\n            }\n        });\n    },\n    \n    // Configurar preloading en hover\n    _setupHoverPreloading() {\n        const hoverPreloadElements = {\n            '[data-view=\"catalog\"]': 'ProductCatalog',\n            '[data-view=\"cart\"]': 'CartView',\n            '[data-view=\"checkout\"]': 'ModernCheckoutComponent'\n        };\n        \n        Object.entries(hoverPreloadElements).forEach(([selector, componentName]) => {\n            document.addEventListener('mouseover', (e) => {\n                if (e.target.matches(selector) || e.target.closest(selector)) {\n                    if (!window[componentName] && !this.loadedComponents.has(componentName)) {\n                        this.loadComponent(componentName)\n                            .catch(error => console.warn(`Hover preload failed: ${componentName}`, error));\n                    }\n                }\n            }, { passive: true });\n        });\n    },\n    \n    // Crear componente con lazy loading\n    createLazyComponent(componentName, placeholder = null) {\n        return {\n            render: async (container) => {\n                // Mostrar placeholder mientras carga\n                if (placeholder) {\n                    container.innerHTML = placeholder;\n                }\n                \n                try {\n                    const component = await this.loadComponent(componentName);\n                    \n                    // Renderizar componente real\n                    if (component && React.isValidElement(component())) {\n                        const root = ReactDOM.createRoot(container);\n                        root.render(React.createElement(component));\n                    } else {\n                        container.innerHTML = '<div class=\"error\">Error renderizando componente</div>';\n                    }\n                    \n                } catch (error) {\n                    console.error(`Error loading lazy component ${componentName}:`, error);\n                    container.innerHTML = '<div class=\"error\">Error cargando componente</div>';\n                }\n            }\n        };\n    },\n    \n    // Obtener métricas de lazy loading\n    getMetrics() {\n        return {\n            loadedComponents: Array.from(this.loadedComponents),\n            loadingPromises: Array.from(this.loadingPromises.keys()),\n            totalComponents: this.loadedComponents.size,\n            config: this.config\n        };\n    },\n    \n    // Limpiar recursos\n    cleanup() {\n        this.intersectionObserver?.disconnect();\n        this.imageObserver?.disconnect();\n        this.loadingPromises.clear();\n    }\n};\n\n// Inicializar cuando el DOM esté listo\nif (document.readyState === 'loading') {\n    document.addEventListener('DOMContentLoaded', () => {\n        window.LazyLoader.init();\n    });\n} else {\n    window.LazyLoader.init();\n}\n\nconsole.log('✅ Lazy Loader System cargado');