# 📚 Documentación de Filtros Avanzados - VelyKaPet

## 🎯 Resumen

Los filtros avanzados permiten a los usuarios encontrar productos específicos usando criterios precisos basados en los datos del backend. El sistema utiliza IDs numéricos en lugar de búsqueda por texto para garantizar resultados exactos y rápidos.

---

## 🔧 Arquitectura

### Backend (.NET)
El backend proporciona endpoints para:
- Obtener opciones de filtros dinámicamente
- Filtrar productos usando IDs numéricos
- Retornar productos con todas sus variaciones

### Frontend (React)
El frontend:
- Carga opciones de filtros dinámicamente desde el backend
- Usa radio buttons para selección única (tipo mascota, categoría, etc.)
- Aplica filtros usando campos de ID del backend
- Calcula contadores de productos por cada opción

---

## 📡 Endpoints de la API

### Obtener Opciones de Filtros

#### Tipos de Mascotas
```
GET /api/Productos/filtros/mascotas
```
Retorna:
```json
[
  {
    "IdMascotaTipo": 1,
    "Nombre": "GATO",
    "Activo": true
  },
  {
    "IdMascotaTipo": 2,
    "Nombre": "PERRO",
    "Activo": true
  }
]
```

#### Categorías de Alimento
```
GET /api/Productos/filtros/categorias-alimento
GET /api/Productos/filtros/categorias-alimento?idMascotaTipo=1
```
Retorna:
```json
[
  {
    "IdCategoriaAlimento": 1,
    "Nombre": "ALIMENTO SECO PERRO",
    "IdMascotaTipo": 2,
    "Activo": true
  }
]
```

#### Subcategorías
```
GET /api/Productos/filtros/subcategorias
GET /api/Productos/filtros/subcategorias?idCategoriaAlimento=2
```

#### Presentaciones
```
GET /api/Productos/filtros/presentaciones
```

### Filtrar Productos

```
GET /api/Productos?idMascotaTipo={id}&idCategoriaAlimento={id}&idSubcategoria={id}&idPresentacion={id}
```

**Ejemplos:**
- Productos para gatos: `/api/Productos?idMascotaTipo=1`
- Alimento seco para gatos: `/api/Productos?idMascotaTipo=1&idCategoriaAlimento=2`
- Alimento adulto en bolsa: `/api/Productos?idSubcategoria=6&idPresentacion=1`

---

## 🎨 Componentes Frontend

### 1. FilterSidebar.js

**Responsabilidades:**
- Cargar opciones de filtros desde el backend
- Mostrar filtros con radio buttons (selección única)
- Manejar cambios de filtros
- Mostrar contadores de productos

**Cambios Implementados:**
- ✅ Carga dinámica de opciones desde backend
- ✅ Uso de IDs numéricos en lugar de texto
- ✅ Radio buttons para selección única
- ✅ Estado de carga mientras obtiene opciones
- ✅ Opción "Todos" para limpiar cada filtro

**Uso:**
```javascript
<FilterSidebar 
  onFiltersChange={handleFiltersChange}
  activeFilters={activeFilters}
  productCounts={productCounts}
/>
```

### 2. CatalogWithFilters.js

**Responsabilidades:**
- Cargar productos del backend
- Aplicar filtros usando campos de ID
- Calcular contadores por categoría
- Mostrar resultados filtrados

**Cambios Implementados:**
- ✅ Aplicación de filtros por IDs del backend
- ✅ Conteo de productos usando IDs
- ✅ Soporte para variaciones de productos
- ✅ Feedback mejorado cuando no hay resultados
- ✅ Muestra filtros activos en estado sin resultados

**Estructura de Filtros:**
```javascript
{
  idMascotaTipo: 1,              // Número o null
  idCategoriaAlimento: 2,        // Número o null
  idSubcategoria: 6,             // Número o null
  idPresentacion: 1,             // Número o null
  maxPrice: 100000,              // Número
  availability: ['in-stock'],    // Array
  search: 'alimento'             // String
}
```

### 3. api.js

**Responsabilidades:**
- Comunicación con el backend
- Mapeo de productos del backend
- Métodos para obtener opciones de filtros

**Nuevos Métodos:**
```javascript
// Obtener tipos de mascotas
await apiService.getMascotaTipos();

// Obtener categorías de alimento
await apiService.getCategoriasAlimento();
await apiService.getCategoriasAlimento(idMascotaTipo);

// Obtener subcategorías
await apiService.getSubcategorias();
await apiService.getSubcategorias(idCategoriaAlimento);

// Obtener presentaciones
await apiService.getPresentaciones();

// Filtrar productos
await apiService.getProducts({
  idMascotaTipo: 1,
  idCategoriaAlimento: 2
});
```

---

## 🔍 Flujo de Filtrado

### 1. Inicialización
```
Usuario abre catálogo
  ↓
CatalogWithFilters carga productos sin filtros
  ↓
FilterSidebar carga opciones de filtros en paralelo
  ↓
Se muestran productos y filtros disponibles
```

### 2. Aplicación de Filtros
```
Usuario selecciona "GATO" en tipo de mascota
  ↓
FilterSidebar llama onFiltersChange({ idMascotaTipo: 1 })
  ↓
CatalogWithFilters recibe nuevo filtro
  ↓
applyFilters filtra productos donde IdMascotaTipo === 1
  ↓
Se actualizan productos mostrados
  ↓
Se recalculan contadores
```

### 3. Filtros Combinados
```
Usuario tiene filtro de mascota activo
  ↓
Usuario selecciona categoría de alimento
  ↓
FilterSidebar agrega idCategoriaAlimento al objeto de filtros
  ↓
CatalogWithFilters aplica ambos filtros
  ↓
Productos deben cumplir TODOS los criterios
```

