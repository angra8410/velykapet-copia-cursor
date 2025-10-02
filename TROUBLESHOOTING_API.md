# Guía de Troubleshooting - Errores API

## Error 500 en /api/Productos - SOLUCIONADO ✅

### Síntoma
- Frontend recibe error 500 al intentar cargar productos
- Consola muestra error de conexión
- A veces aparece un 404 previo en `/api/Products`

### Causa Raíz
El frontend estaba configurado para conectarse **directamente** al backend en `http://localhost:5135/api`, lo cual causaba:
1. **Problemas de CORS** - El navegador bloqueaba las peticiones cross-origin
2. **Errores de conexión** - Si el backend no estaba disponible en ese momento
3. **Bypass del proxy** - El servidor proxy en localhost:3333 no se utilizaba

### Solución Implementada
Se modificó `src/api.js` para usar URLs relativas que pasan por el proxy:

**ANTES (Incorrecto):**
```javascript
const API_CONFIG = {
    baseUrl: 'http://localhost:5135/api', // ❌ Directo al backend
    // ...
};
```

**DESPUÉS (Correcto):**
```javascript
const API_CONFIG = {
    baseUrl: '/api', // ✅ A través del proxy
    // ...
};
```

### Cómo Funciona Ahora

```
Frontend (navegador)
    ↓
    GET /api/Productos
    ↓
Proxy Server (localhost:3333)
    ↓
    GET http://localhost:5135/api/Productos
    ↓
Backend .NET (localhost:5135)
    ↓
    Respuesta con productos
    ↓
Proxy Server (agrega headers CORS)
    ↓
Frontend recibe los datos ✅
```

## Diagnóstico de Problemas API

### 1. Verificar que los Servidores Estén Corriendo

**Frontend/Proxy (Puerto 3333):**
```bash
npm start
```

Deberías ver:
```
🌐 Servidor corriendo en http://localhost:3333
🔀 Proxy configurado para backend en http://localhost:5135
```

**Backend .NET (Puerto 5135):**
```bash
cd ../VentasPetApi/VentasPetApi
dotnet run
```

Deberías ver:
```
Now listening on: http://localhost:5135
```

### 2. Probar los Endpoints Manualmente

**A través del proxy (correcto):**
```bash
curl http://localhost:3333/api/Productos
```

**Directo al backend (puede fallar por CORS en navegador):**
```bash
curl http://localhost:5135/api/Productos
```

### 3. Usar el Script de Debugging

En la consola del navegador, ejecuta:
```javascript
// Cargar el script de debugging
<script src="/debug-network.js"></script>

// Probar endpoints
testDirectEndpoint()

// Verificar configuración
checkCurrentConfig()
```

### 4. Verificar Logs del Servidor

El proxy muestra todas las peticiones:
```
📡 GET /api/Productos
🔀 Proxying to backend: /api/Productos
📨 Backend response: 200
```

Si ves un error:
```
❌ Proxy error: connect ECONNREFUSED 127.0.0.1:5135
```
Significa que el backend NO está corriendo.

## Endpoints Correctos del API

### Productos
- `GET /api/Productos` - Listar todos los productos
- `GET /api/Productos/{id}` - Obtener un producto específico
- `GET /api/Productos/categorias` - Listar categorías
- `GET /api/Productos/variaciones/{id}` - Obtener variaciones de un producto
- `GET /api/Productos/buscar?q=termino` - Buscar productos

### Autenticación
- `POST /api/Auth/register` - Registrar usuario
- `POST /api/Auth/login` - Iniciar sesión
- `GET /api/Auth/me` - Obtener usuario actual

### Órdenes
- `POST /api/Orders` - Crear orden
- `GET /api/Orders` - Listar órdenes

**NOTA:** Los endpoints están en **español** (`Productos`, no `Products`)

## Errores Comunes y Soluciones

### Error: "Failed to fetch"
**Causa:** El servidor frontend/proxy no está corriendo
**Solución:** Ejecuta `npm start`

### Error: "CORS policy blocked"
**Causa:** Intentando acceder directamente al backend
**Solución:** Asegúrate que `baseUrl` en `api.js` sea `/api` (relativo)

### Error: 404 Not Found en /api/Productos
**Causa:** El backend no está corriendo o el controlador no está registrado
**Solución:** 
1. Verifica que el backend esté corriendo: `curl http://localhost:5135/api/Productos`
2. Revisa los logs del backend

### Error: 500 Internal Server Error
**Causa:** Error en el backend (base de datos, código, etc.)
**Solución:**
1. Revisa los logs del backend en la consola
2. Verifica que la base de datos esté accesible
3. Confirma que las tablas y datos existen

### Error: Connection Refused
**Causa:** Puerto ocupado o servicio no iniciado
**Solución:**
1. Verifica que no haya otros procesos usando los puertos
2. En Windows: `netstat -ano | findstr :3333` y `netstat -ano | findstr :5135`
3. Mata procesos si es necesario: `taskkill /PID <pid> /F`

## Mejores Prácticas

1. **Siempre usa URLs relativas** en el frontend cuando hay un proxy
2. **Verifica ambos servidores** estén corriendo antes de probar
3. **Revisa los logs** de consola en frontend y backend
4. **Usa las herramientas de desarrollo** del navegador (Network tab)
5. **Mantén los endpoints en español** consistentemente

## Scripts de Inicio Rápido

**Iniciar todo de una vez:**
```bash
# Windows
start-servers.bat

# PowerShell
.\start-servers.ps1
```

**Solo frontend:**
```bash
npm start
```

**Solo backend:**
```bash
cd ../VentasPetApi/VentasPetApi
dotnet run
```

## Recursos Adicionales

- Ver `ANALISIS_BACKEND_DOTNET.md` para detalles de los endpoints
- Ver `AMBIENTES.md` para configuración de ambientes
- Ver `debug-network.js` para herramientas de debugging
