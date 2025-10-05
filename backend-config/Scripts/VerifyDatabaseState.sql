-- ============================================================================
-- Script de Verificación - Estado de Base de Datos VentasPet_Nueva
-- ============================================================================
-- Este script muestra el estado actual de la base de datos
-- Úsalo para diagnosticar problemas antes de ejecutar otros scripts
-- ============================================================================

USE VentasPet_Nueva;
GO

PRINT '';
PRINT '🔍 ============================================================================';
PRINT '🔍 VERIFICACIÓN DE ESTADO - Base de Datos VentasPet_Nueva';
PRINT '🔍 ============================================================================';
PRINT '';

-- ============================================================================
-- CONTADORES GENERALES
-- ============================================================================
PRINT '📊 CONTADORES GENERALES:';
PRINT '';

DECLARE @CategoriaCount INT = (SELECT COUNT(*) FROM Categorias);
DECLARE @ProveedorCount INT = (SELECT COUNT(*) FROM Proveedores);
DECLARE @ProductoCount INT = (SELECT COUNT(*) FROM Productos);
DECLARE @VariacionCount INT = (SELECT COUNT(*) FROM VariacionesProducto);
DECLARE @ProductosConImagen INT = (SELECT COUNT(*) FROM Productos WHERE URLImagen IS NOT NULL AND URLImagen <> '');

PRINT '   Categorías:              ' + CAST(@CategoriaCount AS VARCHAR(10));
PRINT '   Proveedores:             ' + CAST(@ProveedorCount AS VARCHAR(10));
PRINT '   Productos:               ' + CAST(@ProductoCount AS VARCHAR(10));
PRINT '   Variaciones:             ' + CAST(@VariacionCount AS VARCHAR(10));
PRINT '   Productos con imágenes:  ' + CAST(@ProductosConImagen AS VARCHAR(10)) + ' de ' + CAST(@ProductoCount AS VARCHAR(10));
PRINT '';

-- ============================================================================
-- DIAGNÓSTICO
-- ============================================================================
PRINT '🔬 DIAGNÓSTICO:';
PRINT '';

-- Verificar si hay productos
IF @ProductoCount = 0
BEGIN
    PRINT '   ❌ LA TABLA PRODUCTOS ESTÁ VACÍA';
    PRINT '   📝 Acción requerida: Ejecutar SeedInitialProducts.sql';
    PRINT '      Comando: sqlcmd -S localhost -d VentasPet_Nueva -E -i backend-config/Scripts/SeedInitialProducts.sql';
    PRINT '';
END
ELSE
BEGIN
    PRINT '   ✅ Hay productos en la base de datos';
    PRINT '';
    
    -- Verificar imágenes
    IF @ProductosConImagen = 0
    BEGIN
        PRINT '   ⚠️  NINGÚN PRODUCTO TIENE IMAGEN ASIGNADA';
        PRINT '   📝 Acción requerida: Ejecutar AddSampleProductImages.sql';
        PRINT '      Comando: sqlcmd -S localhost -d VentasPet_Nueva -E -i backend-config/Scripts/AddSampleProductImages.sql';
        PRINT '';
    END
    ELSE IF @ProductosConImagen < @ProductoCount
    BEGIN
        PRINT '   ⚠️  SOLO ALGUNOS PRODUCTOS TIENEN IMAGEN';
        PRINT '   📝 Productos sin imagen: ' + CAST(@ProductoCount - @ProductosConImagen AS VARCHAR(10));
        PRINT '';
    END
    ELSE
    BEGIN
        PRINT '   ✅ TODOS LOS PRODUCTOS TIENEN IMAGEN ASIGNADA';
        PRINT '';
    END
END

-- Verificar categorías
IF @CategoriaCount = 0
BEGIN
    PRINT '   ⚠️  No hay categorías';
    PRINT '';
END

-- Verificar proveedores
IF @ProveedorCount = 0
BEGIN
    PRINT '   ⚠️  No hay proveedores';
    PRINT '';
END

-- ============================================================================
-- DETALLE DE CATEGORÍAS
-- ============================================================================
IF @CategoriaCount > 0
BEGIN
    PRINT '═══════════════════════════════════════════════════════════════════════════';
    PRINT '📁 CATEGORÍAS:';
    PRINT '';
    
    SELECT 
        IdCategoria AS 'ID',
        Nombre,
        TipoMascota AS 'Tipo',
        CASE WHEN Activa = 1 THEN '✅ Activa' ELSE '❌ Inactiva' END AS 'Estado'
    FROM Categorias
    ORDER BY IdCategoria;
    
    PRINT '';
END

