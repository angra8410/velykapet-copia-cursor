# 📚 Guía Completa: Sincronización de Imágenes SQL Server ↔ Cloudflare R2

## 🎯 Objetivo

Esta guía documenta las mejores prácticas para mantener sincronizado el catálogo de imágenes entre SQL Server y Cloudflare R2, evitando desalineaciones y garantizando que los productos siempre muestren sus imágenes correctas.

---

## 📋 Tabla de Contenidos

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura Recomendada](#arquitectura-recomendada)
3. [Convención de Nombres](#convención-de-nombres)
4. [Scripts de Migración](#scripts-de-migración)
5. [Validación y Testing](#validación-y-testing)
6. [Automatización](#automatización)
7. [Troubleshooting](#troubleshooting)
8. [Checklist de Migración](#checklist-de-migración)

---

## 🎯 Resumen Ejecutivo

### Problema Resuelto

**ANTES:** Productos muestran placeholders porque el campo `URLImagen` tiene rutas relativas viejas (`/images/productos/royal-canin-adult.jpg`) que no corresponden a las imágenes reales en Cloudflare R2.

**DESPUÉS:** Productos muestran imágenes reales desde URLs públicas de R2 (`https://www.velykapet.com/productos/alimentos/perros/ROYAL_CANIN_ADULT.jpg`).

### Solución Implementada

✅ Scripts SQL de migración masiva con backup automático  
✅ Scripts de validación de formato y accesibilidad HTTP  
✅ Convenciones de nombres estandarizadas  
✅ Documentación de mejores prácticas  
✅ Automatización para catálogos grandes  

---

## 🏗️ Arquitectura Recomendada

### Estructura de Directorios en R2

```
velykapet-products (bucket)
├── productos/
│   ├── alimentos/
│   │   ├── perros/
│   │   │   ├── ROYAL_CANIN_ADULT.jpg
│   │   │   ├── HILLS_SCIENCE_DIET_PUPPY.jpg
│   │   │   └── ...
│   │   ├── gatos/
│   │   │   ├── CHURU_ATUN_4_PIEZAS_56_GR.jpg
│   │   │   ├── PURINA_PRO_PLAN_ADULT_CAT.jpg
│   │   │   └── ...
│   │   └── otros/
│   ├── accesorios/
│   │   ├── perros/
│   │   ├── gatos/
│   │   └── ambos/
│   └── medicamentos/
└── sistema/
    └── placeholders/
        ├── producto-sin-imagen.jpg
        ├── producto-gato-sin-imagen.jpg
        └── producto-perro-sin-imagen.jpg
```

### Diagrama de Flujo

```
┌─────────────────┐
│  Base de Datos  │
│   (SQL Server)  │
│                 │
│  Tabla:         │
│  Productos      │
│  - URLImagen    │──────┐
└─────────────────┘      │
                         │ Apunta a
                         ↓
┌──────────────────────────────────────┐
│     Cloudflare R2 Bucket             │
│                                      │
│  https://www.velykapet.com/          │
│  └── productos/alimentos/perros/     │
│      └── ROYAL_CANIN_ADULT.jpg       │
└──────────────────────────────────────┘
                         │
                         │ Sirve vía CDN
                         ↓
┌──────────────────────────────────────┐
│         Frontend (React)              │
│                                      │
│  <img src={product.URLImagen} />     │
└──────────────────────────────────────┘
```

---

## 🔤 Convención de Nombres

### Reglas para Nombres de Archivo

**IMPORTANTE:** La consistencia en los nombres es crítica para evitar errores 404.

#### 1. Normalización de Nombres

```javascript
// JavaScript
function normalizeProductName(nombreBase) {
    return nombreBase
        .toUpperCase()                    // Todo en mayúsculas
        .replace(/\s+/g, '_')             // Espacios → guiones bajos
        .replace(/'/g, '')                // Eliminar apóstrofes
        .replace(/\./g, '')               // Eliminar puntos
        .replace(/[^\w_]/g, '')           // Solo alfanuméricos y _
        + '.jpg';
}

// Ejemplos:
// "Royal Canin Adult"        → "ROYAL_CANIN_ADULT.jpg"
// "Churu Atún 4 Piezas 56gr" → "CHURU_ATUN_4_PIEZAS_56GR.jpg"
// "Hill's Science Diet"      → "HILLS_SCIENCE_DIET.jpg"
```

```sql
-- SQL Server
UPPER(REPLACE(REPLACE(REPLACE(NombreBase, ' ', '_'), '''', ''), '.', '')) + '.jpg'
```

#### 2. Estructura de URL Completa

```
https://www.velykapet.com/productos/{categoria}/{tipo_mascota}/{NOMBRE_NORMALIZADO}.jpg
```

**Ejemplos:**

| NombreBase | TipoMascota | URL Final |
|------------|-------------|-----------|
| Royal Canin Adult | Perros | `https://www.velykapet.com/productos/alimentos/perros/ROYAL_CANIN_ADULT.jpg` |
| Churu Atún 4 Piezas 56gr | Gatos | `https://www.velykapet.com/productos/alimentos/gatos/CHURU_ATUN_4_PIEZAS_56_GR.jpg` |
| Hill's Science Diet Puppy | Perros | `https://www.velykapet.com/productos/alimentos/perros/HILLS_SCIENCE_DIET_PUPPY.jpg` |

#### 3. Caracteres Especiales

| Carácter Original | Reemplazo | Ejemplo |
|-------------------|-----------|---------|
| Espacios (` `) | `_` | `Royal Canin` → `ROYAL_CANIN` |
| Apóstrofes (`'`) | (eliminar) | `Hill's` → `HILLS` |
| Puntos (`.`) | (eliminar) | `1.5 KG` → `15_KG` |
| Acentos (`á`, `é`, etc.) | Sin acentos | `Atún` → `ATUN` |
| Ñ | `N` | `Niño` → `NINO` |

---

## 🔄 Scripts de Migración

### 1. Script Principal de Migración

**Archivo:** `MigrateImagenesToCloudflareR2.sql`

**Características:**
- ✅ Backup automático antes de actualizar
- ✅ Modo DRY RUN para pruebas
- ✅ Migración de rutas relativas viejas
- ✅ Asignación a productos sin imagen
- ✅ Normalización de URLs existentes
- ✅ Rollback seguro en caso de error

**Uso:**

```sql
-- Modo prueba (no actualiza nada)
DECLARE @DryRun BIT = 1;  -- Cambiar a 0 para actualización real

-- Ejecutar el script
sqlcmd -S localhost -d VentasPet_Nueva -E -i MigrateImagenesToCloudflareR2.sql
```

**Estrategias de Migración:**

#### Estrategia 1: Rutas Relativas Viejas

```sql
-- De: /images/productos/royal-canin-adult.jpg
-- A:  https://www.velykapet.com/productos/alimentos/perros/ROYAL_CANIN_ADULT.jpg

UPDATE Productos
SET 
    URLImagen = CASE 
        WHEN TipoMascota = 'Perros' THEN 'https://www.velykapet.com/productos/alimentos/perros/'
        WHEN TipoMascota = 'Gatos' THEN 'https://www.velykapet.com/productos/alimentos/gatos/'
        ELSE 'https://www.velykapet.com/productos/otros/'
    END + UPPER(REPLACE(REPLACE(REPLACE(NombreBase, ' ', '_'), '''', ''), '.', '')) + '.jpg',
    FechaActualizacion = GETDATE()
WHERE URLImagen LIKE '/images/productos/%';
```

#### Estrategia 2: Productos Sin Imagen

```sql
UPDATE Productos
SET 
    URLImagen = 'https://www.velykapet.com/productos/alimentos/' + 
                LOWER(TipoMascota) + '/' +
                UPPER(REPLACE(REPLACE(REPLACE(NombreBase, ' ', '_'), '''', ''), '.', '')) + '.jpg',
    FechaActualizacion = GETDATE()
WHERE (URLImagen IS NULL OR URLImagen = '')
  AND Activo = 1;
```

#### Estrategia 3: Normalización de URLs Existentes

```sql
-- Corregir http:// → https://
-- Corregir velykapet.com → www.velykapet.com

UPDATE Productos
SET 
    URLImagen = REPLACE(REPLACE(URLImagen, 'http://', 'https://'), 
                        'velykapet.com', 'www.velykapet.com'),
    FechaActualizacion = GETDATE()
WHERE URLImagen LIKE '%velykapet.com%'
  AND URLImagen NOT LIKE 'https://www.velykapet.com/%';
```

### 2. Rollback de Migración

```sql
-- Restaurar desde backup (si algo salió mal)
-- Reemplazar {TIMESTAMP} con el timestamp de la tabla de backup

-- Opción 1: Restaurar solo URLImagen
UPDATE Productos
SET URLImagen = b.URLImagen
FROM Productos p
INNER JOIN Productos_Backup_{TIMESTAMP} b ON p.IdProducto = b.IdProducto;

-- Opción 2: Restaurar tabla completa
DROP TABLE Productos;
SELECT * INTO Productos FROM Productos_Backup_{TIMESTAMP};
```

---

## ✅ Validación y Testing

### 1. Validación de Formato SQL

**Archivo:** `ValidateR2ImageUrls.sql`

Valida:
- ✅ Formato correcto de URL (`https://www.velykapet.com/...`)
- ✅ Estructura de ruta esperada
- ✅ Nombres de archivo normalizados
- ✅ Consistencia con categorías
- ✅ Productos activos sin imagen
- ✅ URLs duplicadas

**Uso:**

```bash
sqlcmd -S localhost -d VentasPet_Nueva -E -i ValidateR2ImageUrls.sql
```

### 2. Validación HTTP (PowerShell)

**Archivo:** `ValidateR2ImagesHttp.ps1`

Valida accesibilidad real de las imágenes:
- ✅ HTTP status code (200 OK, 404 Not Found, etc.)
- ✅ Content-Type correcto (image/jpeg, image/png)
- ✅ Tamaño de archivo
- ✅ Cache status de Cloudflare
- ✅ Genera reporte HTML

**Uso:**

```powershell
# Validación básica
.\ValidateR2ImagesHttp.ps1

# Con reporte HTML
.\ValidateR2ImagesHttp.ps1 -ExportReport $true

# Especificar servidor
.\ValidateR2ImagesHttp.ps1 -ServerName "localhost" -DatabaseName "VentasPet_Nueva"
```

### 3. Validación HTTP (Node.js)

**Archivo:** `validate-r2-images.js`

Alternativa multiplataforma en Node.js:

```bash
# Instalar dependencias
npm install mssql node-fetch

# Ejecutar validación
node validate-r2-images.js

# Exportar JSON
node validate-r2-images.js --export-json

# Exportar lista de URLs
node validate-r2-images.js --export-urls
```

---

## 🤖 Automatización

### Para Catálogos Grandes (>100 productos)

#### 1. Script de Sincronización Automática

```sql
-- Archivo: SyncR2ImagesAutomated.sql

-- Crear procedimiento almacenado para sincronización
CREATE OR ALTER PROCEDURE sp_SyncProductImageToR2
    @IdProducto INT
AS
BEGIN
    DECLARE @NombreBase NVARCHAR(200);
    DECLARE @TipoMascota NVARCHAR(50);
    DECLARE @NewURL NVARCHAR(500);
    
    -- Obtener datos del producto
    SELECT 
        @NombreBase = NombreBase,
        @TipoMascota = TipoMascota
    FROM Productos
    WHERE IdProducto = @IdProducto;
    
    -- Generar nueva URL
    SET @NewURL = 'https://www.velykapet.com/productos/alimentos/' + 
                  LOWER(@TipoMascota) + '/' +
                  UPPER(REPLACE(REPLACE(REPLACE(@NombreBase, ' ', '_'), '''', ''), '.', '')) + 
                  '.jpg';
    
    -- Actualizar producto
    UPDATE Productos
    SET 
        URLImagen = @NewURL,
        FechaActualizacion = GETDATE()
    WHERE IdProducto = @IdProducto;
    
    -- Log del cambio
    PRINT 'Producto ' + CAST(@IdProducto AS VARCHAR) + ' actualizado: ' + @NewURL;
END;
GO

-- Sincronizar todos los productos sin imagen
DECLARE @IdProducto INT;
DECLARE product_cursor CURSOR FOR
    SELECT IdProducto 
    FROM Productos 
    WHERE URLImagen IS NULL OR URLImagen = ''
    ORDER BY IdProducto;

OPEN product_cursor;
FETCH NEXT FROM product_cursor INTO @IdProducto;

WHILE @@FETCH_STATUS = 0
BEGIN
    EXEC sp_SyncProductImageToR2 @IdProducto;
    FETCH NEXT FROM product_cursor INTO @IdProducto;
END;

CLOSE product_cursor;
DEALLOCATE product_cursor;
```

#### 2. Trigger para Sincronización Automática

```sql
-- Crear trigger que actualice URLImagen automáticamente al insertar/actualizar

CREATE OR ALTER TRIGGER tr_AutoGenerateImageUrl
ON Productos
AFTER INSERT, UPDATE
AS
BEGIN
    UPDATE Productos
    SET 
        URLImagen = 'https://www.velykapet.com/productos/alimentos/' + 
                    LOWER(TipoMascota) + '/' +
                    UPPER(REPLACE(REPLACE(REPLACE(NombreBase, ' ', '_'), '''', ''), '.', '')) + 
                    '.jpg'
    FROM Productos p
    INNER JOIN inserted i ON p.IdProducto = i.IdProducto
    WHERE (i.URLImagen IS NULL OR i.URLImagen = '')
      AND i.NombreBase IS NOT NULL;
END;
GO
```

#### 3. Script de Subida Masiva a R2 (Wrangler CLI)

```bash
# Archivo: upload-images-to-r2.sh

#!/bin/bash

# Configuración
BUCKET_NAME="velykapet-products"
LOCAL_IMAGES_DIR="./product-images"

# Subir imágenes por categoría
echo "📦 Subiendo imágenes de perros..."
wrangler r2 object put ${BUCKET_NAME}/productos/alimentos/perros/ \
    --file ${LOCAL_IMAGES_DIR}/perros/* \
    --recursive

echo "📦 Subiendo imágenes de gatos..."
wrangler r2 object put ${BUCKET_NAME}/productos/alimentos/gatos/ \
    --file ${LOCAL_IMAGES_DIR}/gatos/* \
    --recursive

echo "✅ Subida completada"

# Listar objetos para verificar
wrangler r2 object list ${BUCKET_NAME} --prefix productos/alimentos/
```

#### 4. Script Node.js de Sincronización Bidireccional

```javascript
// sync-r2-database.js

const sql = require('mssql');
const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');

// Configurar cliente S3 para R2
const r2 = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
});

async function syncR2ToDatabase() {
    // 1. Listar todos los archivos en R2
    const command = new ListObjectsV2Command({
        Bucket: 'velykapet-products',
        Prefix: 'productos/',
    });
    
    const response = await r2.send(command);
    const imagesInR2 = response.Contents.map(obj => obj.Key);
    
    // 2. Obtener productos de la base de datos
    const pool = await sql.connect(config);
    const result = await pool.request().query(`
        SELECT IdProducto, NombreBase, TipoMascota, URLImagen
        FROM Productos
    `);
    
    // 3. Comparar y sincronizar
    for (const producto of result.recordset) {
        const expectedFileName = normalizeProductName(producto.NombreBase);
        const expectedPath = `productos/alimentos/${producto.TipoMascota.toLowerCase()}/${expectedFileName}`;
        
        if (imagesInR2.includes(expectedPath)) {
            // La imagen existe en R2, actualizar base de datos
            const url = `https://www.velykapet.com/${expectedPath}`;
            await pool.request()
                .input('IdProducto', sql.Int, producto.IdProducto)
                .input('URLImagen', sql.NVarChar, url)
                .query('UPDATE Productos SET URLImagen = @URLImagen WHERE IdProducto = @IdProducto');
            
            console.log(`✅ Actualizado: ${producto.NombreBase}`);
        } else {
            console.warn(`⚠️  Falta imagen: ${producto.NombreBase} (${expectedPath})`);
        }
    }
    
    await pool.close();
}

syncR2ToDatabase().catch(console.error);
```

---

## 🚨 Troubleshooting

### Problema 1: Imagen muestra 404 aunque la URL está correcta

**Síntomas:**
- La URL en la base de datos es correcta
- El navegador devuelve 404 Not Found

**Posibles causas:**

1. **Nombre de archivo no coincide exactamente**
   ```sql
   -- Verificar nombre exacto en DB
   SELECT URLImagen FROM Productos WHERE IdProducto = X;
   
   -- Verificar que coincida con R2 (case-sensitive)
   -- CORRECTO:   ROYAL_CANIN_ADULT.jpg
   -- INCORRECTO: royal_canin_adult.jpg
   -- INCORRECTO: Royal_Canin_Adult.jpg
   ```

2. **Archivo no está en R2**
   ```bash
   # Listar archivos en R2
   wrangler r2 object list velykapet-products --prefix productos/
   
   # Subir archivo faltante
   wrangler r2 object put velykapet-products/productos/alimentos/perros/ROYAL_CANIN_ADULT.jpg \
       --file ./local-images/royal-canin-adult.jpg
   ```

3. **Permisos del bucket**
   - Verificar que el bucket tenga acceso público configurado
   - Revisar configuración de CORS

### Problema 2: Algunos productos no se actualizaron

**Diagnóstico:**

```sql
-- Ver productos que no se actualizaron
SELECT 
    IdProducto,
    NombreBase,
    URLImagen,
    CASE 
        WHEN URLImagen IS NULL THEN 'NULL'
        WHEN URLImagen = '' THEN 'Cadena vacía'
        WHEN URLImagen LIKE '/images/%' THEN 'Ruta relativa vieja'
        WHEN URLImagen NOT LIKE 'https://www.velykapet.com/%' THEN 'URL incorrecta'
        ELSE 'OK'
    END AS Problema
FROM Productos
WHERE URLImagen NOT LIKE 'https://www.velykapet.com/%'
   OR URLImagen IS NULL
   OR URLImagen = '';
```

**Solución:**

```sql
-- Re-ejecutar migración solo para productos problemáticos
UPDATE Productos
SET URLImagen = 'https://www.velykapet.com/productos/alimentos/' +
                LOWER(TipoMascota) + '/' +
                UPPER(REPLACE(REPLACE(REPLACE(NombreBase, ' ', '_'), '''', ''), '.', '')) + '.jpg'
WHERE IdProducto IN (1, 5, 12); -- IDs específicos
```

### Problema 3: URLs duplicadas

**Diagnóstico:**

```sql
-- Encontrar URLs duplicadas
SELECT 
    URLImagen,
    COUNT(*) AS Productos,
    STRING_AGG(CAST(IdProducto AS VARCHAR), ', ') AS IDs
FROM Productos
WHERE URLImagen IS NOT NULL
GROUP BY URLImagen
HAVING COUNT(*) > 1;
```

**Solución:**

1. Revisar si los productos realmente deberían compartir imagen
2. Si no, renombrar uno de ellos agregando sufijo único:

```sql
UPDATE Productos
SET URLImagen = REPLACE(URLImagen, '.jpg', '_V2.jpg')
WHERE IdProducto = 5;  -- El producto duplicado
```

---

## ✅ Checklist de Migración

### Antes de la Migración

- [ ] Hacer backup completo de la base de datos
- [ ] Verificar que tienes acceso a Cloudflare R2
- [ ] Revisar cuántos productos necesitan migración
- [ ] Preparar las imágenes localmente con nombres normalizados
- [ ] Documentar cualquier excepción o caso especial

### Durante la Migración

- [ ] Ejecutar script en modo DRY RUN primero
- [ ] Revisar preview de cambios
- [ ] Ejecutar script de migración real
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
- [ ] Programar sincronización periódica

### Validación Final

- [ ] Todos los productos activos tienen `URLImagen` no nulo
- [ ] 100% de URLs comienzan con `https://www.velykapet.com/`
- [ ] Validación HTTP muestra >95% de éxito
- [ ] No hay URLs duplicadas (o están justificadas)
- [ ] Frontend muestra imágenes correctamente
- [ ] No hay errores 404 en Network tab

---

## 📊 Métricas de Éxito

### KPIs Recomendados

| Métrica | Objetivo | Crítico si |
|---------|----------|------------|
| Productos con imagen | >95% | <80% |
| URLs válidas (formato) | 100% | <100% |
| Imágenes accesibles (HTTP 200) | >95% | <80% |
| Tiempo de carga promedio | <500ms | >2s |
| Errores 404 | 0 | >5% |

### Query de Monitoreo

```sql
-- Dashboard de salud de imágenes
SELECT 
    COUNT(*) AS TotalProductos,
    SUM(CASE WHEN URLImagen LIKE 'https://www.velykapet.com/%' THEN 1 ELSE 0 END) AS ConR2,
    SUM(CASE WHEN URLImagen IS NULL OR URLImagen = '' THEN 1 ELSE 0 END) AS SinImagen,
    CAST(SUM(CASE WHEN URLImagen LIKE 'https://www.velykapet.com/%' THEN 1 ELSE 0 END) * 100.0 / 
         COUNT(*) AS DECIMAL(5,2)) AS PorcentajeR2
FROM Productos
WHERE Activo = 1;
```

---

## 📞 Soporte y Recursos

### Scripts Incluidos

| Script | Propósito | Uso |
|--------|-----------|-----|
| `MigrateImagenesToCloudflareR2.sql` | Migración masiva | Ejecutar una vez |
| `ValidateR2ImageUrls.sql` | Validación de formato | Ejecutar después de migración |
| `ValidateR2ImagesHttp.ps1` | Validación HTTP (Windows) | Ejecutar periódicamente |
| `validate-r2-images.js` | Validación HTTP (Node.js) | Alternativa multiplataforma |

### Comandos Útiles

```bash
# SQL Server
sqlcmd -S localhost -d VentasPet_Nueva -E -i script.sql

# Cloudflare Wrangler
wrangler r2 object list velykapet-products
wrangler r2 object put velykapet-products/path/file.jpg --file local-file.jpg
wrangler r2 object get velykapet-products/path/file.jpg --file downloaded.jpg

# Node.js
node validate-r2-images.js --export-json
```

---

## 📝 Notas Finales

### Recomendaciones Clave

1. **Consistencia es crítica:** Usar siempre la misma convención de nombres
2. **Validar antes de producción:** No confiar solo en el script, validar HTTP
3. **Monitoreo continuo:** Programar validaciones periódicas
4. **Documentar excepciones:** Si un producto necesita tratamiento especial, documentarlo
5. **Backup siempre:** Nunca modificar producción sin backup

### Mantenimiento Preventivo

- **Semanal:** Validar URLs de productos nuevos
- **Mensual:** Ejecutar validación HTTP completa
- **Trimestral:** Revisar y optimizar imágenes (tamaño, formato)
- **Anual:** Auditar estructura completa de R2

---

**Última actualización:** Enero 2025  
**Versión:** 1.0  
**Autor:** GitHub Copilot Agent  
**Licencia:** Uso interno VelyKapet E-commerce
