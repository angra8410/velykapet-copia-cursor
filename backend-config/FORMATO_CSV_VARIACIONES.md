# 📋 Formato CSV para Importación con Variaciones de Producto

## 🎯 Descripción

El endpoint de importación CSV ahora **agrupa automáticamente** las filas del CSV que representan variaciones del mismo producto. Esto permite crear **un solo producto con múltiples variaciones** (pesos/tamaños/presentaciones) en lugar de productos duplicados.

## 🔑 Lógica de Agrupación

### Cómo Funciona

El sistema agrupa automáticamente las filas CSV por **nombre base del producto**, extrayendo el nombre común antes del sufijo de peso/presentación.

**Patrón de agrupación:**
- Busca el separador ` X ` (espacio-X-espacio) en el nombre del producto
- Todo lo que está **antes** del ` X ` se considera el nombre base
- Todo lo que está **después** del ` X ` es la variación de peso/tamaño

### Ejemplos de Agrupación

| Nombre Completo en CSV | Nombre Base Extraído | Presentación |
|------------------------|---------------------|--------------|
| `BR FOR CAT VET CONTROL DE PESO X 500GR` | `BR FOR CAT VET CONTROL DE PESO` | `500 GR` |
| `BR FOR CAT VET CONTROL DE PESO X 1.5 KG` | `BR FOR CAT VET CONTROL DE PESO` | `1.5 KG` |
| `BR FOR CAT VET CONTROL DE PESO X 3 KG` | `BR FOR CAT VET CONTROL DE PESO` | `3 KG` |

**Resultado:** 1 producto con 3 variaciones ✅

---

## 📝 Formato del CSV

### Estructura Básica

```csv
ID,CATEGORIA,CATEGORIA ALIMENTOS,SUBCATEGORIA,PRESENTACION EMPAQUE,MARCA,NAME,PRECIO ANTES DE GANANCIA CDM,ICONOPET,MARGEN,PRECIO SUGERIDO DE VENTA,description,presentacion,PRICE,stock,sku,imageUrl,proveedor,creadoen,actualizadoen
```

### Campos Clave para Variaciones

| Campo | Descripción | Ejemplo | Obligatorio |
|-------|-------------|---------|-------------|
| `NAME` | Nombre completo con peso (debe incluir ` X ` para agrupación) | `BR FOR CAT VET CONTROL DE PESO X 500GR` | ✅ Sí |
| `presentacion` | Presentación/peso de la variación | `500 GR` | ✅ Sí |
| `PRICE` | Precio específico de esta variación | `$20400.00` | ✅ Sí |
| `stock` | Stock específico de esta variación | `10` | No |

---

## 📊 Ejemplo Completo

### CSV de Entrada

```csv
ID,CATEGORIA,CATEGORIA ALIMENTOS,SUBCATEGORIA,PRESENTACION EMPAQUE,MARCA,NAME,PRECIO ANTES DE GANANCIA CDM,ICONOPET,MARGEN,PRECIO SUGERIDO DE VENTA,description,presentacion,PRICE,stock,sku,imageUrl,proveedor,creadoen,actualizadoen
1,Alimento para Gatos,ALIMENTO SECO,DIETA SECA PRESCRITA,BOLSA,BR,BR FOR CAT VET CONTROL DE PESO X 500GR,$20400.00,,,,,500 GR,$20400.00,10,300100101,https://www.velykapet.com/productos/alimentos/gatos/BR_FOR_CAT_VET_CONTROL_DE_PESO.jpg,CDM,,
2,Alimento para Gatos,ALIMENTO SECO,DIETA SECA PRESCRITA,BOLSA,BR,BR FOR CAT VET CONTROL DE PESO X 1.5 KG,$58200.00,,,,,1.5 KG,$58200.00,15,300100102,https://www.velykapet.com/productos/alimentos/gatos/BR_FOR_CAT_VET_CONTROL_DE_PESO.jpg,CDM,,
3,Alimento para Gatos,ALIMENTO SECO,DIETA SECA PRESCRITA,BOLSA,BR,BR FOR CAT VET CONTROL DE PESO X 3 KG,$110800.00,,,,,3 KG,$110800.00,20,300100103,https://www.velykapet.com/productos/alimentos/gatos/BR_FOR_CAT_VET_CONTROL_DE_PESO.jpg,CDM,,
```