-- ============================================================================
-- DETALLE DE PROVEEDORES
-- ============================================================================
IF @ProveedorCount > 0
BEGIN
    PRINT '═══════════════════════════════════════════════════════════════════════════';
    PRINT '🏢 PROVEEDORES:';
    PRINT '';
    
    SELECT 
        ProveedorId AS 'ID',
        Nombre,
        Telefono AS 'Teléfono',
        Email,
        CASE WHEN Activo = 1 THEN '✅ Activo' ELSE '❌ Inactivo' END AS 'Estado'
    FROM Proveedores
    ORDER BY ProveedorId;
    
    PRINT '';
END

-- ============================================================================
-- DETALLE DE PRODUCTOS
-- ============================================================================
IF @ProductoCount > 0
BEGIN
    PRINT '═══════════════════════════════════════════════════════════════════════════';
    PRINT '📦 PRODUCTOS:';
    PRINT '';
    
    SELECT 
        p.IdProducto AS 'ID',
        p.NombreBase AS 'Nombre',
        c.Nombre AS 'Categoría',
        p.TipoMascota AS 'Tipo',
        pr.Nombre AS 'Proveedor',
        CASE 
            WHEN p.URLImagen LIKE 'https://www.velykapet.com/%' THEN '✅ R2'
            WHEN p.URLImagen IS NOT NULL AND p.URLImagen <> '' THEN '⚠️ Otra'
            ELSE '❌ Sin imagen'
        END AS 'Imagen',
        COUNT(v.IdVariacion) AS 'Variaciones'
    FROM Productos p
    LEFT JOIN Categorias c ON p.IdCategoria = c.IdCategoria
    LEFT JOIN Proveedores pr ON p.ProveedorId = pr.ProveedorId
    LEFT JOIN VariacionesProducto v ON p.IdProducto = v.IdProducto
    GROUP BY p.IdProducto, p.NombreBase, c.Nombre, p.TipoMascota, pr.Nombre, p.URLImagen
    ORDER BY p.IdProducto;
    
    PRINT '';
END

-- ============================================================================
-- DETALLE DE URLs DE IMÁGENES
-- ============================================================================
IF @ProductosConImagen > 0
BEGIN
    PRINT '═══════════════════════════════════════════════════════════════════════════';
    PRINT '🖼️  URLS DE IMÁGENES ASIGNADAS:';
    PRINT '';
    
    SELECT 
        IdProducto AS 'ID',
        NombreBase AS 'Producto',
        URLImagen AS 'URL Imagen'
    FROM Productos
    WHERE URLImagen IS NOT NULL AND URLImagen <> ''
    ORDER BY IdProducto;
    
    PRINT '';
END

-- ============================================================================
-- PRODUCTOS SIN IMAGEN
-- ============================================================================
IF @ProductoCount > @ProductosConImagen AND @ProductoCount > 0
BEGIN
    PRINT '═══════════════════════════════════════════════════════════════════════════';
    PRINT '⚠️  PRODUCTOS SIN IMAGEN:';
    PRINT '';
    
    SELECT 
        IdProducto AS 'ID',
        NombreBase AS 'Producto',
        TipoMascota AS 'Tipo'
    FROM Productos
    WHERE URLImagen IS NULL OR URLImagen = ''
    ORDER BY IdProducto;
    
    PRINT '';
END

-- ============================================================================
-- RECOMENDACIONES FINALES
-- ============================================================================
PRINT '═══════════════════════════════════════════════════════════════════════════';
PRINT '💡 RECOMENDACIONES:';
PRINT '';

IF @ProductoCount = 0
BEGIN
    PRINT '   1. Ejecutar SeedInitialProducts.sql para poblar productos';
    PRINT '   2. Luego ejecutar AddSampleProductImages.sql para agregar imágenes';
END
ELSE IF @ProductosConImagen = 0
BEGIN
    PRINT '   1. Ejecutar AddSampleProductImages.sql para agregar imágenes';
END
ELSE IF @ProductosConImagen < @ProductoCount
BEGIN
    PRINT '   1. Revisar qué productos no tienen imagen';
    PRINT '   2. Actualizar manualmente o ejecutar script personalizado';
END
ELSE
BEGIN
    PRINT '   ✅ Base de datos configurada correctamente';
    PRINT '   🚀 Puedes iniciar el backend y frontend';
    PRINT '';
    PRINT '   Comandos:';
    PRINT '   - Backend:  cd backend-config && dotnet run --urls="http://localhost:5135"';
    PRINT '   - Frontend: npm start';
END

PRINT '';
PRINT '═══════════════════════════════════════════════════════════════════════════';
PRINT '';

GO
