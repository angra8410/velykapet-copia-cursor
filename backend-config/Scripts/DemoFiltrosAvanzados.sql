-- ============================================================================
-- Script de Ejemplo: Uso de Filtros Avanzados para Productos
-- ============================================================================
-- Este script demuestra cómo usar las nuevas tablas maestras para
-- filtrar y categorizar productos en VelyKaPet
-- ============================================================================

USE VentasPet_Nueva;
GO

PRINT '';
PRINT '═══════════════════════════════════════════════════════════════════════════';
PRINT '📋 DEMOSTRACIÓN DE FILTROS AVANZADOS DE PRODUCTOS';
PRINT '═══════════════════════════════════════════════════════════════════════════';
PRINT '';

-- ============================================================================
-- SECCIÓN 1: CONSULTAR TABLAS MAESTRAS
-- ============================================================================
PRINT '───────────────────────────────────────────────────────────────────────────';
PRINT '1️⃣  TABLAS MAESTRAS DE FILTROS';
PRINT '───────────────────────────────────────────────────────────────────────────';
PRINT '';

PRINT '🐾 TIPOS DE MASCOTA:';
SELECT * FROM MascotaTipo WHERE Activo = 1;
PRINT '';

PRINT '🍖 CATEGORÍAS DE ALIMENTO:';
SELECT 
    ca.IdCategoriaAlimento,
    ca.Nombre AS Categoria,
    mt.Nombre AS TipoMascota,
    CASE WHEN ca.Activa = 1 THEN 'Sí' ELSE 'No' END AS Activa
FROM CategoriaAlimento ca
LEFT JOIN MascotaTipo mt ON ca.IdMascotaTipo = mt.IdMascotaTipo
WHERE ca.Activa = 1
ORDER BY mt.Nombre, ca.Nombre;
PRINT '';

PRINT '📂 SUBCATEGORÍAS DE ALIMENTO:';
SELECT 
    sa.IdSubcategoria,
    sa.Nombre AS Subcategoria,
    ca.Nombre AS Categoria,
    mt.Nombre AS TipoMascota
FROM SubcategoriaAlimento sa
JOIN CategoriaAlimento ca ON sa.IdCategoriaAlimento = ca.IdCategoriaAlimento
LEFT JOIN MascotaTipo mt ON ca.IdMascotaTipo = mt.IdMascotaTipo
WHERE sa.Activa = 1
ORDER BY mt.Nombre, ca.Nombre, sa.Nombre;
PRINT '';

PRINT '📦 PRESENTACIONES DE EMPAQUE:';
SELECT * FROM PresentacionEmpaque WHERE Activa = 1;
PRINT '';

-- ============================================================================
-- SECCIÓN 2: EJEMPLOS DE FILTRADO DE PRODUCTOS
-- ============================================================================
PRINT '───────────────────────────────────────────────────────────────────────────';
PRINT '2️⃣  EJEMPLOS DE CONSULTAS CON FILTROS';
PRINT '───────────────────────────────────────────────────────────────────────────';
PRINT '';

-- Ejemplo 1: Productos para GATOS
PRINT '🐱 Ejemplo 1: TODOS LOS PRODUCTOS PARA GATOS';
SELECT 
    p.IdProducto,
    p.NombreBase,
    mt.Nombre AS TipoMascota,
    ca.Nombre AS CategoriaAlimento,
    sa.Nombre AS Subcategoria,
    pe.Nombre AS Presentacion
FROM Productos p
LEFT JOIN MascotaTipo mt ON p.IdMascotaTipo = mt.IdMascotaTipo
LEFT JOIN CategoriaAlimento ca ON p.IdCategoriaAlimento = ca.IdCategoriaAlimento
LEFT JOIN SubcategoriaAlimento sa ON p.IdSubcategoria = sa.IdSubcategoria
LEFT JOIN PresentacionEmpaque pe ON p.IdPresentacion = pe.IdPresentacion
WHERE p.IdMascotaTipo = 1  -- GATO
  AND p.Activo = 1;
PRINT '';

-- Ejemplo 2: Alimento Seco para Perros
PRINT '🐕 Ejemplo 2: ALIMENTO SECO PARA PERROS';
SELECT 
    p.IdProducto,
    p.NombreBase,
    mt.Nombre AS TipoMascota,
    ca.Nombre AS CategoriaAlimento,
    sa.Nombre AS Subcategoria,
    pe.Nombre AS Presentacion