---

## 🧪 Testing

### Ejecutar Tests
```bash
# Asegúrate que el backend esté corriendo en localhost:5135
node test-advanced-filters.js
```

### Tests Implementados
1. ✅ Obtener todos los productos sin filtros
2. ✅ Obtener tipos de mascotas
3. ✅ Obtener categorías de alimento
4. ✅ Obtener subcategorías
5. ✅ Obtener presentaciones
6. ✅ Filtrar por tipo de mascota
7. ✅ Filtrar por categoría de alimento
8. ✅ Filtro combinado (mascota + categoría)

### Casos de Prueba Recomendados
- [ ] Productos con múltiples variaciones
- [ ] Productos sin variaciones
- [ ] Filtros combinados complejos (3+ filtros)
- [ ] Cambio rápido entre filtros
- [ ] Limpieza de filtros
- [ ] Filtro de precio con variaciones
- [ ] Disponibilidad en stock

---

## 🐛 Resolución de Problemas

### Los filtros no muestran opciones

**Síntomas:**
- FilterSidebar muestra estado de carga indefinidamente
- No aparecen opciones en los filtros

**Soluciones:**
1. Verificar que el backend esté corriendo
2. Revisar consola del navegador para errores de API
3. Confirmar que los endpoints de filtros existen
4. Verificar que ApiService esté cargado correctamente

### No aparecen resultados al filtrar por "gato"

**Síntomas:**
- Se selecciona filtro de mascota
- No se muestran productos

**Soluciones:**
1. Verificar en la base de datos que existan productos con `IdMascotaTipo = 1`
2. Revisar que los productos tengan el campo `IdMascotaTipo` poblado
3. Verificar logs de consola para ver qué filtros se están aplicando
4. Confirmar que el mapeo de productos incluye los campos de filtros

### Los contadores muestran 0 productos

**Síntomas:**
- Los filtros se muestran pero todos tienen (0) productos

**Soluciones:**
1. Verificar que los productos cargados tienen los campos de ID
2. Revisar la función `calculateProductCounts()`
3. Confirmar que los IDs en `productCounts` coinciden con los IDs de las opciones

---

## 📊 Estructura de Datos

### Producto del Backend (ProductoDto)
```javascript
{
  IdProducto: 123,
  NombreBase: "Alimento Premium Gato Adulto",
  Descripcion: "Alimento balanceado...",
  URLImagen: "https://...",
  
  // Campos de filtros avanzados
  IdMascotaTipo: 1,
  NombreMascotaTipo: "GATO",
  IdCategoriaAlimento: 2,
  NombreCategoriaAlimento: "ALIMENTO SECO GATO",
  IdSubcategoria: 6,
  NombreSubcategoria: "ADULT",
  IdPresentacion: 1,
  NombrePresentacion: "BOLSA",
  
  // Variaciones
  Variaciones: [
    {
      IdVariacion: 456,
      IdProducto: 123,
      Peso: "1kg",
      Precio: 45000,
      Stock: 10,
      Activa: true
    },
    {
      IdVariacion: 457,
      IdProducto: 123,
      Peso: "3kg",
      Precio: 120000,
      Stock: 5,
      Activa: true
    }
  ]
}
```

---

## ✅ Buenas Prácticas

### Para Desarrolladores

1. **Siempre usar IDs numéricos** para filtros, no texto
2. **Validar datos del backend** antes de aplicar filtros
3. **Incluir logs detallados** para facilitar debugging
4. **Manejar estados de carga** para mejor UX
5. **Proporcionar feedback claro** cuando no hay resultados

### Para Agregar Nuevos Filtros

1. Crear endpoint en el backend para obtener opciones
2. Agregar método en `api.js` para consumir endpoint
3. Agregar estado en `FilterSidebar` para las opciones
4. Cargar opciones en `useEffect` inicial
5. Renderizar sección de filtro con `renderRadioFilterSection`
6. Actualizar `applyFilters` en `CatalogWithFilters`
7. Actualizar `calculateProductCounts`
8. Agregar tests

---

## 🚀 Mejoras Futuras

### Prioridad Alta
- [ ] Cache de opciones de filtros en localStorage
- [ ] Filtros en URL para compartir enlaces
- [ ] Historial de filtros aplicados

### Prioridad Media
- [ ] Ordenamiento de resultados (precio, nombre, etc.)
- [ ] Búsqueda dentro de resultados filtrados
- [ ] Exportar resultados filtrados

### Prioridad Baja
- [ ] Guardar filtros favoritos
- [ ] Sugerencias de filtros basadas en historial
- [ ] Filtros por rango de precios (min-max)

---

## 📝 Notas de Migración

### De Filtros por Texto a IDs

**Antes:**
```javascript
// Filtro por texto
filters.pets = ['gatos', 'perros'];

// Aplicación
products.filter(p => 
  filters.pets.some(pet => 
    p.Name.toLowerCase().includes(pet)
  )
);
```

**Después:**
```javascript
// Filtro por ID
filters.idMascotaTipo = 1;

// Aplicación
products.filter(p => 
  p.IdMascotaTipo === filters.idMascotaTipo
);
```

**Ventajas:**
- ✅ Más rápido (comparación de números)
- ✅ Más preciso (no hay falsos positivos)
- ✅ Más escalable (independiente del idioma)
- ✅ Compatible con el backend

---

## 🤝 Contribuciones

Para reportar bugs o sugerir mejoras en el sistema de filtros:
1. Documentar el comportamiento esperado vs actual
2. Incluir logs de consola relevantes
3. Especificar datos de prueba usados
4. Proporcionar pasos para reproducir

---

**Última actualización:** 2025-10-12  
**Versión:** 2.0.0  
**Autor:** GitHub Copilot Advanced Agent
