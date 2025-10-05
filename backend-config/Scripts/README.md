# 📚 Scripts de Base de Datos - VelyKapet E-commerce

Este directorio contiene todos los scripts SQL necesarios para configurar, mantener y gestionar la base de datos del sistema VelyKapet, incluyendo **scripts de migración masiva de imágenes a Cloudflare R2**.

---

## 🎯 Nuevo: Migración de Imágenes a R2

### Problema Resuelto

**ANTES:**
- Productos muestran placeholders
- Campo `URLImagen` tiene rutas relativas viejas: `/images/productos/royal-canin-adult.jpg`
- Frontend no puede cargar imágenes

**DESPUÉS:**
- Productos muestran imágenes reales
- Campo `URLImagen` tiene URLs públicas de R2: `https://www.velykapet.com/productos/alimentos/perros/ROYAL_CANIN_ADULT.jpg`
- Frontend carga imágenes desde CDN de Cloudflare

---

## 📋 Índice de Scripts

### 🚀 Scripts de Migración R2 (NUEVO)

1. **MigrateImagenesToCloudflareR2.sql** ⭐ **PRINCIPAL**
   - **Propósito:** Migración masiva de rutas relativas antiguas a URLs públicas de Cloudflare R2
   - **Cuándo usar:** Para actualizar en masa el campo `URLImagen` de productos existentes
   - **Características:**
     - ✅ Backup automático antes de actualizar
     - ✅ Modo DRY RUN para pruebas
     - ✅ Normalización automática de nombres (espacios → `_`, UPPERCASE)
     - ✅ Actualización por categoría (perros/gatos/otros)
     - ✅ Rollback seguro incluido
   - **Resultado:** Todos los productos con URLs correctas de R2

2. **ValidateR2ImageUrls.sql** ⭐
   - **Propósito:** Validar formato y consistencia de URLs de imágenes en R2
   - **Cuándo usar:** Después de cualquier migración o actualización de imágenes
   - **Validaciones:**
     - ✅ Formato correcto de URL (`https://www.velykapet.com/...`)
     - ✅ Estructura de ruta esperada
     - ✅ Consistencia con categorías
     - ✅ Productos sin imagen
     - ✅ URLs duplicadas

3. **ValidateR2ImagesHttp.ps1** ⭐ (PowerShell)
   - **Propósito:** Validar accesibilidad HTTP real de las imágenes en R2
   - **Características:**
     - ✅ Valida HTTP status code (200, 404, etc.)
     - ✅ Verifica Content-Type y tamaño de archivo
     - ✅ Genera reporte HTML detallado
     - ✅ Muestra cache status de Cloudflare
   - **Requisitos:** PowerShell 5.1+, acceso a SQL Server

4. **validate-r2-images.js** ⭐ (Node.js)
   - **Propósito:** Validación HTTP multiplataforma (alternativa a PowerShell)
   - **Requisitos:** Node.js 14+, `npm install mssql node-fetch`
   - **Características:**
     - ✅ Compatible con Linux/Mac/Windows
     - ✅ Exporta reportes en JSON
     - ✅ Estadísticas detalladas

### 🔧 Scripts de Configuración Inicial

5. **SeedInitialProducts.sql**
   - Poblar la base de datos con datos iniciales
   - 4 categorías, 3 proveedores, 5 productos base, 15 variaciones

6. **AddSampleProductImages.sql**
   - Agregar URLs de ejemplo de Cloudflare R2 a los productos

7. **UpdateProductoImagenCloudflareR2.sql**
   - Actualizar producto individual con imagen de R2

### 🔍 Scripts de Verificación

8. **VerifyDatabaseState.sql**
   - Verificar el estado completo de la base de datos

---

## 🚀 Guía de Uso Rápido

### Migración de Imágenes a R2 (Caso Principal)

```bash
# 1. Ejecutar migración (primero en modo prueba)
sqlcmd -S localhost -d VentasPet_Nueva -E -i MigrateImagenesToCloudflareR2.sql

# 2. Validar formato de URLs
sqlcmd -S localhost -d VentasPet_Nueva -E -i ValidateR2ImageUrls.sql

# 3. Validar accesibilidad HTTP (PowerShell)
.\ValidateR2ImagesHttp.ps1

# O usar Node.js (multiplataforma)
npm install mssql node-fetch
node validate-r2-images.js --export-json
```

### Primera Configuración (Base de Datos Nueva)

