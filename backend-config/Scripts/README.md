# 🔄 Migración de Producto a Cloudflare R2 - README

## 📋 Resumen de Cambios

Este directorio contiene el script SQL para actualizar el producto de prueba con la imagen de Cloudflare R2.

### Cambio Aplicado

**Producto IdProducto = 2** actualizado de:
- **Antes:** "BR FOR CAT VET CONTROL DE PESO" con imagen local `/images/productos/royal-canin-cat-weight.jpg`
- **Después:** "Churu Atún 4 Piezas 56gr" con imagen de Cloudflare R2 `https://www.velykapet.com/CHURU_ATUN_4_PIEZAS_56_GR.jpg`

---

## 🚀 Cómo Aplicar los Cambios

### Opción 1: Regenerar Base de Datos (Recomendado para Desarrollo)

Los cambios ya están en el código de seed data (`VentasPetDbContext.cs`), por lo que solo necesitas regenerar la base de datos:

```bash
cd backend-config

# 1. Eliminar migración anterior si existe
dotnet ef migrations remove

# 2. Crear nueva migración
dotnet ef migrations add ActualizarProductoConImagenCloudflareR2

# 3. Aplicar migración (regenera la base de datos con nuevos datos)
dotnet ef database update

# 4. Reiniciar el backend
dotnet run
```

### Opción 2: Ejecutar Script SQL (Para Base de Datos Existente)

Si ya tienes una base de datos en producción o no quieres regenerarla:

```bash
# SQL Server
sqlcmd -S localhost -d VentasPetDb -i Scripts/UpdateProductoImagenCloudflareR2.sql

# MySQL/MariaDB
mysql -u root -p VentasPetDb < Scripts/UpdateProductoImagenCloudflareR2.sql

# SQLite
sqlite3 ventaspet.db < Scripts/UpdateProductoImagenCloudflareR2.sql
```

### Opción 3: Usando Entity Framework Core (Programático)

```csharp
// En el contexto de una migración o script de actualización
var producto = await context.Productos.FindAsync(2);
if (producto != null)
{
    producto.NombreBase = "Churu Atún 4 Piezas 56gr";
    producto.Descripcion = "Snack cremoso para gatos sabor atún, presentación 4 piezas de 56 gramos. Irresistible para tu felino.";
    producto.IdCategoria = 3; // Snacks y Premios
    producto.URLImagen = "https://www.velykapet.com/CHURU_ATUN_4_PIEZAS_56_GR.jpg";
    producto.FechaActualizacion = DateTime.Now;
    
    await context.SaveChangesAsync();
}
```

---

## ✅ Verificación

### 1. Verificar en la Base de Datos

```sql
-- Ver el producto actualizado
SELECT IdProducto, NombreBase, URLImagen, TipoMascota 
FROM Productos 
WHERE IdProducto = 2;

-- Resultado esperado:
-- IdProducto: 2
-- NombreBase: Churu Atún 4 Piezas 56gr
-- URLImagen: https://www.velykapet.com/CHURU_ATUN_4_PIEZAS_56_GR.jpg
-- TipoMascota: Gatos
```

### 2. Verificar en la API

```bash
# GET producto individual
curl http://localhost:5135/api/productos/2

# Resultado esperado (JSON):
{
  "IdProducto": 2,
  "NombreBase": "Churu Atún 4 Piezas 56gr",
  "URLImagen": "https://www.velykapet.com/CHURU_ATUN_4_PIEZAS_56_GR.jpg",
  "TipoMascota": "Gatos",
  ...
}
```

### 3. Verificar en el Frontend

1. Iniciar frontend: `npm start` o `node simple-server.cjs`
2. Abrir navegador: `http://localhost:3000`
3. Ir al catálogo de productos
4. Buscar "Churu Atún 4 Piezas 56gr"
5. **Verificar que la imagen se muestra correctamente**

---

## 🔍 Troubleshooting

### Problema: Cambios no se reflejan en el catálogo

**Solución:**
```bash
# 1. Limpiar cache del navegador (Ctrl+Shift+R)
# 2. Reiniciar el backend
cd backend-config
dotnet run

# 3. Verificar que la API devuelve los datos correctos
curl http://localhost:5135/api/productos/2
```

### Problema: Error al ejecutar migración

**Solución:**
```bash
# Eliminar todas las migraciones y empezar de cero
cd backend-config
rm -rf Migrations/
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### Problema: Imagen no se muestra en el frontend

**Posibles causas:**
1. La URL de Cloudflare R2 no es accesible públicamente
2. CORS no está configurado correctamente
3. El navegador está bloqueando la imagen

**Verificación:**
```bash
# Probar la URL directamente
curl -I https://www.velykapet.com/CHURU_ATUN_4_PIEZAS_56_GR.jpg

# Debe retornar:
# HTTP/2 200 
# content-type: image/jpeg
# access-control-allow-origin: *
```

---

## 📁 Archivos Modificados

### Backend

1. **`backend-config/Data/VentasPetDbContext.cs`**
   - Actualizado seed data del producto IdProducto = 2
   - Actualizado variaciones del producto

2. **`backend-config/Scripts/UpdateProductoImagenCloudflareR2.sql`** (NUEVO)
   - Script SQL para actualizar producto directamente en BD

### Documentación

1. **`GUIA_ASOCIAR_IMAGENES_PRODUCTOS.md`** (NUEVO)
   - Guía completa de cómo asociar imágenes a productos
   - Mejores prácticas de frontend
   - Ejemplos de código

2. **`backend-config/Scripts/README.md`** (NUEVO)
   - Este archivo, instrucciones de migración

---

## 🎯 Próximos Pasos

### Inmediato
- [ ] Aplicar migración o ejecutar script SQL
- [ ] Verificar que el producto se muestra con la imagen en el catálogo
- [ ] Validar que lazy loading funciona correctamente

### Corto Plazo
- [ ] Actualizar los otros 4 productos de prueba con imágenes de Cloudflare R2
- [ ] Crear imágenes placeholder para productos sin imagen
- [ ] Implementar caché de imágenes en el frontend

### Mediano Plazo
- [ ] Migrar todas las imágenes desde Google Drive (si aplica)
- [ ] Optimizar tamaño de todas las imágenes (< 200KB)
- [ ] Configurar Cloudflare Image Resizing (opcional, $5/mes)

---

## 📚 Recursos Adicionales

- **Guía completa:** `GUIA_ASOCIAR_IMAGENES_PRODUCTOS.md`
- **Cloudflare R2:** `RESUMEN_EJECUTIVO_CLOUDFLARE_R2.md`
- **Referencia rápida:** `CLOUDFLARE_R2_QUICK_REFERENCE.md`
- **Ejemplos:** `EJEMPLOS_PRODUCTOS_R2.json`

---

## 📞 Soporte

Si encuentras problemas, consulta:
1. `GUIA_ASOCIAR_IMAGENES_PRODUCTOS.md` - Sección Troubleshooting
2. `RESUMEN_EJECUTIVO_CLOUDFLARE_R2.md` - Configuración detallada
3. Logs del backend: `dotnet run --verbosity detailed`
4. Consola del navegador (F12) para errores de frontend

---

**Última actualización:** Diciembre 2024  
**Versión:** 1.0
