# Demostración del Fix: Problema de Casing en JSON

## Simulación del Problema y Solución

### 1. JSON Devuelto por el Backend (ANTES del fix)

Con la configuración por defecto de ASP.NET Core, el JSON se serializa en **camelCase**:

```json
[
  {
    "idProducto": 2,
    "nombreBase": "BR FOR CAT VET CONTROL DE PESO",
    "descripcion": "Alimento con un balance adecuado de nutrientes que ayuda a reducir la formación de bolas de pelo, brindándole máxima protección de piel y pelaje.",
    "idCategoria": 2,
    "nombreCategoria": "Alimento para Gatos",
    "tipoMascota": "Gatos",
    "urlImagen": "/images/productos/royal-canin-cat-weight.jpg",
    "activo": true,
    "variaciones": [
      {
        "idVariacion": 4,
        "idProducto": 2,
        "peso": "500 GR",
        "precio": 204.00,
        "stock": 50,
        "activa": true
      },
      {
        "idVariacion": 5,
        "idProducto": 2,
        "peso": "1.5 KG",
        "precio": 582.00,
        "stock": 30,
        "activa": true
      },
      {
        "idVariacion": 6,
        "idProducto": 2,
        "peso": "3 KG",
        "precio": 1108.00,
        "stock": 20,
        "activa": true
      }
    ]
  }
]
```

### 2. Mapeo del Frontend (`src/api.js`)

```javascript
mapProductFromBackend(producto) {
    return {
        IdProducto: producto.IdProducto,      // undefined ❌
        NombreBase: producto.NombreBase,      // undefined ❌
        Descripcion: producto.Descripcion,    // undefined ❌
        NombreCategoria: producto.NombreCategoria, // undefined ❌
        TipoMascota: producto.TipoMascota,    // undefined ❌
        URLImagen: producto.URLImagen,        // undefined ❌
        Activo: producto.Activo,              // undefined ❌
        Variaciones: producto.Variaciones || [] // undefined → [] ❌
    };
}
```

**Resultado:** Todas las propiedades son `undefined` porque el backend envía `nombreBase` pero el frontend busca `NombreBase`.

### 3. Producto Después del Mapeo (ANTES)

```javascript
{
    IdProducto: undefined,
    NombreBase: undefined,
    Descripcion: undefined,
    NombreCategoria: undefined,
    TipoMascota: undefined,
    URLImagen: undefined,
    Activo: undefined,
    Variaciones: []
}
```

### 4. Componente ProductCard Intenta Mostrar

```javascript
// src/products.js
const modernProduct = {
    name: product.NombreBase,  // undefined → tarjeta sin nombre
    description: product.Descripcion,  // undefined → tarjeta sin descripción
    category: product.NombreCategoria,  // undefined → tarjeta sin categoría
    image: product.URLImagen,  // undefined → imagen rota
    Variaciones: product.Variaciones || []  // [] → sin variaciones
};
```

**Resultado visual:**
- Nombre: (vacío)
- Descripción: (vacío)
- Precio: $0 (no hay variaciones)
- Stock: Agotado (no hay variaciones)

---

## SOLUCIÓN APLICADA

### 1. Configuración del Backend (`backend-config/Program.cs`)

```csharp
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Preserve PascalCase property names in JSON (to match DTO structure)
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
    });
```

### 2. JSON Devuelto por el Backend (DESPUÉS del fix)

Ahora el JSON mantiene **PascalCase** (igual que los DTOs):

```json
[
  {
    "IdProducto": 2,
    "NombreBase": "BR FOR CAT VET CONTROL DE PESO",
    "Descripcion": "Alimento con un balance adecuado de nutrientes que ayuda a reducir la formación de bolas de pelo, brindándole máxima protección de piel y pelaje.",
    "IdCategoria": 2,
    "NombreCategoria": "Alimento para Gatos",
    "TipoMascota": "Gatos",
    "URLImagen": "/images/productos/royal-canin-cat-weight.jpg",
    "Activo": true,
    "Variaciones": [
      {
        "IdVariacion": 4,
        "IdProducto": 2,
        "Peso": "500 GR",
        "Precio": 204.00,
        "Stock": 50,
        "Activa": true
      },
      {
        "IdVariacion": 5,
        "IdProducto": 2,
        "Peso": "1.5 KG",
        "Precio": 582.00,
        "Stock": 30,
        "Activa": true
      },
      {
        "IdVariacion": 6,
        "IdProducto": 2,
        "Peso": "3 KG",
        "Precio": 1108.00,
        "Stock": 20,
        "Activa": true
      }
    ]
  }
]
```

