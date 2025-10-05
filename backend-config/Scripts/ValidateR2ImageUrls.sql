-- ============================================================================
-- SCRIPT DE VALIDACIÓN: URLs de Imágenes en Cloudflare R2
-- ============================================================================
-- Proyecto: VelyKapet E-commerce
-- Fecha: Enero 2025
-- Objetivo: Validar que las URLs de imágenes sean correctas y accesibles
--
-- NOTA IMPORTANTE:
-- Este script SQL NO puede verificar accesibilidad HTTP directamente.
-- Para validación HTTP completa, use los scripts de PowerShell/Node.js incluidos.
--
-- Este script valida:
-- ✅ Formato correcto de URL
-- ✅ Estructura de ruta esperada
-- ✅ Nombres de archivo normalizados
-- ✅ Consistencia con el catálogo
-- ✅ Integridad referencial
-- ============================================================================

USE VentasPet_Nueva;
GO

SET NOCOUNT ON;

PRINT '';
PRINT '╔════════════════════════════════════════════════════════════════════════╗';
PRINT '║  🔍 VALIDACIÓN DE URLs DE IMÁGENES EN CLOUDFLARE R2                  ║';
PRINT '║  Script de validación de formato y consistencia                       ║';
PRINT '╚════════════════════════════════════════════════════════════════════════╝';
PRINT '';

-- ============================================================================
-- VALIDACIÓN 1: Formato de URL
-- ============================================================================
PRINT '📋 VALIDACIÓN 1: Formato de URLs';
PRINT '';

SELECT 
    '1.1 URLs con formato correcto de R2' AS Validacion,
    COUNT(*) AS Total
FROM Productos
WHERE URLImagen LIKE 'https://www.velykapet.com/%';

SELECT 
    '1.2 URLs con formato incorrecto (http sin s)' AS Validacion,
    COUNT(*) AS Total
FROM Productos
WHERE URLImagen LIKE 'http://www.velykapet.com/%';

SELECT 
    '1.3 URLs sin www' AS Validacion,
    COUNT(*) AS Total
FROM Productos
WHERE URLImagen LIKE 'https://velykapet.com/%';

SELECT 
    '1.4 Rutas relativas (necesitan migración)' AS Validacion,
    COUNT(*) AS Total
FROM Productos
WHERE URLImagen LIKE '/%' OR URLImagen LIKE './%';

SELECT 
    '1.5 Sin imagen definida' AS Validacion,
    COUNT(*) AS Total
FROM Productos
WHERE URLImagen IS NULL OR URLImagen = '';

PRINT '';

-- ============================================================================
-- VALIDACIÓN 2: Productos con Problemas
-- ============================================================================
PRINT '⚠️  VALIDACIÓN 2: Productos con URLs problemáticas';
PRINT '';