```bash
# Opción A: Ejecutar scripts individuales
sqlcmd -S localhost -d VentasPet_Nueva -E -i SeedInitialProducts.sql
sqlcmd -S localhost -d VentasPet_Nueva -E -i MigrateImagenesToCloudflareR2.sql
sqlcmd -S localhost -d VentasPet_Nueva -E -i ValidateR2ImageUrls.sql

# Opción B: Usar batch automático (solo Windows)
SetupCompleteDatabase.bat
```

---

## 📖 Documentación Completa

### 📘 Guía Completa de Sincronización R2

**GUIA_SINCRONIZACION_R2.md** - Documento principal que incluye:

✅ Arquitectura recomendada  
✅ Convenciones de nombres detalladas  
✅ Estrategias de migración  
✅ Validación y testing  
✅ Automatización para catálogos grandes  
✅ Troubleshooting completo  
✅ Checklist de migración paso a paso  

**Temas cubiertos:**
1. Estructura de directorios en R2
2. Normalización de nombres de archivos
3. Scripts de migración (3 estrategias)
4. Validación SQL y HTTP
5. Automatización con procedimientos almacenados
6. Triggers para sincronización automática
7. Scripts de subida masiva a R2
8. Sincronización bidireccional con Node.js
9. Resolución de problemas comunes
10. Métricas de éxito y monitoreo

---

## 🔤 Convención de Nombres

### Regla de Normalización

```javascript
// JavaScript
function normalizeProductName(nombreBase) {
    return nombreBase
        .toUpperCase()                    // Todo en mayúsculas
        .replace(/\s+/g, '_')             // Espacios → guiones bajos
        .replace(/'/g, '')                // Eliminar apóstrofes
        .replace(/\./g, '')               // Eliminar puntos
        + '.jpg';
}

// Ejemplos:
// "Royal Canin Adult"        → "ROYAL_CANIN_ADULT.jpg"
// "Churu Atún 4 Piezas 56gr" → "CHURU_ATUN_4_PIEZAS_56GR.jpg"
// "Hill's Science Diet"      → "HILLS_SCIENCE_DIET.jpg"
```

### Estructura de URL Completa

```
https://www.velykapet.com/productos/{categoria}/{tipo_mascota}/{NOMBRE_NORMALIZADO}.jpg
```

**Ejemplos:**

| NombreBase | TipoMascota | URL Final |
|------------|-------------|-----------|
| Royal Canin Adult | Perros | `https://www.velykapet.com/productos/alimentos/perros/ROYAL_CANIN_ADULT.jpg` |
| Churu Atún 4 Piezas 56gr | Gatos | `https://www.velykapet.com/productos/alimentos/gatos/CHURU_ATUN_4_PIEZAS_56_GR.jpg` |

---

## 🔄 Workflow de Migración Completo

```
1. 📦 Backup Automático
   ↓
2. 🔄 Migración SQL (MigrateImagenesToCloudflareR2.sql)
   - DRY RUN primero (@DryRun = 1)
   - Luego migración real (@DryRun = 0)
   - Convierte rutas relativas → URLs R2
   - Normaliza nombres
   - Categoriza por tipo de mascota
   ↓
3. ✅ Validación SQL (ValidateR2ImageUrls.sql)
   - Verifica formato de URLs
   - Detecta inconsistencias
   - Lista productos sin imagen
   ↓
4. 🌐 Validación HTTP (ValidateR2ImagesHttp.ps1 o validate-r2-images.js)
   - Verifica accesibilidad real (HTTP 200)
   - Detecta imágenes faltantes (404)
   - Genera reporte detallado
   ↓
5. ⬆️  Subir imágenes faltantes a R2
   - wrangler r2 object put ...
   ↓
6. ✅ Verificación final en navegador
```

---

## 🎓 Ejemplos de Uso

### Caso 1: Migrar Imágenes Existentes (PRINCIPAL)

```sql
-- 1. Revisar estado actual
SELECT 
    COUNT(*) AS Total,
    SUM(CASE WHEN URLImagen LIKE 'https://www.velykapet.com/%' THEN 1 ELSE 0 END) AS EnR2,
    SUM(CASE WHEN URLImagen LIKE '/images/%' THEN 1 ELSE 0 END) AS RutasRelativas,
    SUM(CASE WHEN URLImagen IS NULL OR URLImagen = '' THEN 1 ELSE 0 END) AS SinImagen
FROM Productos;

-- 2. Ejecutar migración en modo prueba primero
-- En MigrateImagenesToCloudflareR2.sql, configurar:
DECLARE @DryRun BIT = 1;  -- Modo prueba

-- Ver preview de cambios, luego cambiar a:
DECLARE @DryRun BIT = 0;  -- Migración real

-- 3. Validar resultados
sqlcmd -S localhost -d VentasPet_Nueva -E -i ValidateR2ImageUrls.sql

-- 4. Validar HTTP
.\ValidateR2ImagesHttp.ps1
```

