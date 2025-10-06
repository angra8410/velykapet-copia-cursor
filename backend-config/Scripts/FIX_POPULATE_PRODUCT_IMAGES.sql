-- ============================================================================
-- SCRIPT DE CORRECCIÓN: Poblar Campo URLImagen en Productos
-- ============================================================================
-- Proyecto: VelyKapet E-commerce
-- Fecha: Enero 2025
-- Objetivo: Resolver el problema de imágenes no visibles en el catálogo
--
-- PROBLEMA: El campo URLImagen está vacío (NULL o '') en la base de datos,
--           lo que causa que el campo Images calculado también esté vacío.
--
-- SOLUCIÓN: Poblar URLImagen con URLs válidas de Cloudflare R2
-- ============================================================================

USE VentasPet_Nueva;
GO

PRINT '';
PRINT '╔════════════════════════════════════════════════════════════════════════╗';
PRINT '║  🔧 CORRECCIÓN: Poblar Campo URLImagen en Productos                   ║';
PRINT '║  Resolviendo problema de imágenes no visibles en catálogo             ║';
PRINT '╚════════════════════════════════════════════════════════════════════════╝';
PRINT '';

-- ============================================================================
-- PASO 1: Verificar Estado Actual
-- ============================================================================
PRINT '📋 PASO 1: Verificando estado actual de la base de datos...';
PRINT '';

DECLARE @ProductosSinImagen INT;
SET @ProductosSinImagen = (SELECT COUNT(*) FROM Productos WHERE URLImagen IS NULL OR URLImagen = '');

PRINT '   📊 Productos sin imagen: ' + CAST(@ProductosSinImagen AS VARCHAR);

IF @ProductosSinImagen = 0
BEGIN
    PRINT '   ✅ Todos los productos ya tienen imágenes asignadas';
    PRINT '   ℹ️  Si las imágenes no se ven en el catálogo, el problema está en otro lugar.';
    PRINT '';
    PRINT '   Posibles causas:';
    PRINT '   - Las imágenes no existen físicamente en Cloudflare R2';
    PRINT '   - El backend no está corriendo';
    PRINT '   - El frontend no puede conectar con el backend';
    PRINT '';
    GOTO VERIFICACION;
END

PRINT '';
SELECT IdProducto, NombreBase, TipoMascota, URLImagen 
FROM Productos 
WHERE URLImagen IS NULL OR URLImagen = ''
ORDER BY IdProducto;
PRINT '';

-- ============================================================================
-- PASO 2: Poblar URLs de Imágenes
-- ============================================================================
PRINT '🔧 PASO 2: Poblando URLs de imágenes de Cloudflare R2...';
PRINT '';

-- Actualizar cada producto con URL de imagen de R2
-- NOTA: Estas URLs apuntan a imágenes en Cloudflare R2
--       Si las imágenes no existen aún en R2, deberás subirlas

UPDATE Productos 
SET 
    URLImagen = 'https://www.velykapet.com/productos/alimentos/gatos/CHURU_ATUN_4_PIEZAS_56_GR.jpg',
    FechaActualizacion = GETDATE()
WHERE IdProducto = 1 AND (URLImagen IS NULL OR URLImagen = '');

UPDATE Productos 
SET 
    URLImagen = 'https://www.velykapet.com/productos/alimentos/perros/ROYAL_CANIN_ADULT.jpg',
    FechaActualizacion = GETDATE()
WHERE IdProducto = 2 AND (URLImagen IS NULL OR URLImagen = '');

UPDATE Productos 
SET 
    URLImagen = 'https://www.velykapet.com/productos/alimentos/gatos/BR_FOR_CAT_VET.jpg',
    FechaActualizacion = GETDATE()
WHERE IdProducto = 3 AND (URLImagen IS NULL OR URLImagen = '');

UPDATE Productos 
SET 
    URLImagen = 'https://www.velykapet.com/productos/alimentos/perros/HILLS_SCIENCE_DIET_PUPPY.jpg',
    FechaActualizacion = GETDATE()
