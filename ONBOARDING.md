# 🚀 Guía de Onboarding para Nuevos Desarrolladores - VelyKapet

## 👋 Bienvenido al Proyecto VelyKapet

Esta guía te ayudará a configurar tu entorno de desarrollo local y evitar los errores más comunes que enfrentan los nuevos desarrolladores.

## ✅ Checklist de Configuración Inicial

### 1. Pre-requisitos

- [ ] **Node.js** instalado (v14 o superior)
  ```bash
  node --version
  npm --version
  ```

- [ ] **.NET SDK** instalado (v6.0 o superior)
  ```bash
  dotnet --version
  ```

- [ ] **Git** instalado
  ```bash
  git --version
  ```

- [ ] **Editor de código** (VS Code recomendado)

### 2. Clonar el Repositorio

```bash
# Clonar el repositorio
git clone https://github.com/angra8410/velykapet-copia-cursor.git

# Navegar al directorio
cd velykapet-copia-cursor
```

### 3. Configuración del Frontend

- [ ] **Instalar dependencias:**
  ```bash
  npm install
  ```

- [ ] **Verificar archivo de configuración:**
  - Verificar que existe `.env.development` en la raíz del proyecto
  - Si no existe, copiar desde `.env.example`:
    ```bash
    copy .env.example .env.development  # Windows
    cp .env.example .env.development    # Linux/Mac
    ```

- [ ] **Revisar configuración de puertos:**
  Abrir `.env.development` y verificar:
  ```bash
  FRONTEND_PORT=3333
  BACKEND_PORT=5135
  API_URL=http://localhost:5135  # ⚠️ HTTP, no HTTPS en desarrollo
  ```

### 4. Configuración del Backend

- [ ] **Navegar a la carpeta del backend:**
  ```bash
  cd backend-config
  ```

- [ ] **Verificar archivo de configuración:**
  Abrir `appsettings.Development.json` y verificar:
  ```json
  {
    "Kestrel": {
      "Endpoints": {
        "Http": {
          "Url": "http://localhost:5135"  // ⚠️ Este puerto debe coincidir con .env.development
        }
      }
    }
  }
  ```

- [ ] **Restaurar dependencias del backend:**
  ```bash
  dotnet restore
  ```

### 5. Primera Ejecución

#### Opción A: Scripts Automatizados (Recomendado)

**Windows:**
```bash
# Volver a la raíz del proyecto
cd ..

# Iniciar ambos servidores
start-servers.bat
```

**PowerShell:**
```powershell
.\start-servers.ps1
```

#### Opción B: Manual (dos terminales)

**Terminal 1 - Backend:**
```bash
cd backend-config
dotnet run
```

Espera a ver:
```
🚀 VelyKapet API iniciada en:
   📡 API: http://localhost:5135
```

**Terminal 2 - Frontend:**
```bash
# En la raíz del proyecto
npm start
```

Espera a ver:
```
🌐 Servidor corriendo en http://localhost:3333
🔀 Proxy configurado para backend en http://localhost:5135
```

### 6. Verificar la Instalación

- [ ] **Abrir navegador en:** http://localhost:3333

- [ ] **Verificar en DevTools (F12) → Network tab:**
  - Debería haber peticiones exitosas a `/api/Productos` con status 200
  - NO debería haber errores de CORS
  - NO debería haber errores de conexión

- [ ] **Probar endpoints manualmente:**
  ```bash
  # Backend directo
  curl http://localhost:5135/api/Productos
  
  # A través del proxy
  curl http://localhost:3333/api/Productos
  ```

## ⚠️ Errores Comunes y Soluciones

### Error 1: ERR_CONNECTION_REFUSED

**Síntoma:**
```
This site can't be reached
localhost refused to connect.
ERR_CONNECTION_REFUSED
```

**Causas comunes:**

1. **Backend no está corriendo**
   ```bash
   # Iniciar backend
   cd backend-config
   dotnet run
   ```

2. **Puerto incorrecto en .env.development**
   - Verificar que `API_URL` coincida con el puerto del backend
   - Ver: [PORT_CONFIGURATION.md](./PORT_CONFIGURATION.md)

3. **Protocolo incorrecto (HTTP vs HTTPS)**
   - En desarrollo, usar HTTP (no HTTPS)
   - Si `appsettings.Development.json` tiene `https://`, cambiar `.env.development` también a HTTPS
   - Ver: [PORT_CONFIGURATION.md](./PORT_CONFIGURATION.md)

4. **Puerto ocupado por otro proceso**
   ```bash
   # Windows
   netstat -ano | findstr :5135
   taskkill /PID <pid> /F
   
   # Linux/Mac
   lsof -i :5135
   kill -9 <pid>
   ```

### Error 2: CORS Policy Blocked

**Síntoma:**
```
Access to fetch at 'http://localhost:5135/api/Productos' from origin 'http://localhost:3333' 
has been blocked by CORS policy
```

**Causa:**
El frontend intenta conectarse directamente al backend sin pasar por el proxy.

**Solución:**
1. Verificar que `src/api.js` use URL relativa:
   ```javascript
   const API_CONFIG = {
       baseUrl: '/api',  // ✅ Correcto - URL relativa
   };
   ```

2. NO usar URLs absolutas como:
   ```javascript
   baseUrl: 'http://localhost:5135/api'  // ❌ Incorrecto
   ```

### Error 3: 404 Not Found en /api/Products

**Síntoma:**
```
GET http://localhost:3333/api/Products 404 (Not Found)
```

**Causa:**
Los endpoints están en español, no en inglés.

**Solución:**
Usar `/api/Productos` (con tilde y en español), no `/api/Products`

### Error 4: Base de datos no existe

