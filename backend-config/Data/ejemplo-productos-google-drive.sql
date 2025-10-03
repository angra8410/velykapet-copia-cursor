-- =====================================================
-- Script SQL: Ejemplo de Productos con Google Drive
-- =====================================================
-- Este script muestra cómo agregar productos usando
-- imágenes alojadas en Google Drive
-- =====================================================

-- IMPORTANTE: 
-- 1. Las URLs pueden ser pegadas directamente desde Google Drive (formato compartir)
-- 2. El frontend las transformará automáticamente al formato directo
-- 3. Asegúrate de que las imágenes sean públicas ("Cualquier persona con el enlace")

-- =====================================================
-- Ejemplos de Productos para Gatos
-- =====================================================

-- Ejemplo 1: URL de compartir (formato completo con ?usp=sharing)
INSERT INTO Productos (NombreBase, Descripcion, NombreCategoria, TipoMascota, URLImagen, Activo)
VALUES (
    'Royal Canin Indoor Cat 1.5kg',
    'Alimento premium para gatos de interior. Ayuda a controlar las bolas de pelo y mantener un peso saludable.',
    'Alimento para Gatos',
    'Gatos',
    'https://drive.google.com/file/d/1ABC123xyz456/view?usp=sharing',
    1
);

-- Ejemplo 2: URL de compartir (sin parámetros)
INSERT INTO Productos (NombreBase, Descripcion, NombreCategoria, TipoMascota, URLImagen, Activo)
VALUES (
    'Whiskas Gato Adulto 500g',
    'Alimento completo y balanceado para gatos adultos. Rico en proteínas y vitaminas.',
    'Alimento para Gatos',
    'Gatos',
    'https://drive.google.com/file/d/1DEF789abc/view',
    1
);

-- Ejemplo 3: URL directa (ya transformada)
-- Si prefieres transformar manualmente la URL, también funciona
INSERT INTO Productos (NombreBase, Descripcion, NombreCategoria, TipoMascota, URLImagen, Activo)
VALUES (
    'Cat Chow Adulto 3kg',
    'Nutrición completa para gatos adultos de todas las razas.',
    'Alimento para Gatos',
    'Gatos',
    'https://drive.google.com/uc?export=view&id=1GHI456def',
    1
);

-- =====================================================
-- Ejemplos de Productos para Perros
-- =====================================================

-- Ejemplo 4: Alimento para perros
INSERT INTO Productos (NombreBase, Descripcion, NombreCategoria, TipoMascota, URLImagen, Activo)
VALUES (
    'Pedigree Adulto 3kg',
    'Alimento completo y balanceado para perros adultos. Con pollo y arroz.',
    'Alimento para Perros',
    'Perros',
    'https://drive.google.com/file/d/1JKL123mno/view?usp=sharing',
    1
);

-- Ejemplo 5: Producto con formato open?id
INSERT INTO Productos (NombreBase, Descripcion, NombreCategoria, TipoMascota, URLImagen, Activo)
VALUES (
    'Royal Canin Size Perro 7.5kg',
    'Fórmula especial para perros de tamaño mediano. Alto contenido proteico.',
    'Alimento para Perros',
    'Perros',
    'https://drive.google.com/open?id=1PQR789stu',
    1
);

-- =====================================================
-- Agregar Variaciones a los Productos
-- =====================================================

-- NOTA: Primero necesitas obtener el IdProducto del producto insertado
-- Puedes usar SCOPE_IDENTITY() o @@IDENTITY en SQL Server

-- Variaciones para Royal Canin Indoor Cat
DECLARE @ProductoId INT;
SET @ProductoId = (SELECT IdProducto FROM Productos WHERE NombreBase = 'Royal Canin Indoor Cat 1.5kg');

INSERT INTO VariacionesProducto (IdProducto, Peso, Precio, Stock, Activa)
VALUES 
    (@ProductoId, '500g', 204.00, 50, 1),
    (@ProductoId, '1.5kg', 582.00, 30, 1),
    (@ProductoId, '4kg', 1344.00, 20, 1);

-- Variaciones para Whiskas
SET @ProductoId = (SELECT IdProducto FROM Productos WHERE NombreBase = 'Whiskas Gato Adulto 500g');

INSERT INTO VariacionesProducto (IdProducto, Peso, Precio, Stock, Activa)
VALUES 
    (@ProductoId, '500g', 89.00, 100, 1),
    (@ProductoId, '1kg', 165.00, 80, 1);