FROM Productos p
LEFT JOIN MascotaTipo mt ON p.IdMascotaTipo = mt.IdMascotaTipo
LEFT JOIN CategoriaAlimento ca ON p.IdCategoriaAlimento = ca.IdCategoriaAlimento
LEFT JOIN SubcategoriaAlimento sa ON p.IdSubcategoria = sa.IdSubcategoria
LEFT JOIN PresentacionEmpaque pe ON p.IdPresentacion = pe.IdPresentacion
WHERE p.IdMascotaTipo = 2          -- PERRO
  AND p.IdCategoriaAlimento = 1    -- ALIMENTO SECO
  AND p.Activo = 1;
PRINT '';

-- Ejemplo 3: Productos en presentación SOBRE
PRINT '📦 Ejemplo 3: PRODUCTOS EN PRESENTACIÓN SOBRE';
SELECT 
    p.IdProducto,
    p.NombreBase,
    mt.Nombre AS TipoMascota,
    ca.Nombre AS CategoriaAlimento,
    pe.Nombre AS Presentacion
FROM Productos p
LEFT JOIN MascotaTipo mt ON p.IdMascotaTipo = mt.IdMascotaTipo
LEFT JOIN CategoriaAlimento ca ON p.IdCategoriaAlimento = ca.IdCategoriaAlimento
LEFT JOIN PresentacionEmpaque pe ON p.IdPresentacion = pe.IdPresentacion
WHERE p.IdPresentacion = 3  -- SOBRE
  AND p.Activo = 1;
PRINT '';

-- Ejemplo 4: Filtro combinado - Alimento para Gatos Adultos en Bolsa
PRINT '🎯 Ejemplo 4: ALIMENTO SECO PARA GATOS ADULTOS EN BOLSA';
SELECT 
    p.IdProducto,
    p.NombreBase,
    mt.Nombre AS TipoMascota,
    ca.Nombre AS CategoriaAlimento,
    sa.Nombre AS Subcategoria,
    pe.Nombre AS Presentacion
FROM Productos p
LEFT JOIN MascotaTipo mt ON p.IdMascotaTipo = mt.IdMascotaTipo
LEFT JOIN CategoriaAlimento ca ON p.IdCategoriaAlimento = ca.IdCategoriaAlimento
LEFT JOIN SubcategoriaAlimento sa ON p.IdSubcategoria = sa.IdSubcategoria
LEFT JOIN PresentacionEmpaque pe ON p.IdPresentacion = pe.IdPresentacion
WHERE p.IdMascotaTipo = 1          -- GATO
  AND p.IdCategoriaAlimento = 2    -- ALIMENTO SECO (Gatos)
  AND p.IdSubcategoria = 6         -- ADULT
  AND p.IdPresentacion = 1         -- BOLSA
  AND p.Activo = 1;
PRINT '';

-- ============================================================================
-- SECCIÓN 3: ESTADÍSTICAS DE PRODUCTOS POR FILTRO
-- ============================================================================
PRINT '───────────────────────────────────────────────────────────────────────────';
PRINT '3️⃣  ESTADÍSTICAS DE PRODUCTOS';
PRINT '───────────────────────────────────────────────────────────────────────────';
PRINT '';

PRINT '📊 PRODUCTOS POR TIPO DE MASCOTA:';
SELECT 
    mt.Nombre AS TipoMascota,
    COUNT(p.IdProducto) AS CantidadProductos
FROM MascotaTipo mt
LEFT JOIN Productos p ON mt.IdMascotaTipo = p.IdMascotaTipo AND p.Activo = 1
GROUP BY mt.IdMascotaTipo, mt.Nombre
ORDER BY CantidadProductos DESC;
PRINT '';

PRINT '📊 PRODUCTOS POR CATEGORÍA DE ALIMENTO:';
SELECT 
    ca.Nombre AS CategoriaAlimento,
    mt.Nombre AS TipoMascota,
    COUNT(p.IdProducto) AS CantidadProductos
FROM CategoriaAlimento ca
LEFT JOIN MascotaTipo mt ON ca.IdMascotaTipo = mt.IdMascotaTipo
LEFT JOIN Productos p ON ca.IdCategoriaAlimento = p.IdCategoriaAlimento AND p.Activo = 1
GROUP BY ca.IdCategoriaAlimento, ca.Nombre, mt.Nombre
ORDER BY TipoMascota, CantidadProductos DESC;
PRINT '';

