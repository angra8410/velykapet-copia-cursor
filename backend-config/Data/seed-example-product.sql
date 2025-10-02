-- ============================================================================
-- Seed script para agregar el producto de ejemplo: BR FOR CAT VET CONTROL DE PESO
-- Este script agrega un producto real con 3 variaciones de peso como se especifica en el issue
-- 
-- MEJORAS DE INTEGRIDAD REFERENCIAL:
-- - Valida la existencia de la categoría antes de insertar el producto
-- - Valida la existencia del proveedor antes de insertar el producto
-- - Crea las entidades faltantes si no existen
-- - Proporciona mensajes informativos de cada paso
-- ============================================================================

BEGIN TRANSACTION;

BEGIN TRY
    -- ============================================================================
    -- PASO 1: Validar y crear la categoría "Alimento para Gatos" si no existe
    -- ============================================================================
    IF NOT EXISTS (SELECT 1 FROM Categorias WHERE IdCategoria = 2)
    BEGIN
        PRINT '⚠️  La categoría con IdCategoria = 2 no existe. Creándola...';
        
        SET IDENTITY_INSERT Categorias ON;
        
        -- Nota: Solo insertamos los campos que existen en el modelo Categoria
        -- (IdCategoria, Nombre, Descripcion, TipoMascota, Activa)
        INSERT INTO Categorias (IdCategoria, Nombre, Descripcion, TipoMascota, Activa)
        VALUES (
            2,
            'Alimento para Gatos',
            'Alimento balanceado para gatos de todas las edades',
            'Gatos',
            1
        );
        
        SET IDENTITY_INSERT Categorias OFF;
        
        PRINT '✅ Categoría "Alimento para Gatos" (ID: 2) creada exitosamente.';
    END
    ELSE
    BEGIN
        PRINT '✅ Categoría "Alimento para Gatos" (ID: 2) ya existe.';
    END

    -- ============================================================================
    -- PASO 2: Validar y crear el proveedor "Royal Canin" si no existe
    -- ============================================================================
    IF NOT EXISTS (SELECT 1 FROM Proveedores WHERE ProveedorId = 1)
    BEGIN
        PRINT '⚠️  El proveedor con ProveedorId = 1 no existe. Creándolo...';
        
        SET IDENTITY_INSERT Proveedores ON;
        
        -- Insertamos todos los campos del modelo Proveedor
        INSERT INTO Proveedores (ProveedorId, Nombre, RazonSocial, NIT, Direccion, Telefono, Email, SitioWeb, PersonaContacto, Notas, Activo, FechaCreacion, FechaModificacion)
        VALUES (
            1,
            'Royal Canin',
            'Royal Canin México S.A. de C.V.',
            '900123456-7',
            'Av. Insurgentes Sur 1234, Ciudad de México',
            '55-1234-5678',
            'contacto@royalcanin.com.mx',
            'https://www.royalcanin.com.mx',
            'María González',
            'Proveedor principal de alimento premium',
            1,
            GETDATE(),
            GETDATE()
        );
        
        SET IDENTITY_INSERT Proveedores OFF;
        
        PRINT '✅ Proveedor "Royal Canin" (ID: 1) creado exitosamente.';
    END
    ELSE
    BEGIN
        PRINT '✅ Proveedor "Royal Canin" (ID: 1) ya existe.';
    END

    -- ============================================================================
    -- PASO 3: Validar si el producto ya existe para evitar duplicados
    -- ============================================================================
    IF EXISTS (SELECT 1 FROM Productos WHERE NombreBase = 'BR FOR CAT VET CONTROL DE PESO')
    BEGIN
        PRINT '⚠️  El producto "BR FOR CAT VET CONTROL DE PESO" ya existe. Abortando inserción.';
        PRINT '💡 Si desea reemplazarlo, elimine primero las variaciones y el producto manualmente.';
        ROLLBACK TRANSACTION;
        RETURN;
    END

    -- ============================================================================
    -- PASO 4: Insertar el producto base
    -- ============================================================================
    PRINT '📦 Insertando producto "BR FOR CAT VET CONTROL DE PESO"...';
    
    INSERT INTO Productos (NombreBase, Descripcion, IdCategoria, TipoMascota, URLImagen, Activo, FechaCreacion, FechaActualizacion, ProveedorId)
    VALUES (
        'BR FOR CAT VET CONTROL DE PESO',
        'Alimento con un balance adecuado de nutrientes que ayuda a reducir la formación de bolas de pelo, brindándole máxima protección de piel y pelaje.',
        2, -- IdCategoria: 2 = "Alimento para Gatos"
        'Gatos',
        'https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=500&q=80', -- Imagen de producto de alimento para gatos
        1, -- Activo
        GETDATE(),
        GETDATE(),
        1 -- ProveedorId: Royal Canin
    );

    -- Obtener el ID del producto recién insertado
    DECLARE @ProductoId INT = SCOPE_IDENTITY();
    
    IF @ProductoId IS NULL
    BEGIN
        PRINT '❌ ERROR: No se pudo obtener el ID del producto insertado.';
        ROLLBACK TRANSACTION;
        RETURN;
    END
    
    PRINT '✅ Producto insertado exitosamente con ID: ' + CAST(@ProductoId AS VARCHAR(10));


    -- ============================================================================
    -- PASO 5: Insertar las 3 variaciones de peso
    -- ============================================================================
    PRINT '📊 Insertando variaciones de peso del producto...';
    
    INSERT INTO VariacionesProducto (IdProducto, Peso, Precio, Stock, Activa, FechaCreacion)
    VALUES 
        (@ProductoId, '500 GR', 20400, 50, 1, GETDATE()),  -- SKU: 300100101
        (@ProductoId, '1.5 KG', 58200, 30, 1, GETDATE()),  -- SKU: 300100102
        (@ProductoId, '3 KG', 110800, 20, 1, GETDATE());   -- SKU: 300100103
    
    PRINT '✅ 3 variaciones insertadas exitosamente.';

    -- ============================================================================
    -- PASO 6: Confirmar la transacción
    -- ============================================================================
    COMMIT TRANSACTION;
    PRINT '';
    PRINT '🎉 ============================================================================';
    PRINT '🎉 PROCESO COMPLETADO EXITOSAMENTE';
    PRINT '🎉 ============================================================================';
    PRINT '';

    -- ============================================================================
    -- PASO 7: Verificar los datos insertados
    -- ============================================================================
    PRINT '📋 Datos insertados:';
    PRINT '';
    
    SELECT 
        p.IdProducto,
        p.NombreBase,
        p.Descripcion,
        p.TipoMascota,
        c.Nombre AS Categoria,
        pr.Nombre AS Proveedor,
        v.IdVariacion,
        v.Peso,
        v.Precio,
        v.Stock,
        v.Activa
    FROM Productos p
    INNER JOIN Categorias c ON p.IdCategoria = c.IdCategoria
    INNER JOIN Proveedores pr ON p.ProveedorId = pr.ProveedorId
    LEFT JOIN VariacionesProducto v ON p.IdProducto = v.IdProducto
    WHERE p.NombreBase = 'BR FOR CAT VET CONTROL DE PESO'
    ORDER BY v.Precio;