**Síntoma:**
```
❌ Error inicializando la base de datos: Cannot open database
```

**Solución:**
En desarrollo, el proyecto usa SQLite que se crea automáticamente:
```bash
cd backend-config
dotnet run
# La base de datos VentasPet.db se creará automáticamente
```

### Error 5: Puerto 3333 ya está en uso

**Síntoma:**
```
Error: listen EADDRINUSE :::3333
```

**Solución:**
```bash
# Windows
netstat -ano | findstr :3333
taskkill /PID <pid> /F

# Linux/Mac
lsof -i :3333
kill -9 <pid>
```

## 📚 Documentación Esencial

Antes de empezar a desarrollar, **lee estos documentos:**

1. **[README.md](./README.md)** - Información general del proyecto
2. **[PORT_CONFIGURATION.md](./PORT_CONFIGURATION.md)** - ⚠️ **MUY IMPORTANTE** - Configuración de puertos y protocolos
3. **[AMBIENTES.md](./AMBIENTES.md)** - Configuración de ambientes
4. **[TROUBLESHOOTING_API.md](./TROUBLESHOOTING_API.md)** - Solución de problemas API
5. **[backend-config/README_CONFIGURATION.md](./backend-config/README_CONFIGURATION.md)** - Configuración del backend

## 🎯 Arquitectura del Proyecto

```
┌─────────────────────────────────────────────────────┐
│                     DESARROLLO                       │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Frontend (Navegador)                               │
│  └─ http://localhost:3333                           │
│     └─ Aplicación React                             │
│        └─ Usa URLs relativas (/api/...)             │
│                                                      │
│         │                                            │
│         ▼                                            │
│                                                      │
│  Proxy Server (Node.js)                             │
│  └─ http://localhost:3333                           │
│     └─ Redirige /api/* → http://localhost:5135      │
│     └─ Maneja CORS                                  │
│     └─ Sirve archivos estáticos                     │
│                                                      │
│         │                                            │
│         ▼                                            │
│                                                      │
│  Backend API (.NET Core)                            │
│  └─ http://localhost:5135                           │
│     └─ Controladores RESTful                        │
│     └─ Base de datos SQLite (desarrollo)            │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**Flujo de una petición:**
1. El navegador hace una petición a `/api/Productos`
2. El proxy en puerto 3333 intercepta la petición
3. El proxy reenvía a `http://localhost:5135/api/Productos`
4. El backend procesa y responde
5. El proxy agrega headers CORS y envía respuesta al navegador

## 🔑 Mejores Prácticas

### ✅ Hacer

1. **Siempre usar URLs relativas** en el código del frontend
   ```javascript
   fetch('/api/Productos')  // ✅ Correcto
   ```

2. **Verificar ambos servidores** estén corriendo antes de reportar problemas

3. **Revisar los logs** en ambas consolas (frontend y backend)

4. **Consultar la documentación** antes de cambiar configuraciones

5. **Usar HTTP en desarrollo** para simplicidad (no HTTPS)

### ❌ Evitar

1. **No usar URLs absolutas** en el frontend
   ```javascript
   fetch('http://localhost:5135/api/Productos')  // ❌ Incorrecto
   ```

2. **No mezclar HTTP y HTTPS** sin documentarlo claramente

3. **No asumir configuraciones** - siempre verificar archivos .env y appsettings.json

4. **No ignorar errores de consola** - muchas veces contienen la solución

5. **No cambiar puertos** sin actualizar TODA la configuración (frontend, backend, proxy)

## 🆘 ¿Necesitas Ayuda?

### Pasos de Diagnóstico

1. **Verificar que los servidores estén corriendo:**
   ```bash
   # Backend
   curl http://localhost:5135/api/Productos
   
   # Frontend/Proxy
   curl http://localhost:3333/api/Productos
   ```

2. **Revisar configuración:**
   ```bash
   # Ver configuración actual
   cat .env.development
   cat backend-config/appsettings.Development.json
   ```

3. **Consultar documentación:**
   - [PORT_CONFIGURATION.md](./PORT_CONFIGURATION.md) para problemas de conexión
   - [TROUBLESHOOTING_API.md](./TROUBLESHOOTING_API.md) para errores de API

4. **Abrir un issue en GitHub:**
   - Incluir logs del backend
   - Incluir logs del frontend
   - Incluir configuración (.env y appsettings.json)
   - Describir el problema y pasos para reproducirlo

## 🎓 Siguientes Pasos

Una vez que tu entorno esté funcionando:

1. **Explorar el código:**
   - Frontend: `src/` directory
   - Backend: `backend-config/` directory

2. **Revisar la arquitectura:**
   - [ANALISIS_BACKEND_DOTNET.md](./ANALISIS_BACKEND_DOTNET.md)
   - [ARQUITECTURA_VISUAL.md](./ARQUITECTURA_VISUAL.md)

3. **Entender el flujo de datos:**
   - [SOLUCION_ERROR_500.md](./SOLUCION_ERROR_500.md)

4. **Configurar tu IDE:**
   - Instalar extensiones recomendadas para React y .NET
   - Configurar ESLint y Prettier si están disponibles

## ✨ ¡Listo para Desarrollar!

Si completaste todos los pasos de este checklist, tu entorno está listo para desarrollar. 

**Recuerda:**
- El puerto del frontend es **3333**
- El puerto del backend es **5135**
- Usar **HTTP** en desarrollo (no HTTPS)
- Siempre usar **URLs relativas** en el frontend
- Consultar [PORT_CONFIGURATION.md](./PORT_CONFIGURATION.md) ante cualquier problema de conexión

---

**¡Bienvenido al equipo! 🐾**

*VelyKapet - Cuidamos lo que más amas*