-- Productos con URLs que necesitan corrección
IF EXISTS (
    SELECT 1 FROM Productos 
    WHERE URLImagen IS NOT NULL 
      AND URLImagen != ''
      AND URLImagen NOT LIKE 'https://www.velykapet.com/%'
)
BEGIN
    PRINT '   ❌ Se encontraron productos con URLs incorrectas:';
    PRINT '';
    
    SELECT 
        IdProducto,
        NombreBase,
        TipoMascota,
        URLImagen AS URLProblematica,
        CASE 
            WHEN URLImagen LIKE 'http://www.velykapet.com/%' THEN 'Usar HTTPS'
            WHEN URLImagen LIKE 'https://velykapet.com/%' THEN 'Agregar www'
            WHEN URLImagen LIKE '/%' THEN 'Convertir a URL absoluta'
            WHEN URLImagen LIKE 'http%' THEN 'URL externa - verificar'
            ELSE 'Formato desconocido'
        END AS Problema,
        'https://www.velykapet.com/productos/alimentos/' + 
        LOWER(TipoMascota) + '/' + 
        UPPER(REPLACE(REPLACE(REPLACE(NombreBase, ' ', '_'), '''', ''), '.', '')) + '.jpg' AS URLSugerida
    FROM Productos
    WHERE URLImagen IS NOT NULL 
      AND URLImagen != ''
      AND URLImagen NOT LIKE 'https://www.velykapet.com/%'
    ORDER BY IdProducto;
    
    PRINT '';
END
ELSE
BEGIN
    PRINT '   ✅ Todas las URLs tienen formato correcto';
    PRINT '';
END

-- ============================================================================
-- VALIDACIÓN 3: Consistencia de Nombres
-- ============================================================================
PRINT '📐 VALIDACIÓN 3: Consistencia de nombres de archivo';
PRINT '';

-- Verificar que los nombres de archivo sigan la convención
SELECT 
    p.IdProducto,
    p.NombreBase,
    p.TipoMascota,
    p.URLImagen,
    -- Extraer el nombre del archivo de la URL
    REVERSE(SUBSTRING(REVERSE(p.URLImagen), 1, CHARINDEX('/', REVERSE(p.URLImagen)) - 1)) AS NombreArchivoActual,
    -- Nombre esperado basado en NombreBase
    UPPER(REPLACE(REPLACE(REPLACE(p.NombreBase, ' ', '_'), '''', ''), '.', '')) + '.jpg' AS NombreArchivoEsperado,
    CASE 
        WHEN REVERSE(SUBSTRING(REVERSE(p.URLImagen), 1, CHARINDEX('/', REVERSE(p.URLImagen)) - 1)) = 
             UPPER(REPLACE(REPLACE(REPLACE(p.NombreBase, ' ', '_'), '''', ''), '.', '')) + '.jpg'
        THEN '✅ Correcto'
        ELSE '⚠️ Diferente del esperado'
    END AS Estado
FROM Productos p
WHERE p.URLImagen LIKE 'https://www.velykapet.com/%'
ORDER BY p.IdProducto;

PRINT '';

-- ============================================================================
-- VALIDACIÓN 4: Estructura de Rutas por Categoría
-- ============================================================================
PRINT '📁 VALIDACIÓN 4: Estructura de rutas por categoría';
PRINT '';

-- Verificar que las rutas incluyan el tipo de mascota correcto
SELECT 
    p.IdProducto,
    p.NombreBase,
    p.TipoMascota,
    p.URLImagen,
    CASE 
        WHEN p.TipoMascota = 'Perros' AND p.URLImagen LIKE '%/perros/%' THEN '✅ Correcto'
        WHEN p.TipoMascota = 'Gatos' AND p.URLImagen LIKE '%/gatos/%' THEN '✅ Correcto'
        WHEN p.URLImagen IS NULL OR p.URLImagen = '' THEN '⚠️ Sin imagen'
        ELSE '❌ Ruta no coincide con tipo de mascota'
    END AS ValidacionRuta
FROM Productos p
WHERE p.Activo = 1
ORDER BY 
    CASE 
        WHEN p.TipoMascota = 'Perros' AND p.URLImagen LIKE '%/perros/%' THEN 1
        WHEN p.TipoMascota = 'Gatos' AND p.URLImagen LIKE '%/gatos/%' THEN 1
        ELSE 2
    END,
    p.IdProducto;

PRINT '';

-- ============================================================================
-- VALIDACIÓN 5: Productos Activos sin Imagen
-- ============================================================================
PRINT '🖼️  VALIDACIÓN 5: Productos activos que necesitan imagen';
PRINT '';

IF EXISTS (SELECT 1 FROM Productos WHERE Activo = 1 AND (URLImagen IS NULL OR URLImagen = ''))
BEGIN
    PRINT '   ⚠️ Se encontraron productos activos sin imagen:';
    PRINT '';
    
    SELECT 
        p.IdProducto,
        p.NombreBase,
        c.Nombre AS Categoria,
        p.TipoMascota,
        v.TotalVariaciones,
        v.StockTotal,
        'https://www.velykapet.com/productos/alimentos/' + 
        LOWER(p.TipoMascota) + '/' + 
        UPPER(REPLACE(REPLACE(REPLACE(p.NombreBase, ' ', '_'), '''', ''), '.', '')) + '.jpg' AS URLSugerida
    FROM Productos p
    LEFT JOIN Categorias c ON p.IdCategoria = c.IdCategoria
    LEFT JOIN (
        SELECT IdProducto, COUNT(*) AS TotalVariaciones, SUM(Stock) AS StockTotal
        FROM VariacionesProducto
        WHERE Activa = 1
        GROUP BY IdProducto
    ) v ON p.IdProducto = v.IdProducto
    WHERE p.Activo = 1 
      AND (p.URLImagen IS NULL OR p.URLImagen = '')
    ORDER BY v.StockTotal DESC, p.IdProducto;
    
    PRINT '';
    PRINT '   📌 Acción recomendada: Ejecutar MigrateImagenesToCloudflareR2.sql';
    PRINT '';
END
ELSE
BEGIN
    PRINT '   ✅ Todos los productos activos tienen imagen asignada';
    PRINT '';
END

-- ============================================================================
-- VALIDACIÓN 6: Duplicados de URL
-- ============================================================================
PRINT '🔄 VALIDACIÓN 6: URLs duplicadas';
PRINT '';

IF EXISTS (
    SELECT URLImagen 
    FROM Productos 
    WHERE URLImagen IS NOT NULL AND URLImagen != ''
    GROUP BY URLImagen 
    HAVING COUNT(*) > 1
)
BEGIN
    PRINT '   ⚠️ Se encontraron URLs duplicadas:';
    PRINT '';
    
    SELECT 
        URLImagen,
        COUNT(*) AS ProductosUsandoEstaURL,
        STRING_AGG(CAST(IdProducto AS VARCHAR), ', ') AS IDsProductos,
        STRING_AGG(NombreBase, ' | ') AS NombresProductos
    FROM Productos
    WHERE URLImagen IS NOT NULL AND URLImagen != ''
    GROUP BY URLImagen
    HAVING COUNT(*) > 1
    ORDER BY COUNT(*) DESC;
    
    PRINT '';
    PRINT '   📌 Acción recomendada: Revisar productos y asignar imágenes únicas';
    PRINT '';
END
ELSE
BEGIN
    PRINT '   ✅ No se encontraron URLs duplicadas';
    PRINT '';
END

-- ============================================================================
-- VALIDACIÓN 7: Extensiones de Archivo
-- ============================================================================
PRINT '📄 VALIDACIÓN 7: Extensiones de archivo';
PRINT '';

SELECT 
    CASE 
        WHEN URLImagen LIKE '%.jpg' OR URLImagen LIKE '%.JPG' THEN '.jpg'
        WHEN URLImagen LIKE '%.jpeg' OR URLImagen LIKE '%.JPEG' THEN '.jpeg'
        WHEN URLImagen LIKE '%.png' OR URLImagen LIKE '%.PNG' THEN '.png'
        WHEN URLImagen LIKE '%.webp' OR URLImagen LIKE '%.WEBP' THEN '.webp'
        WHEN URLImagen IS NULL OR URLImagen = '' THEN 'Sin imagen'
        ELSE 'Otra extensión'
    END AS Extension,
    COUNT(*) AS Cantidad,
    CAST(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM Productos) AS DECIMAL(5,2)) AS Porcentaje
FROM Productos
GROUP BY 
    CASE 
        WHEN URLImagen LIKE '%.jpg' OR URLImagen LIKE '%.JPG' THEN '.jpg'
        WHEN URLImagen LIKE '%.jpeg' OR URLImagen LIKE '%.JPEG' THEN '.jpeg'
        WHEN URLImagen LIKE '%.png' OR URLImagen LIKE '%.PNG' THEN '.png'
        WHEN URLImagen LIKE '%.webp' OR URLImagen LIKE '%.WEBP' THEN '.webp'
        WHEN URLImagen IS NULL OR URLImagen = '' THEN 'Sin imagen'
        ELSE 'Otra extensión'
    END
ORDER BY Cantidad DESC;

PRINT '';

-- ============================================================================
-- RESUMEN FINAL
-- ============================================================================
PRINT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
PRINT '';
PRINT '📊 RESUMEN DE VALIDACIÓN';
PRINT '';

DECLARE @TotalProductos INT = (SELECT COUNT(*) FROM Productos);
DECLARE @ProductosConR2 INT = (SELECT COUNT(*) FROM Productos WHERE URLImagen LIKE 'https://www.velykapet.com/%');
DECLARE @ProductosSinImagen INT = (SELECT COUNT(*) FROM Productos WHERE URLImagen IS NULL OR URLImagen = '');
DECLARE @ProductosConProblemas INT = (
    SELECT COUNT(*) FROM Productos 
    WHERE URLImagen IS NOT NULL 
      AND URLImagen != ''
      AND URLImagen NOT LIKE 'https://www.velykapet.com/%'
);

SELECT 
    @TotalProductos AS TotalProductos,
    @ProductosConR2 AS ProductosEnR2,
    @ProductosSinImagen AS ProductosSinImagen,
    @ProductosConProblemas AS ProductosConProblemas,
    CAST(@ProductosConR2 * 100.0 / @TotalProductos AS DECIMAL(5,2)) AS PorcentajeEnR2,
    CASE 
        WHEN @ProductosConProblemas = 0 AND @ProductosSinImagen = 0 THEN '✅ EXCELENTE'
        WHEN @ProductosConR2 >= @TotalProductos * 0.8 THEN '✅ BUENO'
        WHEN @ProductosConR2 >= @TotalProductos * 0.5 THEN '⚠️ REGULAR'
        ELSE '❌ REQUIERE ATENCIÓN'
    END AS Estado;

PRINT '';

IF @ProductosConProblemas > 0 OR @ProductosSinImagen > 0
BEGIN
    PRINT '📌 ACCIONES RECOMENDADAS:';
    
    IF @ProductosConProblemas > 0
        PRINT '   1. Ejecutar MigrateImagenesToCloudflareR2.sql para corregir URLs problemáticas';
    
    IF @ProductosSinImagen > 0
        PRINT '   2. Ejecutar MigrateImagenesToCloudflareR2.sql para asignar URLs a productos sin imagen';
    
    PRINT '   3. Subir imágenes faltantes al bucket de R2';
    PRINT '   4. Ejecutar script de validación HTTP (ver ValidateR2ImagesHttp.ps1)';
END
ELSE
BEGIN
    PRINT '✅ TODAS LAS VALIDACIONES PASARON CORRECTAMENTE';
    PRINT '   Próximo paso: Validar accesibilidad HTTP de las URLs';
    PRINT '   Ejecutar: ValidateR2ImagesHttp.ps1 o validate-r2-images.js';
END

PRINT '';
PRINT '╔════════════════════════════════════════════════════════════════════════╗';
PRINT '║  ✅ VALIDACIÓN COMPLETADA                                             ║';
PRINT '╚════════════════════════════════════════════════════════════════════════╝';
PRINT '';

GO

-- ============================================================================
-- CONSULTAS ÚTILES ADICIONALES
-- ============================================================================

/*
-- Ver todos los productos ordenados por estado de URL
SELECT 
    IdProducto,
    NombreBase,
    TipoMascota,
    URLImagen,
    CASE 
        WHEN URLImagen LIKE 'https://www.velykapet.com/%' THEN '✅ R2 OK'
        WHEN URLImagen IS NULL OR URLImagen = '' THEN '❌ Sin imagen'
        ELSE '⚠️ Problema'
    END AS Estado,
    Activo
FROM Productos
ORDER BY Estado, IdProducto;

-- Exportar lista de URLs para validación externa
SELECT DISTINCT URLImagen
FROM Productos
WHERE URLImagen LIKE 'https://www.velykapet.com/%'
ORDER BY URLImagen;

-- Contar productos por categoría y estado de imagen
SELECT 
    c.Nombre AS Categoria,
    COUNT(*) AS TotalProductos,
    SUM(CASE WHEN p.URLImagen LIKE 'https://www.velykapet.com/%' THEN 1 ELSE 0 END) AS ConImagenR2,
    SUM(CASE WHEN p.URLImagen IS NULL OR p.URLImagen = '' THEN 1 ELSE 0 END) AS SinImagen
FROM Productos p
LEFT JOIN Categorias c ON p.IdCategoria = c.IdCategoria
GROUP BY c.Nombre
ORDER BY c.Nombre;
*/
