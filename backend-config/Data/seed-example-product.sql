-- Seed script para agregar el producto de ejemplo: BR FOR CAT VET CONTROL DE PESO
-- Este script agrega un producto real con 3 variaciones de peso como se especifica en el issue

-- Limpiar datos existentes (opcional - comentar si no se desea limpiar)
-- DELETE FROM VariacionesProducto;
-- DELETE FROM Productos;

-- Insertar el producto base
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

-- Insertar las 3 variaciones de peso
INSERT INTO VariacionesProducto (IdProducto, Peso, Precio, Stock, Activa, FechaCreacion)
VALUES 
    (@ProductoId, '500 GR', 20400, 50, 1, GETDATE()),  -- SKU: 300100101
    (@ProductoId, '1.5 KG', 58200, 30, 1, GETDATE()),  -- SKU: 300100102
    (@ProductoId, '3 KG', 110800, 20, 1, GETDATE());   -- SKU: 300100103

-- Verificar los datos insertados
SELECT 
    p.IdProducto,
    p.NombreBase,
    p.Descripcion,
    p.TipoMascota,
    v.IdVariacion,
    v.Peso,
    v.Precio,
    v.Stock,
    v.Activa
FROM Productos p
LEFT JOIN VariacionesProducto v ON p.IdProducto = v.IdProducto
WHERE p.NombreBase = 'BR FOR CAT VET CONTROL DE PESO'
ORDER BY v.Precio;

PRINT 'Producto y variaciones insertados correctamente';
