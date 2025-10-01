# Guía de Configuración: Selector de Variaciones de Productos

## 📋 Resumen de Cambios

Este documento describe la implementación del selector de variaciones de productos, que permite mostrar una sola tarjeta de producto con un dropdown para seleccionar diferentes presentaciones (pesos, tamaños, etc.).

## 🎯 Objetivo

Optimizar la presentación de productos en el catálogo para mostrar:
- Una sola tarjeta por producto (no múltiples tarjetas por variación)
- Dropdown selector para elegir la presentación deseada
- Actualización automática del precio según la variación seleccionada
- Experiencia de usuario similar a e-commerce modernos (Amazon, Rappi, etc.)

## 🔧 Cambios Implementados

### 1. Backend (.NET)
El backend ya soporta variaciones de productos:
- Tabla `Productos` con `NombreBase`, `Descripcion`, etc.
- Tabla `VariacionesProducto` con `Peso`, `Precio`, `Stock` por cada variación
- API endpoint `/api/Productos` que devuelve productos con sus variaciones

### 2. Frontend (React)

#### Archivos modificados:

**`src/components/ProductVariations.js`**
- ✅ Eliminada generación de variaciones artificiales (packs, unidades)
- ✅ Implementado `getBackendVariations()` que lee del backend
- ✅ Cambiado UI de tarjetas a dropdown selector
- ✅ Formato mejorado: "Peso — Precio (Stock disponible)"

**`src/api.js`**
- ✅ `mapProductFromBackend()` ahora mantiene el array `Variaciones`
- ✅ Actualizado para coincidir con estructura del backend (.NET)

**`src/products.js`**
- ✅ Actualizado para pasar productos con `Variaciones` incluidas
- ✅ `handleAddToCart()` ahora maneja `IdVariacion` correctamente
- ✅ Búsqueda actualizada para usar `NombreBase` y `Descripcion`

**`src/components/ProductCard.js`**
- ✅ Asegurado que las variaciones del backend se pasen correctamente

## 📊 Datos de Ejemplo

Se ha creado un script SQL (`seed-example-product.sql`) para insertar el producto de ejemplo:

**Producto:** BR FOR CAT VET CONTROL DE PESO

**Variaciones:**
- 500 GR — $20,400 (SKU: 300100101)
- 1.5 KG — $58,200 (SKU: 300100102)
- 3 KG — $110,800 (SKU: 300100103)

## 🚀 Pasos para Configurar

### 1. Configurar la Base de Datos

```bash
# Ejecutar el script SQL para insertar el producto de ejemplo
# Opción A: Desde SQL Server Management Studio
# Abrir: backend-config/Data/seed-example-product.sql
# Ejecutar contra la base de datos VentasPetDB

# Opción B: Desde línea de comandos
sqlcmd -S localhost -d VentasPetDB -i backend-config/Data/seed-example-product.sql
```

### 2. Iniciar el Backend

```bash
cd backend-config
dotnet run
# O usar: start-backend.bat
```

El backend debería estar disponible en: `http://localhost:5000`

### 3. Iniciar el Frontend

```bash
# Desde la raíz del proyecto
npm run dev
# O usar: start-dev.bat
```

El frontend debería estar disponible en: `http://localhost:3000`

### 4. Verificar la Implementación

1. **Abrir el catálogo de productos**
   - Ir a la sección "Catálogo" o "Productos"

2. **Buscar el producto**
   - Buscar "BR FOR CAT VET CONTROL DE PESO"
   - Debería aparecer UNA SOLA tarjeta

3. **Probar el selector de variaciones**
   - Dentro de la tarjeta, debería aparecer un dropdown con las 3 opciones:
     - 500 GR — $20,400 (50 disp.)
     - 1.5 KG — $58,200 (30 disp.)
     - 3 KG — $110,800 (20 disp.)

4. **Verificar actualización de precio**
   - Al cambiar la selección en el dropdown
   - El precio mostrado en la tarjeta debería actualizarse automáticamente

5. **Probar agregar al carrito**
   - Seleccionar una variación
   - Hacer clic en "Agregar al carrito"
   - Verificar que se agregó la variación correcta con su precio

## 🔍 Resolución de Problemas

### Problema: No aparece el dropdown

**Solución:**
- Verificar que el producto tenga variaciones en la base de datos
- Abrir la consola del navegador (F12) y buscar mensajes de error
- Verificar que `ProductVariations.js` esté cargado correctamente

### Problema: El precio no se actualiza

**Solución:**
- Verificar en la consola del navegador los logs de cambio de variación
- Asegurarse de que `onVariationChange` está siendo llamado
- Revisar que `selectedVariation` se está actualizando en el estado

### Problema: Error al agregar al carrito

**Solución:**
- Verificar que la variación seleccionada tiene stock disponible
- Revisar que `IdVariacion` se está pasando correctamente
- Comprobar logs en la consola del navegador

## 📝 Estructura de Datos

### Producto del Backend (ProductoDto)
```json
{
  "IdProducto": 1,
  "NombreBase": "BR FOR CAT VET CONTROL DE PESO",
  "Descripcion": "Alimento con un balance adecuado...",
  "NombreCategoria": "Alimento para Gatos",
  "TipoMascota": "Gatos",
  "URLImagen": "https://...",
  "Variaciones": [
    {
      "IdVariacion": 1,
      "IdProducto": 1,
      "Peso": "500 GR",
      "Precio": 20400,
      "Stock": 50,
      "Activa": true
    },
    ...
  ]
}
```

### Variación Mapeada en Frontend
```javascript
{
  id: 1,
  idVariacion: 1,
  idProducto: 1,
  name: "BR FOR CAT VET CONTROL DE PESO - 500 GR",
  peso: "500 GR",
  price: 20400,
  stock: 50,
  activa: true,
  description: "Alimento con un balance adecuado...",
  category: "Alimento para Gatos",
  image: "https://...",
  isVariation: true
}
```

## 🎨 Mejoras Futuras

- [ ] Agregar SKU visible en el dropdown
- [ ] Implementar descuentos por volumen (3 KG más barato que 3x 1KG)
- [ ] Agregar imágenes diferentes por variación
- [ ] Implementar comparador de precios por peso (precio/kg)
- [ ] Agregar badge "Mejor valor" para la opción más económica

## 📚 Referencias

- [Issue Original](../README.md)
- [Imagen de Referencia del Diseño](https://github.com/user-attachments/assets/de95bbc7-774c-4982-b635-68a593550bac)
- [Documentación de Entity Framework](https://docs.microsoft.com/ef/)
- [React Hooks Documentation](https://reactjs.org/docs/hooks-intro.html)