### Caso 2: Configurar Base de Datos desde Cero

```bash
# 1. Crear base de datos
CREATE DATABASE VentasPet_Nueva;
GO

# 2. Ejecutar migraciones de Entity Framework
cd backend-config
dotnet ef database update

# 3. Poblar datos iniciales
sqlcmd -S localhost -d VentasPet_Nueva -E -i Scripts/SeedInitialProducts.sql

# 4. Migrar imágenes a R2
sqlcmd -S localhost -d VentasPet_Nueva -E -i Scripts/MigrateImagenesToCloudflareR2.sql

# 5. Validar
sqlcmd -S localhost -d VentasPet_Nueva -E -i Scripts/ValidateR2ImageUrls.sql
```

### Caso 3: Rollback de Migración

```sql
-- Si la migración salió mal, restaurar desde backup

-- 1. Listar tablas de backup disponibles
SELECT name FROM sys.tables WHERE name LIKE 'Productos_Backup_%';

-- 2. Restaurar (reemplazar YYYYMMDD_HHMMSS con el timestamp del backup)
UPDATE Productos
SET URLImagen = b.URLImagen,
    FechaActualizacion = b.FechaActualizacion
FROM Productos p
INNER JOIN Productos_Backup_YYYYMMDD_HHMMSS b ON p.IdProducto = b.IdProducto;

-- 3. Verificar restauración
sqlcmd -S localhost -d VentasPet_Nueva -E -i VerifyDatabaseState.sql
```

---

## 🚨 Troubleshooting

### Imágenes muestran 404 después de migración

**Diagnóstico:**
```sql
-- Ver URLs generadas
SELECT 
    IdProducto,
    NombreBase,
    URLImagen,
    REVERSE(SUBSTRING(REVERSE(URLImagen), 1, CHARINDEX('/', REVERSE(URLImagen)) - 1)) AS NombreArchivo
FROM Productos
WHERE URLImagen LIKE 'https://www.velykapet.com/%';
```

**Solución:**
```bash
# 1. Validar qué imágenes faltan
node validate-r2-images.js --export-json

# 2. Ver el reporte JSON
cat r2-image-validation-report.json | grep "404"

# 3. Subir imágenes faltantes a R2
wrangler r2 object put velykapet-products/productos/alimentos/perros/ROYAL_CANIN_ADULT.jpg \
    --file ./local-images/royal-canin-adult.jpg
```

### URLs no se actualizaron para algunos productos

**Diagnóstico:**
```sql
-- Ver productos con URLs problemáticas
SELECT 
    IdProducto,
    NombreBase,
    TipoMascota,
    URLImagen,
    CASE 
        WHEN URLImagen IS NULL THEN 'NULL'
        WHEN URLImagen = '' THEN 'Vacía'
        WHEN URLImagen LIKE '/images/%' THEN 'Ruta relativa'
        WHEN URLImagen NOT LIKE 'https://www.velykapet.com/%' THEN 'URL incorrecta'
        ELSE 'OK'
    END AS Estado
FROM Productos
WHERE URLImagen NOT LIKE 'https://www.velykapet.com/%'
   OR URLImagen IS NULL
   OR URLImagen = '';
```

**Solución:**
```sql
-- Re-ejecutar migración para productos específicos
UPDATE Productos
SET 
    URLImagen = 'https://www.velykapet.com/productos/alimentos/' +
                LOWER(TipoMascota) + '/' +
                UPPER(REPLACE(REPLACE(REPLACE(NombreBase, ' ', '_'), '''', ''), '.', '')) + '.jpg',
    FechaActualizacion = GETDATE()
WHERE IdProducto IN (1, 5, 12);  -- IDs específicos con problemas
```

**Ver soluciones completas en:** `GUIA_SINCRONIZACION_R2.md`

---

## 📊 Estado de los Scripts

