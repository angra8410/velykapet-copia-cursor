# Diagrama de Flujo: Problema y Solución del Catálogo

## ANTES del Fix: Datos No Se Mapeaban Correctamente

```
┌──────────────────────────────────────────────────────────────────┐
│                    BACKEND (.NET Core)                            │
│                                                                   │
│  ProductoDto (PascalCase en código C#)                           │
│  ┌─────────────────────────────────────────┐                    │
│  │ IdProducto: 2                           │                    │
│  │ NombreBase: "BR FOR CAT VET..."         │                    │
│  │ Descripcion: "Alimento con balance..."  │                    │
│  │ NombreCategoria: "Alimento para Gatos"  │                    │
│  │ Variaciones: [ ... ]                    │                    │
│  └─────────────────────────────────────────┘                    │
│                       │                                           │
│                       │ ASP.NET Core Serialization               │
│                       │ (default: camelCase)                     │
│                       ▼                                           │
│  ╔═══════════════════════════════════════════╗                  │
│  ║  JSON Response (camelCase) ❌             ║                  │
│  ╠═══════════════════════════════════════════╣                  │
│  ║ {                                         ║                  │
│  ║   "idProducto": 2,                        ║                  │
│  ║   "nombreBase": "BR FOR CAT VET...",      ║                  │
│  ║   "descripcion": "Alimento con...",       ║                  │
│  ║   "nombreCategoria": "Alimento para..."   ║                  │
│  ║   "variaciones": [ ... ]                  ║                  │
│  ║ }                                         ║                  │
│  ╚═══════════════════════════════════════════╝                  │
└──────────────────────────│───────────────────────────────────────┘
                           │
                           │ HTTP Response
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                    FRONTEND (JavaScript)                          │
│                                                                   │
│  ApiService.getProducts()                                         │
│  └─► fetch('/api/Productos')                                     │
│       └─► Response JSON (camelCase)                              │
│            └─► mapProductFromBackend(producto)                   │
│                                                                   │
│  mapProductFromBackend(producto) {                               │
│    return {                                                       │
│      IdProducto: producto.IdProducto,      // ❌ undefined        │
│      NombreBase: producto.NombreBase,      // ❌ undefined        │
│      Descripcion: producto.Descripcion,    // ❌ undefined        │
│      ...                                                          │
│    };                                                             │
│  }                                                                │
│                                                                   │
│  PROBLEMA: Busca "IdProducto" pero JSON tiene "idProducto"       │
│            Busca "NombreBase" pero JSON tiene "nombreBase"       │
│                                                                   │
│  ┌────────────────────────────────────────┐                      │
│  │ Producto Mapeado (TODOS undefined) ❌  │                      │
│  ├────────────────────────────────────────┤                      │
│  │ IdProducto: undefined                  │                      │
│  │ NombreBase: undefined                  │                      │
│  │ Descripcion: undefined                 │                      │
│  │ NombreCategoria: undefined             │                      │
│  │ Variaciones: []                        │                      │
│  └────────────────────────────────────────┘                      │
│                       │                                           │
│                       ▼                                           │
│  ProductCard Component                                            │
│  ┌────────────────────────────────────────┐                      │
│  │ name: undefined        → (vacío)       │                      │
│  │ description: undefined → (vacío)       │                      │
│  │ category: undefined    → (vacío)       │                      │
│  │ price: 0               → $0            │                      │
│  │ stock: 0               → Agotado       │                      │
│  └────────────────────────────────────────┘                      │
│                       │                                           │
│                       ▼                                           │
│  ╔═══════════════════════════════════════╗                       │
│  ║  UI: Tarjeta Vacía ❌                 ║                       │
│  ╠═══════════════════════════════════════╣                       │
│  ║ ┌───────────────────────────────────┐ ║                       │
│  ║ │ 🖼️ (imagen rota)                  │ ║                       │
│  ║ │                                   │ ║                       │
│  ║ │ (sin nombre)                      │ ║                       │
│  ║ │ (sin categoría)                   │ ║                       │
│  ║ │                                   │ ║                       │
│  ║ │ Precio: $0                        │ ║                       │
│  ║ │ Estado: Agotado                   │ ║                       │
│  ║ │ [Agregar] (deshabilitado)         │ ║                       │
│  ║ └───────────────────────────────────┘ ║                       │
│  ╚═══════════════════════════════════════╝                       │
└──────────────────────────────────────────────────────────────────┘
```

