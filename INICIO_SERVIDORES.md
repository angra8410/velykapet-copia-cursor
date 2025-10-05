# 🚀 Guía Rápida: Iniciar Servidores VelyKapet

## Solución al Error 500 - IMPLEMENTADA ✅

El error 500 en `/api/Productos` ha sido **SOLUCIONADO**. El problema era que el backend se ejecutaba en modo **Production** sin base de datos configurada. Ahora se ejecuta correctamente en modo **Development** con SQLite.

## 📋 Requisitos Previos

- ✅ .NET SDK 8.0 o superior
- ✅ Node.js 18.0 o superior (recomendado: 20+)

## 🎯 Inicio Rápido (2 pasos)

### 1. Iniciar Backend

**Linux/Mac:**
```bash
./start-backend.sh
```

**Windows:**
```cmd
start-backend.bat
```

**Salida esperada:**
```
🔧 Configurando base de datos:
   📌 Proveedor: Sqlite
   ✅ Usando SQLite (ideal para desarrollo)
✅ Base de datos inicializada exitosamente
   📦 Productos en DB: 5
📡 API: http://localhost:5135
Now listening on: http://localhost:5135
Hosting environment: Development
```

### 2. Iniciar Frontend/Proxy

```bash
npm start
# O si prefieres usar Node directamente:
node server.cjs
```

**Salida esperada:**
```
🌐 Servidor corriendo en: http://localhost:3333
📁 Directorio raíz: /home/runner/work/...
```

## ✅ Verificar que Funciona

### Opción 1: Desde la Terminal

```bash
# Probar backend directamente
curl http://localhost:5135/api/Productos

# Probar a través del proxy (como lo hace el navegador)
curl http://localhost:3333/api/Productos
```

**Respuesta esperada:** JSON con 5 productos

### Opción 2: Desde el Navegador

1. Abrir: http://localhost:3333
2. Abrir DevTools (F12) → Network
3. Deberías ver: `GET /api/Productos` con **Status 200** ✅

**NO deberías ver:**
- ❌ Error 500
- ❌ CORS errors
- ❌ Connection refused

## 🔧 ¿Qué se Corrigió?

### Antes (❌ No funcionaba)
```bash
# El backend se ejecutaba sin configurar el entorno
dotnet run
# → Usaba Production mode
# → Intentaba conectar a SQL Server (no disponible)
# → Base de datos fallaba
# → API retornaba 500 en /api/Productos
```

### Ahora (✅ Funciona)
```bash
# Scripts configuran automáticamente el entorno
ASPNETCORE_ENVIRONMENT=Development dotnet run
# → Usa Development mode
# → Usa SQLite (Data Source=VentasPet.db)
# → Base de datos se crea automáticamente con datos de prueba
# → API retorna 200 con productos
```

## 📊 Arquitectura de Conexión

```
┌─────────────────────────────┐
│  Navegador                  │
│  http://localhost:3333      │
└──────────┬──────────────────┘
           │ GET /api/Productos
           ▼
┌─────────────────────────────┐
│  Proxy Server (Node.js)     │
│  Puerto: 3333               │
│  - Agrega headers CORS      │
│  - Redirige al backend      │
└──────────┬──────────────────┘
           │ GET http://localhost:5135/api/Productos
           ▼
┌─────────────────────────────┐
│  Backend .NET API           │
│  Puerto: 5135               │
│  - Consulta SQLite          │
│  - Retorna productos        │
└──────────┬──────────────────┘
           │ 200 OK + JSON
           ▼
┌─────────────────────────────┐
│  Frontend recibe datos ✅    │
└─────────────────────────────┘
```

## 🛠️ Solución de Problemas

### Error: "Backend no encontrado"

**Causa:** Estás ejecutando el script desde un directorio incorrecto

**Solución:**
```bash
# Asegúrate de estar en la raíz del proyecto
cd /ruta/a/velykapet-copia-cursor
./start-backend.sh
```

### Error: "A network-related error occurred..."

**Causa:** El backend está intentando usar SQL Server

**Solución:** Verifica que estés usando el script `start-backend.sh` o `start-backend.bat` que configura automáticamente el entorno Development.

### Error: "Port 5135 already in use"

**Causa:** Ya hay una instancia del backend corriendo

**Solución:**
```bash
# Linux/Mac
lsof -ti:5135 | xargs kill -9

# Windows
netstat -ano | findstr :5135
taskkill /PID <pid> /F
```

### Error: "Port 3333 already in use"

**Solución:**
```bash
# Linux/Mac
lsof -ti:3333 | xargs kill -9

# Windows
netstat -ano | findstr :3333
taskkill /PID <pid> /F
```

## 📚 Documentación Adicional

- Ver `TROUBLESHOOTING_API.md` para diagnóstico detallado
- Ver `PORT_CONFIGURATION.md` para configuración de puertos
- Ver `SOLUCION_ERROR_500.md` para detalles de la solución implementada

## ✨ Cambios Realizados

1. **start-backend.sh** (Nuevo) - Script para Linux/Mac con configuración automática
2. **start-backend.bat** (Actualizado) - Ahora configura ASPNETCORE_ENVIRONMENT=Development
3. **server.cjs** (Actualizado) - Usa fetch nativo de Node.js

---

**¿Tienes problemas?** Consulta la documentación en `TROUBLESHOOTING_API.md` o abre un issue.
