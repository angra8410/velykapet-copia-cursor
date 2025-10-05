-- ============================================================================
-- Script para POBLAR DATOS INICIALES - Base de Datos VentasPet_Nueva
-- ============================================================================
-- Este script pobla la base de datos con:
-- - Categorías (4 categorías iniciales)
-- - Proveedores (3 proveedores iniciales)
-- - Productos (5 productos base con datos completos)
-- - Variaciones de Productos (múltiples presentaciones por producto)
--
-- IMPORTANTE: Este script debe ejecutarse ANTES de AddSampleProductImages.sql
-- ============================================================================

USE VentasPet_Nueva;
GO

PRINT '';
PRINT '🚀 ============================================================================';
PRINT '🚀 INICIANDO PROCESO DE SEED DE DATOS INICIALES';
PRINT '🚀 ============================================================================';
PRINT '';

BEGIN TRANSACTION;

BEGIN TRY
    -- ============================================================================
    -- PASO 1: Verificar si ya existen datos
    -- ============================================================================
    DECLARE @ProductCount INT = (SELECT COUNT(*) FROM Productos);
    DECLARE @CategoryCount INT = (SELECT COUNT(*) FROM Categorias);
    DECLARE @ProviderCount INT = (SELECT COUNT(*) FROM Proveedores);

    PRINT '📊 Estado actual de la base de datos:';
    PRINT '   - Categorías: ' + CAST(@CategoryCount AS VARCHAR(10));
    PRINT '   - Proveedores: ' + CAST(@ProviderCount AS VARCHAR(10));
    PRINT '   - Productos: ' + CAST(@ProductCount AS VARCHAR(10));
    PRINT '';

    -- ============================================================================
    -- PASO 2: SEED CATEGORÍAS
    -- ============================================================================
    PRINT '📁 PASO 2: Creando categorías...';
    
    -- Verificar y crear Categoría 1: Alimento para Perros
    IF NOT EXISTS (SELECT 1 FROM Categorias WHERE IdCategoria = 1)
    BEGIN
        SET IDENTITY_INSERT Categorias ON;
        INSERT INTO Categorias (IdCategoria, Nombre, Descripcion, TipoMascota, Activa)
        VALUES (1, 'Alimento para Perros', 'Alimento balanceado para perros de todas las edades', 'Perros', 1);
        SET IDENTITY_INSERT Categorias OFF;
        PRINT '   ✅ Categoría "Alimento para Perros" creada';
    END
    ELSE
        PRINT '   ℹ️  Categoría "Alimento para Perros" ya existe';

    -- Verificar y crear Categoría 2: Alimento para Gatos
    IF NOT EXISTS (SELECT 1 FROM Categorias WHERE IdCategoria = 2)
    BEGIN
        SET IDENTITY_INSERT Categorias ON;
        INSERT INTO Categorias (IdCategoria, Nombre, Descripcion, TipoMascota, Activa)
        VALUES (2, 'Alimento para Gatos', 'Alimento balanceado para gatos de todas las edades', 'Gatos', 1);
        SET IDENTITY_INSERT Categorias OFF;
        PRINT '   ✅ Categoría "Alimento para Gatos" creada';
    END
    ELSE
        PRINT '   ℹ️  Categoría "Alimento para Gatos" ya existe';

    -- Verificar y crear Categoría 3: Snacks y Premios
    IF NOT EXISTS (SELECT 1 FROM Categorias WHERE IdCategoria = 3)
    BEGIN
        SET IDENTITY_INSERT Categorias ON;
        INSERT INTO Categorias (IdCategoria, Nombre, Descripcion, TipoMascota, Activa)
        VALUES (3, 'Snacks y Premios', 'Snacks y premios para perros y gatos', 'Ambos', 1);
        SET IDENTITY_INSERT Categorias OFF;
        PRINT '   ✅ Categoría "Snacks y Premios" creada';
    END
    ELSE
        PRINT '   ℹ️  Categoría "Snacks y Premios" ya existe';

    -- Verificar y crear Categoría 4: Accesorios
    IF NOT EXISTS (SELECT 1 FROM Categorias WHERE IdCategoria = 4)
    BEGIN
        SET IDENTITY_INSERT Categorias ON;
        INSERT INTO Categorias (IdCategoria, Nombre, Descripcion, TipoMascota, Activa)
        VALUES (4, 'Accesorios', 'Accesorios para mascotas', 'Ambos', 1);
        SET IDENTITY_INSERT Categorias OFF;
        PRINT '   ✅ Categoría "Accesorios" creada';
    END
    ELSE
        PRINT '   ℹ️  Categoría "Accesorios" ya existe';

    PRINT '';

    -- ============================================================================
    -- PASO 3: SEED PROVEEDORES
    -- ============================================================================
    PRINT '🏢 PASO 3: Creando proveedores...';

    -- Proveedor 1: Royal Canin
    IF NOT EXISTS (SELECT 1 FROM Proveedores WHERE ProveedorId = 1)
    BEGIN
        SET IDENTITY_INSERT Proveedores ON;
        INSERT INTO Proveedores (
            ProveedorId, Nombre, RazonSocial, NIT, Direccion, Telefono, 
            Email, SitioWeb, PersonaContacto, Notas, Activo, FechaCreacion, FechaModificacion
        )
        VALUES (
            1, 'Royal Canin', 'Royal Canin México S.A. de C.V.', '900123456-7',
            'Av. Insurgentes Sur 1234, Ciudad de México', '55-1234-5678',
            'contacto@royalcanin.com.mx', 'https://www.royalcanin.com.mx',
            'María González', 'Proveedor principal de alimento premium', 1,
            GETDATE(), GETDATE()
        );
        SET IDENTITY_INSERT Proveedores OFF;
        PRINT '   ✅ Proveedor "Royal Canin" creado';
    END
    ELSE
        PRINT '   ℹ️  Proveedor "Royal Canin" ya existe';

    -- Proveedor 2: Hill's Science Diet
    IF NOT EXISTS (SELECT 1 FROM Proveedores WHERE ProveedorId = 2)
    BEGIN
        SET IDENTITY_INSERT Proveedores ON;
        INSERT INTO Proveedores (
            ProveedorId, Nombre, RazonSocial, NIT, Direccion, Telefono,
            Email, SitioWeb, PersonaContacto, Notas, Activo, FechaCreacion, FechaModificacion
        )
        VALUES (
            2, 'Hill''s Science Diet', 'Hill''s Pet Nutrition México', '900987654-3',
            'Blvd. Ávila Camacho 567, Estado de México', '55-9876-5432',
            'ventas@hills.com.mx', 'https://www.hills.com.mx',
            'Carlos Rodríguez', 'Especialistas en nutrición veterinaria', 1,
            GETDATE(), GETDATE()
        );
        SET IDENTITY_INSERT Proveedores OFF;
        PRINT '   ✅ Proveedor "Hill''s Science Diet" creado';
    END
    ELSE
        PRINT '   ℹ️  Proveedor "Hill''s Science Diet" ya existe';

    -- Proveedor 3: Purina Pro Plan
    IF NOT EXISTS (SELECT 1 FROM Proveedores WHERE ProveedorId = 3)
    BEGIN
        SET IDENTITY_INSERT Proveedores ON;
        INSERT INTO Proveedores (
            ProveedorId, Nombre, RazonSocial, NIT, Direccion, Telefono,
            Email, SitioWeb, PersonaContacto, Notas, Activo, FechaCreacion, FechaModificacion
        )
        VALUES (
            3, 'Purina Pro Plan', 'Nestlé Purina PetCare México', '900456789-1',
            'Carretera México-Toluca Km 15.5, Estado de México', '55-4567-8912',
            'distribuidores@purina.com.mx', 'https://www.purina.com.mx',
            'Ana Martínez', 'Alimento de alta calidad para mascotas', 1,
            GETDATE(), GETDATE()
        );
        SET IDENTITY_INSERT Proveedores OFF;
        PRINT '   ✅ Proveedor "Purina Pro Plan" creado';
    END
    ELSE
        PRINT '   ℹ️  Proveedor "Purina Pro Plan" ya existe';

    PRINT '';

    -- ============================================================================
    -- PASO 4: SEED PRODUCTOS
    -- ============================================================================
    PRINT '📦 PASO 4: Creando productos base...';

    -- Producto 1: Royal Canin Adult (Perros)
    IF NOT EXISTS (SELECT 1 FROM Productos WHERE IdProducto = 1)
    BEGIN
        SET IDENTITY_INSERT Productos ON;
        INSERT INTO Productos (
            IdProducto, NombreBase, Descripcion, IdCategoria, TipoMascota, 
            URLImagen, Activo, FechaCreacion, FechaActualizacion, ProveedorId
        )
        VALUES (
            1, 'Royal Canin Adult',
            'Alimento balanceado para perros adultos de todas las razas',
            1, 'Perros', NULL, 1, GETDATE(), GETDATE(), 1
        );
        SET IDENTITY_INSERT Productos OFF;
        PRINT '   ✅ Producto "Royal Canin Adult" creado (ID: 1)';
    END
    ELSE
        PRINT '   ℹ️  Producto "Royal Canin Adult" ya existe';

    -- Producto 2: Churu Atún (Gatos - Snack)
    IF NOT EXISTS (SELECT 1 FROM Productos WHERE IdProducto = 2)
    BEGIN
        SET IDENTITY_INSERT Productos ON;
        INSERT INTO Productos (
            IdProducto, NombreBase, Descripcion, IdCategoria, TipoMascota,
            URLImagen, Activo, FechaCreacion, FechaActualizacion, ProveedorId
        )
        VALUES (
            2, 'Churu Atún 4 Piezas 56gr',
            'Snack cremoso para gatos sabor atún, presentación 4 piezas de 56 gramos. Irresistible para tu felino.',
            3, 'Gatos', NULL, 1, GETDATE(), GETDATE(), 1
        );
        SET IDENTITY_INSERT Productos OFF;
        PRINT '   ✅ Producto "Churu Atún 4 Piezas 56gr" creado (ID: 2)';
    END
    ELSE
        PRINT '   ℹ️  Producto "Churu Atún 4 Piezas 56gr" ya existe';

    -- Producto 3: Hill's Science Diet Puppy (Perros)
    IF NOT EXISTS (SELECT 1 FROM Productos WHERE IdProducto = 3)
    BEGIN
        SET IDENTITY_INSERT Productos ON;
        INSERT INTO Productos (
            IdProducto, NombreBase, Descripcion, IdCategoria, TipoMascota,
            URLImagen, Activo, FechaCreacion, FechaActualizacion, ProveedorId
        )
        VALUES (
            3, 'Hill''s Science Diet Puppy',
            'Nutrición científicamente formulada para cachorros',
            1, 'Perros', NULL, 1, GETDATE(), GETDATE(), 2
        );
        SET IDENTITY_INSERT Productos OFF;
        PRINT '   ✅ Producto "Hill''s Science Diet Puppy" creado (ID: 3)';
    END
    ELSE
        PRINT '   ℹ️  Producto "Hill''s Science Diet Puppy" ya existe';

    -- Producto 4: Purina Pro Plan Adult Cat (Gatos)
    IF NOT EXISTS (SELECT 1 FROM Productos WHERE IdProducto = 4)
    BEGIN
        SET IDENTITY_INSERT Productos ON;
        INSERT INTO Productos (
            IdProducto, NombreBase, Descripcion, IdCategoria, TipoMascota,
            URLImagen, Activo, FechaCreacion, FechaActualizacion, ProveedorId
        )
        VALUES (
            4, 'Purina Pro Plan Adult Cat',
            'Alimento completo y balanceado para gatos adultos',
            2, 'Gatos', NULL, 1, GETDATE(), GETDATE(), 3
        );
        SET IDENTITY_INSERT Productos OFF;
        PRINT '   ✅ Producto "Purina Pro Plan Adult Cat" creado (ID: 4)';
    END
    ELSE
        PRINT '   ℹ️  Producto "Purina Pro Plan Adult Cat" ya existe';

    -- Producto 5: Hill's Science Diet Adult (Perros)
    IF NOT EXISTS (SELECT 1 FROM Productos WHERE IdProducto = 5)
    BEGIN
        SET IDENTITY_INSERT Productos ON;
        INSERT INTO Productos (
            IdProducto, NombreBase, Descripcion, IdCategoria, TipoMascota,
            URLImagen, Activo, FechaCreacion, FechaActualizacion, ProveedorId
        )
        VALUES (
            5, 'Hill''s Science Diet Adult',
            'Alimento de alta calidad para perros adultos',
            1, 'Perros', NULL, 1, GETDATE(), GETDATE(), 2
        );
        SET IDENTITY_INSERT Productos OFF;
        PRINT '   ✅ Producto "Hill''s Science Diet Adult" creado (ID: 5)';
    END
    ELSE
        PRINT '   ℹ️  Producto "Hill''s Science Diet Adult" ya existe';

    PRINT '';

    -- ============================================================================
    -- PASO 5: SEED VARIACIONES DE PRODUCTOS
    -- ============================================================================
    PRINT '📊 PASO 5: Creando variaciones de productos...';

    -- Variaciones Producto 1: Royal Canin Adult
    IF NOT EXISTS (SELECT 1 FROM VariacionesProducto WHERE IdProducto = 1)
    BEGIN
        INSERT INTO VariacionesProducto (IdProducto, Peso, Precio, Stock, Activa, FechaCreacion)
        VALUES 
            (1, '3 KG', 285.00, 25, 1, GETDATE()),
            (1, '7.5 KG', 650.00, 15, 1, GETDATE()),
            (1, '15 KG', 1250.00, 10, 1, GETDATE());
        PRINT '   ✅ 3 variaciones creadas para "Royal Canin Adult"';
    END
    ELSE
        PRINT '   ℹ️  Variaciones para "Royal Canin Adult" ya existen';

    -- Variaciones Producto 2: Churu Atún
    IF NOT EXISTS (SELECT 1 FROM VariacionesProducto WHERE IdProducto = 2)
    BEGIN
        INSERT INTO VariacionesProducto (IdProducto, Peso, Precio, Stock, Activa, FechaCreacion)
        VALUES 
            (2, '56 GR', 85.00, 50, 1, GETDATE()),
            (2, '112 GR', 160.00, 30, 1, GETDATE()),
            (2, '224 GR', 300.00, 20, 1, GETDATE());
        PRINT '   ✅ 3 variaciones creadas para "Churu Atún 4 Piezas 56gr"';
    END
    ELSE
        PRINT '   ℹ️  Variaciones para "Churu Atún 4 Piezas 56gr" ya existen';

    -- Variaciones Producto 3: Hill's Science Diet Puppy
    IF NOT EXISTS (SELECT 1 FROM VariacionesProducto WHERE IdProducto = 3)
    BEGIN
        INSERT INTO VariacionesProducto (IdProducto, Peso, Precio, Stock, Activa, FechaCreacion)
        VALUES 
            (3, '2 KG', 320.00, 20, 1, GETDATE()),
            (3, '6.8 KG', 890.00, 12, 1, GETDATE()),
            (3, '12 KG', 1580.00, 8, 1, GETDATE());
        PRINT '   ✅ 3 variaciones creadas para "Hill''s Science Diet Puppy"';
    END
    ELSE
        PRINT '   ℹ️  Variaciones para "Hill''s Science Diet Puppy" ya existen';

    -- Variaciones Producto 4: Purina Pro Plan Adult Cat
    IF NOT EXISTS (SELECT 1 FROM VariacionesProducto WHERE IdProducto = 4)
    BEGIN
        INSERT INTO VariacionesProducto (IdProducto, Peso, Precio, Stock, Activa, FechaCreacion)
        VALUES 
            (4, '1.5 KG', 180.00, 30, 1, GETDATE()),
            (4, '3 KG', 340.00, 20, 1, GETDATE()),
            (4, '7.5 KG', 795.00, 10, 1, GETDATE());
        PRINT '   ✅ 3 variaciones creadas para "Purina Pro Plan Adult Cat"';
    END
    ELSE
        PRINT '   ℹ️  Variaciones para "Purina Pro Plan Adult Cat" ya existen';

    -- Variaciones Producto 5: Hill's Science Diet Adult
    IF NOT EXISTS (SELECT 1 FROM VariacionesProducto WHERE IdProducto = 5)
    BEGIN
        INSERT INTO VariacionesProducto (IdProducto, Peso, Precio, Stock, Activa, FechaCreacion)
        VALUES 
            (5, '3 KG', 350.00, 18, 1, GETDATE()),
            (5, '8 KG', 920.00, 10, 1, GETDATE()),
            (5, '15 KG', 1650.00, 6, 1, GETDATE());
        PRINT '   ✅ 3 variaciones creadas para "Hill''s Science Diet Adult"';
    END
    ELSE
        PRINT '   ℹ️  Variaciones para "Hill''s Science Diet Adult" ya existen';

    PRINT '';

    -- ============================================================================
    -- PASO 6: Confirmar transacción
    -- ============================================================================
    COMMIT TRANSACTION;
    
    PRINT '✅ ============================================================================';
    PRINT '✅ SEED COMPLETADO EXITOSAMENTE';
    PRINT '✅ ============================================================================';
    PRINT '';

    -- ============================================================================
    -- PASO 7: Mostrar resumen de datos creados
    -- ============================================================================
    PRINT '📋 RESUMEN DE DATOS EN LA BASE DE DATOS:';
    PRINT '';

    SELECT COUNT(*) AS 'Total Categorías' FROM Categorias;
    SELECT COUNT(*) AS 'Total Proveedores' FROM Proveedores;
    SELECT COUNT(*) AS 'Total Productos' FROM Productos;
    SELECT COUNT(*) AS 'Total Variaciones' FROM VariacionesProducto;
    
    PRINT '';
    PRINT '📦 PRODUCTOS CREADOS:';
    SELECT 
        p.IdProducto,
        p.NombreBase,
        c.Nombre AS Categoria,
        p.TipoMascota,
        pr.Nombre AS Proveedor,
        COUNT(v.IdVariacion) AS 'Num Variaciones',
        CASE WHEN p.URLImagen IS NULL THEN '❌ Sin imagen' ELSE '✅ Con imagen' END AS 'Estado Imagen'
    FROM Productos p
    LEFT JOIN Categorias c ON p.IdCategoria = c.IdCategoria
    LEFT JOIN Proveedores pr ON p.ProveedorId = pr.ProveedorId
    LEFT JOIN VariacionesProducto v ON p.IdProducto = v.IdProducto
    GROUP BY p.IdProducto, p.NombreBase, c.Nombre, p.TipoMascota, pr.Nombre, p.URLImagen
    ORDER BY p.IdProducto;

    PRINT '';
    PRINT '💡 SIGUIENTE PASO:';
    PRINT '   Ejecutar el script AddSampleProductImages.sql para agregar las URLs de imágenes';
    PRINT '   Comando: sqlcmd -S localhost -d VentasPet_Nueva -E -i backend-config/Scripts/AddSampleProductImages.sql';
    PRINT '';

