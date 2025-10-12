-- ============================================================================
-- Script SQL para limpiar productos de prueba (SQLite)
-- ============================================================================
-- Este script elimina productos que fueron importados desde CSV de prueba,
-- incluyendo sus variaciones y respetando las restricciones de integridad
-- referencial.
--
-- USO (desde línea de comandos):
--   sqlite3 VentasPet.db < Data/limpiar-productos-prueba-sqlite.sql
--
-- O desde SQL interactivo:
--   sqlite3 VentasPet.db
--   .read Data/limpiar-productos-prueba-sqlite.sql
--
-- IMPORTANTE: 
--   - Las variaciones deben eliminarse ANTES que los productos
--   - Verifique los productos a eliminar antes de ejecutar
-- ============================================================================

.echo on
.headers on
.mode column

-- Mostrar banner
SELECT '╔════════════════════════════════════════════════════════════════════════╗';
SELECT '║         LIMPIEZA DE PRODUCTOS DE PRUEBA - VelyKapet (SQLite)          ║';
SELECT '╚════════════════════════════════════════════════════════════════════════╝';
SELECT '';
SELECT '⚠️  ADVERTENCIA: Este script eliminará productos de la base de datos';
SELECT '';

-- ============================================================================
-- VERIFICAR PRODUCTOS A ELIMINAR
-- ============================================================================
SELECT '🔍 Productos que serán eliminados:';
SELECT '';

SELECT 
    p.IdProducto,
    p.NombreBase,
    COUNT(v.IdVariacion) AS 'Variaciones'
FROM Productos p
LEFT JOIN VariacionesProducto v ON p.IdProducto = v.IdProducto
WHERE p.NombreBase LIKE '%BR FOR CAT VET CONTROL DE PESO%'
GROUP BY p.IdProducto, p.NombreBase;

SELECT '';
SELECT '════════════════════════════════════════════════════════════════════════';
SELECT '';

-- Contar productos a eliminar
SELECT '📊 Total de productos a eliminar: ' || COUNT(*) 
FROM Productos
WHERE NombreBase LIKE '%BR FOR CAT VET CONTROL DE PESO%';

SELECT '';
SELECT '════════════════════════════════════════════════════════════════════════';
SELECT '';

-- ============================================================================
-- ELIMINAR PRODUCTOS Y VARIACIONES
-- ============================================================================
SELECT '🗑️  Iniciando eliminación de productos de prueba...';
SELECT '';

BEGIN TRANSACTION;

-- Paso 1: Eliminar variaciones de productos de prueba
SELECT '   → Eliminando variaciones...';

DELETE FROM VariacionesProducto
WHERE IdProducto IN (
    SELECT IdProducto 
    FROM Productos 
    WHERE NombreBase LIKE '%BR FOR CAT VET CONTROL DE PESO%'
);

SELECT '   ✅ Variaciones eliminadas: ' || changes();
SELECT '';

-- Paso 2: Eliminar productos de prueba
SELECT '   → Eliminando productos...';

DELETE FROM Productos
WHERE NombreBase LIKE '%BR FOR CAT VET CONTROL DE PESO%';

SELECT '   ✅ Productos eliminados: ' || changes();
SELECT '';

-- Confirmar transacción
COMMIT;

SELECT '════════════════════════════════════════════════════════════════════════';
SELECT '📊 RESUMEN DE LIMPIEZA COMPLETADA';
SELECT '';
SELECT '✅ Base de datos limpiada exitosamente';
SELECT '════════════════════════════════════════════════════════════════════════';
SELECT '';

-- ============================================================================
-- VERIFICAR PRODUCTOS RESTANTES
-- ============================================================================
SELECT '🔍 Verificando productos restantes en la base de datos...';
SELECT '';

SELECT 
    COUNT(*) AS 'Total_Productos',
    SUM(CASE WHEN NombreBase LIKE '%BR FOR CAT VET CONTROL DE PESO%' THEN 1 ELSE 0 END) AS 'Productos_Prueba_Restantes'
FROM Productos;

SELECT '';
SELECT '✅ Limpieza completada. Puede ejecutar una nueva importación.';
SELECT '';

-- ============================================================================
-- NOTAS IMPORTANTES
-- ============================================================================
-- 1. Este script usa transacciones para garantizar integridad de datos
-- 2. Si hay un error, todos los cambios se revierten automáticamente
-- 3. Para agregar más productos a la limpieza, modifique la condición WHERE:
--    WHERE NombreBase LIKE '%OTRO_PRODUCTO%' OR NombreBase LIKE '%BR FOR CAT%'
-- 4. SIEMPRE verifique los productos a eliminar ANTES de ejecutar la eliminación
-- ============================================================================
