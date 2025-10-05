-- ============================================================================
-- SCRIPT DE MIGRACIÓN: Actualización Masiva de Imágenes a Cloudflare R2
-- ============================================================================
-- Proyecto: VelyKapet E-commerce
-- Fecha: Enero 2025
-- Objetivo: Migrar rutas relativas antiguas a URLs públicas de Cloudflare R2
--
-- PROBLEMA RESUELTO:
-- - Productos muestran placeholders porque URLImagen tiene rutas relativas
--   viejas (ej: /images/productos/royal-canin-adult.jpg)
-- - Se necesita actualizar a URLs públicas de R2
--   (ej: https://www.velykapet.com/productos/alimentos/perros/ROYAL_CANIN_ADULT.jpg)
--
-- CARACTERÍSTICAS:
-- ✅ Actualización masiva con validación
-- ✅ Normalización automática de nombres (espacios → guiones bajos, uppercase)
-- ✅ Backup automático antes de actualizar
-- ✅ Categorización por tipo de mascota
-- ✅ Rollback seguro incluido
-- ✅ Validación post-migración
-- ============================================================================

USE VentasPet_Nueva;
GO

SET NOCOUNT ON;

PRINT '';
PRINT '╔════════════════════════════════════════════════════════════════════════╗';
PRINT '║  🚀 MIGRACIÓN DE IMÁGENES A CLOUDFLARE R2                             ║';
PRINT '║  Script de actualización masiva con backup y validación               ║';
PRINT '╚════════════════════════════════════════════════════════════════════════╝';
PRINT '';

-- ============================================================================
-- CONFIGURACIÓN
-- ============================================================================
DECLARE @DryRun BIT = 0;  -- Cambiar a 1 para modo prueba (no actualiza)
DECLARE @BaseUrl NVARCHAR(500) = 'https://www.velykapet.com';
DECLARE @BackupTable NVARCHAR(200) = 'Productos_Backup_' + CONVERT(VARCHAR(8), GETDATE(), 112) + '_' + REPLACE(CONVERT(VARCHAR(8), GETDATE(), 108), ':', '');

PRINT '⚙️  CONFIGURACIÓN:';
PRINT '   - Modo: ' + CASE WHEN @DryRun = 1 THEN 'DRY RUN (solo vista previa)' ELSE 'ACTUALIZACIÓN REAL' END;
PRINT '   - URL Base R2: ' + @BaseUrl;
PRINT '   - Tabla Backup: ' + @BackupTable;
PRINT '';

-- ============================================================================
-- PASO 1: CREAR TABLA DE BACKUP
-- ============================================================================
PRINT '📦 PASO 1: Creando backup de tabla Productos...';

BEGIN TRY
    -- Crear tabla de backup con timestamp
    DECLARE @BackupSQL NVARCHAR(MAX) = 
        'SELECT * INTO ' + @BackupTable + ' FROM Productos;';
    
    EXEC sp_executesql @BackupSQL;
    
    DECLARE @BackupCount INT;
    DECLARE @CountSQL NVARCHAR(MAX) = 
        'SELECT @Count = COUNT(*) FROM ' + @BackupTable;
    
    EXEC sp_executesql @CountSQL, N'@Count INT OUTPUT', @Count = @BackupCount OUTPUT;
    
    PRINT '   ✅ Backup creado exitosamente: ' + @BackupTable;
    PRINT '   ✅ ' + CAST(@BackupCount AS VARCHAR(10)) + ' registros respaldados';
    PRINT '';
END TRY
BEGIN CATCH
    PRINT '   ❌ ERROR al crear backup: ' + ERROR_MESSAGE();
    PRINT '';
    RETURN;
END CATCH

-- ============================================================================
-- PASO 2: ANÁLISIS DE ESTADO ACTUAL
-- ============================================================================
PRINT '🔍 PASO 2: Analizando estado actual de las imágenes...';
PRINT '';

-- Análisis detallado por tipo de URL
SELECT 
    CASE 
        WHEN URLImagen LIKE 'https://www.velykapet.com/%' THEN '✅ Ya en Cloudflare R2'
        WHEN URLImagen LIKE '/images/productos/%' THEN '🔄 Ruta relativa (requiere migración)'
        WHEN URLImagen LIKE 'http%' THEN '⚠️  Otra URL externa'
        WHEN URLImagen IS NULL OR URLImagen = '' THEN '❌ Sin imagen'
        ELSE '🔍 Formato desconocido'
    END AS Estado,
    COUNT(*) AS Cantidad,
    CAST(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM Productos) AS DECIMAL(5,2)) AS Porcentaje