END TRY
BEGIN CATCH
    -- ============================================================================
    -- MANEJO DE ERRORES
    -- ============================================================================
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;
    
    PRINT '';
    PRINT '❌ ============================================================================';
    PRINT '❌ ERROR AL EJECUTAR EL SCRIPT DE SEED';
    PRINT '❌ ============================================================================';
    PRINT 'Error Number: ' + CAST(ERROR_NUMBER() AS VARCHAR(10));
    PRINT 'Error Message: ' + ERROR_MESSAGE();
    PRINT 'Error Line: ' + CAST(ERROR_LINE() AS VARCHAR(10));
    PRINT 'Error Procedure: ' + ISNULL(ERROR_PROCEDURE(), 'N/A');
    PRINT '';
    PRINT '💡 RECOMENDACIONES:';
    PRINT '   1. Verifique que la base de datos VentasPet_Nueva existe';
    PRINT '   2. Verifique que tiene permisos para crear datos';
    PRINT '   3. Verifique que las tablas necesarias existen (Categorias, Proveedores, Productos, VariacionesProducto)';
    PRINT '   4. Si las tablas no existen, ejecute primero las migraciones de Entity Framework';
    PRINT '      Comando: dotnet ef database update --project backend-config';
    PRINT '';
END CATCH;
GO
