-- ============================================================================
-- Script SQL para limpiar productos de prueba
-- ============================================================================
-- Este script elimina productos que fueron importados desde CSV de prueba,
-- incluyendo sus variaciones y respetando las restricciones de integridad
-- referencial.
--
-- IMPORTANTE: 
--   - Este script debe ejecutarse en SQL Server Management Studio o similar
--   - Las variaciones deben eliminarse ANTES que los productos
--   - Verifique los productos a eliminar antes de ejecutar
-- ============================================================================

-- Mostrar banner
PRINT '╔════════════════════════════════════════════════════════════════════════╗';
PRINT '║         LIMPIEZA DE PRODUCTOS DE PRUEBA - VelyKapet                   ║';
PRINT '╚════════════════════════════════════════════════════════════════════════╝';
PRINT '';
PRINT '⚠️  ADVERTENCIA: Este script eliminará productos de la base de datos';
PRINT '';

-- ============================================================================
-- VERIFICAR PRODUCTOS A ELIMINAR
-- ============================================================================
PRINT '🔍 Productos que serán eliminados:';
PRINT '';

SELECT 
    p.IdProducto,
    p.NombreBase,
    COUNT(v.IdVariacion) AS 'Variaciones'
FROM Productos p
LEFT JOIN VariacionesProducto v ON p.IdProducto = v.IdProducto
WHERE p.NombreBase LIKE '%BR FOR CAT VET CONTROL DE PESO%'
GROUP BY p.IdProducto, p.NombreBase;

PRINT '';
PRINT '════════════════════════════════════════════════════════════════════════';
PRINT '';

-- Contar productos a eliminar
DECLARE @ProductosAEliminar INT;
SET @ProductosAEliminar = (
    SELECT COUNT(*)
    FROM Productos
    WHERE NombreBase LIKE '%BR FOR CAT VET CONTROL DE PESO%'
);

IF @ProductosAEliminar = 0
BEGIN
    PRINT '✅ No se encontraron productos de prueba para eliminar';
    PRINT '';
END
ELSE
BEGIN
    PRINT '📊 Total de productos a eliminar: ' + CAST(@ProductosAEliminar AS VARCHAR(10));
    PRINT '';
    PRINT '⚠️  ¿Desea continuar? Ejecute la siguiente sección para proceder.';
    PRINT '';
END;

PRINT '════════════════════════════════════════════════════════════════════════';
PRINT '';
GO

-- ============================================================================
-- ELIMINAR PRODUCTOS Y VARIACIONES
-- ============================================================================
-- IMPORTANTE: Descomente esta sección SOLO si desea ejecutar la eliminación
-- ============================================================================

/*
PRINT '🗑️  Iniciando eliminación de productos de prueba...';
PRINT '';

BEGIN TRANSACTION;

DECLARE @VariacionesEliminadas INT = 0;
DECLARE @ProductosEliminados INT = 0;

BEGIN TRY
    -- Paso 1: Eliminar variaciones de productos de prueba
    PRINT '   → Eliminando variaciones...';
    
    DELETE FROM VariacionesProducto
    WHERE IdProducto IN (
        SELECT IdProducto 
        FROM Productos 
        WHERE NombreBase LIKE '%BR FOR CAT VET CONTROL DE PESO%'
    );
    
    SET @VariacionesEliminadas = @@ROWCOUNT;
    PRINT '   ✅ Variaciones eliminadas: ' + CAST(@VariacionesEliminadas AS VARCHAR(10));
    PRINT '';

    -- Paso 2: Eliminar productos de prueba
    PRINT '   → Eliminando productos...';
    
    DELETE FROM Productos
    WHERE NombreBase LIKE '%BR FOR CAT VET CONTROL DE PESO%';
    
    SET @ProductosEliminados = @@ROWCOUNT;
    PRINT '   ✅ Productos eliminados: ' + CAST(@ProductosEliminados AS VARCHAR(10));
    PRINT '';

    -- Confirmar transacción
    COMMIT TRANSACTION;

    PRINT '════════════════════════════════════════════════════════════════════════';
    PRINT '📊 RESUMEN DE LIMPIEZA:';
    PRINT '';
    PRINT '   ✅ Variaciones eliminadas: ' + CAST(@VariacionesEliminadas AS VARCHAR(10));
    PRINT '   ✅ Productos eliminados: ' + CAST(@ProductosEliminados AS VARCHAR(10));
    PRINT '';
    PRINT '✅ Base de datos limpiada exitosamente';
    PRINT '════════════════════════════════════════════════════════════════════════';
    PRINT '';

END TRY
BEGIN CATCH
    -- Revertir transacción en caso de error
    ROLLBACK TRANSACTION;
    
    PRINT '';
    PRINT '❌ ERROR durante la eliminación:';
    PRINT '   ' + ERROR_MESSAGE();
    PRINT '';
    PRINT '🔄 Transacción revertida. No se eliminó ningún dato.';
    PRINT '';
END CATCH;
*/

-- ============================================================================
-- VERIFICAR PRODUCTOS RESTANTES
-- ============================================================================
-- Descomente esta sección para verificar que los productos fueron eliminados
-- ============================================================================

/*
PRINT '🔍 Verificando productos restantes en la base de datos...';
PRINT '';

SELECT 
    COUNT(*) AS 'Total Productos',
    SUM(CASE WHEN NombreBase LIKE '%BR FOR CAT VET CONTROL DE PESO%' THEN 1 ELSE 0 END) AS 'Productos de Prueba Restantes'
FROM Productos;

PRINT '';
*/

-- ============================================================================
-- NOTAS IMPORTANTES
-- ============================================================================
-- 1. Este script usa transacciones para garantizar integridad de datos
-- 2. Si hay un error, todos los cambios se revierten automáticamente
-- 3. Para agregar más productos a la limpieza, modifique la condición WHERE:
--    WHERE NombreBase LIKE '%OTRO_PRODUCTO%' OR NombreBase LIKE '%BR FOR CAT%'
-- 4. SIEMPRE verifique los productos a eliminar ANTES de ejecutar la eliminación
-- ============================================================================
