# 🧪 Guía de Pruebas para seed-example-product.sql

## 📋 Descripción General

Este documento describe cómo probar el script `seed-example-product.sql` que ha sido mejorado para manejar problemas de integridad referencial.

## ✅ Mejoras Implementadas

El script ahora incluye:

1. **Validación de Categoría**: Verifica si la categoría con `IdCategoria = 2` ("Alimento para Gatos") existe antes de insertar el producto.
2. **Validación de Proveedor**: Verifica si el proveedor con `ProveedorId = 1` ("Royal Canin") existe antes de insertar el producto.
3. **Creación Automática**: Si no existen, el script crea automáticamente la categoría y/o el proveedor.
4. **Validación de Duplicados**: Verifica si el producto ya existe para evitar duplicados.
5. **Transacciones**: Usa transacciones para garantizar la integridad de los datos (todo o nada).
6. **Manejo de Errores**: Implementa bloques TRY-CATCH para capturar y reportar errores de manera clara.
7. **Mensajes Informativos**: Proporciona mensajes claros del progreso de cada paso.

## 🔍 Escenarios de Prueba

### Escenario 1: Base de Datos Vacía
**Condición inicial**: No existen ni la categoría ni el proveedor

**Pasos**:
```sql
-- Conectar a la base de datos VentasPet_Nueva
USE VentasPet_Nueva;
GO

-- Verificar que no existen los datos
SELECT * FROM Categorias WHERE IdCategoria = 2;
SELECT * FROM Proveedores WHERE ProveedorId = 1;
SELECT * FROM Productos WHERE NombreBase = 'BR FOR CAT VET CONTROL DE PESO';

-- Ejecutar el script
-- (Ejecutar el contenido de seed-example-product.sql)
```

**Resultado esperado**:
- ⚠️  Mensaje: "La categoría con IdCategoria = 2 no existe. Creándola..."
- ✅ Mensaje: "Categoría 'Alimento para Gatos' (ID: 2) creada exitosamente."
- ⚠️  Mensaje: "El proveedor con ProveedorId = 1 no existe. Creándolo..."
- ✅ Mensaje: "Proveedor 'Royal Canin' (ID: 1) creado exitosamente."
- 📦 Mensaje: "Insertando producto 'BR FOR CAT VET CONTROL DE PESO'..."
- ✅ Mensaje: "Producto insertado exitosamente con ID: [X]"
- 📊 Mensaje: "Insertando variaciones de peso del producto..."
- ✅ Mensaje: "3 variaciones insertadas exitosamente."
- 🎉 Mensaje: "PROCESO COMPLETADO EXITOSAMENTE"
- Se muestra una tabla con los datos insertados

### Escenario 2: Categoría y Proveedor Ya Existen
**Condición inicial**: La categoría y el proveedor ya existen en la base de datos

**Pasos**:
```sql
-- Verificar que existen los datos
SELECT * FROM Categorias WHERE IdCategoria = 2;
SELECT * FROM Proveedores WHERE ProveedorId = 1;

-- Ejecutar el script nuevamente
```

**Resultado esperado**:
- ✅ Mensaje: "Categoría 'Alimento para Gatos' (ID: 2) ya existe."
- ✅ Mensaje: "Proveedor 'Royal Canin' (ID: 1) ya existe."
- ⚠️  Mensaje: "El producto 'BR FOR CAT VET CONTROL DE PESO' ya existe. Abortando inserción."
- 💡 Mensaje: "Si desea reemplazarlo, elimine primero las variaciones y el producto manualmente."
- Transacción revertida (ROLLBACK)

### Escenario 3: Solo Falta la Categoría
**Condición inicial**: El proveedor existe pero la categoría no

**Pasos**:
```sql
-- Eliminar solo la categoría
DELETE FROM Categorias WHERE IdCategoria = 2;

-- Ejecutar el script
```

**Resultado esperado**:
- ⚠️  Mensaje: "La categoría con IdCategoria = 2 no existe. Creándola..."
- ✅ Mensaje: "Categoría 'Alimento para Gatos' (ID: 2) creada exitosamente."
- ✅ Mensaje: "Proveedor 'Royal Canin' (ID: 1) ya existe."
- Continúa con la inserción del producto y sus variaciones
- 🎉 Mensaje: "PROCESO COMPLETADO EXITOSAMENTE"

### Escenario 4: Solo Falta el Proveedor
**Condición inicial**: La categoría existe pero el proveedor no

