# 📚 Índice de Documentación - Importación Masiva CSV

## 🚀 Inicio Rápido

¿Primera vez usando el endpoint? Empieza aquí:

### ⭐ Para Usuarios Windows (PowerShell)

👉 **[QUICK_REFERENCE_IMPORTAR_MASIVO.md](QUICK_REFERENCE_IMPORTAR_MASIVO.md)** - Quick Reference del Script PowerShell
- Script interactivo mejorado
- Uso en un minuto
- Comandos básicos
- Solución de errores comunes

👉 **[GUIA_IMPORTAR_MASIVO.md](GUIA_IMPORTAR_MASIVO.md)** - Guía Completa PowerShell
- Documentación detallada del script `importar-masivo.ps1`
- Ejemplos de uso paso a paso
- Interpretación de resultados
- Mejores prácticas

**Uso rápido:**
```powershell
cd backend-config
.\importar-masivo.ps1
```

### 📘 Para Usuarios Linux/Mac o Uso Programático

👉 **[QUICK_START_IMPORTAR_CSV.md](QUICK_START_IMPORTAR_CSV.md)**
- Comandos básicos con cURL
- Ejemplos prácticos
- Troubleshooting

## 📖 Documentación Completa

### 📘 Referencia del API

**[API_ENDPOINT_IMPORTAR_CSV.md](API_ENDPOINT_IMPORTAR_CSV.md)**
- Especificación completa del endpoint
- Formato detallado del CSV
- Todos los campos soportados
- Ejemplos de request/response
- Validaciones implementadas
- Casos de error
- Guía de seguridad

### 📗 Resumen Ejecutivo

**[RESUMEN_IMPORTACION_CSV.md](RESUMEN_IMPORTACION_CSV.md)**
- Funcionalidades implementadas
- Objetivos cumplidos
- Archivos creados/modificados
- Pruebas realizadas
- Métricas de rendimiento
- Mejoras futuras

## 🧪 Archivos de Prueba

### 📄 CSV de Ejemplo

**[sample-products.csv](sample-products.csv)**
- Archivo de ejemplo con 3 productos
- Formato correcto del CSV
- Listo para importar

### 🔧 Scripts de Prueba e Importación

**⭐ [importar-masivo.ps1](importar-masivo.ps1)** - Script PowerShell Interactivo (RECOMENDADO)
- Interfaz interactiva con mensajes claros
- Validaciones automáticas
- Formato de respuesta JSON
- Manejo de errores con sugerencias
- Opciones de reintento
- Compatible con PowerShell 5.1+

**Uso:**
```powershell
cd backend-config
.\importar-masivo.ps1
```

**[test-importar-csv.sh](test-importar-csv.sh)** - Script Bash de prueba
- Script automatizado bash
- Prueba el endpoint completo
- Muestra resultados formateados

**Uso:**
```bash
cd backend-config
bash test-importar-csv.sh
```

**[importar-simple.ps1](importar-simple.ps1)** - Script PowerShell básico (legacy)
- Versión simple sin interactividad
- Usar `importar-masivo.ps1` para mejor experiencia

## 📋 Estructura del Proyecto

```
backend-config/
├── Controllers/
│   └── ProductosController.cs          # Endpoint ImportarCsv
├── Models/
│   └── Producto.cs                      # DTOs: ProductoCsvDto, ImportResultDto
├── API_ENDPOINT_IMPORTAR_CSV.md         # Documentación técnica completa
├── QUICK_START_IMPORTAR_CSV.md          # Guía de inicio rápido (Linux/Mac)
├── RESUMEN_IMPORTACION_CSV.md           # Resumen ejecutivo
├── INDICE_IMPORTACION_CSV.md            # Este archivo
├── GUIA_IMPORTAR_MASIVO.md              # ⭐ Guía completa PowerShell
├── QUICK_REFERENCE_IMPORTAR_MASIVO.md   # ⭐ Quick Reference PowerShell
├── sample-products.csv                  # Archivo de ejemplo
├── importar-masivo.ps1                  # ⭐ Script PowerShell interactivo
├── importar-simple.ps1                  # Script PowerShell básico (legacy)
└── test-importar-csv.sh                 # Script de prueba bash
```

## 🎯 Casos de Uso Comunes

### 1. Primera Importación (Windows - PowerShell)