### Resultado de la Importación

```json
{
  "TotalProcessed": 3,
  "SuccessCount": 1,
  "FailureCount": 0,
  "Errors": [],
  "CreatedProducts": [
    {
      "IdProducto": 6,
      "NombreBase": "BR FOR CAT VET CONTROL DE PESO",
      "Variaciones": [
        {
          "IdVariacion": 13,
          "Presentacion": "500 GR",
          "Precio": 2040000,
          "Stock": 10
        },
        {
          "IdVariacion": 14,
          "Presentacion": "1.5 KG",
          "Precio": 5820000,
          "Stock": 15
        },
        {
          "IdVariacion": 15,
          "Presentacion": "3 KG",
          "Precio": 11080000,
          "Stock": 20
        }
      ],
      "Mensaje": "Producto creado exitosamente con 3 variación(es)"
    }
  ],
  "Message": "Importación completada: 1 productos creados, 0 errores."
}
```

**Interpretación:**
- ✅ **3 filas CSV** → **1 producto** creado
- ✅ **3 variaciones** asociadas al producto
- ✅ Cada variación tiene su propio precio, stock y presentación

---

## 🔄 Comportamiento Especial

### Productos SIN Variaciones

Si el nombre del producto **no contiene** el patrón ` X `, se crea como un producto individual:

```csv
1,Juguete para Perros,,,,,Pelota de Tenis para Perros,,,,,Pelota de tenis estándar,,15000,50,JUG001,https://example.com/pelota.jpg,ProveXYZ,,
```

**Resultado:** 1 producto con 1 variación (sin agrupación)

### Múltiples Productos en el Mismo CSV

Puede mezclar productos con y sin variaciones en el mismo CSV:

```csv
ID,CATEGORIA,...,NAME,...
1,Alimento para Gatos,...,BR FOR CAT VET CONTROL DE PESO X 500GR,...
2,Alimento para Gatos,...,BR FOR CAT VET CONTROL DE PESO X 1.5 KG,...
3,Alimento para Gatos,...,BR FOR CAT VET CONTROL DE PESO X 3 KG,...
4,Juguete para Perros,...,Pelota de Tenis para Perros,...
5,Alimento para Perros,...,ROYAL CANIN ADULTO X 7 KG,...
6,Alimento para Perros,...,ROYAL CANIN ADULTO X 15 KG,...
```

**Resultado:**
- 1 producto: "BR FOR CAT VET CONTROL DE PESO" con 3 variaciones
- 1 producto: "Pelota de Tenis para Perros" con 1 variación
- 1 producto: "ROYAL CANIN ADULTO" con 2 variaciones

**Total: 3 productos, 6 variaciones**

---

## ✅ Validaciones

El sistema valida automáticamente:

1. ✅ **Nombre base obligatorio:** Cada grupo debe tener un nombre base válido
2. ✅ **Categoría válida:** La categoría debe existir en la base de datos
3. ✅ **Precio válido:** Cada variación debe tener un precio > 0
4. ✅ **No duplicados:** No se puede importar un producto que ya existe en la base de datos

---

## 🎨 Vista en el Frontend

Con esta agrupación, el frontend mostrará:

**ANTES (Incorrecto):**
```
[Producto 1] BR FOR CAT VET CONTROL DE PESO X 500GR    - $20,400
[Producto 2] BR FOR CAT VET CONTROL DE PESO X 1.5 KG   - $58,200
[Producto 3] BR FOR CAT VET CONTROL DE PESO X 3 KG     - $110,800
```