### 3. Mapeo del Frontend (DESPUÉS)

```javascript
mapProductFromBackend(producto) {
    return {
        IdProducto: producto.IdProducto,      // 2 ✅
        NombreBase: producto.NombreBase,      // "BR FOR CAT VET CONTROL DE PESO" ✅
        Descripcion: producto.Descripcion,    // "Alimento con un balance..." ✅
        NombreCategoria: producto.NombreCategoria, // "Alimento para Gatos" ✅
        TipoMascota: producto.TipoMascota,    // "Gatos" ✅
        URLImagen: producto.URLImagen,        // "/images/productos/..." ✅
        Activo: producto.Activo,              // true ✅
        Variaciones: producto.Variaciones || [] // Array(3) ✅
    };
}
```

**Resultado:** Todas las propiedades tienen valores correctos.

### 4. Producto Después del Mapeo (DESPUÉS)

```javascript
{
    IdProducto: 2,
    NombreBase: "BR FOR CAT VET CONTROL DE PESO",
    Descripcion: "Alimento con un balance adecuado de nutrientes que ayuda a reducir la formación de bolas de pelo, brindándole máxima protección de piel y pelaje.",
    NombreCategoria: "Alimento para Gatos",
    TipoMascota: "Gatos",
    URLImagen: "/images/productos/royal-canin-cat-weight.jpg",
    Activo: true,
    Variaciones: [
        { IdVariacion: 4, Peso: "500 GR", Precio: 204.00, Stock: 50, Activa: true },
        { IdVariacion: 5, Peso: "1.5 KG", Precio: 582.00, Stock: 30, Activa: true },
        { IdVariacion: 6, Peso: "3 KG", Precio: 1108.00, Stock: 20, Activa: true }
    ]
}
```

### 5. Componente ProductCard Ahora Puede Mostrar

```javascript
const modernProduct = {
    name: product.NombreBase,  // "BR FOR CAT VET CONTROL DE PESO" ✅
    description: product.Descripcion,  // "Alimento con un balance..." ✅
    category: product.NombreCategoria,  // "Alimento para Gatos" ✅
    image: product.URLImagen,  // "/images/productos/..." ✅
    Variaciones: product.Variaciones  // Array(3) ✅
};
```

**Resultado visual:**
- Nombre: BR FOR CAT VET CONTROL DE PESO ✅
- Categoría: Alimento para Gatos ✅
- Descripción: Alimento con un balance adecuado... ✅
- Selector de peso: 500 GR / 1.5 KG / 3 KG ✅
- Precio: $204.00 (primera variación) ✅
- Stock: 50 disponibles ✅

---

## Comparación Visual

### ANTES del Fix
```
┌─────────────────────────┐
│ 🐱 (imagen rota)        │
│                         │
│ (sin nombre)            │
│ (sin categoría)         │
│                         │
│ Precio: $0              │
│ Estado: Agotado         │
│ [Agregar] (deshabilitado)│
└─────────────────────────┘
```

### DESPUÉS del Fix
```
┌─────────────────────────┐
│ 🐱                       │
│                         │
│ BR FOR CAT VET CONTROL  │
│ DE PESO                 │
│                         │
│ Alimento para Gatos     │
│                         │
│ Selecciona un peso:     │
│ [v] 3 KG — $110,800     │
│     (20 disp.)          │
│                         │
│ [🛒 Agregar al carrito] │
└─────────────────────────┘
```

## Conclusión

El fix de **una sola línea** en `Program.cs` resuelve completamente el problema al alinear el formato JSON del backend con las expectativas del frontend, permitiendo que todas las propiedades de productos y variaciones se mapeen correctamente y se muestren en la interfaz de usuario.
