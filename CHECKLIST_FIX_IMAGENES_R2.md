# ✅ CHECKLIST - Fix Imágenes R2 en Catálogo

## 🎯 Problema
Las imágenes de Cloudflare R2 no se visualizan en el catálogo. Todos los productos muestran el placeholder.

## 🔍 Causa Identificada
❌ **La base de datos NO tiene valores en el campo `URLImagen`**

El código frontend y backend está funcionando correctamente. Solo falta ejecutar el script SQL para poblar los datos.

---

## 📝 PASOS PARA SOLUCIONAR

### ✅ Paso 1: Ejecutar Script SQL

**Windows (SQL Server Management Studio):**
1. [ ] Abrir SQL Server Management Studio (SSMS)
2. [ ] Conectar a `localhost` con autenticación Windows
3. [ ] File → Open → File
4. [ ] Navegar a: `backend-config/Scripts/AddSampleProductImages.sql`
5. [ ] Verificar que la base de datos seleccionada es `VentasPet_Nueva`
6. [ ] Click en "Execute" (F5)
7. [ ] Verificar mensaje de éxito: "5 rows affected"

**Línea de Comandos:**
```bash
sqlcmd -S localhost -d VentasPet_Nueva -E -i backend-config/Scripts/AddSampleProductImages.sql
```

### ✅ Paso 2: Verificar Base de Datos

Ejecutar esta query para confirmar que las URLs fueron agregadas:

```sql
SELECT IdProducto, NombreBase, URLImagen 
FROM Productos 
ORDER BY IdProducto;
```

**Resultado esperado:**
```
IdProducto=1: https://www.velykapet.com/...CHURU_ATUN_4_PIEZAS_56_GR.jpg
IdProducto=2: https://www.velykapet.com/...ROYAL_CANIN_ADULT.jpg
IdProducto=3: https://www.velykapet.com/...BR_FOR_CAT_VET.jpg
IdProducto=4: https://www.velykapet.com/...HILLS_SCIENCE_DIET_PUPPY.jpg
IdProducto=5: https://www.velykapet.com/...PURINA_PRO_PLAN_ADULT_CAT.jpg
```

- [ ] Todos los productos tienen `URLImagen` con valor (no NULL)
- [ ] Las URLs comienzan con `https://www.velykapet.com/`

### ✅ Paso 3: Iniciar Backend

```bash
cd backend-config
dotnet run --urls="http://localhost:5135"
```

**Verificar:**
- [ ] Backend inició sin errores
- [ ] Mensaje muestra: "Now listening on: http://localhost:5135"
- [ ] No hay errores de base de datos

### ✅ Paso 4: Iniciar Frontend

En una **nueva terminal**:
```bash
npm start
```

**Verificar:**
- [ ] Frontend inició sin errores
- [ ] Mensaje muestra: "Servidor corriendo en http://localhost:3333"
- [ ] No hay errores de compilación

### ✅ Paso 5: Probar en Navegador

1. [ ] Abrir navegador en `http://localhost:3333`
2. [ ] Abrir DevTools Console (F12)
3. [ ] Click en "Gatolandia" o "Perrolandia"
4. [ ] Esperar a que cargue el catálogo

**En Console, buscar estos mensajes:**
```
✅ Productos cargados: 5
✅ Products with URLImagen: 5
🖼️ ProductCard - Image URL for Churu Atún: { imageUrl: "https://www.velykapet.com/..." }
✅ Final image URL: https://www.velykapet.com/CHURU_ATUN_4_PIEZAS_56_GR.jpg
```

**Verificar en console:**
- [ ] No dice "❌ Products without URLImagen: 5"
- [ ] SÍ dice "✅ Products with URLImagen: 5"
- [ ] Muestra las URLs completas de R2

### ✅ Paso 6: Verificar Imágenes

**Escenario A: Imágenes YA están en R2** ✅
- [ ] Los productos muestran las imágenes reales
- [ ] No se ven placeholders
- [ ] Network tab muestra 200 OK para las imágenes

