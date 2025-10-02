# 🔌 Configuración de Puertos y Protocolos - VelyKapet

## 📋 Resumen Ejecutivo

Este documento explica la configuración de puertos y protocolos en VelyKapet para **evitar errores de conexión** como `ERR_CONNECTION_REFUSED` y proporciona mejores prácticas para desarrollo y producción.

## 🎯 Problema Común: ERR_CONNECTION_REFUSED

### Síntomas
```
This site can't be reached
localhost refused to connect.
ERR_CONNECTION_REFUSED
```

### Causa Raíz
Intentar acceder al backend con el **puerto o protocolo incorrecto**:
- ❌ `http://localhost:5135` cuando el backend escucha en `https://localhost:5135`
- ❌ `http://localhost:5135` cuando el backend escucha en `http://localhost:5000`
- ❌ No tener el backend corriendo

## 🔧 Configuración de Puertos en VelyKapet

### Desarrollo Local (Recomendado)

```
┌─────────────────────────────────────────────────────┐
│                    DESARROLLO                        │
├─────────────────────────────────────────────────────┤
│  Frontend (Navegador)                               │
│  └─ http://localhost:3333                           │
│                                                      │
│  Proxy Server (Node.js)                             │
│  └─ http://localhost:3333                           │
│     └─ Redirige peticiones /api/* al backend       │
│                                                      │
│  Backend API (.NET)                                 │
│  └─ http://localhost:5135                           │
│     └─ Configurado en appsettings.Development.json │
└─────────────────────────────────────────────────────┘
```

**Configuración recomendada en `.env.development`:**
```bash
FRONTEND_PORT=3333
FRONTEND_HOST=localhost
BACKEND_PORT=5135
BACKEND_HOST=localhost
API_URL=http://localhost:5135
FRONTEND_URL=http://localhost:3333
```

### Producción

```
┌─────────────────────────────────────────────────────┐
│                    PRODUCCIÓN                        │
├─────────────────────────────────────────────────────┤
│  Frontend                                            │
│  └─ https://ventaspet.com (Puerto 443)              │
│                                                      │
│  Backend API                                         │
│  └─ https://api.ventaspet.com (Puerto 443)          │
└─────────────────────────────────────────────────────┘
```

**Configuración en `.env.production`:**
```bash
FRONTEND_PORT=80
FRONTEND_HOST=0.0.0.0
BACKEND_PORT=5000
BACKEND_HOST=api.ventaspet.com
API_URL=https://api.ventaspet.com
FRONTEND_URL=https://ventaspet.com
```

## 🚀 Opciones de Configuración del Backend

### Opción 1: HTTP Simple (Recomendado para Desarrollo)

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

**Ventajas:**
- ✅ Simple y directo
- ✅ No requiere certificados SSL
- ✅ Fácil de configurar
- ✅ Ideal para desarrollo local

**Configuración del Frontend:**
```bash
API_URL=http://localhost:5135
```

### Opción 2: HTTPS con Certificado Autofirmado

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

**Ventajas:**
- ✅ Simula entorno de producción
- ✅ Prueba configuración SSL

**Desventajas:**
- ❌ Requiere aceptar certificado autofirmado en el navegador
- ❌ Más complejo de configurar
- ❌ Puede causar errores CORS adicionales

**Configuración del Frontend:**
```bash
API_URL=https://localhost:5135
```

**Pasos adicionales:**
1. Generar certificado de desarrollo:
   ```bash
   dotnet dev-certs https --trust
   ```
2. Aceptar el certificado en el navegador al acceder por primera vez

### Opción 3: HTTP y HTTPS Simultáneos

**Archivo:** `backend-config/appsettings.Development.json`

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

**Ventajas:**
- ✅ Máxima flexibilidad
- ✅ Puedes elegir HTTP o HTTPS según necesites

**Configuración del Frontend:**
```bash
# Para usar HTTP
API_URL=http://localhost:5000

# Para usar HTTPS
API_URL=https://localhost:5135
```

## 📝 Guía Paso a Paso: Configuración de Desarrollo

### Escenario A: HTTP Simple (Recomendado)

1. **Verificar Backend Configuration:**
   ```bash
   cd backend-config
   cat appsettings.Development.json
   ```
   
   Debe contener:
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

2. **Verificar Frontend Configuration:**
   ```bash
   cat .env.development
   ```
   
   Debe contener:
   ```bash
   API_URL=http://localhost:5135
   ```

3. **Iniciar Backend:**
   ```bash
   cd backend-config
   dotnet run
   ```
   
   Salida esperada:
   ```
   🚀 VelyKapet API iniciada en:
      📡 API: http://localhost:5135
   ```

4. **Iniciar Frontend:**
   ```bash
   npm start
   ```
   
   Salida esperada:
   ```
   🌐 Servidor corriendo en http://localhost:3333
   🔀 Proxy configurado para backend en http://localhost:5135
   ```

5. **Probar conexión:**
   ```bash
   # Directo al backend
   curl http://localhost:5135/api/Productos
   
   # A través del proxy (como lo hace el navegador)
   curl http://localhost:3333/api/Productos
   ```

### Escenario B: Cambiar a HTTPS

1. **Generar certificado de desarrollo:**
   ```bash
   dotnet dev-certs https --trust
   ```

2. **Actualizar `appsettings.Development.json`:**
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

3. **Actualizar `.env.development`:**
   ```bash
   API_URL=https://localhost:5135
   ```