**Pasos**:
```sql
-- Eliminar productos primero (por FK constraint)
DELETE FROM VariacionesProducto WHERE IdProducto IN (SELECT IdProducto FROM Productos WHERE ProveedorId = 1);
DELETE FROM Productos WHERE ProveedorId = 1;
-- Eliminar solo el proveedor
DELETE FROM Proveedores WHERE ProveedorId = 1;

-- Ejecutar el script
```

**Resultado esperado**:
- ✅ Mensaje: "Categoría 'Alimento para Gatos' (ID: 2) ya existe."
- ⚠️  Mensaje: "El proveedor con ProveedorId = 1 no existe. Creándolo..."
- ✅ Mensaje: "Proveedor 'Royal Canin' (ID: 1) creado exitosamente."
- Continúa con la inserción del producto y sus variaciones
- 🎉 Mensaje: "PROCESO COMPLETADO EXITOSAMENTE"

### Escenario 5: Error de Permisos
**Condición inicial**: El usuario no tiene permisos suficientes

**Pasos**:
```sql
-- Conectar con un usuario que solo tiene permisos de lectura
-- Ejecutar el script
```

**Resultado esperado**:
- ❌ Mensaje: "ERROR AL EJECUTAR EL SCRIPT"
- Muestra el número de error, mensaje y línea
- 💡 Recomendaciones sobre qué verificar
- Transacción revertida (ROLLBACK)

## 📊 Verificación de Datos Insertados

Después de una ejecución exitosa, el script automáticamente muestra:

```sql
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
```

**Datos esperados**:
- **Producto**: BR FOR CAT VET CONTROL DE PESO
- **Categoría**: Alimento para Gatos
- **Proveedor**: Royal Canin
- **Variación 1**: 500 GR, Precio: 20400, Stock: 50
- **Variación 2**: 1.5 KG, Precio: 58200, Stock: 30
- **Variación 3**: 3 KG, Precio: 110800, Stock: 20

## 🧹 Limpieza de Datos (Opcional)

Si necesita ejecutar el script múltiples veces durante las pruebas:

```sql
-- Eliminar en orden correcto por foreign keys
DELETE FROM VariacionesProducto 
WHERE IdProducto IN (
    SELECT IdProducto FROM Productos 
    WHERE NombreBase = 'BR FOR CAT VET CONTROL DE PESO'
);

DELETE FROM Productos 
WHERE NombreBase = 'BR FOR CAT VET CONTROL DE PESO';

-- Opcionalmente, eliminar categoría y proveedor si también desea probar su creación
-- DELETE FROM Categorias WHERE IdCategoria = 2;
-- DELETE FROM Proveedores WHERE ProveedorId = 1;
```

## 🎯 Buenas Prácticas Demostradas

El script implementa las siguientes buenas prácticas para scripts de seed SQL:

1. **Transacciones**: Todo se ejecuta en una transacción para garantizar consistencia
2. **Validación de Referencias Foráneas**: Verifica que existan antes de usarlas
3. **Creación Automática**: Crea entidades faltantes automáticamente
4. **Validación de Duplicados**: Evita insertar datos duplicados
5. **Manejo de Errores**: Captura y reporta errores claramente
6. **Mensajes Informativos**: Guía al usuario a través del proceso
7. **Verificación Final**: Muestra los datos insertados para validación
8. **Documentación Clara**: Explica cada paso del proceso

## 📝 Notas Importantes

- El script usa `SET IDENTITY_INSERT ON/OFF` para insertar IDs específicos
- Todas las operaciones se realizan dentro de una transacción
- Si algo falla, toda la transacción se revierte (ROLLBACK)
- Los mensajes incluyen emojis para mejor visualización (⚠️ ✅ 📦 📊 🎉 ❌ 💡)
- El script es idempotente después del primer run (detecta duplicados)

## 🔧 Solución de Problemas Comunes

### Error: "Cannot insert the value NULL into column 'IdProducto'"
**Causa**: El producto no se insertó correctamente
**Solución**: El script ahora valida que `@ProductoId` no sea NULL antes de continuar

### Error: "The INSERT statement conflicted with the FOREIGN KEY constraint"
**Causa**: La categoría o proveedor no existe
**Solución**: El script ahora crea automáticamente estas entidades si no existen

### Error: "Cannot insert duplicate key"
**Causa**: El producto ya existe en la base de datos
**Solución**: El script ahora detecta duplicados y aborta la inserción con un mensaje claro
