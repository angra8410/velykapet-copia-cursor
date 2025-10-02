-- ============================================================================
-- TEMPLATE: Script de Seed con Validación de Integridad Referencial
-- ============================================================================
-- Este es un template que puede ser usado para crear nuevos scripts de seed
-- que manejen correctamente la integridad referencial de la base de datos.
--
-- INSTRUCCIONES:
-- 1. Copie este archivo y renómbrelo según el producto/entidad que va a insertar
-- 2. Modifique las secciones marcadas con [MODIFICAR] según sus necesidades
-- 3. Siga las buenas prácticas documentadas al final del script
-- ============================================================================

BEGIN TRANSACTION;

BEGIN TRY
    -- ============================================================================
    -- PASO 1: Validar y crear referencias foráneas necesarias
    -- ============================================================================
    
    -- [MODIFICAR] Ejemplo: Validar Categoría
    DECLARE @RequiredCategoryId INT = 1; -- Cambiar según necesidad
    DECLARE @CategoryName NVARCHAR(100) = 'Nombre de la Categoría';
    
    IF NOT EXISTS (SELECT 1 FROM Categorias WHERE IdCategoria = @RequiredCategoryId)
    BEGIN
        PRINT '⚠️  La categoría con IdCategoria = ' + CAST(@RequiredCategoryId AS VARCHAR(10)) + ' no existe. Creándola...';
        
        SET IDENTITY_INSERT Categorias ON;
        
        INSERT INTO Categorias (IdCategoria, Nombre, Descripcion, TipoMascota, Activa)
        VALUES (
            @RequiredCategoryId,
            @CategoryName,
            'Descripción de la categoría',
            'Perros', -- o 'Gatos' o 'Ambos'
            1
        );
        
        SET IDENTITY_INSERT Categorias OFF;
        
        PRINT '✅ Categoría "' + @CategoryName + '" (ID: ' + CAST(@RequiredCategoryId AS VARCHAR(10)) + ') creada exitosamente.';
    END
    ELSE
    BEGIN
        PRINT '✅ Categoría con ID ' + CAST(@RequiredCategoryId AS VARCHAR(10)) + ' ya existe.';
    END

    -- [MODIFICAR] Ejemplo: Validar Proveedor
    DECLARE @RequiredProviderId INT = 1; -- Cambiar según necesidad
    DECLARE @ProviderName NVARCHAR(100) = 'Nombre del Proveedor';
    
    IF NOT EXISTS (SELECT 1 FROM Proveedores WHERE ProveedorId = @RequiredProviderId)
    BEGIN
        PRINT '⚠️  El proveedor con ProveedorId = ' + CAST(@RequiredProviderId AS VARCHAR(10)) + ' no existe. Creándolo...';
        
        SET IDENTITY_INSERT Proveedores ON;
        
        INSERT INTO Proveedores (ProveedorId, Nombre, RazonSocial, NIT, Direccion, Telefono, Email, SitioWeb, PersonaContacto, Notas, Activo, FechaCreacion, FechaModificacion)
        VALUES (
            @RequiredProviderId,
            @ProviderName,
            'Razón Social del Proveedor S.A.',
            '900000000-0',
            'Dirección del proveedor',
            '55-0000-0000',
            'contacto@proveedor.com',
            'https://www.proveedor.com',
            'Nombre del Contacto',
            'Notas adicionales',
            1,
            GETDATE(),
            GETDATE()
        );
        
        SET IDENTITY_INSERT Proveedores OFF;
        
        PRINT '✅ Proveedor "' + @ProviderName + '" (ID: ' + CAST(@RequiredProviderId AS VARCHAR(10)) + ') creado exitosamente.';
    END
    ELSE
    BEGIN
        PRINT '✅ Proveedor con ID ' + CAST(@RequiredProviderId AS VARCHAR(10)) + ' ya existe.';
    END

    -- ============================================================================
    -- PASO 2: Validar si el producto ya existe para evitar duplicados
    -- ============================================================================
    -- [MODIFICAR] Cambiar el nombre del producto a buscar
    DECLARE @ProductName NVARCHAR(200) = 'NOMBRE DEL PRODUCTO';
    
    IF EXISTS (SELECT 1 FROM Productos WHERE NombreBase = @ProductName)
    BEGIN
        PRINT '⚠️  El producto "' + @ProductName + '" ya existe. Abortando inserción.';
        PRINT '💡 Si desea reemplazarlo, elimine primero las variaciones y el producto manualmente.';
        ROLLBACK TRANSACTION;
        RETURN;
    END

    -- ============================================================================
    -- PASO 3: Insertar el producto base
    -- ============================================================================
    PRINT '📦 Insertando producto "' + @ProductName + '"...';
    
    -- [MODIFICAR] Cambiar los valores del producto
    INSERT INTO Productos (NombreBase, Descripcion, IdCategoria, TipoMascota, URLImagen, Activo, FechaCreacion, FechaActualizacion, ProveedorId)
    VALUES (
        @ProductName,
        'Descripción del producto', -- Cambiar descripción
        @RequiredCategoryId, -- Usa la categoría validada
        'Perros', -- o 'Gatos', cambiar según corresponda
        'https://ejemplo.com/imagen.jpg', -- URL de imagen
        1, -- Activo
        GETDATE(),
        GETDATE(),
        @RequiredProviderId -- Usa el proveedor validado
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
    -- PASO 4: Insertar las variaciones del producto
    -- ============================================================================
    PRINT '📊 Insertando variaciones del producto...';
    
    -- [MODIFICAR] Cambiar las variaciones según el producto
    INSERT INTO VariacionesProducto (IdProducto, Peso, Precio, Stock, Activa, FechaCreacion)
    VALUES 
        (@ProductoId, '500 GR', 10000, 50, 1, GETDATE()),
        (@ProductoId, '1 KG', 18000, 30, 1, GETDATE()),
        (@ProductoId, '2 KG', 35000, 20, 1, GETDATE());
    
    DECLARE @VariacionesInsertadas INT = @@ROWCOUNT;
    PRINT '✅ ' + CAST(@VariacionesInsertadas AS VARCHAR(10)) + ' variaciones insertadas exitosamente.';

    -- ============================================================================
    -- PASO 5: Confirmar la transacción
    -- ============================================================================
    COMMIT TRANSACTION;
    PRINT '';
    PRINT '🎉 ============================================================================';
    PRINT '🎉 PROCESO COMPLETADO EXITOSAMENTE';
    PRINT '🎉 ============================================================================';
    PRINT '';

    -- ============================================================================
    -- PASO 6: Verificar los datos insertados
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
    WHERE p.NombreBase = @ProductName
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
    PRINT '   1. Verifique que la base de datos existe';
    PRINT '   2. Verifique que todas las tablas necesarias existen';
    PRINT '   3. Revise los permisos de usuario en la base de datos';
    PRINT '   4. Consulte el mensaje de error anterior para más detalles';
    PRINT '   5. Verifique que los IDs de categoría y proveedor son correctos';
    PRINT '';
END CATCH;

-- ============================================================================
-- BUENAS PRÁCTICAS PARA SCRIPTS DE SEED SQL
-- ============================================================================
-- 
-- ✅ SIEMPRE use transacciones (BEGIN TRANSACTION / COMMIT / ROLLBACK)
--    Esto garantiza que todos los cambios se apliquen juntos o ninguno se aplique.
--
-- ✅ VALIDE la existencia de referencias foráneas antes de insertar
--    Use IF NOT EXISTS para verificar categorías, proveedores, etc.
--
-- ✅ CREE las entidades faltantes automáticamente cuando sea posible
--    Use SET IDENTITY_INSERT ON/OFF para IDs específicos.
--
-- ✅ VERIFIQUE duplicados antes de insertar para evitar errores
--    Use IF EXISTS para verificar si el producto ya existe.
--
-- ✅ USE bloques TRY-CATCH para manejo robusto de errores
--    Capture errores y proporcione mensajes claros de qué salió mal.
--
-- ✅ PROPORCIONE mensajes informativos del progreso del script
--    Use PRINT con emojis para hacer el proceso más legible.
--
-- ✅ MUESTRE los datos insertados al final para verificación
--    Use SELECT con JOINs para mostrar todos los datos relacionados.
--
-- ✅ DOCUMENTE claramente cada paso del proceso
--    Use comentarios para explicar qué hace cada sección.
--
-- ✅ USE variables para valores que se repiten
--    Facilita el mantenimiento y reduce errores.
--
-- ✅ VERIFIQUE que SCOPE_IDENTITY() no sea NULL
--    Asegura que el producto se insertó correctamente antes de continuar.
--
-- ============================================================================
-- PATRÓN DE NOMENCLATURA SUGERIDO PARA SCRIPTS DE SEED
-- ============================================================================
-- 
-- seed-[entidad]-[identificador].sql
-- 
-- Ejemplos:
-- - seed-product-royal-canin-control-peso.sql
-- - seed-category-accesorios.sql
-- - seed-provider-hills.sql
-- - seed-multiple-products-promocion-verano.sql
--
-- ============================================================================
