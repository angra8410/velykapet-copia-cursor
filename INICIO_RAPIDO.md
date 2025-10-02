# 🚀 Guía de Inicio Rápido - VelyKapet

## ✨ Lo Nuevo: Error 500 Solucionado

**Ya no necesitas SQL Server para desarrollar**. El backend ahora usa SQLite automáticamente en modo desarrollo.

## 📦 Requisitos

### Para Desarrollo (FÁCIL)
- ✅ Node.js (ya instalado)
- ✅ .NET 8.0 SDK (ya instalado)
- ✅ ¡Eso es todo! No necesitas SQL Server

### Para Producción (Opcional)
- SQL Server (solo si vas a producción)

## 🎯 Inicio Rápido (2 minutos)

### Paso 1: Clonar e Instalar
```bash
git clone https://github.com/angra8410/velykapet-copia-cursor.git
cd velykapet-copia-cursor
npm install
```

### Paso 2: Iniciar Backend
```bash
# Windows PowerShell
$env:ASPNETCORE_ENVIRONMENT="Development"
cd backend-config
dotnet run

# Windows CMD
set ASPNETCORE_ENVIRONMENT=Development
cd backend-config
dotnet run

# Linux/Mac
export ASPNETCORE_ENVIRONMENT=Development
cd backend-config
dotnet run
```

**Deberías ver:**
```
✅ Usando SQLite (ideal para desarrollo)
✅ Base de datos inicializada exitosamente
   📦 Productos en DB: 5
🚀 VelyKapet API iniciada en:
   📡 API: http://localhost:5135
```

### Paso 3: Iniciar Frontend (en otra terminal)
```bash
npm start
```

**Deberías ver:**
```
🌐 Servidor corriendo en http://localhost:3333
🔀 Proxy configurado para backend en http://localhost:5135
```

### Paso 4: Abrir en Navegador
```
http://localhost:3333
```

¡Listo! El catálogo de productos debería cargar sin error 500.

## 🔍 Verificar que Todo Funciona

### Probar API Directamente
```bash
# Verificar productos
curl http://localhost:5135/api/Productos

# A través del proxy (como lo hace el frontend)
curl http://localhost:3333/api/Productos
```

Ambos deberían retornar 5 productos con sus variaciones.

### Verificar en el Navegador
1. Abre DevTools (F12)
2. Ve a Network
3. Deberías ver: `GET /api/Productos` con Status 200 ✅
4. **NO** deberías ver errores 500 ❌

## 🎓 Modo Desarrollo vs Producción

### Modo Desarrollo (Actual - SQLite)
```bash
export ASPNETCORE_ENVIRONMENT=Development
dotnet run
```
- ✅ No requiere SQL Server
- ✅ Base de datos SQLite (VentasPet.db)
- ✅ Datos de prueba incluidos
- ✅ Puerto 5135

### Modo Producción (SQL Server)
```bash
export ASPNETCORE_ENVIRONMENT=Production
dotnet run
```
- Requiere SQL Server instalado
- Base de datos VentasPet_Nueva
- Puerto 5135
- Mejor rendimiento para producción

## 🐛 ¿Problemas?

### Error: "Could not open a connection to SQL Server"
**Solución:** Asegúrate de estar en modo Development:
```bash
set ASPNETCORE_ENVIRONMENT=Development
```

### Error: "Port 5135 already in use"
**Solución:** Mata el proceso existente:
```bash
# Windows
netstat -ano | findstr :5135
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5135 | xargs kill -9
```

### Base de datos SQLite corrupta o sin datos
**Solución:** Elimina y recrea:
```bash
cd backend-config
rm VentasPet.db VentasPet.db-shm VentasPet.db-wal
dotnet run
```

### Frontend muestra error 500
**Verificar:**
1. ¿Backend está corriendo en puerto 5135?
2. ¿Backend muestra "5 productos en DB"?
3. ¿Curl al backend funciona?

## 📚 Más Información

- **SOLUCION_DEFINITIVA_ERROR_500.md** - Documentación técnica completa
- **TROUBLESHOOTING_API.md** - Guía de diagnóstico de errores
- **SOLUCION_ERROR_500.md** - Fix anterior de configuración frontend

## 🆘 Ayuda Adicional

Si sigues teniendo problemas:
1. Verifica los logs de consola del backend (muy detallados ahora)
2. Verifica los logs de consola del frontend proxy
3. Usa DevTools Network tab en el navegador
4. Consulta la documentación en los archivos MD

---

**¡Feliz desarrollo! 🎉**