**Escenario B: Imágenes NO están en R2** ⚠️
- [ ] Los productos muestran placeholders
- [ ] Console muestra: "⚠️ Using placeholder for [producto]"
- [ ] Network tab muestra 404 para las imágenes
- [ ] Esto es **NORMAL** - solo falta subir las imágenes a R2

---

## 🚨 TROUBLESHOOTING

### ❌ "Products without URLImagen: 5"

**Causa:** El script SQL no se ejecutó o falló

**Solución:**
1. Verificar en SSMS que el script se ejecutó sin errores
2. Ejecutar la query SELECT para verificar datos
3. Revisar si hay errores de conexión a base de datos

### ❌ "Error 500 Internal Server Error"

**Causa:** Backend no está corriendo o tiene error

**Solución:**
1. Verificar que dotnet está corriendo en puerto 5135
2. Revisar console del backend por errores
3. Verificar connection string en `appsettings.json`

### ❌ "Error al cargar los productos"

**Causa:** Frontend no puede conectar con backend

**Solución:**
1. Verificar que AMBOS servidores están corriendo
2. Backend en 5135, Frontend en 3333
3. No hay firewall bloqueando localhost

### ❌ Images show 404

**Causa:** Las imágenes no están subidas a R2 (ESPERADO)

**Solución:**
1. Esto es normal si no has subido las imágenes
2. El código está funcionando correctamente
3. Sube las imágenes a R2 con los nombres correctos:
   - `CHURU_ATUN_4_PIEZAS_56_GR.jpg`
   - `ROYAL_CANIN_ADULT.jpg`
   - etc.

---

## 📊 VERIFICACIÓN FINAL

Cuando TODO esté funcionando correctamente, deberías ver:

### En la Base de Datos:
```sql
SELECT COUNT(*) FROM Productos WHERE URLImagen IS NOT NULL;
-- Resultado: 5 (o más)
```

### En Console del Navegador:
```
✅ Productos cargados: 5
✅ Products with URLImagen: 5
  - Churu Atún: https://www.velykapet.com/CHURU_ATUN_4_PIEZAS_56_GR.jpg
  - Royal Canin: https://www.velykapet.com/ROYAL_CANIN_ADULT.jpg
  ...
❌ Products without URLImagen: 0
```

### En el Navegador:
- **Si imágenes existen en R2:** ✅ Imágenes reales visibles
- **Si NO existen en R2:** ⚠️ Placeholders (normal, solo sube las imágenes)

### En Network Tab (F12):
```
GET /api/Productos          → 200 OK (JSON con URLImagen)
GET /CHURU_ATUN_...jpg     → 200 OK o 404 (depende si existe en R2)
```

---

## 🎓 RESUMEN RÁPIDO

1. ✅ **Ejecutar SQL script** → Agrega URLs a base de datos
2. ✅ **Iniciar backend** → Puerto 5135
3. ✅ **Iniciar frontend** → Puerto 3333
4. ✅ **Abrir navegador** → Con DevTools Console abierto
5. ✅ **Verificar console** → Debe decir "Products with URLImagen: 5"
6. ⚠️ **Si 404:** Normal, solo sube las imágenes a R2

---

## 📞 NECESITAS AYUDA?

Si después de seguir TODOS estos pasos aún no funciona, proporciona:

1. Screenshot de la query SELECT en SSMS
2. Screenshot completo del Console del navegador
3. Screenshot del Network tab
4. Confirmación de que:
   - [ ] SQL script fue ejecutado
   - [ ] Backend está corriendo (puerto 5135)
   - [ ] Frontend está corriendo (puerto 3333)

---

**Última actualización:** $(date)
**Documentos relacionados:**
- `RESUMEN_SOLUCION_IMAGENES_R2.md` - Resumen ejecutivo
- `DIAGNOSTIC_R2_IMAGES.md` - Guía técnica completa
- `backend-config/Scripts/AddSampleProductImages.sql` - Script SQL