END TRY
BEGIN CATCH
    -- ============================================================================
    -- MANEJO DE ERRORES
    -- ============================================================================
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;
    
    PRINT '';
    PRINT '❌ ============================================================================';
    PRINT '❌ ERROR AL EJECUTAR EL SCRIPT';
    PRINT '❌ ============================================================================';
    PRINT 'Error Number: ' + CAST(ERROR_NUMBER() AS VARCHAR(10));
    PRINT 'Error Message: ' + ERROR_MESSAGE();
    PRINT 'Error Line: ' + CAST(ERROR_LINE() AS VARCHAR(10));
    PRINT '';
    PRINT '💡 RECOMENDACIONES:';
    PRINT '   1. Verifique que la base de datos VentasPet_Nueva existe';
    PRINT '   2. Verifique que las tablas Categorias, Proveedores, Productos y VariacionesProducto existen';
    PRINT '   3. Revise los permisos de usuario en la base de datos';
    PRINT '   4. Consulte el mensaje de error anterior para más detalles';
    PRINT '';
END CATCH;

-- ============================================================================
-- BUENAS PRÁCTICAS PARA SCRIPTS DE SEED:
-- ============================================================================
-- 1. SIEMPRE use transacciones para mantener la integridad de los datos
-- 2. VALIDE la existencia de referencias foráneas antes de insertar
-- 3. CREE las entidades faltantes automáticamente cuando sea posible
-- 4. VERIFIQUE duplicados antes de insertar para evitar errores
-- 5. USE bloques TRY-CATCH para manejo robusto de errores
-- 6. PROPORCIONE mensajes informativos del progreso del script
-- 7. MUESTRE los datos insertados al final para verificación
-- 8. DOCUMENTE claramente cada paso del proceso
-- ============================================================================
