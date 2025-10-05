-- Script to add sample product images from Cloudflare R2
-- This script populates URLImagen for existing products in the database

USE VentasPet_Nueva;
GO

-- First, let's see what products we have
SELECT IdProducto, NombreBase, URLImagen 
FROM Productos 
ORDER BY IdProducto;
GO

-- Update products with sample R2 image URLs
-- Note: These are example URLs. Replace with actual image URLs from your R2 bucket

-- Product 1: Example cat food
UPDATE Productos 
SET URLImagen = 'https://www.velykapet.com/productos/alimentos/gatos/CHURU_ATUN_4_PIEZAS_56_GR.jpg'
WHERE IdProducto = 1 AND (URLImagen IS NULL OR URLImagen = '');

-- Product 2: Example dog food  
UPDATE Productos 
SET URLImagen = 'https://www.velykapet.com/productos/alimentos/perros/ROYAL_CANIN_ADULT.jpg'
WHERE IdProducto = 2 AND (URLImagen IS NULL OR URLImagen = '');

-- Product 3: Example cat food
UPDATE Productos 
SET URLImagen = 'https://www.velykapet.com/productos/alimentos/gatos/BR_FOR_CAT_VET.jpg'
WHERE IdProducto = 3 AND (URLImagen IS NULL OR URLImagen = '');

-- Product 4: Example dog food
UPDATE Productos 
SET URLImagen = 'https://www.velykapet.com/productos/alimentos/perros/HILLS_SCIENCE_DIET_PUPPY.jpg'
WHERE IdProducto = 4 AND (URLImagen IS NULL OR URLImagen = '');

-- Product 5: Example cat food/snacks
UPDATE Productos 
SET URLImagen = 'https://www.velykapet.com/productos/alimentos/gatos/PURINA_PRO_PLAN_ADULT_CAT.jpg'
WHERE IdProducto = 5 AND (URLImagen IS NULL OR URLImagen = '');

-- Verify the updates
SELECT IdProducto, NombreBase, URLImagen,
    CASE 
        WHEN URLImagen LIKE 'https://www.velykapet.com/%' THEN '✅ R2 Image'
        WHEN URLImagen IS NULL OR URLImagen = '' THEN '❌ No Image'
        ELSE '⚠️ Other Source'
    END AS ImageStatus
FROM Productos
ORDER BY IdProducto;
GO
