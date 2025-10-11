# 📦 Endpoint de Importación Masiva de Productos - CSV

## 📋 Descripción General

Este endpoint permite la carga masiva de productos mediante un archivo CSV, facilitando la integración y actualización de catálogos a gran escala.

## 🎯 Endpoint

```
POST /api/Productos/ImportarCsv
```

## 📝 Request

### Headers
```
Content-Type: multipart/form-data
```

### Body Parameters

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `file` | File | ✅ Sí | Archivo CSV con los productos a importar |

### Ejemplo de Request (cURL)

```bash
curl -X POST http://localhost:5122/api/Productos/ImportarCsv \
  -H "Content-Type: multipart/form-data" \
  -F "file=@productos.csv"
```

### Ejemplo de Request (JavaScript/Fetch)

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('/api/Productos/ImportarCsv', {
    method: 'POST',
    body: formData
});

const result = await response.json();
console.log(result);
```

## 📄 Formato del Archivo CSV

### Estructura de Columnas

El archivo CSV debe contener las siguientes columnas (el orden puede variar, se usa el nombre de la columna como referencia):

| Columna | Tipo | Requerido | Descripción | Ejemplo |
|---------|------|-----------|-------------|---------|
| ID | Número | ❌ No | Identificador único (se ignora, se genera automáticamente) | 1 |
| CATEGORIA | Texto | ✅ Sí | Categoría del producto (debe existir en la BD) | GATO, PERRO |
| CATEGORIA ALIMENTOS | Texto | ❌ No | Categoría de alimento | ALIMENTO SECO, ALIMENTO HÚMEDO |
| SUBCATEGORIA | Texto | ❌ No | Subcategoría del producto | DIETA SECA PRESCRITA |
| PRESENTACION EMPAQUE | Texto | ❌ No | Tipo de presentación del empaque | BOLSA, LATA, SOBRE |
| MARCA | Texto | ❌ No | Marca del producto | BR, Royal Canin |
| NAME | Texto | ✅ Sí | Nombre completo del producto | BR FOR CAT VET CONTROL DE PESO X 500GR |
| PRECIO ANTES DE GANANCIA CDM | Texto | ❌ No | Precio antes de ganancia (no se usa actualmente) | $20,400.00 |
| ICONOPET | Texto | ❌ No | Campo especial (no se usa actualmente) | - |
| MARGEN | Texto | ❌ No | Margen de ganancia (no se usa actualmente) | - |
| PRECIO SUGERIDO DE VENTA | Texto | ❌ No | Precio sugerido (no se usa actualmente) | - |
| description | Texto | ❌ No | Descripción del producto | Alimento para gatos con control de peso |
| presentacion | Texto | ❌ No | Presentación de la variación | 500 GR, 1.5 KG, 3 KG |
| PRICE | Texto | ✅ Sí | Precio del producto (acepta formato $20,400.00) | $20,400.00 |
| stock | Texto | ❌ No | Stock disponible (por defecto 0) | 10 |
| sku | Texto | ❌ No | SKU del producto (no se usa actualmente) | 300100101 |
| imageUrl | Texto | ❌ No | URL de la imagen del producto | https://... |
| proveedor | Texto | ❌ No | Nombre del proveedor (debe existir en la BD) | CDM |
| creadoen | Texto | ❌ No | Fecha de creación (no se usa, se genera automáticamente) | - |
| actualizadoen | Texto | ❌ No | Fecha de actualización (no se usa) | - |

### Ejemplo de CSV

```csv
ID,CATEGORIA,CATEGORIA ALIMENTOS,SUBCATEGORIA,PRESENTACION EMPAQUE,MARCA,NAME,PRECIO ANTES DE GANANCIA CDM,ICONOPET,MARGEN,PRECIO SUGERIDO DE VENTA,description,presentacion,PRICE,stock,sku,imageUrl,proveedor,creadoen,actualizadoen
1,GATO,ALIMENTO SECO,DIETA SECA PRESCRITA,BOLSA,BR,BR FOR CAT VET CONTROL DE PESO X 500GR,$20400.00,,,,,500 GR,$20400.00,10,300100101,https://www.velykapet.com/productos/alimentos/gatos/BR_FOR_CAT_VET_CONTROL_DE_PESO.jpg,CDM,,
2,GATO,ALIMENTO SECO,DIETA SECA PRESCRITA,BOLSA,BR,BR FOR CAT VET CONTROL DE PESO X 1.5 KG,$58200.00,,,,,1.5 KG,$58200.00,15,300100102,https://www.velykapet.com/productos/alimentos/gatos/BR_FOR_CAT_VET_CONTROL_DE_PESO.jpg,CDM,,
3,GATO,ALIMENTO SECO,DIETA SECA PRESCRITA,BOLSA,BR,BR FOR CAT VET CONTROL DE PESO X 3 KG,$110800.00,,,,,3 KG,$110800.00,20,300100103,https://www.velykapet.com/productos/alimentos/gatos/BR_FOR_CAT_VET_CONTROL_DE_PESO.jpg,CDM,,
```

### Notas Importantes sobre el CSV

1. **Encabezados**: La primera línea debe contener los nombres de las columnas
2. **Formato de precio**: El precio puede incluir símbolos ($), comas y puntos. Ejemplos válidos:
   - `$20,400.00`
   - `20400`
   - `20400.00`
3. **Categorías**: Deben existir previamente en la base de datos
4. **Proveedores**: Si se especifica un proveedor, debe existir en la base de datos
5. **Duplicados**: No se permiten productos con el mismo nombre
6. **Codificación**: Se recomienda UTF-8 para soportar caracteres especiales

## 📤 Response

### Success Response (200 OK)

```json
{
    "totalProcessed": 3,
    "successCount": 3,
    "failureCount": 0,
    "errors": [],
    "createdProducts": [
        {
            "idProducto": 101,
            "nombreBase": "BR FOR CAT VET CONTROL DE PESO X 500GR",
            "variaciones": [
                {
                    "idVariacion": 201,
                    "presentacion": "500 GR",
                    "precio": 20400.00,
                    "stock": 10
                }
            ],
            "mensaje": "Producto creado exitosamente"
        },
        {
            "idProducto": 102,
            "nombreBase": "BR FOR CAT VET CONTROL DE PESO X 1.5 KG",
            "variaciones": [
                {
                    "idVariacion": 202,
                    "presentacion": "1.5 KG",
                    "precio": 58200.00,
                    "stock": 15
                }
            ],
            "mensaje": "Producto creado exitosamente"
        },
        {
            "idProducto": 103,
            "nombreBase": "BR FOR CAT VET CONTROL DE PESO X 3 KG",
            "variaciones": [
                {
                    "idVariacion": 203,
                    "presentacion": "3 KG",
                    "precio": 110800.00,
                    "stock": 20
                }
            ],
            "mensaje": "Producto creado exitosamente"
        }
    ],
    "message": "Importación completada: 3 productos creados, 0 errores."
}
```

### Partial Success Response (200 OK con errores)

```json
{
    "totalProcessed": 5,
    "successCount": 3,
    "failureCount": 2,
    "errors": [
        "Línea 3: El producto 'PRODUCTO DUPLICADO' ya existe.",
        "Línea 5: Categoría 'CATEGORIA_INVALIDA' no encontrada."
    ],
    "createdProducts": [
        {
            "idProducto": 101,
            "nombreBase": "PRODUCTO 1",
            "variaciones": [...],
            "mensaje": "Producto creado exitosamente"
        },
        // ... más productos
    ],
    "message": "Importación completada: 3 productos creados, 2 errores."
}
```

### Error Responses

#### 400 Bad Request - Archivo no proporcionado

```json
{
    "error": "No se proporcionó ningún archivo o el archivo está vacío."
}
```

#### 400 Bad Request - Formato incorrecto

```json
{
    "error": "El archivo debe ser un CSV."
}
```

#### 500 Internal Server Error

```json
{
    "error": "Error al procesar el archivo CSV",
    "mensaje": "Descripción del error",
    "detalles": "Detalles adicionales del error"
}
```

## 🔍 Validaciones Implementadas

### Validaciones por Registro

1. **Nombre del producto**: Obligatorio y debe ser único
2. **Categoría**: Debe existir en la base de datos y estar activa
3. **Precio**: Debe ser un número válido mayor a 0
4. **Stock**: Debe ser un número entero (por defecto 0 si no se proporciona)
5. **Proveedor**: Si se proporciona, debe existir en la base de datos
6. **Categoría de alimento**: Si se proporciona, debe existir en la base de datos
7. **Subcategoría**: Si se proporciona, debe existir en la base de datos
8. **Presentación**: Si se proporciona, debe existir en la base de datos

### Validaciones Generales

- Archivo no vacío
- Formato CSV válido
- Encabezados correctos

## ⚡ Características

### Transaccionalidad

- Cada producto se procesa en su propia transacción
- Si un producto falla, los demás continúan procesándose
- No hay rollback global (cada producto es independiente)

### Optimización

- Se cargan todos los datos de referencia (categorías, proveedores, etc.) una sola vez al inicio
- Reduce las consultas a la base de datos
- Mejora el rendimiento para archivos grandes

### Manejo de Errores

- Cada error se registra con el número de línea del CSV
- Los errores no detienen el procesamiento completo
- Se reportan todos los errores al final

### Logging

- Se registran en consola los productos creados exitosamente
- Se registran los errores encontrados
- Se muestra un resumen al final del proceso

## 🧪 Pruebas

### Script de Prueba

```bash
cd backend-config
bash test-importar-csv.sh
```

### Prueba Manual con cURL

```bash
curl -X POST http://localhost:5122/api/Productos/ImportarCsv \
  -H "Content-Type: multipart/form-data" \
  -F "file=@sample-products.csv"