-- =====================================================
-- UPDATE: Actualizar URLs Existentes
-- =====================================================

-- Si ya tienes productos y quieres agregar imágenes de Google Drive:

UPDATE Productos 
SET URLImagen = 'https://drive.google.com/file/d/TU_ID_AQUI/view?usp=sharing'
WHERE IdProducto = 1;

-- Actualizar múltiples productos:
UPDATE Productos 
SET URLImagen = CASE IdProducto
    WHEN 1 THEN 'https://drive.google.com/file/d/ID_PRODUCTO_1/view?usp=sharing'
    WHEN 2 THEN 'https://drive.google.com/file/d/ID_PRODUCTO_2/view?usp=sharing'
    WHEN 3 THEN 'https://drive.google.com/file/d/ID_PRODUCTO_3/view?usp=sharing'
    ELSE URLImagen
END
WHERE IdProducto IN (1, 2, 3);

-- =====================================================
-- CONSULTAS ÚTILES
-- =====================================================

-- Ver todos los productos con URLs de Google Drive
SELECT 
    IdProducto,
    NombreBase,
    URLImagen,
    CASE 
        WHEN URLImagen LIKE '%drive.google.com%' THEN 'Google Drive'
        ELSE 'Otra fuente'
    END AS TipoImagen
FROM Productos
WHERE URLImagen IS NOT NULL;

-- Ver productos SIN imagen
SELECT IdProducto, NombreBase, NombreCategoria
FROM Productos
WHERE URLImagen IS NULL OR URLImagen = '';

-- Extraer IDs de archivos de Google Drive
SELECT 
    IdProducto,
    NombreBase,
    URLImagen,
    -- Extraer el ID del archivo (entre /d/ y /view o /?)
    CASE 
        WHEN URLImagen LIKE '%/file/d/%' 
        THEN SUBSTRING(URLImagen, 
            CHARINDEX('/d/', URLImagen) + 3, 
            CHARINDEX('/', URLImagen, CHARINDEX('/d/', URLImagen) + 3) - CHARINDEX('/d/', URLImagen) - 3
        )
        ELSE 'No es URL de Drive'
    END AS GoogleDriveID
FROM Productos
WHERE URLImagen LIKE '%drive.google.com%';

-- =====================================================
-- MIGRACIÓN MASIVA: Convertir URLs a formato directo
-- =====================================================

-- Si prefieres guardar las URLs ya transformadas en la base de datos
-- (aunque no es necesario, el frontend lo hace automáticamente)

UPDATE Productos 
SET URLImagen = CONCAT(
    'https://drive.google.com/uc?export=view&id=',
    SUBSTRING(
        URLImagen, 
        CHARINDEX('/d/', URLImagen) + 3, 
        CHARINDEX('/', URLImagen, CHARINDEX('/d/', URLImagen) + 3) - CHARINDEX('/d/', URLImagen) - 3
    )
)
WHERE URLImagen LIKE '%drive.google.com/file/d/%'
  AND URLImagen NOT LIKE '%uc?export=view%';

-- Verificar la conversión
SELECT 
    IdProducto,
    NombreBase,
    URLImagen,
    CASE 
        WHEN URLImagen LIKE '%uc?export=view%' THEN '✅ Directo'
        WHEN URLImagen LIKE '%/file/d/%' THEN '⚠️ Compartir'
        ELSE '❓ Otro'
    END AS TipoURL
FROM Productos
WHERE URLImagen LIKE '%drive.google.com%';

-- =====================================================
-- PLANTILLA PARA IMPORTACIÓN MASIVA
-- =====================================================

-- Si tienes un Excel/CSV con productos e IDs de Google Drive:

/*
FORMATO DEL CSV:
NombreBase,Descripcion,Categoria,TipoMascota,GoogleDriveID,Peso,Precio,Stock

Ejemplo:
Royal Canin Indoor Cat,Alimento premium para gatos,Alimento para Gatos,Gatos,1ABC123xyz,1.5kg,582.00,30
Whiskas Adulto,Alimento balanceado,Alimento para Gatos,Gatos,1DEF456abc,500g,89.00,100
*/

-- Luego puedes usar BULK INSERT o crear un script como:

DECLARE @GoogleDriveID VARCHAR(100);

