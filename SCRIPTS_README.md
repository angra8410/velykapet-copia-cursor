# 🚀 VentasPet - Scripts de Inicialización

Este proyecto incluye varios scripts para facilitar el inicio de los servidores frontend y backend.

## 📁 Archivos Disponibles

## 📂 Estructura de Directorios

```
C:\Projects\flutter-docker\
├── ventas_pet_new\          (Frontend - DIRECTORIO ACTUAL)
│   ├── src/
│   ├── start-servers.bat
│   ├── start-frontend.bat
│   └── start-backend.bat
└── ventas_pet\              (Proyecto completo)
    └── ventas_pet_api_dotnet\ (Backend .NET)
        └── VentasPetApi.csproj
```

⚠️ **Importante**: Los scripts buscan automáticamente el backend en `../ventas_pet/ventas_pet_api_dotnet/`

### 🔧 Scripts Principales

1. **`start-servers.bat`** - Inicia frontend y backend automáticamente (CMD/PowerShell)
2. **`start-servers.ps1`** - Versión PowerShell con más funciones
3. **`start-frontend.bat`** - Solo inicia el frontend
4. **`start-backend.bat`** - Solo inicia el backend API

## 🚀 Cómo Usar

### Opción 1: Script Batch (Recomendado para principiantes)
```bash
# Desde CMD o PowerShell
.\start-servers.bat
```

### Opción 2: Script PowerShell (Más funciones)
```powershell
# Desde PowerShell
.\start-servers.ps1
```

### Opción 3: Solo Frontend
```bash
# Si solo necesitas el frontend
.\start-frontend.bat
```

### Opción 4: Solo Backend
```bash
# Si solo necesitas el backend
.\start-backend.bat
```

## 🔧 Lo que hacen los scripts

### ✅ Verificaciones Automáticas:
- Node.js instalado
- .NET instalado  
- Busca automáticamente el proyecto backend
- Crea directorios necesarios

### 🌐 Servidores que inicia:
- **Frontend**: `http://localhost:3333`
- **Backend**: `http://localhost:5135` 
- **Swagger**: `http://localhost:5135/swagger`

### 👥 Credenciales de Prueba:
- **Email**: `admin_20250920103519@ventaspet.com`
- **Password**: `Admin123!`

## ⚡ Inicio Rápido

1. **Abrir terminal** en la carpeta del proyecto
2. **Ejecutar script**:
   ```bash
   .\start-servers.bat
   ```
3. **Esperar** que se abran las ventanas de los servidores
4. **Abrir navegador** en `http://localhost:3333`
5. **Iniciar sesión** con las credenciales de prueba

## 🛑 Detener Servidores

### Método 1: Cerrar ventanas
- Cerrar las ventanas que abrió el script

### Método 2: Ctrl+C
- En cada ventana de servidor, presionar `Ctrl+C`

### Método 3: PowerShell (forzado)
```powershell
Stop-Process -Name "node","dotnet" -Force
```

## ❗ Solución de Problemas

### "Node.js no encontrado"
- Instalar desde: https://nodejs.org
- Reiniciar terminal después de instalar

### ".NET no encontrado"  
- Instalar desde: https://dotnet.microsoft.com
- Reiniciar terminal después de instalar

### "Backend no encontrado"
- Verificar que existe una carpeta con archivos `.csproj`
- El script busca automáticamente en carpetas comunes

### Puerto ocupado
- Cambiar puerto en `simple-server.cjs` (línea 5)
- O matar procesos: `netstat -ano | findstr :3333`

## 💡 Consejos

1. **Primera vez**: Usar `start-servers.bat` es más simple
2. **Desarrollo**: `start-servers.ps1` tiene más información
3. **Solo frontend**: Usar `start-frontend.bat` cuando el backend ya esté corriendo
4. **Debugging**: Las ventanas de servidor muestran logs útiles

## 🔄 Actualizar Scripts

Los scripts están diseñados para ser autocontenidos. Si cambias puertos o rutas:

1. Editar el puerto en `simple-server.cjs`
2. Actualizar las URLs en los scripts si es necesario
3. Los scripts buscan automáticamente el backend

¡Los servidores deberían iniciarse automáticamente y todo debería funcionar! 🎉