PRINT '📊 PRODUCTOS POR PRESENTACIÓN:';
SELECT 
    pe.Nombre AS Presentacion,
    COUNT(p.IdProducto) AS CantidadProductos
FROM PresentacionEmpaque pe
LEFT JOIN Productos p ON pe.IdPresentacion = p.IdPresentacion AND p.Activo = 1
GROUP BY pe.IdPresentacion, pe.Nombre
ORDER BY CantidadProductos DESC;
PRINT '';

-- ============================================================================
-- SECCIÓN 4: EJEMPLOS DE ACTUALIZACIÓN DE PRODUCTOS
-- ============================================================================
PRINT '───────────────────────────────────────────────────────────────────────────';
PRINT '4️⃣  EJEMPLOS DE ACTUALIZACIÓN DE PRODUCTOS';
PRINT '───────────────────────────────────────────────────────────────────────────';
PRINT '';

PRINT '💡 Para asociar un producto existente a las nuevas tablas maestras:';
PRINT '';
PRINT '   -- Ejemplo: Actualizar producto "Royal Canin Adult" (IdProducto = 1)';
PRINT '   UPDATE Productos';
PRINT '   SET IdMascotaTipo = 2,           -- PERRO';
PRINT '       IdCategoriaAlimento = 1,      -- ALIMENTO SECO (Perros)';
PRINT '       IdSubcategoria = 2,           -- ADULT';
PRINT '       IdPresentacion = 1            -- BOLSA';
PRINT '   WHERE IdProducto = 1;';
PRINT '';
PRINT '   -- Ejemplo: Actualizar snack para gatos';
PRINT '   UPDATE Productos';
PRINT '   SET IdMascotaTipo = 1,           -- GATO';
PRINT '       IdCategoriaAlimento = 5,      -- SNACKS Y PREMIOS';
PRINT '       IdSubcategoria = 13,          -- SNACKS NATURALES';
PRINT '       IdPresentacion = 3            -- SOBRE';
PRINT '   WHERE IdProducto = 2;';
PRINT '';

-- ============================================================================
-- SECCIÓN 5: CONSULTA COMPLETA DE PRODUCTOS CON TODOS LOS DETALLES
-- ============================================================================
PRINT '───────────────────────────────────────────────────────────────────────────';
PRINT '5️⃣  VISTA COMPLETA DE PRODUCTOS CON FILTROS';
PRINT '───────────────────────────────────────────────────────────────────────────';
PRINT '';

SELECT 
    p.IdProducto,
    p.NombreBase,
    p.Descripcion,
    -- Categoría original (compatibilidad)
    c.Nombre AS CategoriaOriginal,
    p.TipoMascota AS TipoMascotaOriginal,
    -- Nuevos filtros avanzados
    mt.Nombre AS TipoMascotaFiltro,
    ca.Nombre AS CategoriaAlimentoFiltro,
    sa.Nombre AS SubcategoriaFiltro,
    pe.Nombre AS PresentacionFiltro,
    -- Estado
    CASE WHEN p.Activo = 1 THEN 'Activo' ELSE 'Inactivo' END AS Estado
FROM Productos p
JOIN Categorias c ON p.IdCategoria = c.IdCategoria
LEFT JOIN MascotaTipo mt ON p.IdMascotaTipo = mt.IdMascotaTipo
LEFT JOIN CategoriaAlimento ca ON p.IdCategoriaAlimento = ca.IdCategoriaAlimento
LEFT JOIN SubcategoriaAlimento sa ON p.IdSubcategoria = sa.IdSubcategoria
LEFT JOIN PresentacionEmpaque pe ON p.IdPresentacion = pe.IdPresentacion
WHERE p.Activo = 1
ORDER BY p.IdProducto;
PRINT '';

PRINT '═══════════════════════════════════════════════════════════════════════════';
PRINT '✅ DEMOSTRACIÓN COMPLETADA';
PRINT '═══════════════════════════════════════════════════════════════════════════';
PRINT '';
PRINT '📚 Documentación completa en: /GUIA_FILTROS_AVANZADOS.md';
PRINT '';
