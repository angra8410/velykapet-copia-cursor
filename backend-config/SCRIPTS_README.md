# Scripts de Importación Masiva - Backend Config

Este directorio contiene scripts PowerShell para la importación y gestión masiva de productos en VelyKapet.

## 📋 Scripts Principales

### `importar-masivo.ps1`
Script de importación masiva de productos desde archivos CSV.

**Uso:**
```powershell
.\importar-masivo.ps1
```

**Características:**
- Importa productos desde CSV a la API del backend
- Maneja errores con mensajes descriptivos
- Muestra resumen detallado de la importación
- Lista productos creados y errores encontrados

### `preprocesar-csv.ps1`
Script de preprocesamiento y limpieza de archivos CSV antes de la importación.

**Uso:**
```powershell
.\preprocesar-csv.ps1
# O especificar archivos:
.\preprocesar-csv.ps1 -InputFile "productos.csv" -OutputFile "productos-limpio.csv"
```

**Características:**
- Limpia y normaliza formatos de precios
- Convierte encoding a UTF-8
- Detecta y corrige errores comunes
- Genera reporte de cambios realizados

### `test-importacion-csv.ps1`
Script de prueba automatizada del proceso completo de importación.

**Uso:**
```powershell
.\test-importacion-csv.ps1
# O especificar archivo:
.\test-importacion-csv.ps1 -TestFile "productos.csv"
```

**Características:**
- Valida formato del CSV
- Verifica conexión con el backend
- Prueba parsing de precios
- Genera reporte de tests

### `validate-scripts.ps1`
Script de validación automática de todos los scripts PowerShell.

**Uso:**
```powershell
.\validate-scripts.ps1
# O con opciones:
.\validate-scripts.ps1 -Verbose -Path "."
```

**Características:**
- Valida sintaxis de todos los scripts
- Verifica encoding UTF-8
- Detecta bloques mal cerrados
- Genera reporte de validación

## 🚀 Flujo de Trabajo Recomendado

1. **Preprocesar el CSV** (opcional pero recomendado):
   ```powershell
   .\preprocesar-csv.ps1
   ```

2. **Probar la importación**:
   ```powershell
   .\test-importacion-csv.ps1
   ```

3. **Importar los productos**:
   ```powershell
   .\importar-masivo.ps1
   ```

## ✅ Validación y Calidad

Antes de ejecutar scripts en producción, valídalos con:
```powershell
.\validate-scripts.ps1
```

Este script verifica:
- ✅ Sintaxis correcta
- ✅ Encoding UTF-8
- ✅ Bloques balanceados
- ✅ Manejo de errores

## 📚 Documentación

Ver `POWERSHELL_BEST_PRACTICES.md` para:
- Buenas prácticas de scripting en PowerShell
- Errores comunes y cómo evitarlos
- Herramientas recomendadas
- Guías de testing y CI/CD

## 🔧 Requisitos

- PowerShell 5.1 o superior
- Acceso al backend en `http://localhost:5135`
- Archivos CSV con el formato correcto

## 📊 Formato del CSV

El CSV debe contener al menos las siguientes columnas:
- `NAME`: Nombre del producto
- `CATEGORIA`: Categoría del producto
- `PRICE`: Precio (formato: 20400.00)
- Otras columnas según el modelo de datos

Ver `sample-products.csv` como ejemplo.

## 🆘 Solución de Problemas

### El backend no está corriendo
```powershell
cd backend-config
dotnet run
```

### Error 405: Método no permitido
Verificar que el endpoint `/api/Productos/ImportarCsv` esté configurado con `[HttpPost]`.

### Problemas de encoding
Asegurar que los archivos CSV estén en UTF-8. Usar el preprocesador:
```powershell
.\preprocesar-csv.ps1
```

### Errores de sintaxis en scripts
Validar todos los scripts:
```powershell
.\validate-scripts.ps1
```

## 🔗 Enlaces Útiles

- [Documentación del Proyecto](../README.md)
- [Guía de PowerShell Best Practices](./POWERSHELL_BEST_PRACTICES.md)
- [API Documentation](../API_DOCUMENTATION.md)

## 📝 Historial de Cambios

- **2025-10-18:** Corrección de errores de sintaxis en `importar-masivo.ps1`
- **2025-10-18:** Creación de `validate-scripts.ps1` para validación automática
- **2025-10-18:** Documentación completa de buenas prácticas
