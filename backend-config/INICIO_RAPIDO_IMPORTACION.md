# 🎯 INICIO RÁPIDO: Importación CSV y Limpieza de Productos

## ⚡ Comandos Esenciales (Desarrollo)

### Importar Productos desde CSV

**Bash/Linux/Mac/WSL**:
```bash
cd backend-config
./test-importar-csv.sh
```

**PowerShell/Windows**:
```powershell
cd backend-config
.\importar-simple.ps1
```

---

### Limpiar Productos de Prueba

**Bash/Linux/Mac/WSL**:
```bash
cd backend-config
./limpiar-productos-prueba-rapido.sh
```

**PowerShell/Windows**:
```powershell
cd backend-config
.\limpiar-productos-prueba-rapido.ps1
```

---

## 📋 Prerequisitos

1. **Backend ejecutándose**:
   ```bash
   cd backend-config
   dotnet run
   ```
   
   Espere a ver: `Now listening on: http://localhost:5135`

2. **Archivo CSV**: `sample-products.csv` debe estar en `backend-config/`

3. **Base de datos**: Creada automáticamente con `dotnet ef database update`

---

## 🔧 Solución de Problemas

### Error 405: Method Not Allowed

**Causa**: El backend no está ejecutándose o el endpoint es incorrecto.

**Solución**:
```bash
# 1. Verificar que el backend está corriendo
curl http://localhost:5135/api/Productos

# 2. Si no responde, iniciar el backend
cd backend-config
dotnet run
```

---

### Error 404: Not Found

**Causa**: URL incorrecta o backend no ejecutándose.

**Solución**: Verificar URL en el script:
- Debe ser: `http://localhost:5135/api/Productos/ImportarCsv`

---

### Error 400: Bad Request

**Causa**: CSV mal formateado o campos faltantes.

**Solución**: 
- Verificar que el CSV tiene: `NAME`, `CATEGORIA`, `PRICE`
- Verificar extensión `.csv`

---

## 📚 Scripts Disponibles

### Importación:
- `importar-simple.ps1` - PowerShell simple (⭐ recomendado para Windows)
- `importar-masivo.ps1` - PowerShell avanzado (con construcción manual multipart)
- `test-importar-csv.sh` - Bash (⭐ recomendado para Linux/Mac)
- `test-importar-csv.ps1` - PowerShell de prueba

### Limpieza:
- `limpiar-productos-prueba-rapido.sh` - Bash rápido (⭐ recomendado)
- `limpiar-productos-prueba-rapido.ps1` - PowerShell rápido (⭐ recomendado)
- `Data/limpiar-productos-prueba-sqlite.sql` - SQL directo para SQLite
- `Data/limpiar-productos-prueba.sql` - SQL para SQL Server

---

## 💡 Ejemplos de Uso

### Flujo Completo de Desarrollo

```bash
# 1. Iniciar backend (terminal 1)
cd backend-config
dotnet run

# 2. Importar productos (terminal 2)
cd backend-config
./test-importar-csv.sh

# Resultado esperado:
# ✅ ÉXITO: La importación se completó correctamente
# 📊 Total procesados: 3
# ✅ Exitosos: 3

# 3. Verificar en navegador
# http://localhost:5135/api/Productos

# 4. Limpiar cuando termine las pruebas
./limpiar-productos-prueba-rapido.sh

# Resultado esperado:
# ✅ Limpieza completada
# ✅ Productos eliminados: 3
```

---

### Importaciones Múltiples

```bash
# Primera importación
./test-importar-csv.sh

# Modificar sample-products.csv con nuevos datos

# Limpiar datos anteriores
./limpiar-productos-prueba-rapido.sh

# Segunda importación
./test-importar-csv.sh
```

---

## 🎓 Características Implementadas

### ✅ Scripts de Importación:
- Pre-validación de prerequisitos (archivo, backend, curl)
- Detección automática de errores HTTP comunes
- Mensajes de error claros y accionables
- Verificación de conectividad con backend
- Soporte para multipart/form-data correcto

### ✅ Scripts de Limpieza:
- Limpieza rápida con un comando
- Basado en transacciones SQL (seguro)
- No requiere backend ejecutándose
- Respeta integridad referencial (elimina variaciones primero)
- Muestra resumen de operación

### ✅ Manejo de Errores:
- **405 Method Not Allowed**: Endpoint no configurado o backend no ejecutándose
- **404 Not Found**: URL incorrecta
- **400 Bad Request**: CSV mal formateado
- **415 Unsupported Media Type**: Content-Type incorrecto
- **500 Internal Server Error**: Error en backend/base de datos

---

## 📖 Documentación Completa

Para información detallada, consulte:
- **GUIA_IMPORTACION_Y_LIMPIEZA.md**: Guía completa con todos los scripts
- **API_ENDPOINT_IMPORTAR_CSV.md**: Documentación del endpoint
- **RESUMEN_IMPORTACION_CSV.md**: Formato CSV y validaciones

---

## ⚙️ Configuración

### Cambiar URL del Backend

**En importar-simple.ps1**:
```powershell
$ApiUrl = "http://localhost:5135/api/Productos/ImportarCsv"
```

**En test-importar-csv.sh**:
```bash
API_URL="http://localhost:5135/api/Productos/ImportarCsv"
```

### Cambiar Archivo CSV

```powershell
$CsvFile = "mi-archivo.csv"  # PowerShell
```

```bash
CSV_FILE="mi-archivo.csv"    # Bash
```

---

## 🆘 Obtener Ayuda

Si los scripts no funcionan:

1. **Verificar prerequisitos**:
   - Backend ejecutándose en puerto 5135
   - Archivo CSV existe
   - Base de datos creada

2. **Revisar logs del backend**:
   - Ejecutar `dotnet run` y ver mensajes de error
   - Buscar errores de validación o base de datos

3. **Consultar documentación**:
   - GUIA_IMPORTACION_Y_LIMPIEZA.md tiene soluciones detalladas
   - FAQ section con problemas comunes

---

## 🎉 Próximos Pasos

Después de importar exitosamente:

1. Verificar productos en la API: `http://localhost:5135/api/Productos`
2. Verificar en la base de datos: `sqlite3 VentasPet.db "SELECT * FROM Productos;"`
3. Probar el frontend (si está disponible)
4. Limpiar datos de prueba cuando termine

---

**Versión**: 2.0  
**Última actualización**: Octubre 2025  
**Compatibilidad**: Windows 10+, Linux, macOS
