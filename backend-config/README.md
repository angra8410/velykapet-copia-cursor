# 📦 Backend Configuration - VelyKapet

Este directorio contiene el backend .NET de VelyKapet y los scripts de gestión de productos.

## 🚀 Inicio Rápido

### Iniciar el Backend

```powershell
dotnet run
```

El backend estará disponible en:
- HTTP: http://localhost:5135
- Swagger UI: http://localhost:5135 (documentación de API)

### Importar Productos desde CSV

**Proceso Recomendado:**

```powershell
# 1. Preprocesar el CSV (limpia y valida)
.\preprocesar-csv.ps1

# 2. Validar el CSV procesado
.\test-importacion-csv.ps1

# 3. Importar los productos
.\importar-masivo.ps1
```

## 📋 Scripts Disponibles

### Scripts de Importación

| Script | Descripción | Uso |
|--------|-------------|-----|
| `preprocesar-csv.ps1` | Limpia y valida CSV antes de importar | `.\preprocesar-csv.ps1` |
| `importar-masivo.ps1` | Importa productos desde CSV al backend | `.\importar-masivo.ps1` |
| `test-importacion-csv.ps1` | Tests automatizados de validación | `.\test-importacion-csv.ps1` |

### Scripts de Prueba

| Script | Descripción |
|--------|-------------|
| `test-crear-producto.ps1` | Prueba creación de un solo producto |
| `test-importar-csv.ps1` | Prueba importación CSV básica |
| `limpiar-productos-prueba.ps1` | Limpia productos de prueba de la BD |

### Archivos de Datos

| Archivo | Descripción |
|---------|-------------|
| `sample-products.csv` | CSV de ejemplo con 3 productos |
| `test-prices.csv` | CSV de prueba con diferentes formatos de precio |

## 🔧 Solución al Bug de Importación CSV

**Problema Original:** Las importaciones masivas fallaban porque los precios se parseaban incorrectamente.

**Ejemplo del Bug:**
- CSV: `$20,400.00`
- Bug: Se parseaba como `2,040,000` ❌
- Fix: Ahora se parsea como `20,400.00` ✅

**Documentación Completa:**
- [SOLUCION_BUG_IMPORTACION_CSV.md](./SOLUCION_BUG_IMPORTACION_CSV.md) - Solución detallada
- [GUIA_RAPIDA_IMPORTACION.md](./GUIA_RAPIDA_IMPORTACION.md) - Guía rápida

## 📊 Formato del CSV

### Campos Obligatorios

- `NAME` - Nombre del producto
- `CATEGORIA` - Categoría del producto (debe existir en BD)
- `PRICE` - Precio (formato: $20,400.00)

### Campos Opcionales

- `description` - Descripción del producto
- `presentacion` - Presentación (ej: "500 GR", "1.5 KG")
- `stock` - Stock disponible
- `imageUrl` - URL de la imagen
- `proveedor` - Nombre del proveedor
- `CATEGORIA ALIMENTOS` - Categoría de alimento
- `SUBCATEGORIA` - Subcategoría
- `PRESENTACION EMPAQUE` - Tipo de empaque

### Ejemplo CSV

**Formato US (coma = separador de miles, punto = decimal):**
```csv
NAME,CATEGORIA,PRICE,presentacion,stock
BR FOR CAT VET X 500 GR,Alimento para Gatos,$20,400.00,500 GR,10
BR FOR CAT VET X 1.5 KG,Alimento para Gatos,$58,200.00,1.5 KG,15
```

**Formato EU (punto = separador de miles, coma = decimal):**
```csv
NAME,CATEGORIA,PRICE,presentacion,stock
BR FOR CAT VET X 500 GR,Alimento para Gatos,$20.400,00,500 GR,10
BR FOR CAT VET X 1.5 KG,Alimento para Gatos,$58.200,00,1.5 KG,15
```

**Nota:** El preprocesador detecta y convierte ambos formatos automáticamente.

**Ver:** [FORMATO_CSV_VARIACIONES.md](./FORMATO_CSV_VARIACIONES.md) para más detalles.

## 🎯 Características Principales

### Backend API

