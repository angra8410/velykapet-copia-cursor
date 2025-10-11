# API Endpoint: Crear Producto con Variaciones

## Índice

1. [Resumen](#resumen)
2. [Detalles del Endpoint](#detalles-del-endpoint)
3. [Request Body](#request-body)
   - [Estructura del JSON](#️-importante-estructura-del-json)
   - [Estructura del DTO](#estructura-del-dto)
   - [Notas sobre Tipos de Datos](#notas-sobre-tipos-de-datos)
   - [Ejemplo de Request](#ejemplo-de-request---caso-real)
4. [Response](#response)
   - [Success Response](#success-response-201-created)
   - [Error Responses](#error-responses)
5. [Validaciones Implementadas](#validaciones-implementadas)
6. [Transaccionalidad](#transaccionalidad)
7. [Logging](#logging)
8. [IDs de Referencia](#ids-de-referencia---valores-seed)
9. [Ejemplos de Uso](#ejemplos-de-uso-con-curl)
   - [cURL](#ejemplos-de-uso-con-curl)
   - [PowerShell](#ejemplos-de-uso-con-powershell)
   - [Postman](#ejemplos-de-uso-con-postman)
10. [Integración con Frontend](#integración-con-frontend)
11. [Extensibilidad](#extensibilidad)
12. [Scripts de Prueba](#-scripts-de-prueba)
13. [Troubleshooting](#-troubleshooting---errores-comunes)
14. [Buenas Prácticas](#buenas-prácticas-implementadas)
15. [Mejoras Futuras](#mejoras-futuras)

## Resumen
Este endpoint permite crear un producto con todas sus variaciones en una sola petición HTTP, garantizando consistencia transaccional.

## Detalles del Endpoint

**URL:** `POST /api/Productos`

**Headers:**
```
Content-Type: application/json
```

**Autenticación:** No requerida (agregar según necesidades del sistema)

## Request Body

### ⚠️ IMPORTANTE: Estructura del JSON

El endpoint espera recibir el objeto JSON **directamente en el body**, **SIN wrappers ni claves raíz adicionales**.

**✅ CORRECTO:**
```json
{
  "nombreBase": "BR FOR CAT VET CONTROL DE PESO",
  "descripcion": "Alimento con un balance adecuado...",
  "idCategoria": 2,
  ...
}
```

**❌ INCORRECTO (NO usar wrapper):**
```json
{
  "productoDto": {
    "nombreBase": "BR FOR CAT VET CONTROL DE PESO",
    ...
  }
}
```

### Estructura del DTO

```json
{
  "nombreBase": "string (requerido, max 200 caracteres)",
  "descripcion": "string (opcional, max 1000 caracteres)",
  "idCategoria": "integer (requerido)",
  "tipoMascota": "string (requerido, max 50 caracteres)",
  "urlImagen": "string (opcional, max 500 caracteres)",
  "idMascotaTipo": "integer (opcional)",
  "idCategoriaAlimento": "integer (opcional)",
  "idSubcategoria": "integer (opcional)",
  "idPresentacion": "integer (opcional)",
  "proveedorId": "integer (opcional)",
  "variacionesProducto": [
    {
      "presentacion": "string (requerido, max 50 caracteres)",
      "precio": "decimal (requerido, > 0)",
      "stock": "integer (opcional, >= 0, default 0)",
      "urlImagen": "string (opcional, max 500 caracteres)"
    }
  ]
}
```

### Notas sobre Tipos de Datos

- **Cadenas (string):** Deben estar entre comillas dobles `"valor"`
- **Números enteros (integer):** Sin comillas y sin decimales: `2`, `10`, `100`
- **Números decimales (decimal):** Sin comillas, pueden tener decimales: `20400`, `58200.50`
- **Arrays:** Deben estar entre corchetes `[]` y pueden contener múltiples objetos
- **Campos opcionales:** Pueden omitirse o enviarse como `null`

### Ejemplo de Request - Caso Real

Este ejemplo corresponde al producto mencionado en el issue:

```json
{
  "nombreBase": "BR FOR CAT VET CONTROL DE PESO",
  "descripcion": "Alimento con un balance adecuado de nutrientes que ayuda a reducir la formación de bolas de pelo, brindándole máxima protección de piel y pelaje.",
  "idCategoria": 2,
  "tipoMascota": "Gatos",
  "urlImagen": "https://www.velykapet.com/productos/alimentos/gatos/BR_FOR_CAT_VET_CONTROL_DE_PESO.jpg",
  "idMascotaTipo": 1,
  "idCategoriaAlimento": 2,
  "idSubcategoria": 5,
  "idPresentacion": 1,
  "proveedorId": 1,
  "variacionesProducto": [
    {
      "presentacion": "500 GR",
      "precio": 20400,
      "stock": 10,
      "urlImagen": "https://www.velykapet.com/productos/alimentos/gatos/BR_FOR_CAT_VET_CONTROL_DE_PESO.jpg"
    },
    {
      "presentacion": "1.5 KG",
      "precio": 58200,
      "stock": 10,
      "urlImagen": "https://www.velykapet.com/productos/alimentos/gatos/BR_FOR_CAT_VET_CONTROL_DE_PESO.jpg"
    },
    {
      "presentacion": "3 KG",
      "precio": 110800,
      "stock": 10,
      "urlImagen": "https://www.velykapet.com/productos/alimentos/gatos/BR_FOR_CAT_VET_CONTROL_DE_PESO.jpg"
    }
  ]
}
```

### Notas sobre el Mapeo de Campos

- **`presentacion`** en el DTO se mapea al campo **`Peso`** en la base de datos (VariacionProducto)
- Esto permite mantener compatibilidad con el modelo existente mientras se usa una nomenclatura más clara en el API

## Response

### Success Response (201 Created)

**Headers:**
```
Location: /api/Productos/{idProducto}
```

**Body:**
```json
{
  "idProducto": 123,
  "nombreBase": "BR FOR CAT VET CONTROL DE PESO",
  "variaciones": [
    {
      "idVariacion": 456,
      "presentacion": "500 GR",
      "precio": 20400,
      "stock": 10
    },
    {
      "idVariacion": 457,
      "presentacion": "1.5 KG",
      "precio": 58200,
      "stock": 10
    },
    {
      "idVariacion": 458,
      "presentacion": "3 KG",
      "precio": 110800,
      "stock": 10
    }
  ],
  "mensaje": "Producto 'BR FOR CAT VET CONTROL DE PESO' creado exitosamente con 3 variación(es)."
}
```

### Error Responses

#### 400 Bad Request - Validación de Modelo (ModelState)

Este error ocurre cuando el JSON enviado no cumple con las reglas de validación del DTO.

**Ejemplo de error cuando falta un campo requerido:**
```json
{
  "error": "Datos inválidos",
  "detalles": [
    "El campo NombreBase es requerido.",
    "El campo IdCategoria es requerido.",
    "Debe incluir al menos una variación."
  ]
}
```

**Causas comunes:**
- Campos requeridos faltantes (`nombreBase`, `idCategoria`, `tipoMascota`, `variacionesProducto`)
- Campos que exceden la longitud máxima
- Valores fuera del rango permitido (ej: `precio` <= 0, `stock` < 0)
- Array `variacionesProducto` vacío

**Ejemplo de JSON que causa este error:**
```json
{
  "descripcion": "Solo descripción, faltan campos requeridos"
}
```

#### 400 Bad Request - Datos Inválidos

```json
{
  "error": "Datos inválidos",
  "detalles": [
    "El campo NombreBase es requerido.",
    "Debe incluir al menos una variación."
  ]
}
```

#### 400 Bad Request - Categoría Inválida

```json
{
  "error": "Categoría inválida",
  "mensaje": "La categoría con ID 99 no existe o está inactiva."
}
```

#### 400 Bad Request - Tipo de Mascota Inválido

```json
{
  "error": "Tipo de mascota inválido",
  "mensaje": "El tipo de mascota con ID 99 no existe o está inactivo."
}
```

#### 400 Bad Request - Categoría de Alimento Inválida

```json
{
  "error": "Categoría de alimento inválida",
  "mensaje": "La categoría de alimento con ID 99 no existe o está inactiva."
}
```

#### 400 Bad Request - Subcategoría Inválida

```json
{
  "error": "Subcategoría inválida",
  "mensaje": "La subcategoría con ID 99 no existe o está inactiva."
}
```

#### 400 Bad Request - Presentación Inválida

```json
{
  "error": "Presentación inválida",
  "mensaje": "La presentación con ID 99 no existe o está inactiva."
}
```

#### 400 Bad Request - Proveedor Inválido

```json
{
  "error": "Proveedor inválido",
  "mensaje": "El proveedor con ID 99 no existe o está inactivo."
}
```

#### 409 Conflict - Producto Duplicado

```json
{
  "error": "Producto duplicado",
  "mensaje": "Ya existe un producto con el nombre 'BR FOR CAT VET CONTROL DE PESO'."
}
```

#### 500 Internal Server Error

```json
{
  "error": "Error al crear el producto",
  "mensaje": "Error description...",
  "detalles": "Detailed error message..."
}
```

## Validaciones Implementadas

El endpoint realiza las siguientes validaciones antes de crear el producto:

1. ✅ **Validación de modelo:** Todos los campos requeridos y formatos
2. ✅ **Categoría:** Verifica que existe y está activa
3. ✅ **Tipo de Mascota:** Si se proporciona, verifica que existe y está activo
4. ✅ **Categoría de Alimento:** Si se proporciona, verifica que existe y está activa
5. ✅ **Subcategoría:** Si se proporciona, verifica que existe y está activa
6. ✅ **Presentación:** Si se proporciona, verifica que existe y está activa
7. ✅ **Proveedor:** Si se proporciona, verifica que existe y está activo
8. ✅ **Duplicados:** Verifica que no exista otro producto con el mismo nombre base

## Transaccionalidad

El endpoint utiliza **transacciones de base de datos** para garantizar la consistencia:

- Si alguna validación falla, **no se crea nada**
- Si la creación del producto falla, **no se crean las variaciones**
- Si la creación de alguna variación falla, **se revierte todo (producto y variaciones)**

Esto asegura que nunca se quede un producto sin variaciones o variaciones huérfanas.

## Logging

El endpoint registra información útil en la consola:

**Éxito:**
```
✅ Producto creado exitosamente: ID=123, Nombre=BR FOR CAT VET CONTROL DE PESO, Variaciones=3
```

**Error:**
```
❌ Error al crear producto con variaciones: Error description
   StackTrace: ...
   InnerException: ...
```

## IDs de Referencia - Valores Seed

Para facilitar las pruebas, estos son los IDs de las entidades creadas en el seed de la base de datos:

### Tipos de Mascota (MascotaTipo)
- `1` - GATO
- `2` - PERRO

### Categorías (Categorias)
- `1` - Alimento para Perros
- `2` - Alimento para Gatos
- `3` - Snacks y Premios
- `4` - Accesorios

### Categorías de Alimento (CategoriaAlimento)
- `1` - ALIMENTO SECO (Perros)
- `2` - ALIMENTO SECO (Gatos)
- `3` - ALIMENTO HÚMEDO (Perros)
- `4` - ALIMENTO HÚMEDO (Gatos)
- `5` - SNACKS Y PREMIOS

### Subcategorías (SubcategoriaAlimento)
**Para Alimento Seco - Perros (IdCategoriaAlimento = 1):**
- `1` - DIETA SECA PRESCRITA
- `2` - ADULT
- `3` - PUPPY
- `4` - SENIOR

**Para Alimento Seco - Gatos (IdCategoriaAlimento = 2):**
- `5` - DIETA SECA PRESCRITA
- `6` - ADULT
- `7` - KITTEN
- `8` - INDOOR

**Para Alimento Húmedo - Perros (IdCategoriaAlimento = 3):**
- `9` - DIETA HÚMEDA PRESCRITA
- `10` - ADULT HÚMEDO

**Para Alimento Húmedo - Gatos (IdCategoriaAlimento = 4):**
- `11` - DIETA HÚMEDA PRESCRITA
- `12` - ADULT HÚMEDO

**Para Snacks (IdCategoriaAlimento = 5):**
- `13` - SNACKS NATURALES
- `14` - PREMIOS DE ENTRENAMIENTO

### Presentaciones de Empaque (PresentacionEmpaque)
- `1` - BOLSA
- `2` - LATA
- `3` - SOBRE
- `4` - CAJA
- `5` - TUBO

### Proveedores (Proveedor)
- `1` - Royal Canin
- `2` - Hill's Science Diet
- `3` - Purina Pro Plan

## Ejemplos de Uso con cURL

### Crear el producto del ejemplo

```bash
curl -X POST "http://localhost:5000/api/Productos" \
  -H "Content-Type: application/json" \
  -d '{
    "nombreBase": "BR FOR CAT VET CONTROL DE PESO",
    "descripcion": "Alimento con un balance adecuado de nutrientes que ayuda a reducir la formación de bolas de pelo, brindándole máxima protección de piel y pelaje.",
    "idCategoria": 2,
    "tipoMascota": "Gatos",
    "urlImagen": "https://www.velykapet.com/productos/alimentos/gatos/BR_FOR_CAT_VET_CONTROL_DE_PESO.jpg",
    "idMascotaTipo": 1,
    "idCategoriaAlimento": 2,
    "idSubcategoria": 5,
    "idPresentacion": 1,
    "proveedorId": 1,
    "variacionesProducto": [
      {
        "presentacion": "500 GR",
        "precio": 20400,
        "stock": 10
      },
      {
        "presentacion": "1.5 KG",
        "precio": 58200,
        "stock": 10
      },
      {
        "presentacion": "3 KG",
        "precio": 110800,
        "stock": 10
      }
    ]
  }'
```

### Verificar el producto creado

```bash
curl -X GET "http://localhost:5000/api/Productos/{idProducto}"
```

## Ejemplos de Uso con PowerShell

### Crear producto con Invoke-RestMethod

**Método recomendado - Usando here-string:**

```powershell
# Definir headers
$headers = @{
    "Content-Type" = "application/json"
}

# Definir body como string JSON
$body = @"
{
  "nombreBase": "BR FOR CAT VET CONTROL DE PESO",
  "descripcion": "Alimento con un balance adecuado de nutrientes que ayuda a reducir la formación de bolas de pelo, brindándole máxima protección de piel y pelaje.",
  "idCategoria": 2,
  "tipoMascota": "Gatos",
  "urlImagen": "https://www.velykapet.com/productos/alimentos/gatos/BR_FOR_CAT_VET_CONTROL_DE_PESO.jpg",
  "idMascotaTipo": 1,
  "idCategoriaAlimento": 2,
  "idSubcategoria": 5,
  "idPresentacion": 1,
  "proveedorId": 1,
  "variacionesProducto": [
    {
      "presentacion": "500 GR",
      "precio": 20400,
      "stock": 10
    },
    {
      "presentacion": "1.5 KG",
      "precio": 58200,
      "stock": 10
    },
    {
      "presentacion": "3 KG",
      "precio": 110800,
      "stock": 10
    }
  ]
}
"@

# Realizar la petición
try {
    $response = Invoke-RestMethod `
        -Uri "http://localhost:5000/api/Productos" `
        -Method Post `
        -Headers $headers `
        -Body $body `
        -ContentType "application/json"
    
    Write-Host "✅ Producto creado exitosamente" -ForegroundColor Green
    Write-Host "   ID Producto: $($response.idProducto)" -ForegroundColor Cyan
    Write-Host "   Nombre: $($response.nombreBase)" -ForegroundColor Cyan
    Write-Host "   Variaciones creadas: $($response.variaciones.Count)" -ForegroundColor Cyan
    
    # Mostrar detalles de variaciones
    foreach ($variacion in $response.variaciones) {
        Write-Host "      - $($variacion.presentacion): `$$($variacion.precio) (Stock: $($variacion.stock))" -ForegroundColor Gray
    }
}
catch {
    Write-Host "❌ Error al crear producto:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    # Si hay respuesta del servidor, mostrarla
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Respuesta del servidor:" -ForegroundColor Yellow
        Write-Host $responseBody -ForegroundColor Yellow
    }
}
```

**Método alternativo - Usando ConvertTo-Json (⚠️ requiere cuidado con tipos):**

```powershell
# Solo usar si entiendes bien la serialización de PowerShell
$producto = @{
    nombreBase = "BR FOR CAT VET CONTROL DE PESO"
    descripcion = "Alimento con un balance adecuado..."
    idCategoria = 2  # Asegúrate que sea int, no string
    tipoMascota = "Gatos"
    idMascotaTipo = 1
    idCategoriaAlimento = 2
    idSubcategoria = 5
    idPresentacion = 1
    proveedorId = 1
    variacionesProducto = @(
        @{
            presentacion = "500 GR"
            precio = 20400  # Asegúrate que sea numérico
            stock = 10
        },
        @{
            presentacion = "1.5 KG"
            precio = 58200
            stock = 10
        }
    )
}

$body = $producto | ConvertTo-Json -Depth 10

$response = Invoke-RestMethod `
    -Uri "http://localhost:5000/api/Productos" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

### Verificar producto creado (PowerShell)

```powershell
$idProducto = 123  # Reemplazar con el ID devuelto
$producto = Invoke-RestMethod -Uri "http://localhost:5000/api/Productos/$idProducto"
$producto | ConvertTo-Json -Depth 5
```

## Ejemplos de Uso con Postman

### Configuración de la Request en Postman

1. **Método:** `POST`
2. **URL:** `http://localhost:5000/api/Productos`
3. **Headers:**
   - Key: `Content-Type`
   - Value: `application/json`

4. **Body:**
   - Seleccionar: `raw`
   - Tipo: `JSON`
   - Contenido:

```json
{
  "nombreBase": "BR FOR CAT VET CONTROL DE PESO",
  "descripcion": "Alimento con un balance adecuado de nutrientes que ayuda a reducir la formación de bolas de pelo, brindándole máxima protección de piel y pelaje.",
  "idCategoria": 2,
  "tipoMascota": "Gatos",
  "urlImagen": "https://www.velykapet.com/productos/alimentos/gatos/BR_FOR_CAT_VET_CONTROL_DE_PESO.jpg",
  "idMascotaTipo": 1,
  "idCategoriaAlimento": 2,
  "idSubcategoria": 5,
  "idPresentacion": 1,
  "proveedorId": 1,
  "variacionesProducto": [
    {
      "presentacion": "500 GR",
      "precio": 20400,
      "stock": 10
    },
    {
      "presentacion": "1.5 KG",
      "precio": 58200,
      "stock": 10
    },
    {
      "presentacion": "3 KG",
      "precio": 110800,
      "stock": 10
    }
  ]
}
```

### Colección de Postman

Puedes importar esta colección en Postman para probar el endpoint rápidamente:

```json
{
  "info": {
    "name": "VelyKapet API - Productos",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Crear Producto con Variaciones",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"nombreBase\": \"BR FOR CAT VET CONTROL DE PESO\",\n  \"descripcion\": \"Alimento con un balance adecuado de nutrientes que ayuda a reducir la formación de bolas de pelo, brindándole máxima protección de piel y pelaje.\",\n  \"idCategoria\": 2,\n  \"tipoMascota\": \"Gatos\",\n  \"urlImagen\": \"https://www.velykapet.com/productos/alimentos/gatos/BR_FOR_CAT_VET_CONTROL_DE_PESO.jpg\",\n  \"idMascotaTipo\": 1,\n  \"idCategoriaAlimento\": 2,\n  \"idSubcategoria\": 5,\n  \"idPresentacion\": 1,\n  \"proveedorId\": 1,\n  \"variacionesProducto\": [\n    {\n      \"presentacion\": \"500 GR\",\n      \"precio\": 20400,\n      \"stock\": 10\n    },\n    {\n      \"presentacion\": \"1.5 KG\",\n      \"precio\": 58200,\n      \"stock\": 10\n    },\n    {\n      \"presentacion\": \"3 KG\",\n      \"precio\": 110800,\n      \"stock\": 10\n    }\n  ]\n}"
        },
        "url": {
          "raw": "http://localhost:5000/api/Productos",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "Productos"]
        }
      }
    },
    {
      "name": "Obtener Producto por ID",
      "request": {
        "method": "GET",
        "url": {
          "raw": "http://localhost:5000/api/Productos/{{productId}}",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "Productos", "{{productId}}"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "productId",
      "value": "1"
    }
  ]
}
```

## Integración con Frontend

### Ejemplo en JavaScript/React

```javascript
async function crearProductoConVariaciones(productoData) {
  try {
    const response = await fetch('http://localhost:5000/api/Productos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productoData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.mensaje || error.error);
    }

    const productoCreado = await response.json();
    console.log('Producto creado:', productoCreado);
    return productoCreado;
  } catch (error) {
    console.error('Error al crear producto:', error);
    throw error;
  }
}

// Uso
const nuevoProducto = {
  nombreBase: "BR FOR CAT VET CONTROL DE PESO",
  descripcion: "Alimento con un balance adecuado...",
  idCategoria: 2,
  tipoMascota: "Gatos",
  idMascotaTipo: 1,
  idCategoriaAlimento: 2,
  idSubcategoria: 5,
  idPresentacion: 1,
  proveedorId: 1,
  variacionesProducto: [
    { presentacion: "500 GR", precio: 20400, stock: 10 },
    { presentacion: "1.5 KG", precio: 58200, stock: 10 },
    { presentacion: "3 KG", precio: 110800, stock: 10 }
  ]
};

crearProductoConVariaciones(nuevoProducto)
  .then(resultado => console.log('Éxito:', resultado))
  .catch(error => console.error('Error:', error));
```

## Extensibilidad

Este endpoint está diseñado para ser fácilmente extensible:

1. **Nuevos atributos:** Agregar campos al DTO y al modelo
2. **Nuevas validaciones:** Agregar validaciones antes de crear el producto
3. **Nuevos tipos de variaciones:** Ampliar el modelo de variaciones sin romper la API
4. **Webhooks/Eventos:** Agregar notificaciones después de crear el producto

## 🧪 Scripts de Prueba

Para validar el correcto funcionamiento del endpoint y ver ejemplos de uso en acción, ejecuta los scripts de prueba incluidos:

**PowerShell (Windows):**
```powershell
cd backend-config
.\test-crear-producto.ps1
```

**Bash (Linux/macOS/WSL):**
```bash
cd backend-config
./test-crear-producto.sh
```

Estos scripts demuestran:
- ✅ El formato correcto de JSON esperado
- ❌ Errores comunes y cómo evitarlos
- 💡 Soluciones a problemas de integración
- 🔍 Validación de respuestas del servidor

**Qué testean:**
1. Request correcto que crea un producto exitosamente
2. Error común: usar wrapper `{ "productoDto": {...} }`
3. Error común: tipos de datos incorrectos
4. Error común: array de variaciones vacío

Ver **`TEST_SCRIPTS_README.md`** para más detalles sobre los scripts de prueba.

## 🔧 Troubleshooting - Errores Comunes

### Error 400: "The productoDto field is required"

**Causa:** Estás enviando el JSON con un wrapper innecesario.

**Error recibido:**
```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "productoDto": ["The productoDto field is required."]
  }
}
```

**Solución:** Envía el JSON directamente, **sin** envolver en `{ "productoDto": { ... } }`.

**Ejemplo de JSON INCORRECTO:**
```json
{
  "productoDto": {
    "nombreBase": "Mi Producto",
    "descripcion": "Descripción del producto",
    ...
  }
}
```

**Ejemplo de JSON CORRECTO:**
```json
{
  "nombreBase": "Mi Producto",
  "descripcion": "Descripción del producto",
  ...
}
```

### Error 400: "The JSON value could not be converted to System.String"

**Causa:** Algún campo de tipo string está siendo enviado con el tipo incorrecto (número, objeto, array, etc.).

**Error recibido:**
```json
{
  "errors": {
    "$.descripcion": ["The JSON value could not be converted to System.String. Path: $.descripcion | LineNumber: 0 | BytePositionInLine: 110."]
  }
}
```

**Solución:** Asegúrate de que todos los campos de tipo string estén entre comillas dobles:

**Incorrecto:**
```json
{
  "nombreBase": BR FOR CAT,          // ❌ Falta comillas
  "descripcion": 12345,               // ❌ Es un número, debería ser string
  "tipoMascota": ["Gatos"]            // ❌ Es un array, debería ser string
}
```

**Correcto:**
```json
{
  "nombreBase": "BR FOR CAT",         // ✅ String con comillas
  "descripcion": "Alimento para...",  // ✅ String con comillas
  "tipoMascota": "Gatos"              // ✅ String con comillas
}
```

### Error 400: "The JSON value could not be converted to System.Int32"

**Causa:** Un campo numérico está siendo enviado como string u otro tipo.

**Solución:** Los números deben enviarse sin comillas:

**Incorrecto:**
```json
{
  "idCategoria": "2",        // ❌ Es un string, debería ser número
  "precio": "20400"          // ❌ Es un string, debería ser número
}
```

**Correcto:**
```json
{
  "idCategoria": 2,          // ✅ Número sin comillas
  "precio": 20400            // ✅ Número sin comillas
}
```

### Error 400: "Debe incluir al menos una variación"

**Causa:** El array `variacionesProducto` está vacío o no fue enviado.

**Solución:** Siempre incluye al menos una variación:

```json
{
  "nombreBase": "Mi Producto",
  "variacionesProducto": [
    {
      "presentacion": "500 GR",
      "precio": 20400,
      "stock": 10
    }
  ]
}
```

### Error al usar PowerShell con Invoke-RestMethod

**Problema:** PowerShell puede tener problemas con la serialización JSON de ciertos tipos de datos.

**Solución recomendada:** Usa el parámetro `-Body` con un JSON string bien formado:

```powershell
$headers = @{
    "Content-Type" = "application/json"
}

$body = @"
{
  "nombreBase": "BR FOR CAT VET CONTROL DE PESO",
  "descripcion": "Alimento con un balance adecuado de nutrientes",
  "idCategoria": 2,
  "tipoMascota": "Gatos",
  "urlImagen": "https://www.velykapet.com/productos/alimentos/gatos/BR_FOR_CAT_VET_CONTROL_DE_PESO.jpg",
  "idMascotaTipo": 1,
  "idCategoriaAlimento": 2,
  "idSubcategoria": 5,
  "idPresentacion": 1,
  "proveedorId": 1,
  "variacionesProducto": [
    {
      "presentacion": "500 GR",
      "precio": 20400,
      "stock": 10
    },
    {
      "presentacion": "1.5 KG",
      "precio": 58200,
      "stock": 10
    }
  ]
}
"@

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/Productos" `
    -Method Post `
    -Headers $headers `
    -Body $body

Write-Host "Producto creado con ID: $($response.idProducto)"
```

**⚠️ Evitar:** No uses hashtables de PowerShell directamente con `-Body` ya que la serialización puede fallar.

### Verificar el formato JSON

Antes de enviar tu request, valida que el JSON sea válido usando herramientas online:
- https://jsonlint.com/
- https://jsonformatter.org/

## Buenas Prácticas Implementadas

✅ **Transaccionalidad:** Uso de transacciones para operaciones atómicas
✅ **Validación exhaustiva:** Validación de todos los IDs de referencia
✅ **Mensajes descriptivos:** Errores claros y detallados
✅ **RESTful:** Sigue convenciones REST (POST para crear, 201 Created con Location header)
✅ **Logging:** Registro de operaciones para debugging
✅ **DTOs:** Separación entre modelos de dominio y DTOs de API
✅ **Consistencia:** Rollback automático en caso de error

## Mejoras Futuras

- [ ] Autenticación y autorización (JWT)
- [ ] Validación de permisos (solo admins pueden crear productos)
- [ ] Rate limiting
- [ ] Versionamiento de API
- [ ] Paginación en endpoints GET
- [ ] Campos adicionales en VariacionProducto (SKU, URLImagen dedicada, etc.)
- [ ] Soporte para actualización masiva
- [ ] Importación desde CSV/Excel
- [ ] Webhooks para notificar a sistemas externos
