# 🎯 Quick Reference Card - Database Setup

## 📌 Problema en Una Línea
Tu tabla `Productos` está vacía → el script de imágenes no actualiza nada → frontend muestra placeholders.

## 🚀 Solución en 3 Pasos

### 1️⃣ Verificar Estado
```bash
sqlcmd -S localhost -d VentasPet_Nueva -E -i backend-config/Scripts/VerifyDatabaseState.sql
```

### 2️⃣ Setup Automático (Recomendado)
```bash
cd backend-config\Scripts
SetupCompleteDatabase.bat
```

**O Manual:**
```bash
# Paso A: Poblar productos
sqlcmd -S localhost -d VentasPet_Nueva -E -i backend-config/Scripts/SeedInitialProducts.sql

# Paso B: Agregar imágenes
sqlcmd -S localhost -d VentasPet_Nueva -E -i backend-config/Scripts/AddSampleProductImages.sql
```

### 3️⃣ Iniciar Servidores
```bash
# Terminal 1: Backend
cd backend-config
dotnet run --urls="http://localhost:5135"

# Terminal 2: Frontend
npm start
```

## 📊 Qué Crea el Script

| Entidad | Cantidad | Ejemplo |
|---------|----------|---------|
| Categorías | 4 | Alimento Perros, Gatos, Snacks, Accesorios |
| Proveedores | 3 | Royal Canin, Hill's, Purina |
| Productos | 5 | Royal Canin Adult, Churu Atún, etc. |
| Variaciones | 15 | 3 por producto (diferentes pesos) |
| Imágenes | 5 | URLs de Cloudflare R2 |

## ✅ Verificación Rápida

```sql
-- Ver productos con imágenes
SELECT IdProducto, NombreBase, URLImagen FROM Productos;
```

**Resultado esperado:** 5 productos, cada uno con URL de `https://www.velykapet.com/...`

## 🆘 Troubleshooting Rápido

| Problema | Solución |
|----------|----------|
| `(0 rows affected)` | Tabla vacía → Ejecutar SeedInitialProducts.sql primero |
| `Cannot insert duplicate key` | Productos ya existen → Solo ejecutar AddSampleProductImages.sql |
| `Invalid object name 'Productos'` | Tablas no existen → Ejecutar `dotnet ef database update` |
| Backend no inicia | Verificar .NET instalado: `dotnet --version` |
| Frontend muestra placeholders | Imágenes no están en R2 (es normal si no las subiste) |

## 📚 Documentación

| Documento | Propósito | Ubicación |
|-----------|-----------|-----------|
| **SOLUCION_TABLA_VACIA.md** | Guía rápida 1 página | Raíz |
| **README_DATABASE_SETUP.md** | Guía completa | backend-config/Scripts/ |
| **TESTING_GUIDE.md** | 8 pruebas paso a paso | backend-config/Scripts/ |
| **DIAGRAMA_FLUJO_SOLUCION.md** | Diagramas visuales | backend-config/Scripts/ |

## 🎯 Scripts Disponibles

| Script | Úsalo cuando... |
|--------|-----------------|
| `VerifyDatabaseState.sql` | Quieras saber el estado actual |
| `SeedInitialProducts.sql` | Tabla Productos esté vacía |
| `AddSampleProductImages.sql` | Ya tengas productos pero sin imágenes |
| `SetupCompleteDatabase.bat` | Quieras hacer todo de una vez (Windows) |

## 💡 Pro Tips

1. **SIEMPRE** ejecutar `VerifyDatabaseState.sql` primero
2. El batch `SetupCompleteDatabase.bat` es la forma más fácil
3. Los scripts son idempotentes (puedes ejecutarlos múltiples veces)
4. Las transacciones garantizan que no se corrompa la BD
5. Si ves 404 en imágenes, es normal si no están en R2 todavía

## 🔗 Enlaces Rápidos

- API Productos: http://localhost:5135/api/Productos
- Swagger: http://localhost:5135/swagger
- Frontend: http://localhost:3333

## ⏱️ Tiempo Estimado

- Verificación: 10 segundos
- Setup automático: 30 segundos
- Setup manual: 1 minuto
- Pruebas completas: 15 minutos

---

**TL;DR:** Ejecuta `SetupCompleteDatabase.bat`, espera 30 segundos, inicia backend y frontend. ¡Listo! 🎉