- ✅ REST API con .NET 8.0
- ✅ Entity Framework Core
- ✅ Soporte SQLite y SQL Server
- ✅ CORS configurado para frontend
- ✅ Swagger UI para documentación
- ✅ Autenticación JWT

### Importación CSV

- ✅ Parsing inteligente de precios (US/EU)
- ✅ Agrupación automática de variaciones
- ✅ Validación de campos obligatorios
- ✅ Errores detallados por fila
- ✅ Soporte UTF-8 completo

### Endpoints Principales

```
GET    /api/Productos                    - Listar productos
GET    /api/Productos/{id}              - Obtener producto
POST   /api/Productos                    - Crear producto
POST   /api/Productos/ImportarCsv       - Importar desde CSV
GET    /api/Productos/categorias        - Listar categorías
```

## 🔍 Troubleshooting

### Backend no inicia

```powershell
# Verificar que .NET 8.0 está instalado
dotnet --version

# Restaurar dependencias
dotnet restore

# Limpiar y reconstruir
dotnet clean
dotnet build
```

### Error de conexión a base de datos

Por defecto usa SQLite. Si necesitas SQL Server:

1. Editar `appsettings.Development.json`
2. Cambiar `DatabaseProvider` a `"SqlServer"`
3. Actualizar `ConnectionString`

### Importación falla con "Categoría no encontrada"

```powershell
# Ver categorías disponibles
curl http://localhost:5135/api/Productos/categorias
```

Las categorías deben existir en la base de datos antes de importar productos.

### Caracteres especiales mal mostrados

```powershell
# Configurar encoding UTF-8 en PowerShell
chcp 65001
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
```

## 📚 Documentación Adicional

### Importación CSV
- [SOLUCION_BUG_IMPORTACION_CSV.md](./SOLUCION_BUG_IMPORTACION_CSV.md) - Solución completa del bug
- [GUIA_RAPIDA_IMPORTACION.md](./GUIA_RAPIDA_IMPORTACION.md) - Guía rápida
- [FORMATO_CSV_VARIACIONES.md](./FORMATO_CSV_VARIACIONES.md) - Formato CSV detallado
- [API_ENDPOINT_IMPORTAR_CSV.md](./API_ENDPOINT_IMPORTAR_CSV.md) - Documentación del endpoint

### Endpoints
- [API_ENDPOINT_CREAR_PRODUCTO.md](./API_ENDPOINT_CREAR_PRODUCTO.md) - Endpoint de creación
- [RESUMEN_IMPORTACION_CSV.md](./RESUMEN_IMPORTACION_CSV.md) - Resumen de importación

### Configuración
- [README_CONFIGURATION.md](./README_CONFIGURATION.md) - Configuración del backend

## 🧪 Tests

### Ejecutar todos los tests de importación

```powershell
.\test-importacion-csv.ps1
```

### Test de un CSV específico

```powershell
.\test-importacion-csv.ps1 -TestFile "mi-archivo.csv"
```

### Resultado esperado

```
Tests ejecutados:  6
Tests exitosos:    6
Tests fallidos:    0

✅ TODOS LOS TESTS PASARON
```

## 🔐 Seguridad

- Las contraseñas NO deben estar en el código
- Usar variables de entorno para secretos
- JWT configurado en `appsettings.json`
- CORS configurado solo para dominios permitidos

## 🤝 Contribuir

Para reportar problemas o sugerir mejoras:

1. Crear un issue describiendo el problema
2. Incluir archivos CSV de ejemplo si aplica
3. Adjuntar logs del backend
4. Describir pasos para reproducir

## 📝 Changelog

### v1.0.0 (Actual)

**Agregado:**
- ✅ Fix crítico de parsing de precios
- ✅ Script de preprocesamiento de CSV
- ✅ Tests automatizados de validación
- ✅ Reporte detallado de errores por fila
- ✅ Documentación completa

**Mejorado:**
- ✅ Experiencia de usuario en importación
- ✅ Manejo de errores con sugerencias
- ✅ Soporte UTF-8 en todos los scripts

---

**Versión:** 1.0.0  
**Framework:** .NET 8.0  
**Autor:** VelyKapet Dev Team
