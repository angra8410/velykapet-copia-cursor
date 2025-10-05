# 🧪 Guía de Prueba - Scripts de Base de Datos

Esta guía te ayudará a probar que los scripts funcionan correctamente en tu entorno.

## ✅ Pre-requisitos

1. **SQL Server instalado y corriendo**
   ```bash
   # Verificar que SQL Server está corriendo
   sc query MSSQLSERVER
   ```

2. **Base de datos VentasPet_Nueva existe**
   ```bash
   sqlcmd -S localhost -E -Q "SELECT name FROM sys.databases WHERE name = 'VentasPet_Nueva'"
   ```
   
   Si no existe, crearla:
   ```bash
   sqlcmd -S localhost -E -Q "CREATE DATABASE VentasPet_Nueva"
   ```

3. **Las tablas existen** (creadas por migraciones de Entity Framework)
   ```bash
   cd backend-config
   dotnet ef database update
   ```

## 🧪 Prueba 1: Verificar Estado Inicial

```bash
sqlcmd -S localhost -d VentasPet_Nueva -E -i backend-config/Scripts/VerifyDatabaseState.sql
```

**Resultado esperado:**
```
📊 CONTADORES GENERALES:
   Categorías:              0 (o 4 si ya corrió migrations)
   Proveedores:             0 (o 3 si ya corrió migrations)
   Productos:               0 (o 5 si ya corrió migrations)
   Variaciones:             0 (o 15 si ya corrió migrations)
   Productos con imágenes:  0 de 0
```

## 🧪 Prueba 2: Seed de Productos Iniciales

```bash
sqlcmd -S localhost -d VentasPet_Nueva -E -i backend-config/Scripts/SeedInitialProducts.sql
```

**Resultado esperado:**
```
🚀 INICIANDO PROCESO DE SEED DE DATOS INICIALES

📊 Estado actual de la base de datos:
   - Categorías: 0
   - Proveedores: 0
   - Productos: 0

📁 PASO 2: Creando categorías...
   ✅ Categoría "Alimento para Perros" creada
   ✅ Categoría "Alimento para Gatos" creada
   ✅ Categoría "Snacks y Premios" creada
   ✅ Categoría "Accesorios" creada

🏢 PASO 3: Creando proveedores...
   ✅ Proveedor "Royal Canin" creado
   ✅ Proveedor "Hill's Science Diet" creado
   ✅ Proveedor "Purina Pro Plan" creado

📦 PASO 4: Creando productos base...
   ✅ Producto "Royal Canin Adult" creado (ID: 1)
   ✅ Producto "Churu Atún 4 Piezas 56gr" creado (ID: 2)
   ✅ Producto "Hill's Science Diet Puppy" creado (ID: 3)
   ✅ Producto "Purina Pro Plan Adult Cat" creado (ID: 4)
   ✅ Producto "Hill's Science Diet Adult" creado (ID: 5)

📊 PASO 5: Creando variaciones de productos...
   ✅ 3 variaciones creadas para "Royal Canin Adult"
   ✅ 3 variaciones creadas para "Churu Atún 4 Piezas 56gr"
   ✅ 3 variaciones creadas para "Hill's Science Diet Puppy"
   ✅ 3 variaciones creadas para "Purina Pro Plan Adult Cat"
   ✅ 3 variaciones creadas para "Hill's Science Diet Adult"

✅ SEED COMPLETADO EXITOSAMENTE
```

## 🧪 Prueba 3: Verificar Datos Creados

```bash
sqlcmd -S localhost -d VentasPet_Nueva -E -i backend-config/Scripts/VerifyDatabaseState.sql
```

**Resultado esperado:**
```
📊 CONTADORES GENERALES:
   Categorías:              4
   Proveedores:             3
   Productos:               5
   Variaciones:             15
   Productos con imágenes:  0 de 5

🔬 DIAGNÓSTICO:
   ✅ Hay productos en la base de datos
   ⚠️  NINGÚN PRODUCTO TIENE IMAGEN ASIGNADA
   📝 Acción requerida: Ejecutar AddSampleProductImages.sql
```

