// Script de limpieza AGRESIVA para resolver problemas de caché
// Ejecutar en la consola del navegador

console.log('🧹 INICIANDO LIMPIEZA AGRESIVA DE CACHÉ...');

async function clearAllCache() {
    try {
        // 1. Limpiar Service Workers
        if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            console.log(`🔧 Encontrados ${registrations.length} service workers`);
            
            for (let registration of registrations) {
                await registration.unregister();
                console.log('✅ Service worker eliminado');
            }
        }

        // 2. Limpiar Cache API
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            console.log(`💾 Encontrados ${cacheNames.length} caches`);
            
            for (let cacheName of cacheNames) {
                await caches.delete(cacheName);
                console.log(`✅ Cache eliminado: ${cacheName}`);
            }
        }

        // 3. Limpiar localStorage
        const localStorageKeys = Object.keys(localStorage);
        console.log(`🗄️ Limpiando ${localStorageKeys.length} items de localStorage`);
        localStorage.clear();

        // 4. Limpiar sessionStorage
        const sessionStorageKeys = Object.keys(sessionStorage);
        console.log(`📝 Limpiando ${sessionStorageKeys.length} items de sessionStorage`);
        sessionStorage.clear();

        // 5. Forzar recarga sin caché
        console.log('🔄 LIMPIEZA COMPLETADA - Recargando página...');
        
        // Esperar un momento y recargar
        setTimeout(() => {
            window.location.reload(true);
        }, 1000);

    } catch (error) {
        console.error('❌ Error durante la limpieza:', error);
    }
}

// Ejecutar limpieza
clearAllCache();