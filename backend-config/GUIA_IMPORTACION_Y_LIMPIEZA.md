# 📦 Guía Completa: Importación CSV y Limpieza de Productos

## 📋 Índice
1. [Scripts de Importación](#scripts-de-importación)
2. [Scripts de Limpieza](#scripts-de-limpieza)
3. [Solución de Problemas](#solución-de-problemas)
4. [Ejemplos de Uso](#ejemplos-de-uso)

---

## 🚀 Scripts de Importación

### 1. `importar-simple.ps1` (⭐ RECOMENDADO)

**Descripción**: Script PowerShell simple que usa `curl.exe` para importar productos desde CSV.

**Ventajas**:
- ✅ Más simple y confiable
- ✅ Usa curl.exe (incluido en Windows 10+)
- ✅ Diagnósticos automáticos de errores comunes
- ✅ Verifica que el backend esté ejecutándose

**Uso**:
```powershell
cd backend-config
.\importar-simple.ps1
```

**Prerequisitos**:
- Windows 10 (versión 1803+) o Windows 11
- Backend ejecutándose en `http://localhost:5135`
- Archivo `sample-products.csv` en el directorio actual

---

### 2. `importar-masivo.ps1` (Avanzado)

**Descripción**: Script PowerShell avanzado que construye manualmente la petición `multipart/form-data`.

**Ventajas**:
- ✅ No requiere curl.exe
- ✅ Mayor control sobre la petición HTTP
- ✅ Útil para debugging avanzado

**Uso**:
```powershell
cd backend-config
.\importar-masivo.ps1
```

---

### 3. `test-importar-csv.sh` (Para Linux/Mac/WSL)

**Descripción**: Script bash para importar productos usando curl.

**Uso**:
```bash
cd backend-config
chmod +x test-importar-csv.sh  # Solo la primera vez
./test-importar-csv.sh
```

---

## 🧹 Scripts de Limpieza

### ⭐ Método RÁPIDO: Scripts de Limpieza Automática (SQLite)

Para desarrollo (usando SQLite), use estos scripts simples:

**PowerShell**:
```powershell
cd backend-config
.\limpiar-productos-prueba-rapido.ps1
```

**Bash**:
```bash
cd backend-config
./limpiar-productos-prueba-rapido.sh
```

Estos scripts ejecutan automáticamente el SQL de limpieza y muestran los resultados.

---

### 1. `Data/limpiar-productos-prueba-sqlite.sql` (SQLite) - Base del método rápido

**Descripción**: Script SQL para limpieza directa en la base de datos SQLite.

**Uso directo**:
```bash
cd backend-config
sqlite3 VentasPet.db < Data/limpiar-productos-prueba-sqlite.sql
```

**Ventajas**:
- ✅ Más rápido para grandes volúmenes
- ✅ No requiere que el backend esté ejecutándose
- ✅ Usa transacciones para seguridad
- ✅ Funciona siempre (no depende de endpoints de API)

---

### 2. `Data/limpiar-productos-prueba.sql` (SQL Server) - Para producción

**Descripción**: Script SQL para limpieza directa en la base de datos.

**Uso**:
1. Abrir el archivo en SQL Server Management Studio, Azure Data Studio o similar
2. Revisar los productos que serán eliminados (ejecutar sección 1)
3. Descomentar la sección de eliminación si desea proceder
4. Ejecutar el script

**Para SQLite (desarrollo)**:
```bash
cd backend-config
sqlite3 VentasPet.db < Data/limpiar-productos-prueba-sqlite.sql
```

**Ventajas**:
- ✅ Más rápido para grandes volúmenes
- ✅ No requiere que el backend esté ejecutándose
- ✅ Usa transacciones para seguridad
- ✅ Funciona siempre (no depende de endpoints de API)

**⚠️ IMPORTANTE**: 
- Siempre verifique los productos ANTES de eliminar
- El script usa transacciones (rollback automático en caso de error)

---

### 2. `limpiar-productos-prueba.ps1` (PowerShell) - API Required

**⚠️ NOTA**: Este script requiere que el backend tenga un endpoint DELETE implementado.
Actualmente, el backend NO tiene este endpoint, así que use el SQL script en su lugar.

**Descripción**: Elimina productos de prueba usando la API REST (si está disponible).

**Uso básico** (sin confirmación):
```powershell
cd backend-config
.\limpiar-productos-prueba.ps1
```

**Uso con confirmación**:
```powershell
cd backend-config
.\limpiar-productos-prueba.ps1 -Confirmar
```

**Características**:
- ✅ Verifica conexión con el backend
- ✅ Muestra productos antes de eliminar
- ✅ Opción de confirmación manual
- ✅ Reporte detallado de éxitos y errores
- ⚠️ Requiere endpoint DELETE en el backend

---

### 3. `limpiar-productos-prueba.sh` (Bash) - API Required

**⚠️ NOTA**: Similar al script PowerShell, requiere endpoint DELETE.

**Descripción**: Versión bash del script de limpieza.

**Uso básico**:
```bash
cd backend-config
./limpiar-productos-prueba.sh
```

**Uso con confirmación**:
```bash
cd backend-config
./limpiar-productos-prueba.sh --confirmar
```

**Prerequisitos**:
- `curl` instalado
- `jq` instalado (opcional pero recomendado): `sudo apt install jq`
- Backend con endpoint DELETE implementado

---

## 🔧 Solución de Problemas

### Error 405: Method Not Allowed

**Causas comunes**:
1. ❌ El backend no está ejecutándose
2. ❌ La ruta del endpoint es incorrecta
3. ❌ El método HTTP no está configurado en el controlador

**Soluciones**:
```powershell
# Verificar que el backend esté ejecutándose
cd backend-config
dotnet run

# En otra terminal, ejecutar el script
.\importar-simple.ps1
```

**Verificar en el backend**:
- Archivo: `Controllers/ProductosController.cs`
- Debe tener: `[HttpPost("ImportarCsv")]`
- Ruta debe ser: `/api/Productos/ImportarCsv`

---

### Error 404: Not Found

**Causas**:
- URL incorrecta
- Backend no está ejecutándose

**Solución**:
```powershell
# Verificar URL en el script
$ApiUrl = "http://localhost:5135/api/Productos/ImportarCsv"
```

---

### Error 400: Bad Request

**Causas**:
- CSV vacío o mal formateado
- Faltan campos obligatorios

**Solución**:
- Verificar que el CSV tenga los campos: `NAME`, `CATEGORIA`, `PRICE`
- Verificar que el archivo tenga extensión `.csv`

---

### Error 500: Internal Server Error

**Causas**:
- Error en la base de datos
- Datos que no cumplen validaciones

**Solución**:
- Revisar logs del backend
- Verificar que las categorías, proveedores, etc. existan en la BD

---

## 📖 Ejemplos de Uso

### Flujo Completo: Importar → Verificar → Limpiar

**Usando scripts rápidos (SQLite/Desarrollo)**:
```bash
# 1. Importar productos de prueba
cd backend-config
./test-importar-csv.sh

# 2. Verificar productos importados
curl http://localhost:5135/api/Productos | jq

# 3. Limpiar productos de prueba (método rápido)
./limpiar-productos-prueba-rapido.sh
```

**PowerShell**:
```powershell
# 1. Importar
cd backend-config
.\importar-simple.ps1

# 2. Verificar (abrir en navegador)
# http://localhost:5135/api/Productos

# 3. Limpiar (método rápido)
.\limpiar-productos-prueba-rapido.ps1
```

---

### Múltiples Importaciones de Prueba

```bash
# Primera importación
./test-importar-csv.sh

# Limpiar (método rápido)
./limpiar-productos-prueba-rapido.sh

# Segunda importación con datos diferentes
# (modificar sample-products.csv primero)
./test-importar-csv.sh
```

---

### Verificar Diagnósticos de Errores

```powershell
# El script detectará automáticamente:
# ✅ Si curl.exe está disponible
# ✅ Si el archivo CSV existe
# ✅ Si el backend está ejecutándose
# ✅ Errores HTTP comunes (405, 404, 400, 500, 415)

.\importar-simple.ps1

# Cada error mostrará:
# - Código de estado HTTP
# - Posibles causas
# - Soluciones sugeridas
```

---

## 🎯 Mejores Prácticas

### Para Desarrollo

1. **Use `importar-simple.ps1`**: Es el más confiable y simple
2. **Limpie entre pruebas**: Use los scripts de limpieza para evitar duplicados
3. **Verifique el backend primero**: Asegúrese de que esté ejecutándose antes de importar

### Para Producción

1. **Use autenticación**: Los scripts actuales no usan JWT (solo para desarrollo)
2. **Valide el CSV**: Verifique datos antes de importar
3. **Haga backup**: Respalde la base de datos antes de importaciones grandes

---

## 📚 Referencias

- **Documentación del endpoint**: `API_ENDPOINT_IMPORTAR_CSV.md`
- **Formato CSV**: `RESUMEN_IMPORTACION_CSV.md`
- **Ejemplos de prueba**: `TEST_SCRIPTS_README.md`

---

## ❓ Preguntas Frecuentes

### ¿Qué script debo usar en Windows?

**Respuesta**: `importar-simple.ps1` - Es el más simple y confiable.

### ¿Puedo personalizar los productos a limpiar?

**Respuesta**: Sí, edite el array `$ProductosAEliminar` en `limpiar-productos-prueba.ps1`:

```powershell
$ProductosAEliminar = @(
    "BR FOR CAT VET CONTROL DE PESO",
    "OTRO PRODUCTO DE PRUEBA"
)
```

### ¿Qué hago si obtengo error 405?

**Respuesta**: 
1. Verifique que el backend esté ejecutándose: `dotnet run`
2. Espere a ver "Now listening on: http://localhost:5135"
3. Vuelva a ejecutar el script de importación

### ¿Puedo usar estos scripts en Linux/Mac?

**Respuesta**: Sí, use las versiones `.sh`:
- `test-importar-csv.sh` para importar
- `limpiar-productos-prueba.sh` para limpiar

---

## 🔄 Actualizaciones

**Versión 2.0** (Actual):
- ✅ Script simple mejorado con diagnósticos automáticos
- ✅ Manejo de error 405 específico
- ✅ Scripts de limpieza completos (PowerShell, Bash, SQL)
- ✅ Verificación de prerequisitos antes de ejecutar
- ✅ Mensajes de error claros y accionables

---

## 📧 Soporte

Si tiene problemas no documentados aquí:
1. Revise los logs del backend
2. Verifique que todas las dependencias estén instaladas
3. Consulte la documentación del endpoint
