// LIMPIEZA NUCLEAR DE CACHÉ - EJECUTAR EN CONSOLA
console.log('💥 INICIANDO LIMPIEZA NUCLEAR...');

// 1. ELIMINAR TODO EL CACHÉ DE APLICACIÓN
if ('caches' in window) {
    caches.keys().then(function(names) {
        for (let name of names) {
            caches.delete(name);
            console.log('🗑️ Cache eliminado:', name);
        }
    });
}

// 2. ELIMINAR SERVICE WORKERS
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
            registration.unregister();
            console.log('🗑️ Service Worker eliminado');
        }
    });
}

// 3. LIMPIAR STORAGE COMPLETO
localStorage.clear();
sessionStorage.clear();
console.log('🗑️ Storage limpiado');

// 4. LIMPIAR COOKIES
document.cookie.split(";").forEach(function(c) { 
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});
console.log('🗑️ Cookies eliminadas');

// 5. FORZAR RECARGA SIN CACHÉ
console.log('🔄 RECARGANDO SIN CACHÉ...');
setTimeout(() => {
    window.location.reload(true);
}, 1000);

console.log('💥 LIMPIEZA NUCLEAR COMPLETADA');