4. **Actualizar `server.cjs` (línea 50):**
   ```javascript
   const backendUrl = `https://localhost:5135${req.url}`;
   ```

5. **Reiniciar ambos servidores**

6. **Aceptar certificado en navegador:**
   - Abrir https://localhost:5135/api/Productos
   - Hacer clic en "Advanced" → "Proceed to localhost (unsafe)"

## 🔍 Diagnóstico de Problemas

### Error: ERR_CONNECTION_REFUSED en http://localhost:5135

**Posibles causas:**

1. **Backend no está corriendo**
   ```bash
   # Verificar
   curl http://localhost:5135/api/Productos
   
   # Si falla, iniciar backend
   cd backend-config
   dotnet run
   ```

2. **Backend escucha en HTTPS, no HTTP**
   ```bash
   # Verificar en los logs del backend al iniciar:
   # ¿Dice "http://localhost:5135" o "https://localhost:5135"?
   
   # Solución: Actualizar .env para usar HTTPS
   API_URL=https://localhost:5135
   ```

3. **Backend escucha en puerto diferente (ej: 5000)**
   ```bash
   # Verificar appsettings.Development.json
   # Si usa puerto 5000, actualizar .env
   API_URL=http://localhost:5000
   ```

4. **Puerto ocupado por otro proceso**
   ```bash
   # Windows
   netstat -ano | findstr :5135
   taskkill /PID <pid> /F
   
   # Linux/Mac
   lsof -i :5135
   kill -9 <pid>
   ```

### Error: CORS Policy Blocked

**Causa:** Frontend intenta conectarse directamente al backend sin pasar por el proxy.

**Solución:**
1. Verificar que `src/api.js` use URL relativa:
   ```javascript
   const API_CONFIG = {
       baseUrl: '/api',  // ✅ Correcto
       // NO: 'http://localhost:5135/api'
   };
   ```

2. Asegurar que el navegador apunte a `http://localhost:3333` (no directamente al backend)

### Error: SSL Certificate Problem

**Causa:** Usando HTTPS con certificado autofirmado no confiable.

**Soluciones:**
1. **Opción A - Confiar en el certificado:**
   ```bash
   dotnet dev-certs https --trust
   ```

2. **Opción B - Cambiar a HTTP en desarrollo:**
   - Actualizar `appsettings.Development.json` para usar HTTP
   - Actualizar `.env.development` con `API_URL=http://localhost:5135`

## 🎓 Mejores Prácticas

### ✅ Recomendaciones

1. **Desarrollo Local:**
   - Usar HTTP simple (sin certificados)
   - Puerto 5135 para backend
   - Puerto 3333 para frontend/proxy
   - Siempre usar URLs relativas en el código del frontend

2. **Staging/Testing:**
   - Usar HTTPS con certificados válidos
   - Configurar DNS apropiados
   - Probar con configuración similar a producción

3. **Producción:**
   - Siempre HTTPS
   - Certificados válidos de Let's Encrypt o CA comercial
   - Puerto 443 (estándar HTTPS)
   - Configurar firewalls y reverse proxy apropiados

### ❌ Evitar

1. ❌ Mezclar HTTP y HTTPS sin documentación clara
2. ❌ Usar URLs absolutas en el código del frontend
3. ❌ No documentar los puertos en uso
4. ❌ Asumir que todos los desarrolladores conocen la configuración
5. ❌ Usar certificados autofirmados en producción

## 📚 Documentación Relacionada

- **[README.md](./README.md)** - Información general del proyecto
- **[AMBIENTES.md](./AMBIENTES.md)** - Configuración de ambientes
- **[TROUBLESHOOTING_API.md](./TROUBLESHOOTING_API.md)** - Solución de problemas de API
- **[SOLUCION_ERROR_500.md](./SOLUCION_ERROR_500.md)** - Solución de error 500

## 🆘 Soporte Rápido

### Verificación Rápida de Configuración

```bash
# 1. Ver configuración actual
echo "Frontend Port: $(grep FRONTEND_PORT .env.development)"
echo "Backend Port: $(grep BACKEND_PORT .env.development)"
echo "API URL: $(grep API_URL .env.development)"

# 2. Verificar que los puertos estén disponibles
# Windows
netstat -ano | findstr :3333
netstat -ano | findstr :5135

# Linux/Mac
lsof -i :3333
lsof -i :5135

# 3. Probar endpoints
curl http://localhost:3333/api/Productos
curl http://localhost:5135/api/Productos
```

### Configuración de Emergencia

Si nada funciona, usa esta configuración mínima:

**`.env.development`:**
```bash
FRONTEND_PORT=3333
BACKEND_PORT=5135
API_URL=http://localhost:5135
```

**`backend-config/appsettings.Development.json`:**
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

**`server.cjs` (línea 50):**
```javascript
const backendUrl = `http://localhost:5135${req.url}`;
```

## 📞 Contacto

Si después de seguir esta guía sigues teniendo problemas:

1. Revisa los logs del backend y frontend
2. Verifica la configuración de firewall/antivirus
3. Consulta [TROUBLESHOOTING_API.md](./TROUBLESHOOTING_API.md)
4. Abre un issue en GitHub con:
   - Logs del backend
   - Logs del frontend
   - Configuración de .env
   - Sistema operativo

---

**Actualizado:** Diciembre 2024  
**Versión:** 1.0.0
