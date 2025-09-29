# 🧪 Comandos de Prueba - VelyKapet

## 🔍 Verificar que los Filtros Amazon Sean Visibles

### 1. Abrir Consola del Navegador (F12)

### 2. Verificar Componentes Cargados
```javascript
// Verificar que todos los componentes estén cargados
console.log('Componentes disponibles:', {
    CatalogWithFilters: !!window.CatalogWithFilters,
    FilterSidebar: !!window.FilterSidebar,
    ProductCard: !!window.ProductCardComponent,
    AdminPanel: !!window.AdminPanel,
    IconoPetScraper: !!window.IconoPetScraper
});
```

### 3. Ir al Catálogo (debe mostrar filtros)
```javascript
window.setCurrentView('catalog')
```

### 4. Si NO se ven los filtros, verificar en consola:
- Debe aparecer: "✅ Cargando CatalogWithFilters con filtros Amazon"
- Si aparece "❌ ERROR FilterSidebar no disponible" = problema de carga de scripts

---

## 📦 Extraer Productos de IconoPet

### Comando Rápido para Extraer Todos los Productos:
```javascript
extractIconoPetProducts()
```

### Comando Alternativo Paso a Paso:
```javascript
// 1. Crear instancia del scraper
const scraper = new IconoPetScraper();

// 2. Ver estadísticas
const stats = scraper.getStatistics();
console.table(stats);

// 3. Procesar productos
const products = await scraper.processForVelyKapet();
console.log(`Productos procesados: ${products.length}`);

// 4. Guardar en el sistema
const result = await scraper.saveToSystem();
console.log('Resultado:', result);
```

---

## 🔧 Acceder al Panel de Administración

```javascript
window.setCurrentView('admin')
```

### Probar Importación de Catálogo:
1. Ve al panel de admin
2. Click en "Importar Catálogo" 
3. Sube un archivo CSV de prueba:

```csv
Nombre,Precio,Stock,Marca,Descripción
"Producto Prueba 1",25000,15,"Marca Test","Descripción del producto 1"
"Producto Prueba 2",35000,25,"Marca Test","Descripción del producto 2"
```

---

## 🧪 Debug Avanzado

### Ver Estado Completo del Sistema:
```javascript
console.log('=== ESTADO COMPLETO DEL SISTEMA ===');
console.log('Vista actual:', window.getCurrentView ? window.getCurrentView() : 'No disponible');
console.log('Usuario actual:', window.authManager ? window.authManager.getUser() : 'No autenticado');
console.log('Productos en carrito:', window.cartManager ? window.cartManager.getTotalItems() : 0);
console.log('API Service:', window.ApiService ? window.ApiService.getApiStatus() : 'No disponible');
```

### Limpiar Caché Local:
```javascript
localStorage.removeItem('ventaspet_imported_products');
localStorage.removeItem('ventaspet_cart');
location.reload();
```

---

## 🛠️ Solución de Problemas

### Problema: Filtros no se ven
**Solución:**
```javascript
// 1. Recargar página
location.reload();

// 2. Verificar orden de scripts en index.html:
// - FilterSidebar.js debe cargar ANTES que CatalogWithFilters.js
// - app.js debe cargar AL FINAL

// 3. Forzar recarga de componente
window.setCurrentView('home');
setTimeout(() => window.setCurrentView('catalog'), 500);
```

### Problema: No hay productos
**Solución:**
```javascript
// Extraer productos de IconoPet
extractIconoPetProducts();

// Recargar vista de catálogo
window.setCurrentView('catalog');
```

### Problema: Error de API
**Solución:**
```javascript
// Probar conexión API
window.ApiService.testConnection().then(result => {
    console.log('Test API:', result);
});

// Usar datos locales
localStorage.setItem('use_local_data', 'true');
location.reload();
```

---

## 📊 Comandos de Estadísticas

### Ver Productos Cargados:
```javascript
// En la vista de catálogo, abrir consola y ejecutar:
console.log('Productos disponibles:', window.CatalogWithFilters ? 'Sí' : 'No');
```

### Ver Marcas Disponibles:
```javascript
const scraper = new IconoPetScraper();
const stats = scraper.getStatistics();
console.log('Marcas:', stats.brands);
console.log('Categorías:', stats.categories);
```

### Ver Productos por Marca:
```javascript
const scraper = new IconoPetScraper();
const products = scraper.generateIconoPetProducts();
console.log('TIKI PETS:', products.filter(p => p.brand === 'TIKI PETS'));
console.log('CHURU:', products.filter(p => p.brand === 'CHURU'));
```

---

## 🚀 Test Completo del Sistema

```javascript
async function testCompleteSystem() {
    console.log('🚀 INICIANDO TEST COMPLETO DEL SISTEMA');
    
    // 1. Verificar componentes
    console.log('1. Componentes:', {
        CatalogWithFilters: !!window.CatalogWithFilters,
        FilterSidebar: !!window.FilterSidebar,
        AdminPanel: !!window.AdminPanel
    });
    
    // 2. Extraer productos IconoPet
    console.log('2. Extrayendo productos IconoPet...');
    await extractIconoPetProducts();
    
    // 3. Ir a catálogo
    console.log('3. Cargando catálogo...');
    window.setCurrentView('catalog');
    
    // 4. Esperar 2 segundos y verificar
    setTimeout(() => {
        console.log('4. ¿Filtros visibles?', document.querySelector('.filter-sidebar') ? 'SÍ' : 'NO');
        console.log('✅ TEST COMPLETO FINALIZADO');
    }, 2000);
}

// Ejecutar test completo
testCompleteSystem();
```

---

## 📋 Checklist de Verificación

- [ ] ✅ Los filtros Amazon se ven en el lado izquierdo
- [ ] ✅ Hay más de 30 productos cargados (IconoPet + ejemplos)
- [ ] ✅ Los filtros funcionan (buscar, precio, marca, etc.)
- [ ] ✅ El panel de admin es accesible
- [ ] ✅ La importación de archivos funciona
- [ ] ✅ El viewport se aprovecha al máximo

## 🎯 Resultados Esperados

- **Home**: Aprovecha 98% del viewport, cards más grandes
- **Carrito**: Layout expandido, mejor uso del espacio  
- **Catálogo**: Filtros laterales + grid de hasta 10 columnas
- **Admin**: Dashboard funcional + importador de archivos
- **Productos**: 60+ productos (IconoPet + ejemplos)
- **Filtros**: Completamente funcionales tipo Amazon