## 🧪 Prueba 4: Agregar Imágenes

```bash
sqlcmd -S localhost -d VentasPet_Nueva -E -i backend-config/Scripts/AddSampleProductImages.sql
```

**Resultado esperado:**
```
Changed database context to 'VentasPet_Nueva'.

IdProducto  NombreBase                      URLImagen
----------- ------------------------------- ------------
1           Royal Canin Adult               NULL
2           Churu Atún 4 Piezas 56gr       NULL
3           Hill's Science Diet Puppy       NULL
4           Purina Pro Plan Adult Cat       NULL
5           Hill's Science Diet Adult       NULL

(1 rows affected)   <- Producto 1 actualizado
(1 rows affected)   <- Producto 2 actualizado
(1 rows affected)   <- Producto 3 actualizado
(1 rows affected)   <- Producto 4 actualizado
(1 rows affected)   <- Producto 5 actualizado

IdProducto  NombreBase                  URLImagen                                          ImageStatus
----------- --------------------------- -------------------------------------------------- ------------
1           Royal Canin Adult           https://www.velykapet.com/.../ROYAL_CANIN_ADULT.jpg  ✅ R2 Image
2           Churu Atún 4 Piezas 56gr   https://www.velykapet.com/.../CHURU_ATUN...jpg       ✅ R2 Image
3           Hill's Science Diet Puppy   https://www.velykapet.com/.../HILLS_PUPPY.jpg        ✅ R2 Image
4           Purina Pro Plan Adult Cat   https://www.velykapet.com/.../PURINA_CAT.jpg         ✅ R2 Image
5           Hill's Science Diet Adult   https://www.velykapet.com/.../HILLS_ADULT.jpg        ✅ R2 Image
```

## 🧪 Prueba 5: Verificación Final

```bash
sqlcmd -S localhost -d VentasPet_Nueva -E -i backend-config/Scripts/VerifyDatabaseState.sql
```

**Resultado esperado:**
```
📊 CONTADORES GENERALES:
   Categorías:              4
   Proveedores:             3
   Productos:               5
   Variaciones:             15
   Productos con imágenes:  5 de 5

🔬 DIAGNÓSTICO:
   ✅ Hay productos en la base de datos
   ✅ TODOS LOS PRODUCTOS TIENEN IMAGEN ASIGNADA

💡 RECOMENDACIONES:
   ✅ Base de datos configurada correctamente
   🚀 Puedes iniciar el backend y frontend
```

## 🧪 Prueba 6: Batch Automático (Solo Windows)

Para probar el script automatizado completo:

```bash
# NOTA: Primero limpiar la base de datos si ya corriste las pruebas anteriores
sqlcmd -S localhost -d VentasPet_Nueva -E -Q "DELETE FROM VariacionesProducto; DELETE FROM Productos; DELETE FROM Categorias; DELETE FROM Proveedores;"

# Luego ejecutar el batch
cd backend-config\Scripts
SetupCompleteDatabase.bat
```

**Resultado esperado:**
- Ventana de terminal que muestra el progreso
- Mensaje de "ETAPA 1: SEED DE DATOS INICIALES"
- Mensaje de "ETAPA 2: ACTUALIZACIÓN DE IMAGENES R2"
- Mensaje de "SETUP COMPLETO FINALIZADO"
- Resumen mostrando 5 productos con 5 imágenes

## 🧪 Prueba 7: Backend API

```bash
# 1. Iniciar backend
cd backend-config
dotnet run --urls="http://localhost:5135"

# 2. En otra terminal, probar API
curl http://localhost:5135/api/Productos
```