WHERE IdProducto = 4 AND (URLImagen IS NULL OR URLImagen = '');

UPDATE Productos 
SET 
    URLImagen = 'https://www.velykapet.com/productos/alimentos/gatos/PURINA_PRO_PLAN_ADULT_CAT.jpg',
    FechaActualizacion = GETDATE()
WHERE IdProducto = 5 AND (URLImagen IS NULL OR URLImagen = '');

-- Si tienes más productos, agregar más UPDATEs aquí siguiendo el mismo patrón
-- UPDATE Productos SET URLImagen = 'https://www.velykapet.com/...' WHERE IdProducto = 6;

PRINT '   ✅ URLs de imágenes actualizadas';
PRINT '';

-- ============================================================================
-- PASO 3: Verificación
-- ============================================================================
VERIFICACION:
PRINT '✅ PASO 3: Verificando resultados...';
PRINT '';

SELECT 
    IdProducto,
    NombreBase,
    TipoMascota,
    URLImagen,
    CASE 
        WHEN URLImagen LIKE 'https://www.velykapet.com/%' THEN '✅ R2 Image'
        WHEN URLImagen IS NULL OR URLImagen = '' THEN '❌ No Image'
        ELSE '⚠️ Other Source'
    END AS ImageStatus,
    FechaActualizacion
FROM Productos
ORDER BY IdProducto;

PRINT '';

-- ============================================================================
-- RESUMEN
-- ============================================================================
DECLARE @TotalProductos INT;
DECLARE @ProductosConR2 INT;
DECLARE @ProductosActualizadosSinImagen INT;

SET @TotalProductos = (SELECT COUNT(*) FROM Productos);
SET @ProductosConR2 = (SELECT COUNT(*) FROM Productos WHERE URLImagen LIKE 'https://www.velykapet.com/%');
SET @ProductosActualizadosSinImagen = (SELECT COUNT(*) FROM Productos WHERE URLImagen IS NULL OR URLImagen = '');

PRINT '╔════════════════════════════════════════════════════════════════════════╗';
PRINT '║  📊 RESUMEN DE CORRECCIÓN                                             ║';
PRINT '╚════════════════════════════════════════════════════════════════════════╝';
PRINT '';
PRINT '   Total de productos: ' + CAST(@TotalProductos AS VARCHAR);
PRINT '   Productos con imagen de R2: ' + CAST(@ProductosConR2 AS VARCHAR);
PRINT '   Productos sin imagen: ' + CAST(@ProductosActualizadosSinImagen AS VARCHAR);
PRINT '';

IF @ProductosActualizadosSinImagen = 0
BEGIN
    PRINT '   ✅ ¡ÉXITO! Todos los productos tienen URLs de imagen asignadas.';
    PRINT '';
    PRINT '   📋 PRÓXIMOS PASOS:';
    PRINT '   1. Iniciar el backend: cd backend-config && dotnet run --urls="http://localhost:5135"';
    PRINT '   2. Verificar API: curl http://localhost:5135/api/Productos | jq ".[0].Images"';
    PRINT '   3. Iniciar frontend: npm start';
    PRINT '   4. Abrir navegador: http://localhost:3333';
    PRINT '   5. Abrir DevTools (F12) y verificar Console logs';
    PRINT '';
    PRINT '   ⚠️  IMPORTANTE: Las imágenes deben existir en Cloudflare R2.';
    PRINT '   Si ves errores 404, necesitas subir las imágenes al bucket.';
    PRINT '';
END
ELSE
BEGIN
    PRINT '   ⚠️  Aún hay ' + CAST(@ProductosActualizadosSinImagen AS VARCHAR) + ' producto(s) sin imagen.';
    PRINT '   Revisa y agrega URLs manualmente o ejecuta el script nuevamente.';
    PRINT '';
END

PRINT '╔════════════════════════════════════════════════════════════════════════╗';
PRINT '║  ✅ SCRIPT COMPLETADO                                                 ║';
PRINT '╚════════════════════════════════════════════════════════════════════════╝';
PRINT '';

GO