```

### Prueba con Postman

1. Crear nueva request POST
2. URL: `http://localhost:5122/api/Productos/ImportarCsv`
3. En la pestaña "Body", seleccionar "form-data"
4. Agregar key "file" de tipo "File"
5. Seleccionar el archivo CSV
6. Enviar request

## 🔒 Seguridad y Buenas Prácticas

### Recomendaciones

1. **Autenticación**: En producción, agregar autenticación JWT
2. **Autorización**: Restringir acceso solo a administradores
3. **Límite de tamaño**: Configurar un límite de tamaño de archivo (ej: 10 MB)
4. **Validación de formato**: Verificar extensión y tipo MIME
5. **Rate limiting**: Implementar límites de peticiones para evitar abuso
6. **Auditoría**: Registrar quién y cuándo realiza importaciones

### Límites Sugeridos

```csharp
// En Program.cs o Startup.cs
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 10485760; // 10 MB
});
```

## 📊 Casos de Uso

### Caso 1: Importación Inicial de Catálogo

- Cargar todos los productos de un nuevo proveedor
- Usar archivo CSV proporcionado por el proveedor
- Verificar resultados antes de publicar productos

### Caso 2: Actualización Masiva de Precios

- Exportar productos actuales
- Actualizar precios en Excel/CSV
- Reimportar con nuevos precios (requiere modificación para soportar updates)

### Caso 3: Migración de Datos

- Migrar productos desde otro sistema
- Mapear campos al formato CSV esperado
- Importar en lotes pequeños para verificar

## 🔄 Mejoras Futuras

- [ ] Soporte para actualización (upsert) en lugar de solo inserción
- [ ] Procesamiento asíncrono para archivos muy grandes
- [ ] Validación previa del archivo sin insertar (modo "dry-run")
- [ ] Exportación de productos a CSV
- [ ] Importación de múltiples variaciones por producto
- [ ] Soporte para otros formatos (Excel, JSON)
- [ ] Webhook para notificar cuando termine la importación
- [ ] UI para subir archivos desde el panel de administración
- [ ] Historial de importaciones realizadas
- [ ] Opción de revertir importación

## 📞 Soporte

Para problemas o preguntas sobre la importación:

1. Verificar el formato del CSV
2. Revisar los errores en la respuesta
3. Consultar los logs del servidor
4. Verificar que las categorías y proveedores existan

## 📚 Referencias

- [CsvHelper Documentation](https://joshclose.github.io/CsvHelper/)
- [ASP.NET Core File Upload](https://docs.microsoft.com/en-us/aspnet/core/mvc/models/file-uploads)
- [Multipart Form Data](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST)