**Resultado esperado:**
```json
[
  {
    "idProducto": 1,
    "nombreBase": "Royal Canin Adult",
    "descripcion": "Alimento balanceado para perros adultos de todas las razas",
    "tipoMascota": "Perros",
    "urlImagen": "https://www.velykapet.com/productos/alimentos/perros/ROYAL_CANIN_ADULT.jpg",
    "categoria": "Alimento para Perros",
    "variaciones": [...]
  },
  ...
]
```

Verificar que:
- ✅ `urlImagen` tiene valor (no es null)
- ✅ `urlImagen` empieza con `https://www.velykapet.com/`
- ✅ Hay 5 productos
- ✅ Cada producto tiene 3 variaciones

## 🧪 Prueba 8: Frontend

```bash
# 1. Asegurar que backend está corriendo
# 2. Iniciar frontend
npm start

# 3. Abrir navegador en http://localhost:3333
# 4. Abrir DevTools (F12) > Console
```

**Resultado esperado en Console:**
```
✅ Productos cargados: 5
✅ Products with URLImagen: 5
  - Royal Canin Adult: https://www.velykapet.com/.../ROYAL_CANIN_ADULT.jpg
  - Churu Atún 4 Piezas 56gr: https://www.velykapet.com/.../CHURU_ATUN...jpg
  ...
```

**Resultado esperado en UI:**
- Si las imágenes EXISTEN en R2: Imágenes reales mostradas
- Si las imágenes NO EXISTEN en R2: Placeholders (comportamiento correcto)

## ✅ Checklist de Pruebas

Marca cada prueba cuando la completes:

- [ ] ✅ Prueba 1: Estado inicial verificado
- [ ] ✅ Prueba 2: Seed ejecutado exitosamente
- [ ] ✅ Prueba 3: Datos verificados en BD
- [ ] ✅ Prueba 4: Imágenes agregadas
- [ ] ✅ Prueba 5: Verificación final confirmada
- [ ] ✅ Prueba 6: Batch automático funciona (Windows)
- [ ] ✅ Prueba 7: Backend API retorna productos con imágenes
- [ ] ✅ Prueba 8: Frontend muestra productos correctamente

## 🚨 Troubleshooting de Pruebas

### Error: "Changed database context to 'VentasPet_Nueva'. (0 rows affected)"

**Problema:** No hay productos antes de ejecutar AddSampleProductImages.sql

**Solución:** Ejecutar primero SeedInitialProducts.sql

### Error: "Cannot insert duplicate key row"

**Problema:** Los datos ya existen

**Solución:** 
1. Verificar con VerifyDatabaseState.sql
2. Si quieres re-seed, limpiar primero:
   ```bash
   sqlcmd -S localhost -d VentasPet_Nueva -E -Q "DELETE FROM VariacionesProducto; DELETE FROM Productos; DELETE FROM Categorias; DELETE FROM Proveedores;"
   ```

### Error: "Invalid object name 'Productos'"

**Problema:** Las tablas no existen

**Solución:** Ejecutar migraciones de EF:
```bash
cd backend-config
dotnet ef database update
```

### Error: Backend no inicia

**Problema:** .NET no instalado o puerto ocupado

**Solución:**
1. Verificar .NET: `dotnet --version`
2. Verificar puerto: `netstat -ano | findstr :5135`
3. Cambiar puerto si es necesario

## 📊 Resultados Esperados - Resumen

| Prueba | Categorías | Proveedores | Productos | Variaciones | Imágenes |
|--------|------------|-------------|-----------|-------------|----------|
| 1. Estado inicial | 0 | 0 | 0 | 0 | 0/0 |
| 2. Después de Seed | 4 | 3 | 5 | 15 | 0/5 |
| 3. Verificar datos | 4 | 3 | 5 | 15 | 0/5 |
| 4. Después de imágenes | 4 | 3 | 5 | 15 | 5/5 |
| 5. Verificación final | 4 | 3 | 5 | 15 | 5/5 |

---

**Tiempo estimado:** 15-20 minutos para todas las pruebas

**Nivel de dificultad:** Principiante

**Autor:** GitHub Copilot Agent