**DESPUÉS (Correcto):**
```
[Producto 1] BR FOR CAT VET CONTROL DE PESO
   Seleccionar peso: 
   ○ 500 GR     - $20,400   (Stock: 10)
   ○ 1.5 KG     - $58,200   (Stock: 15)
   ● 3 KG       - $110,800  (Stock: 20)
```

---

## 📚 Recomendaciones

### ✅ Buenas Prácticas

1. **Usar convención ` X `**: Siempre incluir ` X ` (espacio-X-espacio) antes del peso
   ```
   ✅ Correcto: "PRODUCTO X 500GR"
   ❌ Incorrecto: "PRODUCTO 500GR"
   ❌ Incorrecto: "PRODUCTO X500GR" (sin espacio)
   ```

2. **Nombres consistentes**: Usar el mismo nombre base para todas las variaciones
   ```
   ✅ Correcto:
   - "ALIMENTO PREMIUM X 1KG"
   - "ALIMENTO PREMIUM X 3KG"
   
   ❌ Incorrecto:
   - "ALIMENTO PREMIUM X 1KG"
   - "ALIMENTO PARA MASCOTAS X 3KG"  (nombre base diferente)
   ```

3. **Imágenes compartidas**: Las variaciones del mismo producto pueden compartir la misma imagen URL

4. **Datos completos**: Asegurar que cada variación tenga `presentacion`, `PRICE` y `stock`

### ⚠️ Advertencias

- Si el producto base ya existe en la base de datos, la importación será rechazada
- Las variaciones sin precio válido (precio = 0) no se crearán
- Los campos opcionales (proveedor, subcategoría, etc.) se toman de la primera fila del grupo

---

## 🔧 Casos de Uso

### Caso 1: Catálogo de Alimentos con Múltiples Pesos

```csv
NAME,presentacion,PRICE,stock
ALIMENTO PERRO ADULTO X 1KG,1 KG,15000,50
ALIMENTO PERRO ADULTO X 3KG,3 KG,40000,30
ALIMENTO PERRO ADULTO X 7KG,7 KG,85000,20
```
**Resultado:** 1 producto con 3 variaciones

### Caso 2: Productos Individuales

```csv
NAME,presentacion,PRICE,stock
Collar para Perros Pequeños,,12000,100
Correa Extensible 5m,,25000,50
```
**Resultado:** 2 productos con 1 variación cada uno

### Caso 3: Mezcla de Productos

```csv
NAME,presentacion,PRICE,stock
SHAMPOO PERROS X 250ML,250 ML,18000,40
SHAMPOO PERROS X 500ML,500 ML,32000,25
Cepillo Dental para Perros,,8000,80
```
**Resultado:** 2 productos (1 con 2 variaciones, 1 con 1 variación)

---

## 📖 Documentación Relacionada

- [API_ENDPOINT_IMPORTAR_CSV.md](./API_ENDPOINT_IMPORTAR_CSV.md) - Documentación técnica del endpoint
- [RESUMEN_IMPORTACION_CSV.md](./RESUMEN_IMPORTACION_CSV.md) - Resumen de funcionalidades
- [INICIO_RAPIDO_IMPORTACION.md](./INICIO_RAPIDO_IMPORTACION.md) - Guía de inicio rápido

---

## ✨ Beneficios de esta Implementación

1. ✅ **Experiencia de usuario mejorada**: Un solo producto con selector de variaciones
2. ✅ **Inventario simplificado**: Gestión centralizada de productos
3. ✅ **Importación eficiente**: Agrupa automáticamente sin intervención manual
4. ✅ **Compatibilidad hacia atrás**: Productos sin variaciones siguen funcionando
5. ✅ **Escalable**: Soporta productos con 1 o N variaciones

---

**Versión**: 1.0  
**Última actualización**: Octubre 2025  
**Autor**: VelyKapet Dev Team
