# 📚 Guía de Scripts de Seed SQL - VentasPet

## 📁 Contenido del Directorio

- **`seed-example-product.sql`**: Script mejorado que inserta el producto "BR FOR CAT VET CONTROL DE PESO" con validación de integridad referencial
- **`seed-template.sql`**: Template reutilizable para crear nuevos scripts de seed siguiendo las mejores prácticas
- **`TEST_SEED_SCRIPT.md`**: Guía completa de pruebas para validar scripts de seed
- **`VentasPetDbContext.cs`**: Contexto de Entity Framework con configuración de la base de datos

## 🎯 Propósito

Los scripts de seed SQL permiten:
- Insertar datos iniciales en la base de datos
- Poblar tablas con productos de ejemplo
- Configurar datos de prueba para desarrollo
- Mantener consistencia entre entornos (desarrollo, staging, producción)

## ⚠️ Problema Resuelto

### Problema Original

El script original de seed tenía varios problemas de integridad referencial:

1. **Error de Foreign Key en Categoría**:
   ```
   The INSERT statement conflicted with the FOREIGN KEY constraint 
   "FK_Productos_Categorias_IdCategoria". The conflict occurred in 
   table "dbo.Categorias", column 'IdCategoria'.
   ```

2. **Error de NULL en VariacionesProducto**:
   ```
   Cannot insert the value NULL into column 'IdProducto', 
   table 'VariacionesProducto'; column does not allow nulls.
   ```

3. **Falta de validaciones**: No verificaba si las referencias foráneas existían antes de usarlas

### Solución Implementada

El script mejorado (`seed-example-product.sql`) ahora:

✅ **Valida la existencia de la categoría** antes de insertar el producto  
✅ **Crea automáticamente la categoría** si no existe  
✅ **Valida la existencia del proveedor** antes de insertar el producto  
✅ **Crea automáticamente el proveedor** si no existe  
✅ **Verifica duplicados** antes de insertar para evitar errores  
✅ **Usa transacciones** para mantener la integridad de datos  
✅ **Maneja errores** con bloques TRY-CATCH  
✅ **Proporciona mensajes informativos** del progreso  
✅ **Muestra los datos insertados** al final para verificación  

## 🚀 Cómo Usar

### Opción 1: Ejecutar el Script de Ejemplo

```sql
-- 1. Conectar a la base de datos
USE VentasPet_Nueva;
GO

-- 2. Ejecutar el script completo
-- (Copiar y pegar el contenido de seed-example-product.sql)
```

### Opción 2: Crear un Nuevo Script desde el Template

1. Copie `seed-template.sql` y renómbrelo:
   ```bash
   cp seed-template.sql seed-product-mi-nuevo-producto.sql
   ```

2. Edite el nuevo archivo y modifique las secciones marcadas con `[MODIFICAR]`:
   - ID y nombre de la categoría
   - ID y nombre del proveedor
   - Nombre y descripción del producto
   - Variaciones del producto (peso, precio, stock)

3. Ejecute el script en SQL Server Management Studio o Azure Data Studio

## 📋 Buenas Prácticas Implementadas

### 1. Transacciones

```sql
BEGIN TRANSACTION;
BEGIN TRY
    -- Operaciones de inserción
    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    ROLLBACK TRANSACTION;
    -- Manejo de error
END CATCH;
```

**Beneficio**: Si algo falla, todos los cambios se revierten automáticamente.

### 2. Validación de Referencias Foráneas

```sql
IF NOT EXISTS (SELECT 1 FROM Categorias WHERE IdCategoria = 2)
BEGIN
    -- Crear la categoría
END
```

**Beneficio**: Evita errores de foreign key constraint.

### 3. Creación Automática de Dependencias

```sql
SET IDENTITY_INSERT Categorias ON;
INSERT INTO Categorias (IdCategoria, Nombre, ...) VALUES (...);
SET IDENTITY_INSERT Categorias OFF;
```

**Beneficio**: El script funciona incluso si las dependencias no existen.

### 4. Validación de Duplicados

```sql
IF EXISTS (SELECT 1 FROM Productos WHERE NombreBase = 'NOMBRE_PRODUCTO')
BEGIN
    PRINT 'El producto ya existe. Abortando inserción.';
    ROLLBACK TRANSACTION;
    RETURN;
END
```

**Beneficio**: Previene errores al ejecutar el script múltiples veces.

### 5. Validación de SCOPE_IDENTITY()

```sql
DECLARE @ProductoId INT = SCOPE_IDENTITY();

IF @ProductoId IS NULL
BEGIN
    PRINT 'ERROR: No se pudo obtener el ID del producto insertado.';
    ROLLBACK TRANSACTION;
    RETURN;
END
```

**Beneficio**: Detecta fallos en la inserción antes de continuar.

### 6. Manejo de Errores con Mensajes Claros

```sql
BEGIN CATCH
    PRINT 'Error Number: ' + CAST(ERROR_NUMBER() AS VARCHAR(10));
    PRINT 'Error Message: ' + ERROR_MESSAGE();
    PRINT 'Error Line: ' + CAST(ERROR_LINE() AS VARCHAR(10));
    -- Recomendaciones
END CATCH
```

**Beneficio**: Facilita el diagnóstico de problemas.

### 7. Mensajes Informativos

```sql
PRINT '✅ Categoría "Alimento para Gatos" (ID: 2) creada exitosamente.';
PRINT '📦 Insertando producto...';
PRINT '🎉 PROCESO COMPLETADO EXITOSAMENTE';
```

**Beneficio**: El usuario puede seguir el progreso del script.

### 8. Verificación Final

