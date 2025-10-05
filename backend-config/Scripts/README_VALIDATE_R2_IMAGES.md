# 🔍 Guía de Uso: validate-r2-images.js

## Descripción

Script Node.js para validar la accesibilidad HTTP de las imágenes de productos almacenadas en Cloudflare R2. Verifica que todas las URLs en la base de datos sean accesibles y proporciona un reporte detallado.

## 📋 Requisitos Previos

### 1. Node.js y NPM
```bash
node --version  # Debe ser v14 o superior
npm --version
```

### 2. SQL Server
- SQL Server debe estar ejecutándose (SQLEXPRESS o MSSQLSERVER)
- Base de datos: `VentasPet_Nueva`
- Autenticación: Windows Authentication (trustedConnection)

### 3. Dependencias Node.js
```bash
# Instalar dependencias
cd /home/runner/work/velykapet-copia-cursor/velykapet-copia-cursor
npm install
```

Esto instalará:
- `mssql` v10.0.2 - Cliente SQL Server para Node.js
- `node-fetch` v2.7.0 - Cliente HTTP para validación de URLs

## 🚀 Pathways de Ejecución

### Opción 1: Desde el directorio raíz del proyecto
```bash
cd /home/runner/work/velykapet-copia-cursor/velykapet-copia-cursor
node backend-config/Scripts/validate-r2-images.js
```

### Opción 2: Desde el directorio Scripts
```bash
cd /home/runner/work/velykapet-copia-cursor/velykapet-copia-cursor/backend-config/Scripts
node validate-r2-images.js
```

### Opción 3: Con exportación de resultados a JSON
```bash
node backend-config/Scripts/validate-r2-images.js --export-json
```
Genera el archivo: `r2-image-validation-report.json`

### Opción 4: Exportar lista de URLs
```bash
node backend-config/Scripts/validate-r2-images.js --export-urls
```
Genera el archivo: `r2-image-urls.txt`

### Opción 5: Ambas exportaciones
```bash
node backend-config/Scripts/validate-r2-images.js --export-json --export-urls
```

## 📊 Salida del Script

### Ejecución Exitosa
```
╔════════════════════════════════════════════════════════════════════════╗
║  🔍 VALIDACIÓN HTTP DE IMÁGENES EN CLOUDFLARE R2                     ║
║  Verificando accesibilidad de URLs en producción                      ║
╚════════════════════════════════════════════════════════════════════════╝

📡 Conectando a SQL Server...
   Servidor: localhost
   Base de datos: VentasPet_Nueva
   Timeout de conexión: 15 segundos

   ✅ Conexión establecida exitosamente

📋 Obteniendo URLs de productos...
   Ejecutando consulta SQL...
   ✅ Consulta ejecutada exitosamente
   ✅ 25 productos encontrados con URLs de R2

🔍 Validando accesibilidad de 25 URLs...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   Validando... 25/25 (100%)

📊 RESULTADOS DETALLADOS:

   ✅ [1/25] ID 1 - Producto Ejemplo
      URL: https://www.velykapet.com/productos/imagen1.jpg
      Tamaño: 125.50 KB, Tipo: image/jpeg
      Cache: HIT

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 RESUMEN DE VALIDACIÓN

   Total de productos:        25
   ✅ Imágenes accesibles:    23 (92.00%)
   ❌ Imágenes no accesibles: 2 (8.00%)

   Estado general: ✅ BUENO - La mayoría de las imágenes son accesibles

   Tamaño total de imágenes: 15.25 MB

╔════════════════════════════════════════════════════════════════════════╗
║  ✅ VALIDACIÓN COMPLETADA                                             ║
╚════════════════════════════════════════════════════════════════════════╝
```

### Cuando no hay productos
```
⚠️  No se encontraron productos con URLs de R2 para validar
```

## 🔧 Troubleshooting

### Problema: Script se queda detenido tras "Conectando a SQL Server..."

**Causa**: SQL Server no está disponible o no responde.

**Solución**:
1. Verifica que SQL Server esté ejecutándose:
   ```
   Servicios de Windows > SQL Server (SQLEXPRESS o MSSQLSERVER)
   Estado: Ejecutándose
   ```

