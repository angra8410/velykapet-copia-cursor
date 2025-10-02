# Backend Configuration - VelyKapet API

## 📝 Archivos de Configuración

### `appsettings.json`
Configuración base para todos los ambientes. Define:
- Cadena de conexión por defecto (SQL Server)
- Configuración JWT
- Logging básico

### `appsettings.Development.json`
Configuración específica para desarrollo. **IMPORTANTE:**

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

Esta configuración hace que el backend escuche en:
- **Puerto:** 5135
- **Protocolo:** HTTP (no HTTPS)
- **Host:** localhost

⚠️ **Coherencia con Frontend:**
Esta URL debe coincidir con `API_URL` en el archivo `.env.development` del frontend:
```bash
API_URL=http://localhost:5135
```

## 🔧 Cambiar Configuración de Puerto

### Opción 1: Solo HTTP (Recomendado para Desarrollo)

**Archivo:** `appsettings.Development.json`
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

**Frontend `.env.development`:**
```bash
API_URL=http://localhost:5135
BACKEND_PORT=5135
```

### Opción 2: Solo HTTPS

**Archivo:** `appsettings.Development.json`
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

**Pasos adicionales:**
1. Generar certificado de desarrollo:
   ```bash
   dotnet dev-certs https --trust
   ```

2. Actualizar frontend `.env.development`:
   ```bash
   API_URL=https://localhost:5135
   BACKEND_PORT=5135
   ```

### Opción 3: HTTP y HTTPS Simultáneos

**Archivo:** `appsettings.Development.json`
```json
{
  "Kestrel": {
    "Endpoints": {
      "Http": {
        "Url": "http://localhost:5000"
      },
      "Https": {
        "Url": "https://localhost:5135"
      }
    }
  }
}
```

**Frontend `.env.development` (elegir uno):**
```bash
# Para usar HTTP
API_URL=http://localhost:5000
BACKEND_PORT=5000

# O para usar HTTPS
API_URL=https://localhost:5135
BACKEND_PORT=5135
```

## 🚀 Iniciar el Backend

```bash
# Desde la carpeta del proyecto
cd backend-config

# Ejecutar
dotnet run

# Deberías ver:
# 🚀 VelyKapet API iniciada en:
#    📡 API: http://localhost:5135
#    📚 Swagger: http://localhost:5135
```

## 🔍 Verificar Configuración

### Verificar en qué puerto está escuchando:

**Windows:**
```bash
netstat -ano | findstr :5135
```

**Linux/Mac:**
```bash
lsof -i :5135
```

### Probar el endpoint:

```bash
# HTTP
curl http://localhost:5135/api/Productos

# HTTPS (si está configurado)
curl https://localhost:5135/api/Productos
```

## ⚠️ Problemas Comunes

### Error: "Address already in use"
**Causa:** El puerto 5135 ya está siendo utilizado por otro proceso.

**Solución:**
```bash
# Windows - Encontrar proceso
netstat -ano | findstr :5135
taskkill /PID <pid> /F

# Linux/Mac - Encontrar proceso
lsof -i :5135
kill -9 <pid>
```

### Error: ERR_CONNECTION_REFUSED desde el frontend
**Causa:** El frontend intenta conectarse al backend con puerto/protocolo incorrecto.

**Verificar:**
1. ¿El backend está corriendo? (`dotnet run`)
2. ¿Qué dice el log al iniciar? (http vs https, puerto)
3. ¿El `.env.development` del frontend coincide con la configuración del backend?

**Solución:**
- Ver **[../PORT_CONFIGURATION.md](../PORT_CONFIGURATION.md)** para guía completa

### Error: SSL Certificate Problem
**Causa:** Usando HTTPS sin certificado válido.

**Solución:**
```bash
# Instalar y confiar en el certificado de desarrollo
dotnet dev-certs https --trust
```

O cambiar a HTTP en desarrollo (recomendado).

## 📚 Documentación Adicional

- **[../PORT_CONFIGURATION.md](../PORT_CONFIGURATION.md)** - Guía completa de configuración de puertos
- **[../AMBIENTES.md](../AMBIENTES.md)** - Configuración de ambientes
- **[../TROUBLESHOOTING_API.md](../TROUBLESHOOTING_API.md)** - Solución de problemas

## 🔐 Configuración de Base de Datos

### Desarrollo (SQLite)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=VentasPet.db"
  },
  "DatabaseProvider": "Sqlite"
}
```

### Producción (SQL Server)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=VentasPet_Nueva;Trusted_Connection=true;TrustServerCertificate=true;"
  },
  "DatabaseProvider": "SqlServer"
}
```

---

**Última actualización:** Diciembre 2024