```sql
SELECT p.*, c.Nombre AS Categoria, pr.Nombre AS Proveedor, v.*
FROM Productos p
INNER JOIN Categorias c ON p.IdCategoria = c.IdCategoria
INNER JOIN Proveedores pr ON p.ProveedorId = pr.ProveedorId
LEFT JOIN VariacionesProducto v ON p.IdProducto = v.IdProducto
WHERE p.NombreBase = 'NOMBRE_PRODUCTO'
```

**Beneficio**: Confirma visualmente que los datos se insertaron correctamente.

## 🧪 Pruebas

Consulte el archivo **`TEST_SEED_SCRIPT.md`** para:
- Escenarios de prueba detallados
- Resultados esperados para cada escenario
- Scripts de limpieza de datos
- Solución de problemas comunes

### Escenarios Probados

1. ✅ Base de datos vacía (no existen categoría ni proveedor)
2. ✅ Categoría y proveedor ya existen
3. ✅ Solo falta la categoría
4. ✅ Solo falta el proveedor
5. ✅ Producto ya existe (prevención de duplicados)
6. ✅ Errores de permisos

## 🔍 Estructura de Datos

### Tablas Involucradas

```
Categorias
├─ IdCategoria (PK, INT)
├─ Nombre (NVARCHAR(100))
├─ Descripcion (NVARCHAR(500))
├─ TipoMascota (NVARCHAR(50))
└─ Activa (BIT)

Proveedores
├─ ProveedorId (PK, INT)
├─ Nombre (NVARCHAR(100))
├─ RazonSocial (NVARCHAR(200))
├─ NIT (NVARCHAR(20))
├─ Direccion (NVARCHAR(500))
├─ Telefono (NVARCHAR(20))
├─ Email (NVARCHAR(100))
├─ SitioWeb (NVARCHAR(200))
├─ PersonaContacto (NVARCHAR(100))
├─ Notas (NVARCHAR(1000))
├─ Activo (BIT)
├─ FechaCreacion (DATETIME)
└─ FechaModificacion (DATETIME)

Productos
├─ IdProducto (PK, INT)
├─ NombreBase (NVARCHAR(200))
├─ Descripcion (NVARCHAR(1000))
├─ IdCategoria (FK -> Categorias)
├─ TipoMascota (NVARCHAR(50))
├─ URLImagen (NVARCHAR(500))
├─ Activo (BIT)
├─ FechaCreacion (DATETIME)
├─ FechaActualizacion (DATETIME)
└─ ProveedorId (FK -> Proveedores)

VariacionesProducto
├─ IdVariacion (PK, INT)
├─ IdProducto (FK -> Productos)
├─ Peso (NVARCHAR(50))
├─ Precio (DECIMAL(10,2))
├─ Stock (INT)
├─ Activa (BIT)
└─ FechaCreacion (DATETIME)
```

### Relaciones

- `Productos.IdCategoria` → `Categorias.IdCategoria` (Restrict)
- `Productos.ProveedorId` → `Proveedores.ProveedorId` (Restrict)
- `VariacionesProducto.IdProducto` → `Productos.IdProducto` (Cascade)

## 📝 Ejemplo de Producto Insertado

El script `seed-example-product.sql` inserta:

**Producto**: BR FOR CAT VET CONTROL DE PESO
- **Categoría**: Alimento para Gatos (ID: 2)
- **Proveedor**: Royal Canin (ID: 1)
- **Tipo**: Gatos
- **Estado**: Activo

**Variaciones**:
1. 500 GR - $20,400 - Stock: 50
2. 1.5 KG - $58,200 - Stock: 30
3. 3 KG - $110,800 - Stock: 20

## 🛠️ Solución de Problemas

### Error: "Cannot insert explicit value for identity column"

**Solución**: Use `SET IDENTITY_INSERT [tabla] ON` antes de insertar y `OFF` después.

### Error: "Foreign key constraint conflict"

**Solución**: El script ahora valida y crea automáticamente las referencias foráneas necesarias.

### Error: "Cannot insert duplicate key"

**Solución**: El script ahora detecta duplicados y aborta la inserción con un mensaje claro.

### Error: "Invalid column name"

**Solución**: Verifique que los nombres de columnas coincidan con el esquema de la base de datos. Algunas columnas como `FechaCreacion` y `FechaModificacion` pueden no existir en todas las tablas.

## 📖 Referencias

- **Documentación SQL Server**: [Transactions](https://docs.microsoft.com/en-us/sql/t-sql/language-elements/transactions-transact-sql)
- **Entity Framework Core**: [Data Seeding](https://docs.microsoft.com/en-us/ef/core/modeling/data-seeding)
- **Best Practices**: Ver comentarios al final de cada script

## 🤝 Contribuciones

Al crear nuevos scripts de seed:

1. Use el template `seed-template.sql`
2. Siga las buenas prácticas documentadas
3. Pruebe todos los escenarios descritos en `TEST_SEED_SCRIPT.md`
4. Documente cualquier consideración especial
5. Use nombres descriptivos para los archivos

## 📞 Soporte

Si encuentra problemas con los scripts de seed:

1. Verifique los mensajes de error en la consola
2. Consulte la sección "Solución de Problemas" en este README
3. Revise los escenarios de prueba en `TEST_SEED_SCRIPT.md`
4. Verifique que las tablas existen en la base de datos
5. Confirme que tiene los permisos necesarios

---

**Última actualización**: Script mejorado para resolver problemas de integridad referencial  
**Autor**: Copilot (Agente de IA)  
**Versión**: 2.0 - Con validaciones y manejo de errores robusto
