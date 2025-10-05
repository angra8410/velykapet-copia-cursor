# 🚀 VentasPet - Scripts de Inicialización y Base de Datos

Este proyecto incluye varios scripts para facilitar el inicio de los servidores frontend y backend, así como scripts SQL para configurar la base de datos.

## 📁 Tipos de Scripts

### 🖥️ Scripts de Inicio de Servidores (Raíz del proyecto)
- Scripts para iniciar frontend y backend
- Ver sección "Scripts de Servidores" más abajo

### 🗄️ Scripts de Base de Datos (backend-config/Scripts/)
- Scripts para poblar y configurar SQL Server
- **NUEVO**: Scripts para bases de datos vacías
- Ver `backend-config/Scripts/README_DATABASE_SETUP.md` para guía completa

## 🆕 Scripts de Base de Datos (IMPORTANTE)

### ⚠️ Si tu tabla Productos está vacía

Si ejecutas `AddSampleProductImages.sql` y obtienes `(0 rows affected)`, necesitas:

#### 1. Verificar Estado
```bash
sqlcmd -S localhost -d VentasPet_Nueva -E -i backend-config/Scripts/VerifyDatabaseState.sql
```

#### 2. Setup Completo Automático (Recomendado)
```bash
cd backend-config\Scripts
SetupCompleteDatabase.bat
```

#### 3. O Paso a Paso Manual
```bash
# Paso 1: Poblar productos
sqlcmd -S localhost -d VentasPet_Nueva -E -i backend-config/Scripts/SeedInitialProducts.sql

# Paso 2: Agregar imágenes
sqlcmd -S localhost -d VentasPet_Nueva -E -i backend-config/Scripts/AddSampleProductImages.sql
```

### 📋 Scripts SQL Disponibles

| Script | Propósito | Cuándo Usar |
|--------|-----------|-------------|
| `VerifyDatabaseState.sql` | Verifica estado de BD | SIEMPRE ejecutar primero |
| `SeedInitialProducts.sql` | Pobla productos, categorías, proveedores | Tabla Productos vacía |
| `AddSampleProductImages.sql` | Agrega URLs de imágenes R2 | Después de tener productos |
| `SetupCompleteDatabase.bat` | Ejecuta todo en orden | Setup inicial completo |
| `seed-example-product.sql` | Agrega 1 producto específico | Agregar productos individuales |

**📖 Documentación Completa:** `backend-config/Scripts/README_DATABASE_SETUP.md`

**🆘 Guía Rápida:** `SOLUCION_TABLA_VACIA.md` (raíz del proyecto)

## 📁 Archivos Disponibles

## 📂 Estructura de Directorios

```
VentasPet/
├── backend-config/
│   ├── Scripts/               ⭐ SCRIPTS DE BASE DE DATOS
│   │   ├── README_DATABASE_SETUP.md      (Guía completa)
│   │   ├── VerifyDatabaseState.sql       (Verificar estado BD)
│   │   ├── SeedInitialProducts.sql       (Poblar productos)
│   │   ├── AddSampleProductImages.sql    (Agregar imágenes)
│   │   ├── SetupCompleteDatabase.bat     (Setup automático)
│   │   └── seed-example-product.sql      (Ejemplo individual)
│   └── Data/
├── src/                       (Frontend)
├── start-servers.bat          ⭐ SCRIPTS DE INICIO
├── start-frontend.bat
├── start-backend.bat
├── SCRIPTS_README.md          (Este archivo)
└── SOLUCION_TABLA_VACIA.md   ⭐ SOLUCIÓN RÁPIDA
```

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