-- Ejemplo de inserción programática
SET @GoogleDriveID = '1ABC123xyz'; -- ID del archivo en Google Drive

INSERT INTO Productos (NombreBase, Descripcion, NombreCategoria, TipoMascota, URLImagen, Activo)
VALUES (
    'Nombre del Producto',
    'Descripción del producto',
    'Categoría',
    'Tipo Mascota',
    CONCAT('https://drive.google.com/uc?export=view&id=', @GoogleDriveID),
    1
);

-- =====================================================
-- BACKUP Y ROLLBACK
-- =====================================================

-- Antes de hacer cambios masivos, crear backup de URLs
CREATE TABLE Productos_URLImagen_Backup AS
SELECT IdProducto, URLImagen, GETDATE() AS FechaBackup
FROM Productos;

-- Restaurar desde backup si algo sale mal
UPDATE Productos 
SET URLImagen = b.URLImagen
FROM Productos p
INNER JOIN Productos_URLImagen_Backup b ON p.IdProducto = b.IdProducto;

-- =====================================================
-- VALIDACIÓN DE URLS
-- =====================================================

-- Verificar que todas las URLs de Google Drive tengan el formato correcto
SELECT 
    IdProducto,
    NombreBase,
    URLImagen,
    CASE 
        WHEN URLImagen LIKE '%drive.google.com/file/d/%/view%' THEN '✅ Válido (Compartir)'
        WHEN URLImagen LIKE '%drive.google.com/uc?export=view&id=%' THEN '✅ Válido (Directo)'
        WHEN URLImagen LIKE '%drive.google.com/open?id=%' THEN '✅ Válido (Open)'
        WHEN URLImagen LIKE '%drive.google.com%' THEN '⚠️ Formato desconocido'
        ELSE '❌ No es Google Drive'
    END AS Validacion
FROM Productos
WHERE URLImagen IS NOT NULL;

-- =====================================================
-- EJEMPLOS DE PRODUCTOS COMPLETOS CON VARIACIONES
-- =====================================================

-- Producto completo con todas sus variaciones
BEGIN TRANSACTION;

-- Insertar producto
DECLARE @NuevoProductoId INT;

INSERT INTO Productos (NombreBase, Descripcion, NombreCategoria, TipoMascota, URLImagen, Activo)
VALUES (
    'Royal Canin Veterinary Control de Peso',
    'Alimento con un balance adecuado de nutrientes que ayuda a reducir la formación de bolas de pelo.',
    'Alimento para Gatos',
    'Gatos',
    'https://drive.google.com/file/d/1XYZ789control/view?usp=sharing',
    1
);

SET @NuevoProductoId = SCOPE_IDENTITY();

-- Insertar variaciones
INSERT INTO VariacionesProducto (IdProducto, Peso, Precio, Stock, Activa)
VALUES 
    (@NuevoProductoId, '500g', 220.00, 40, 1),
    (@NuevoProductoId, '1.5kg', 620.00, 25, 1),
    (@NuevoProductoId, '3kg', 1150.00, 15, 1);

COMMIT TRANSACTION;

-- =====================================================
-- NOTAS FINALES
-- =====================================================

/*
IMPORTANTE:

1. ✅ Puedes usar URLs de compartir directamente (el formato con /file/d/ID/view)
2. ✅ El frontend transformará automáticamente las URLs al formato directo
3. ✅ No es necesario transformar las URLs en la base de datos (pero puedes hacerlo)
4. ⚠️ Asegúrate de que las imágenes sean PÚBLICAS en Google Drive
5. ⚠️ El permiso debe ser "Cualquier persona con el enlace" + "Lector"
6. 💡 Optimiza las imágenes ANTES de subirlas a Drive (max 800x800px, <100KB)
7. 💡 Usa nombres descriptivos para las imágenes
8. 💡 Organiza las imágenes en carpetas por categoría en Drive

VENTAJAS:
✅ Fácil de implementar
✅ No requiere servidor de imágenes propio
✅ Gratis (hasta 15GB en Google Drive)

DESVENTAJAS:
⚠️ Cuota de tráfico limitada
⚠️ Performance más lenta que CDNs
⚠️ Sin optimización automática de imágenes

PARA PRODUCCIÓN:
Cuando el proyecto crezca, considera migrar a Cloudinary o AWS S3.
Ver guía completa en: GUIA_IMAGENES_GOOGLE_DRIVE.md
*/

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