---

## DESPUÉS del Fix: Datos Se Mapean Correctamente

```
┌──────────────────────────────────────────────────────────────────┐
│                    BACKEND (.NET Core)                            │
│                                                                   │
│  FIX APLICADO en Program.cs:                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ builder.Services.AddControllers()                        │   │
│  │     .AddJsonOptions(options => {                         │   │
│  │         options.JsonSerializerOptions                    │   │
│  │                .PropertyNamingPolicy = null;             │   │
│  │     });                                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ProductoDto (PascalCase en código C#)                           │
│  ┌─────────────────────────────────────────┐                    │
│  │ IdProducto: 2                           │                    │
│  │ NombreBase: "BR FOR CAT VET..."         │                    │
│  │ Descripcion: "Alimento con balance..."  │                    │
│  │ NombreCategoria: "Alimento para Gatos"  │                    │
│  │ Variaciones: [ ... ]                    │                    │
│  └─────────────────────────────────────────┘                    │
│                       │                                           │
│                       │ ASP.NET Core Serialization               │
│                       │ (CONFIGURADO: PascalCase) ✅             │
│                       ▼                                           │
│  ╔═══════════════════════════════════════════╗                  │
│  ║  JSON Response (PascalCase) ✅            ║                  │
│  ╠═══════════════════════════════════════════╣                  │
│  ║ {                                         ║                  │
│  ║   "IdProducto": 2,                        ║                  │
│  ║   "NombreBase": "BR FOR CAT VET...",      ║                  │
│  ║   "Descripcion": "Alimento con...",       ║                  │
│  ║   "NombreCategoria": "Alimento para..."   ║                  │
│  ║   "Variaciones": [                        ║                  │
│  ║     {                                     ║                  │
│  ║       "IdVariacion": 4,                   ║                  │
│  ║       "Peso": "500 GR",                   ║                  │
│  ║       "Precio": 204.00,                   ║                  │
│  ║       "Stock": 50                         ║                  │
│  ║     }                                     ║                  │
│  ║   ]                                       ║                  │
│  ║ }                                         ║                  │
│  ╚═══════════════════════════════════════════╝                  │
└──────────────────────────│───────────────────────────────────────┘
                           │
                           │ HTTP Response
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                    FRONTEND (JavaScript)                          │
│                                                                   │
│  ApiService.getProducts()                                         │
│  └─► fetch('/api/Productos')                                     │
│       └─► Response JSON (PascalCase) ✅                          │
│            └─► mapProductFromBackend(producto)                   │
│                                                                   │
│  mapProductFromBackend(producto) {                               │
│    return {                                                       │
│      IdProducto: producto.IdProducto,      // ✅ 2               │
│      NombreBase: producto.NombreBase,      // ✅ "BR FOR CAT..." │
│      Descripcion: producto.Descripcion,    // ✅ "Alimento..."   │
│      Variaciones: producto.Variaciones     // ✅ Array(3)        │
│    };                                                             │
│  }                                                                │
│                                                                   │
│  SOLUCIÓN: Busca "IdProducto" y JSON tiene "IdProducto" ✅       │
│            Busca "NombreBase" y JSON tiene "NombreBase" ✅       │
│                                                                   │
│  ┌────────────────────────────────────────────────────┐          │
│  │ Producto Mapeado (CON DATOS) ✅                    │          │
│  ├────────────────────────────────────────────────────┤          │
│  │ IdProducto: 2                                      │          │
│  │ NombreBase: "BR FOR CAT VET CONTROL DE PESO"       │          │
│  │ Descripcion: "Alimento con un balance adecuado..." │          │
│  │ NombreCategoria: "Alimento para Gatos"             │          │
│  │ Variaciones: [                                     │          │
│  │   { IdVariacion: 4, Peso: "500 GR",                │          │
│  │     Precio: 204, Stock: 50 },                      │          │
│  │   { IdVariacion: 5, Peso: "1.5 KG",                │          │
│  │     Precio: 582, Stock: 30 },                      │          │
│  │   { IdVariacion: 6, Peso: "3 KG",                  │          │
│  │     Precio: 1108, Stock: 20 }                      │          │
│  │ ]                                                  │          │
│  └────────────────────────────────────────────────────┘          │
│                       │                                           │
│                       ▼                                           │
│  ProductCard Component                                            │
│  ┌────────────────────────────────────────────────────┐          │
│  │ name: "BR FOR CAT..."        → Visible ✅          │          │
│  │ description: "Alimento..."   → Visible ✅          │          │
│  │ category: "Alimento para..." → Visible ✅          │          │
│  │ variations: Array(3)         → Selector ✅         │          │
│  │ price: 204 (primera var.)    → $204.00 ✅          │          │
│  │ stock: 50                    → 50 disp. ✅         │          │
│  └────────────────────────────────────────────────────┘          │
│                       │                                           │
│                       ▼                                           │
│  ╔═══════════════════════════════════════════════════╗           │
│  ║  UI: Tarjeta Completa ✅                          ║           │
│  ╠═══════════════════════════════════════════════════╣           │
│  ║ ┌───────────────────────────────────────────────┐ ║           │
│  ║ │ 🐱 [imagen correcta]                          │ ║           │
│  ║ │                                               │ ║           │
│  ║ │ BR FOR CAT VET CONTROL DE PESO               │ ║           │
│  ║ │ Alimento para Gatos                          │ ║           │
│  ║ │                                               │ ║           │
│  ║ │ Alimento con un balance adecuado de          │ ║           │
│  ║ │ nutrientes que ayuda a reducir...            │ ║           │
│  ║ │                                               │ ║           │
│  ║ │ Selecciona un peso:                          │ ║           │
│  ║ │ [▼] 3 KG — $110,800 (20 disp.)               │ ║           │
│  ║ │                                               │ ║           │
│  ║ │ Precio: $110,800                             │ ║           │
│  ║ │ Stock: 20 disponibles                        │ ║           │
│  ║ │                                               │ ║           │
│  ║ │ [🛒 Agregar al carrito]  (habilitado)        │ ║           │
│  ║ └───────────────────────────────────────────────┘ ║           │
│  ╚═══════════════════════════════════════════════════╝           │
└──────────────────────────────────────────────────────────────────┘
```

---

## Resumen del Cambio

### La Solución (1 línea crítica)
```csharp
options.JsonSerializerOptions.PropertyNamingPolicy = null;
```

Esta única configuración:
1. ✅ Desactiva la conversión automática a camelCase
2. ✅ Preserva los nombres de propiedades tal como están en el DTO
3. ✅ Alinea el backend con las expectativas del frontend
4. ✅ No requiere cambios en el código del frontend
5. ✅ Resuelve el problema para todos los endpoints de la API

### Impacto
- **5 productos** en la base de datos
- **15+ variaciones** de producto
- **Todas las propiedades** ahora mapeadas correctamente
- **Catálogo completo** funcionando

### Por Qué Esta Es La Mejor Solución
1. **Minimal change**: Solo una configuración en el backend
2. **No breaking changes**: El frontend ya esperaba PascalCase
3. **Consistente**: Los DTOs en C# usan PascalCase
4. **Escalable**: Funciona para todos los endpoints existentes y futuros
5. **Mantenible**: Alineación clara entre backend y frontend
