# API Endpoint: Crear Producto con Variaciones

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
