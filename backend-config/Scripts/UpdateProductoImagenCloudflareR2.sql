-- Script SQL para Actualizar Producto con Imagen de Cloudflare R2
-- Proyecto: VelyKapet E-commerce
-- Fecha: Diciembre 2024
-- Objetivo: Asociar imagen pública de Cloudflare R2 al producto de prueba

-- =============================================================================
-- ACTUALIZACIÓN DEL PRODUCTO IdProducto = 2
-- =============================================================================

-- Actualizar información del producto
UPDATE Productos 
SET 
    NombreBase = 'Churu Atún 4 Piezas 56gr',
    Descripcion = 'Snack cremoso para gatos sabor atún, presentación 4 piezas de 56 gramos. Irresistible para tu felino.',
    IdCategoria = 3, -- Snacks y Premios
    TipoMascota = 'Gatos',
    URLImagen = 'https://www.velykapet.com/CHURU_ATUN_4_PIEZAS_56_GR.jpg',
    FechaActualizacion = GETDATE()
WHERE IdProducto = 2;

-- Actualizar variaciones del producto
UPDATE VariacionesProducto 
SET 
    Peso = '56 GR',
    Precio = 85.00,
    Stock = 50
WHERE IdVariacion = 4 AND IdProducto = 2;

UPDATE VariacionesProducto 
SET 
    Peso = '112 GR',
    Precio = 160.00,
    Stock = 30
WHERE IdVariacion = 5 AND IdProducto = 2;

UPDATE VariacionesProducto 
SET 
    Peso = '224 GR',
    Precio = 295.00,
    Stock = 20
WHERE IdVariacion = 6 AND IdProducto = 2;

-- =============================================================================
-- VERIFICACIÓN
-- =============================================================================

-- Mostrar el producto actualizado
SELECT 
    p.IdProducto,
    p.NombreBase,
    p.Descripcion,
    p.URLImagen,
    c.Nombre AS Categoria,
    p.TipoMascota,
    p.Activo,
    p.FechaActualizacion
FROM Productos p
INNER JOIN Categorias c ON p.IdCategoria = c.IdCategoria
WHERE p.IdProducto = 2;

-- Mostrar las variaciones actualizadas
SELECT 
    v.IdVariacion,
    v.IdProducto,
    p.NombreBase AS Producto,
    v.Peso,
    v.Precio,
    v.Stock,
    v.Activa
FROM VariacionesProducto v
INNER JOIN Productos p ON v.IdProducto = p.IdProducto
WHERE v.IdProducto = 2
ORDER BY v.Precio ASC;

-- =============================================================================
-- SCRIPT ADICIONAL: Actualizar otros productos (ejemplo)
-- =============================================================================

-- Descomentar y modificar según necesidades

/*
-- Ejemplo 1: Actualizar producto individual
UPDATE Productos 
SET 
    URLImagen = 'https://www.velykapet.com/productos/alimentos/gatos/NOMBRE_PRODUCTO.jpg',
    FechaActualizacion = GETDATE()
WHERE IdProducto = 3;

-- Ejemplo 2: Migración masiva desde rutas locales a Cloudflare R2
UPDATE Productos 
SET 
    URLImagen = REPLACE(
        URLImagen, 
        '/images/productos/', 
        'https://www.velykapet.com/productos/'
    ),
    FechaActualizacion = GETDATE()
WHERE URLImagen LIKE '/images/productos/%';

-- Ejemplo 3: Actualizar solo productos de gatos sin imagen
UPDATE Productos 
SET 
    URLImagen = 'https://www.velykapet.com/sistema/placeholders/producto-gato-sin-imagen.jpg',
    FechaActualizacion = GETDATE()
WHERE TipoMascota = 'Gatos' 
  AND (URLImagen IS NULL OR URLImagen = '');
*/

-- =============================================================================
-- VALIDACIÓN DE IMÁGENES
-- =============================================================================

-- Listar todos los productos con sus imágenes
SELECT 
    IdProducto,
    NombreBase,
    TipoMascota,
    URLImagen,
    CASE 
        WHEN URLImagen LIKE 'https://www.velykapet.com/%' THEN 'Cloudflare R2 ✅'
        WHEN URLImagen LIKE '/images/%' THEN 'Ruta local ⚠️'
        WHEN URLImagen IS NULL OR URLImagen = '' THEN 'Sin imagen ❌'
        ELSE 'Otro servicio 🔍'
    END AS TipoImagen,
    Activo
FROM Productos
ORDER BY 
    CASE 
        WHEN URLImagen LIKE 'https://www.velykapet.com/%' THEN 1
        WHEN URLImagen LIKE '/images/%' THEN 2
        WHEN URLImagen IS NULL OR URLImagen = '' THEN 3
        ELSE 4
    END,
    IdProducto;

-- Estadísticas de imágenes
SELECT 
    CASE 
        WHEN URLImagen LIKE 'https://www.velykapet.com/%' THEN 'Cloudflare R2'
        WHEN URLImagen LIKE '/images/%' THEN 'Ruta local'
        WHEN URLImagen IS NULL OR URLImagen = '' THEN 'Sin imagen'
        ELSE 'Otro servicio'
    END AS TipoImagen,
    COUNT(*) AS Cantidad,
    CAST(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM Productos) AS DECIMAL(5,2)) AS Porcentaje
FROM Productos
GROUP BY 
    CASE 
        WHEN URLImagen LIKE 'https://www.velykapet.com/%' THEN 'Cloudflare R2'
        WHEN URLImagen LIKE '/images/%' THEN 'Ruta local'
        WHEN URLImagen IS NULL OR URLImagen = '' THEN 'Sin imagen'
        ELSE 'Otro servicio'
    END
ORDER BY Cantidad DESC;
