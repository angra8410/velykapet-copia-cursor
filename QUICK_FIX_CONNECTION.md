# 🔧 Quick Fix Guide - ERR_CONNECTION_REFUSED

## 🚨 Error Común
```
This site can't be reached
localhost refused to connect.
ERR_CONNECTION_REFUSED
```

## ✅ Solución Rápida (2 minutos)

### Paso 1: Verificar Backend
```bash
cd backend-config
dotnet run
```

**¿Qué deberías ver?**
```
═══════════════════════════════════════════════════════
🚀 VelyKapet API Backend
═══════════════════════════════════════════════════════
   📡 API: http://localhost:5135
```

**Si ves:** `https://localhost:5135` → Ve al Paso 3

### Paso 2: Verificar Frontend
En otra terminal:
```bash
npm start
```

**¿Qué deberías ver?**
```
═══════════════════════════════════════════════════════
🚀 VelyKapet Frontend Server
═══════════════════════════════════════════════════════
🌐 Servidor corriendo en http://localhost:3333
🔀 Proxy configurado para backend en http://localhost:5135
```

### Paso 3: Verificar Coherencia

**Backend dice:** `http://localhost:5135` (o `https://localhost:5135`)  
**Frontend dice:** `http://localhost:5135` (o `https://localhost:5135`)

**¿Coinciden?**
- ✅ **SÍ** → Todo está bien, debería funcionar
- ❌ **NO** → Sigue al Paso 4

### Paso 4: Corregir Configuración

#### Opción A: Backend en HTTP (Recomendado para Desarrollo)

**Archivo:** `backend-config/appsettings.Development.json`
```json
{
  "Kestrel": {
    "Endpoints": {
      "Http": {
        "Url": "http://localhost:5135"
      }
    }
  }
}
```

**Archivo:** `.env.development`
```bash
API_URL=http://localhost:5135
BACKEND_PORT=5135
```

#### Opción B: Backend en HTTPS

**Archivo:** `backend-config/appsettings.Development.json`
```json
{
  "Kestrel": {
    "Endpoints": {
      "Https": {
        "Url": "https://localhost:5135"
      }
    }
  }
}
```

**Archivo:** `.env.development`
```bash
API_URL=https://localhost:5135
BACKEND_PORT=5135
```

**Pasos adicionales para HTTPS:**
```bash
dotnet dev-certs https --trust
```

### Paso 5: Reiniciar Todo
```bash
# Detener ambos servidores (Ctrl+C)
# Iniciar backend
cd backend-config
dotnet run

# En otra terminal, iniciar frontend
npm start
```

### Paso 6: Verificar en Navegador
Abrir: http://localhost:3333

**Verificar en DevTools (F12) → Network:**
- ✅ Debería haber peticiones a `/api/Productos` con status 200
- ❌ NO debería haber errores de conexión o CORS

## 🔍 Diagnóstico Adicional

### Verificar Puertos Ocupados
```bash
# Windows
netstat -ano | findstr :5135
netstat -ano | findstr :3333

# Linux/Mac
lsof -i :5135
lsof -i :3333
```

### Probar Endpoints Manualmente
```bash
# Backend directo
curl http://localhost:5135/api/Productos

# A través del proxy
curl http://localhost:3333/api/Productos
```

## 📚 Documentación Completa

Para información más detallada, consulta:

- **[PORT_CONFIGURATION.md](./PORT_CONFIGURATION.md)** - Guía completa de configuración de puertos
- **[ONBOARDING.md](./ONBOARDING.md)** - Guía completa para nuevos desarrolladores
- **[TROUBLESHOOTING_API.md](./TROUBLESHOOTING_API.md)** - Solución de otros problemas API

## 🆘 Aún No Funciona?

1. **Lee los logs** - Muchas veces contienen la solución
2. **Verifica tu firewall/antivirus** - Puede estar bloqueando los puertos
3. **Reinicia tu computadora** - A veces ayuda con puertos bloqueados
4. **Consulta [PORT_CONFIGURATION.md](./PORT_CONFIGURATION.md)** - Tiene más opciones avanzadas

## ⚡ Configuración de Emergencia

Si nada funciona, usa esta configuración mínima garantizada:

**1. Backend:** `backend-config/appsettings.Development.json`
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=VentasPet.db"
  },
  "DatabaseProvider": "Sqlite",
  "Kestrel": {
    "Endpoints": {
      "Http": {
        "Url": "http://localhost:5135"
      }
    }
  }
}
```

**2. Frontend:** `.env.development`
```bash
FRONTEND_PORT=3333
FRONTEND_HOST=localhost
BACKEND_PORT=5135
BACKEND_HOST=localhost
API_URL=http://localhost:5135
FRONTEND_URL=http://localhost:3333
```

**3. Reiniciar todo:**
```bash
# Terminal 1
cd backend-config
dotnet run

# Terminal 2
npm start
```

---

**¿Solucionaste el problema? ¡Genial! 🎉**

Ahora puedes empezar a desarrollar. Recuerda:
- Siempre usar **URLs relativas** en el código del frontend (`/api/...`)
- El frontend debe accederse en **http://localhost:3333**
- El backend corre en **http://localhost:5135**

**¿Aún necesitas ayuda?**
Abre un issue en GitHub con:
- Logs del backend
- Logs del frontend  
- Tu configuración (.env y appsettings.json)