2. Verifica que la base de datos existe:
   ```bash
   sqlcmd -S localhost -E -Q "SELECT name FROM sys.databases"
   ```
   Debes ver `VentasPet_Nueva` en la lista.

3. Prueba la conexión manualmente:
   ```bash
   sqlcmd -S localhost -d VentasPet_Nueva -E -Q "SELECT COUNT(*) FROM Productos"
   ```

### Problema: Error "Failed to connect to localhost:1433"

**Diagnóstico mostrado por el script**:
```
❌ Error al conectar a SQL Server

💡 DIAGNÓSTICO:
   - Error: Failed to connect to localhost:1433 - Could not connect (sequence)
   - Verifica los logs de SQL Server para más detalles

📝 PASOS PARA RESOLVER:
   1. Verifica que SQL Server esté ejecutándose
   2. Verifica la base de datos
   3. Prueba la conexión
   4. Revisa los permisos del usuario de Windows
```

**Soluciones**:
1. **SQL Server no está ejecutándose**:
   - Abre Servicios de Windows
   - Busca "SQL Server (SQLEXPRESS)" o "SQL Server (MSSQLSERVER)"
   - Click derecho > Iniciar

2. **Puerto bloqueado**:
   - Verifica firewall de Windows
   - SQL Server usa puerto 1433 por defecto

3. **Autenticación**:
   - El script usa Windows Authentication
   - Tu usuario de Windows debe tener permisos en SQL Server

### Problema: Error "Login failed for user"

**Causa**: Problema de autenticación.

**Solución**:
1. Verifica permisos en SQL Server Management Studio
2. Tu usuario debe tener rol `db_datareader` en `VentasPet_Nueva`
3. SQL Server debe tener Windows Authentication habilitada

### Problema: Error "Cannot open database 'VentasPet_Nueva'"

**Causa**: La base de datos no existe.

**Solución**:
1. Crea la base de datos siguiendo `QUICK_REFERENCE_DATABASE.md`
2. Ejecuta los scripts de setup:
   ```bash
   cd backend-config\Scripts
   SetupCompleteDatabase.bat
   ```

### Problema: Timeout al ejecutar la consulta

**Causa**: La consulta SQL tarda más de 30 segundos.

**Solución**:
1. Verifica el rendimiento de SQL Server
2. Considera agregar índices a la tabla Productos
3. Modifica `requestTimeout` en el script si es necesario

## ⚙️ Configuración

El script usa los siguientes timeouts:

```javascript
const config = {
    server: 'localhost',
    database: 'VentasPet_Nueva',
    connectionTimeout: 15000,  // 15 segundos para conectar
    requestTimeout: 30000      // 30 segundos para queries
};
```

Puedes modificar estos valores si necesitas más tiempo.

## 📝 Interpretación de Resultados

### Estados de Validación

- **✅ Accesible**: La imagen responde HTTP 200 OK
- **❌ No encontrada (404)**: La imagen no existe en R2
- **⚠️ Error**: Otro problema (timeout, red, etc.)

### Estado General

- **EXCELENTE**: 100% imágenes accesibles
- **BUENO**: ≥80% imágenes accesibles
- **REGULAR**: 50-79% imágenes accesibles
- **CRÍTICO**: <50% imágenes accesibles

### Información de Cache

- **HIT**: Imagen servida desde cache de Cloudflare (rápido)
- **MISS**: Imagen servida desde origen R2 (primera carga)
- **DYNAMIC**: No cacheada

## 🔗 Recursos Adicionales

- `QUICK_REFERENCE_DATABASE.md` - Configuración de base de datos
- `CLOUDFLARE_R2_QUICK_REFERENCE.md` - Configuración de R2
- `backend-config/Scripts/README_DATABASE_SETUP.md` - Setup completo

## 💡 Tips

1. **Primera vez**: Ejecuta sin parámetros para ver el estado general
2. **Debugging**: Usa `--export-json` para análisis detallado
3. **Testing**: Usa `--export-urls` para pruebas manuales en navegador
4. **Automatización**: El script retorna exit code 1 si hay imágenes inválidas

## 🐛 Reporte de Issues

Si encuentras problemas no cubiertos en esta guía:

1. Verifica que cumples todos los requisitos previos
2. Ejecuta el script y captura toda la salida
3. Incluye el error completo al reportar
4. Indica el pathway de ejecución que usaste
