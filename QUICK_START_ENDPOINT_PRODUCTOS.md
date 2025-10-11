# 🚀 Quick Start - Endpoint de Creación de Productos

## ⚡ Inicio Rápido

### 1. Iniciar el API

```bash
cd backend-config
dotnet run
```

El API estará disponible en: **http://localhost:5135**

### 2. Crear un Producto

```bash
curl -X POST "http://localhost:5135/api/Productos" \
  -H "Content-Type: application/json" \
  -d '{
    "nombreBase": "Royal Canin Gastrointestinal",
    "descripcion": "Alimento terapéutico para problemas digestivos",
    "idCategoria": 2,
    "tipoMascota": "Gatos",
    "urlImagen": "https://www.velykapet.com/productos/gastrointestinal.jpg",
    "idMascotaTipo": 1,
    "idCategoriaAlimento": 2,
    "idSubcategoria": 5,
    "idPresentacion": 1,
    "proveedorId": 1,
    "variacionesProducto": [
      {
        "presentacion": "400 GR",
        "precio": 18500,
        "stock": 15
      },
      {
        "presentacion": "2 KG",
        "precio": 75200,
        "stock": 8
      }
    ]
  }'
```

### 3. Verificar el Producto Creado

```bash
# Obtener producto por ID (reemplazar {id} con el ID retornado)
curl "http://localhost:5135/api/Productos/{id}"

# Buscar por nombre
curl "http://localhost:5135/api/Productos?busqueda=Gastrointestinal"
```

## 📋 IDs de Referencia (Seed Data)

### Categorías
- `1` - Alimento para Perros
- `2` - Alimento para Gatos
- `3` - Snacks y Premios
- `4` - Accesorios

### Tipos de Mascota
- `1` - GATO
- `2` - PERRO

### Categorías de Alimento
- `1` - ALIMENTO SECO (Perros)
- `2` - ALIMENTO SECO (Gatos)
- `3` - ALIMENTO HÚMEDO (Perros)
- `4` - ALIMENTO HÚMEDO (Gatos)
- `5` - SNACKS Y PREMIOS

### Subcategorías para Gatos (Alimento Seco)
- `5` - DIETA SECA PRESCRITA
- `6` - ADULT
- `7` - KITTEN
- `8` - INDOOR

### Presentaciones
- `1` - BOLSA
- `2` - LATA
- `3` - SOBRE
- `4` - CAJA
- `5` - TUBO

### Proveedores
- `1` - Royal Canin
- `2` - Hill's Science Diet
- `3` - Purina Pro Plan

## 🧪 Ejecutar Tests

```bash
cd backend-config
bash test-endpoint-crear-producto.sh
```

## 📚 Documentación Completa

Ver: `backend-config/API_ENDPOINT_CREAR_PRODUCTO.md`

## ⚠️ Campos Requeridos Mínimos

```json
{
  "nombreBase": "Nombre del Producto",
  "idCategoria": 2,
  "tipoMascota": "Gatos",
  "variacionesProducto": [
    {
      "presentacion": "1 KG",
      "precio": 100
    }
  ]
}
```

## ✅ Validaciones Automáticas

El endpoint valida:
- ✅ Categoría existe
- ✅ Tipo de mascota existe (si se proporciona)
- ✅ Categoría de alimento existe (si se proporciona)
- ✅ Subcategoría existe (si se proporciona)
- ✅ Presentación existe (si se proporciona)
- ✅ Proveedor existe (si se proporciona)
- ✅ No hay duplicados (nombre base único)
- ✅ Al menos una variación incluida

## 🔄 Transaccionalidad

Si **cualquier** validación falla o hay un error:
- ❌ No se crea el producto
- ❌ No se crean las variaciones
- ✅ Rollback automático

## 📞 Respuestas Comunes

### ✅ Éxito (201 Created)
```json
{
  "idProducto": 6,
  "nombreBase": "...",
  "variaciones": [...],
  "mensaje": "Producto '...' creado exitosamente con 2 variación(es)."
}
```

### ❌ Error (400 Bad Request)
```json
{
  "error": "Categoría inválida",
  "mensaje": "La categoría con ID 999 no existe o está inactiva."
}
```

### ❌ Duplicado (409 Conflict)
```json
{
  "error": "Producto duplicado",
  "mensaje": "Ya existe un producto con el nombre '...'"
}
```

## 🎯 Ejemplo del Issue Original

```bash
curl -X POST "http://localhost:5135/api/Productos" \
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
      {"presentacion": "500 GR", "precio": 20400, "stock": 10},
      {"presentacion": "1.5 KG", "precio": 58200, "stock": 10},
      {"presentacion": "3 KG", "precio": 110800, "stock": 10}
    ]
  }'
```

---

**Para más información consulta:**
- 📖 API_ENDPOINT_CREAR_PRODUCTO.md
- 📊 RESUMEN_IMPLEMENTACION_ENDPOINT_PRODUCTOS.md
