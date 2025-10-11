# 🚀 Quick Start - Importación Masiva de Productos CSV

## ⚡ Inicio Rápido

### 1. Iniciar el API

```bash
cd backend-config
ASPNETCORE_ENVIRONMENT=Development dotnet run
```

El API estará disponible en: `http://localhost:5135`

### 2. Importar Productos desde CSV

```bash
curl -X POST http://localhost:5135/api/Productos/ImportarCsv \
  -H "Content-Type: multipart/form-data" \
  -F "file=@sample-products.csv"
```

### 3. Ejecutar Test Automatizado

```bash
cd backend-config
bash test-importar-csv.sh
```

## 📋 Formato Mínimo del CSV

```csv
ID,CATEGORIA,NAME,presentacion,PRICE,stock
1,Alimento para Gatos,Producto Test 1,1 KG,$10000.00,10
```

### Campos Requeridos

- **CATEGORIA**: Debe ser una categoría existente en la base de datos
- **NAME**: Nombre único del producto
- **PRICE**: Precio del producto (acepta formato `$10,000.00`)

### Campos Opcionales

- **presentacion**: Presentación de la variación (por defecto: "1 UN")
- **stock**: Stock disponible (por defecto: 0)
- **description**: Descripción del producto
- **imageUrl**: URL de la imagen del producto
- **proveedor**: Nombre del proveedor (debe existir en BD)
- **CATEGORIA_ALIMENTOS**: Categoría de alimento
- **SUBCATEGORIA**: Subcategoría
- **PRESENTACION_EMPAQUE**: Tipo de empaque

## 📊 Categorías Disponibles (por defecto)

- `Alimento para Perros`
- `Alimento para Gatos`
- `Snacks y Premios`
- `Accesorios`

## ✅ Respuesta Exitosa

```json
{
  "TotalProcessed": 3,
  "SuccessCount": 3,
  "FailureCount": 0,
  "Errors": [],
  "CreatedProducts": [
    {
      "IdProducto": 6,
      "NombreBase": "BR FOR CAT VET CONTROL DE PESO X 500GR",
      "Variaciones": [...],
      "Mensaje": "Producto creado exitosamente"
    }
  ],
  "Message": "Importación completada: 3 productos creados, 0 errores."
}
```

## ❌ Casos de Error Comunes

### Error: Categoría no encontrada

```json
{
  "Errors": [
    "Línea 2: Categoría 'CATEGORIA_INVALIDA' no encontrada."
  ]
}
```

**Solución**: Verificar que la categoría existe en la base de datos

### Error: Producto duplicado

```json
{
  "Errors": [
    "Línea 2: El producto 'NOMBRE_PRODUCTO' ya existe."
  ]
}
```

**Solución**: Cambiar el nombre del producto o eliminar el duplicado

### Error: Precio inválido

```json
{
  "Errors": [
    "Línea 2: Precio inválido 'ABC'."
  ]
}
```

**Solución**: Verificar que el precio sea un número válido

## 🧪 Archivos de Prueba Incluidos

- `sample-products.csv`: Ejemplo básico con 3 productos
- `test-invalid.csv`: Prueba con categoría inválida
- `test-mixed.csv`: Mezcla de productos válidos e inválidos

## 🔍 Verificar Productos Importados

```bash
# Ver todos los productos
curl http://localhost:5135/api/Productos

# Contar productos
curl -s http://localhost:5135/api/Productos | jq 'length'
```

## 📚 Documentación Completa

Ver: `backend-config/API_ENDPOINT_IMPORTAR_CSV.md`

## ⚙️ Características Principales

- ✅ Validación de categorías y proveedores
- ✅ Detección de duplicados
- ✅ Procesamiento en lote con transacciones individuales
- ✅ Reporte detallado de errores por línea
- ✅ Soporte para múltiples formatos de precio
- ✅ Logging completo en consola
- ✅ Continúa procesando aunque haya errores

## 🎯 Ejemplo del Issue Original

El CSV del issue original se mapea así:

| Campo CSV | Campo BD | Requerido |
|-----------|----------|-----------|
| CATEGORIA | IdCategoria | ✅ Sí |
| NAME | NombreBase | ✅ Sí |
| PRICE | Precio (variación) | ✅ Sí |
| presentacion | Peso (variación) | ❌ No |
| stock | Stock (variación) | ❌ No |
| description | Descripcion | ❌ No |
| imageUrl | URLImagen | ❌ No |
| proveedor | ProveedorId | ❌ No |

## 💡 Tips

1. **Preparar datos**: Asegurarse de que las categorías y proveedores existan antes de importar
2. **Probar primero**: Usar un CSV pequeño para verificar el formato
3. **Revisar errores**: Leer los mensajes de error para corregir problemas
4. **Importar en lotes**: Para archivos grandes, dividir en lotes más pequeños

## 🔒 Seguridad (Próximos Pasos)

En producción, considerar:
- Autenticación JWT para el endpoint
- Autorización solo para administradores
- Límite de tamaño de archivo
- Rate limiting

## 📞 Troubleshooting

### El servidor no responde

```bash
# Verificar que el servidor está corriendo
curl http://localhost:5135/api/Productos/categorias

# Reiniciar el servidor
cd backend-config
ASPNETCORE_ENVIRONMENT=Development dotnet run
```

### Error "archivo no encontrado"

```bash
# Verificar la ruta del archivo
ls -la sample-products.csv

# Usar ruta absoluta
curl -X POST http://localhost:5135/api/Productos/ImportarCsv \
  -F "file=@/ruta/completa/al/archivo.csv"
```

### Error de base de datos

```bash
# Eliminar base de datos y reiniciar
rm VentasPet.db*
ASPNETCORE_ENVIRONMENT=Development dotnet run
```