```powershell
# Navegar al directorio
cd backend-config

# Ejecutar el script interactivo
.\importar-masivo.ps1

# El script te guiará paso a paso:
# 1. Mostrará el formato esperado del CSV
# 2. Pedirá la ruta del archivo (default: sample-products.csv)
# 3. Validará el archivo
# 4. Enviará la solicitud
# 5. Mostrará resultados formateados
```

### 2. Primera Importación (Linux/Mac - cURL)

```bash
# 1. Preparar CSV con tus productos
# 2. Verificar que las categorías existan
curl http://localhost:5135/api/Productos/categorias

# 3. Importar
curl -X POST http://localhost:5135/api/Productos/ImportarCsv \
  -F "file=@mis-productos.csv"
```

### 3. Validar antes de Importar

```bash
# Usar el script de prueba con archivo pequeño
cp mis-productos.csv test-productos.csv
# Editar test-productos.csv para incluir solo 5 productos
bash test-importar-csv.sh
```

### 4. Importación de Catálogo Completo

Ver: [API_ENDPOINT_IMPORTAR_CSV.md - Casos de Uso](API_ENDPOINT_IMPORTAR_CSV.md#📊-casos-de-uso)

## 🔗 Links Útiles

### Documentación General del Proyecto

- [API_ENDPOINT_CREAR_PRODUCTO.md](API_ENDPOINT_CREAR_PRODUCTO.md) - Endpoint de creación individual
- [QUICK_START_ENDPOINT_PRODUCTOS.md](QUICK_START_ENDPOINT_PRODUCTOS.md) - Guía de endpoints de productos
- [RESUMEN_IMPLEMENTACION_ENDPOINT_PRODUCTOS.md](RESUMEN_IMPLEMENTACION_ENDPOINT_PRODUCTOS.md) - Resumen de endpoints

### Configuración

- [README_CONFIGURATION.md](README_CONFIGURATION.md) - Configuración del backend
- [appsettings.Development.json](appsettings.Development.json) - Configuración de desarrollo

## ❓ FAQ

### ¿Qué formato de precio acepta?

El endpoint acepta múltiples formatos:
- `$20,400.00`
- `20400.00`
- `20400`
- `$20400`

Ver: [API_ENDPOINT_IMPORTAR_CSV.md - Formato CSV](API_ENDPOINT_IMPORTAR_CSV.md#📄-formato-del-archivo-csv)

### ¿Qué pasa si hay errores?

El endpoint continúa procesando los demás productos y reporta todos los errores al final.

Ver: [QUICK_START_IMPORTAR_CSV.md - Casos de Error](QUICK_START_IMPORTAR_CSV.md#❌-casos-de-error-comunes)

### ¿Cómo actualizo productos existentes?

Actualmente el endpoint solo inserta nuevos productos. Para actualizar, hay que eliminar y reimportar.

Ver: [RESUMEN_IMPORTACION_CSV.md - Mejoras Futuras](RESUMEN_IMPORTACION_CSV.md#🔄-mejoras-futuras-sugeridas)

### ¿Hay límite de tamaño?

No hay límite implementado actualmente. Se recomienda 10 MB para producción.

Ver: [API_ENDPOINT_IMPORTAR_CSV.md - Seguridad](API_ENDPOINT_IMPORTAR_CSV.md#🔒-seguridad-y-buenas-prácticas)

## 🆘 Soporte

Si tienes problemas:

1. **Consultar Quick Start**: [QUICK_START_IMPORTAR_CSV.md](QUICK_START_IMPORTAR_CSV.md#📞-troubleshooting)
2. **Ver ejemplos**: Revisar `sample-products.csv`
3. **Ejecutar test**: `bash test-importar-csv.sh`
4. **Revisar logs**: Verificar salida de consola del servidor

## 📝 Notas de Versión

### v1.0.0 (Actual)

✅ Importación básica de productos
✅ Validaciones completas
✅ Reporte de errores detallado
✅ Documentación completa

### Próximas Versiones

- [ ] Soporte para actualización (upsert)
- [ ] Procesamiento asíncrono
- [ ] UI de administración
- [ ] Exportación a CSV

Ver: [RESUMEN_IMPORTACION_CSV.md - Mejoras Futuras](RESUMEN_IMPORTACION_CSV.md#🔄-mejoras-futuras-sugeridas)

---

**Última actualización**: 2025-10-11  
**Versión**: 1.0.0  
**Autor**: VelyKapet Development Team