FROM Productos
GROUP BY 
    CASE 
        WHEN URLImagen LIKE 'https://www.velykapet.com/%' THEN '✅ Ya en Cloudflare R2'
        WHEN URLImagen LIKE '/images/productos/%' THEN '🔄 Ruta relativa (requiere migración)'
        WHEN URLImagen LIKE 'http%' THEN '⚠️  Otra URL externa'
        WHEN URLImagen IS NULL OR URLImagen = '' THEN '❌ Sin imagen'
        ELSE '🔍 Formato desconocido'
    END
ORDER BY Cantidad DESC;

PRINT '';

-- Mostrar productos que necesitan migración
PRINT '📋 Productos que requieren migración:';
PRINT '';

SELECT 
    IdProducto,
    NombreBase,
    TipoMascota,
    URLImagen AS URLActual,
    CASE 
        WHEN TipoMascota = 'Perros' THEN @BaseUrl + '/productos/alimentos/perros/'
        WHEN TipoMascota = 'Gatos' THEN @BaseUrl + '/productos/alimentos/gatos/'
        ELSE @BaseUrl + '/productos/otros/'
    END + UPPER(REPLACE(REPLACE(REPLACE(NombreBase, ' ', '_'), '''', ''), '.', '')) + '.jpg' AS URLNueva
FROM Productos
WHERE URLImagen LIKE '/images/productos/%' 
   OR URLImagen IS NULL 
   OR URLImagen = ''
ORDER BY IdProducto;

PRINT '';
PRINT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
PRINT '';

-- ============================================================================
-- PASO 3: ACTUALIZACIÓN MASIVA
-- ============================================================================

IF @DryRun = 0
BEGIN
    PRINT '🔄 PASO 3: Actualizando URLs de imágenes...';
    PRINT '';
    
    BEGIN TRANSACTION;
    
    BEGIN TRY
        -- ====================================================================
        -- Estrategia 1: Actualizar rutas relativas viejas
        -- Patrón: /images/productos/*.jpg → https://www.velykapet.com/productos/alimentos/{tipo}/{NOMBRE_NORMALIZADO}.jpg
        -- ====================================================================
        
        UPDATE Productos
        SET 
            URLImagen = CASE 
                WHEN TipoMascota = 'Perros' THEN @BaseUrl + '/productos/alimentos/perros/'
                WHEN TipoMascota = 'Gatos' THEN @BaseUrl + '/productos/alimentos/gatos/'
                ELSE @BaseUrl + '/productos/otros/'
            END + UPPER(REPLACE(REPLACE(REPLACE(NombreBase, ' ', '_'), '''', ''), '.', '')) + '.jpg',
            FechaActualizacion = GETDATE()
        WHERE URLImagen LIKE '/images/productos/%';
        
        DECLARE @UpdatedOldPaths INT = @@ROWCOUNT;
        
        -- ====================================================================
        -- Estrategia 2: Actualizar productos sin imagen
        -- Asignar URL basada en el nombre del producto normalizado
        -- ====================================================================
        
        UPDATE Productos
        SET 
            URLImagen = CASE 
                WHEN TipoMascota = 'Perros' THEN @BaseUrl + '/productos/alimentos/perros/'
                WHEN TipoMascota = 'Gatos' THEN @BaseUrl + '/productos/alimentos/gatos/'
                ELSE @BaseUrl + '/productos/otros/'
            END + UPPER(REPLACE(REPLACE(REPLACE(NombreBase, ' ', '_'), '''', ''), '.', '')) + '.jpg',
            FechaActualizacion = GETDATE()
        WHERE (URLImagen IS NULL OR URLImagen = '')
          AND Activo = 1;  -- Solo productos activos
        
        DECLARE @UpdatedNullImages INT = @@ROWCOUNT;
        
        -- ====================================================================
        -- Estrategia 3: Normalizar URLs que ya apuntan a R2 pero con formato incorrecto
        -- Ejemplo: http://velykapet.com → https://www.velykapet.com
        -- ====================================================================
        
        UPDATE Productos
        SET 
            URLImagen = REPLACE(REPLACE(URLImagen, 'http://', 'https://'), 'velykapet.com', 'www.velykapet.com'),
            FechaActualizacion = GETDATE()
        WHERE URLImagen LIKE '%velykapet.com%'
          AND URLImagen NOT LIKE 'https://www.velykapet.com/%';
        
        DECLARE @NormalizedUrls INT = @@ROWCOUNT;
        
        COMMIT TRANSACTION;
        
        PRINT '   ✅ Actualización completada exitosamente:';
        PRINT '      - Rutas relativas migradas: ' + CAST(@UpdatedOldPaths AS VARCHAR(10));
        PRINT '      - Productos sin imagen actualizados: ' + CAST(@UpdatedNullImages AS VARCHAR(10));
        PRINT '      - URLs normalizadas: ' + CAST(@NormalizedUrls AS VARCHAR(10));
        PRINT '      - Total actualizado: ' + CAST(@UpdatedOldPaths + @UpdatedNullImages + @NormalizedUrls AS VARCHAR(10));
        PRINT '';
        
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        PRINT '   ❌ ERROR durante la actualización: ' + ERROR_MESSAGE();
        PRINT '   ℹ️  Se ejecutó ROLLBACK. No se realizaron cambios.';
        PRINT '';
        RETURN;
    END CATCH
END
ELSE
BEGIN
    PRINT '🔍 PASO 3: MODO DRY RUN - Vista previa de cambios (no se guardará nada)';
    PRINT '';
    PRINT '   Los siguientes productos serían actualizados:';
    PRINT '';
    
    -- Mostrar preview de cambios
    SELECT 
        IdProducto,
        NombreBase,
        TipoMascota,
        URLImagen AS URLActual,
        CASE 
            WHEN TipoMascota = 'Perros' THEN @BaseUrl + '/productos/alimentos/perros/'
            WHEN TipoMascota = 'Gatos' THEN @BaseUrl + '/productos/alimentos/gatos/'
            ELSE @BaseUrl + '/productos/otros/'
        END + UPPER(REPLACE(REPLACE(REPLACE(NombreBase, ' ', '_'), '''', ''), '.', '')) + '.jpg' AS URLNueva,
        'Migración necesaria' AS Accion
    FROM Productos
    WHERE URLImagen LIKE '/images/productos/%' 
       OR URLImagen IS NULL 
       OR URLImagen = ''
       OR (URLImagen LIKE '%velykapet.com%' AND URLImagen NOT LIKE 'https://www.velykapet.com/%')
    ORDER BY IdProducto;
    
    PRINT '';
    PRINT '   ℹ️  Para ejecutar la actualización real, cambiar @DryRun = 0 al inicio del script';
    PRINT '';
END

-- ============================================================================
-- PASO 4: VALIDACIÓN POST-MIGRACIÓN
-- ============================================================================
PRINT '✅ PASO 4: Validación post-migración';
PRINT '';

-- Resumen final
SELECT 
    '📊 RESUMEN FINAL' AS Categoria,
    COUNT(*) AS TotalProductos,
    SUM(CASE WHEN URLImagen LIKE 'https://www.velykapet.com/%' THEN 1 ELSE 0 END) AS ProductosEnR2,
    SUM(CASE WHEN URLImagen IS NULL OR URLImagen = '' THEN 1 ELSE 0 END) AS ProductosSinImagen,
    SUM(CASE WHEN URLImagen LIKE '/images/%' THEN 1 ELSE 0 END) AS ProductosConRutaRelativa,
    CAST(SUM(CASE WHEN URLImagen LIKE 'https://www.velykapet.com/%' THEN 1 ELSE 0 END) * 100.0 / COUNT(*) AS DECIMAL(5,2)) AS PorcentajeMigrado
FROM Productos;

PRINT '';

-- Listado completo de productos con sus URLs finales
PRINT '📋 Listado completo de productos:';
PRINT '';

SELECT 
    p.IdProducto,
    p.NombreBase,
    c.Nombre AS Categoria,
    p.TipoMascota,
    p.URLImagen,
    CASE 
        WHEN p.URLImagen LIKE 'https://www.velykapet.com/%' THEN '✅ R2'
        WHEN p.URLImagen LIKE '/images/%' THEN '⚠️ Relativa'
        WHEN p.URLImagen IS NULL OR p.URLImagen = '' THEN '❌ Vacía'
        ELSE '🔍 Otra'
    END AS Estado,
    p.Activo
FROM Productos p
LEFT JOIN Categorias c ON p.IdCategoria = c.IdCategoria
ORDER BY 
    CASE 
        WHEN p.URLImagen LIKE 'https://www.velykapet.com/%' THEN 1
        WHEN p.URLImagen LIKE '/images/%' THEN 2
        WHEN p.URLImagen IS NULL OR p.URLImagen = '' THEN 3
        ELSE 4
    END,
    p.IdProducto;

PRINT '';
PRINT '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
PRINT '';
PRINT '✅ MIGRACIÓN COMPLETADA';
PRINT '';
PRINT '📌 PRÓXIMOS PASOS:';
PRINT '   1. Verificar que las imágenes existen en R2 con los nombres generados';
PRINT '   2. Subir imágenes faltantes al bucket de R2';
PRINT '   3. Probar acceso a las URLs en el navegador';
PRINT '   4. Ejecutar script de validación: ValidateR2ImageUrls.sql';
PRINT '';
PRINT '💾 BACKUP DISPONIBLE EN: ' + @BackupTable;
PRINT '   Para restaurar: SELECT * INTO Productos_Restored FROM ' + @BackupTable;
PRINT '';
PRINT '╔════════════════════════════════════════════════════════════════════════╗';
PRINT '║  ✅ PROCESO FINALIZADO EXITOSAMENTE                                   ║';
PRINT '╚════════════════════════════════════════════════════════════════════════╝';
PRINT '';

GO

-- ============================================================================
-- SCRIPT ADICIONAL: ACTUALIZACIÓN MANUAL INDIVIDUAL
-- ============================================================================
-- Use este bloque para actualizar productos individuales manualmente
-- (descomente y modifique según sea necesario)

/*
-- Actualizar un producto específico
UPDATE Productos 
SET 
    URLImagen = 'https://www.velykapet.com/productos/alimentos/gatos/NOMBRE_EXACTO_EN_R2.jpg',
    FechaActualizacion = GETDATE()
WHERE IdProducto = 1;

-- Actualizar múltiples productos con patrón
UPDATE Productos 
SET 
    URLImagen = REPLACE(URLImagen, 'old-pattern', 'new-pattern'),
    FechaActualizacion = GETDATE()
WHERE URLImagen LIKE '%old-pattern%';

-- Verificar cambio
SELECT IdProducto, NombreBase, URLImagen 
FROM Productos 
WHERE IdProducto = 1;
*/

GO