| Script | Estado | Última Actualización | Versión |
|--------|--------|---------------------|---------|
| **MigrateImagenesToCloudflareR2.sql** | ✅ **Nuevo** | **Enero 2025** | **1.0** |
| **ValidateR2ImageUrls.sql** | ✅ **Nuevo** | **Enero 2025** | **1.0** |
| **ValidateR2ImagesHttp.ps1** | ✅ **Nuevo** | **Enero 2025** | **1.0** |
| **validate-r2-images.js** | ✅ **Nuevo** | **Enero 2025** | **1.0** |
| **GUIA_SINCRONIZACION_R2.md** | ✅ **Nuevo** | **Enero 2025** | **1.0** |
| SeedInitialProducts.sql | ✅ Estable | Diciembre 2024 | 1.0 |
| AddSampleProductImages.sql | ✅ Estable | Diciembre 2024 | 1.0 |
| UpdateProductoImagenCloudflareR2.sql | ✅ Estable | Diciembre 2024 | 1.0 |
| VerifyDatabaseState.sql | ✅ Estable | Diciembre 2024 | 1.0 |

---

## ✅ Checklist de Migración

### Antes de la Migración

- [ ] Hacer backup completo de la base de datos
- [ ] Verificar que tienes acceso a Cloudflare R2
- [ ] Revisar cuántos productos necesitan migración
- [ ] Preparar las imágenes localmente con nombres normalizados

### Durante la Migración

- [ ] Ejecutar script en modo DRY RUN primero (`@DryRun = 1`)
- [ ] Revisar preview de cambios
- [ ] Ejecutar script de migración real (`@DryRun = 0`)
- [ ] Verificar que el backup se creó correctamente
- [ ] Ejecutar script de validación SQL
- [ ] Subir imágenes faltantes a R2
- [ ] Ejecutar validación HTTP

### Después de la Migración

- [ ] Verificar productos en el navegador
- [ ] Revisar console del navegador por errores
- [ ] Probar con diferentes productos (gatos, perros)
- [ ] Verificar performance de carga
- [ ] Documentar cualquier imagen faltante

### Validación Final

- [ ] Todos los productos activos tienen `URLImagen` no nulo
- [ ] 100% de URLs comienzan con `https://www.velykapet.com/`
- [ ] Validación HTTP muestra >95% de éxito
- [ ] No hay URLs duplicadas (o están justificadas)
- [ ] Frontend muestra imágenes correctamente
- [ ] No hay errores 404 en Network tab

---

## 📞 Recursos y Documentación

### Documentos en este directorio

- **GUIA_SINCRONIZACION_R2.md** ⭐ - Guía completa de sincronización (PRINCIPAL)
- **TESTING_GUIDE.md** - Guía paso a paso para probar scripts
- **README_DATABASE_SETUP.md** - Configuración detallada de base de datos
- **INDEX_DOCUMENTACION.md** - Índice completo

### Documentos en el proyecto

- **GUIA_ASOCIAR_IMAGENES_PRODUCTOS.md** - Cómo asociar imágenes de R2
- **CLOUDFLARE_R2_INDEX.md** - Documentación completa de R2
- **DIAGNOSTIC_R2_IMAGES.md** - Diagnóstico de problemas

### Comandos Útiles

```bash
# SQL Server
sqlcmd -S localhost -d VentasPet_Nueva -E -i script.sql

# Cloudflare Wrangler
wrangler r2 object list velykapet-products
wrangler r2 object put velykapet-products/path/file.jpg --file local-file.jpg

# Node.js
node validate-r2-images.js --export-json
```

---

## 🎯 Resumen de Solución

### Lo que esta solución proporciona:

✅ **Scripts de migración masiva** con backup automático y rollback  
✅ **Validación SQL** de formato y consistencia  
✅ **Validación HTTP** de accesibilidad real (PowerShell y Node.js)  
✅ **Convenciones estandarizadas** de nombres de archivo  
✅ **Documentación completa** de mejores prácticas  
✅ **Automatización** para catálogos grandes  
✅ **Troubleshooting** detallado de problemas comunes  

### Mejores Prácticas Implementadas:

1. **Consistencia:** Convención única de nombres en todo el sistema
2. **Validación:** Scripts SQL + HTTP para verificación completa
3. **Seguridad:** Backup automático antes de cualquier cambio
4. **Monitoreo:** Queries de diagnóstico y reportes detallados
5. **Documentación:** Guías paso a paso y ejemplos prácticos

---

**Última actualización:** Enero 2025  
**Mantenedor:** Equipo VelyKapet  
**Versión de documentación:** 2.0 (con soporte completo para migración R2)
