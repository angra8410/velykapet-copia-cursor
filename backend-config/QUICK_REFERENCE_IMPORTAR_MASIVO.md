# 🚀 Quick Reference - Importador Masivo PowerShell

## ⚡ Uso Rápido

```powershell
cd backend-config
.\importar-masivo.ps1
```

## 📋 Requisitos

- ✅ PowerShell 5.1+ (incluido en Windows 10/11)
- ✅ Backend ejecutándose en `http://localhost:5135`
- ✅ Archivo CSV con formato correcto

## 🎯 Características Principales

| Característica | Descripción |
|----------------|-------------|
| 🎨 **Interactivo** | Solicita archivo CSV con sugerencia por defecto |
| ✅ **Validaciones** | Verifica existencia y formato antes de enviar |
| 📊 **Respuestas claras** | Formatea JSON y muestra resumen visual |
| ❌ **Manejo de errores** | Mensajes claros con sugerencias de solución |
| 🔄 **Reintentos** | Permite reintentar o cambiar de archivo |
| 📚 **Ayuda integrada** | Explica formato CSV esperado |

## 📄 Formato CSV Mínimo

```csv
CATEGORIA,NAME,PRICE
Alimento para Gatos,Producto 1,$10000.00
Alimento para Perros,Producto 2,$15000.00
```

### Campos Obligatorios
- `CATEGORIA` - Debe existir en BD
- `NAME` - Nombre único
- `PRICE` - Precio (acepta $, comas)

## 🎨 Ejemplo de Salida

```
╔════════════════════════════════════════════════════════════════════════╗
║          IMPORTADOR MASIVO DE PRODUCTOS - VelyKapet                   ║
╚════════════════════════════════════════════════════════════════════════╝

📋 FORMATO DEL ARCHIVO CSV:
[... ayuda sobre formato ...]

📂 SELECCIÓN DE ARCHIVO
Ruta del archivo: [ENTER para usar sample-products.csv]

✅ Archivo encontrado: sample-products.csv

📤 ENVIANDO SOLICITUD AL SERVIDOR
Por favor espere...

═══════════════════════════════════════════════════════════════════════
✅ RESPUESTA DEL SERVIDOR (HTTP 200)
═══════════════════════════════════════════════════════════════════════

📊 RESUMEN DE LA IMPORTACIÓN:
   📦 Total procesados: 3
   ✅ Exitosos:         3
   ❌ Fallidos:         0

✨ PRODUCTOS CREADOS: 3
   1. [101] BR FOR CAT VET CONTROL DE PESO X 500GR
   2. [102] BR FOR CAT VET CONTROL DE PESO X 1.5 KG
   3. [103] BR FOR CAT VET CONTROL DE PESO X 3 KG
```

## ⚠️ Solución de Errores Comunes

### Error: Servidor no disponible
```
❌ HTTP 0: Error de conexión
```
**Solución:**
```powershell
cd backend-config
dotnet run --urls="http://localhost:5135"
```

### Error: Archivo no encontrado
```
❌ No se encontró el archivo 'archivo.csv'
```
**Solución:**
- Verificar ruta del archivo
- Usar ruta absoluta o relativa correcta

### Error: Categoría no existe
```
⚠️ Línea 3: Categoría 'CATEGORIA_INVALIDA' no encontrada
```
**Solución:**
- Verificar categorías en la BD
- Usar nombres exactos de categorías

### Error: Producto duplicado
```
⚠️ Línea 5: El producto 'NOMBRE' ya existe
```
**Solución:**
- Cambiar nombre del producto
- Eliminar línea duplicada del CSV

## 🔧 Opciones Avanzadas

### URL Personalizada
```powershell
.\importar-masivo.ps1 -ApiUrl "http://otroservidor:8080/api/Productos/ImportarCsv"
```

### Guardar Log de Importación
```powershell
.\importar-masivo.ps1 | Tee-Object -FilePath "importacion.log"
```

### Bypass Política de Ejecución
```powershell
PowerShell -ExecutionPolicy Bypass -File .\importar-masivo.ps1
```

## 📊 Interpretación de Resultados

### ✅ Éxito Total
```
Total procesados: 10
Exitosos: 10
Fallidos: 0
```
→ Todos los productos se importaron correctamente

### ⚠️ Éxito Parcial
```
Total procesados: 10
Exitosos: 7
Fallidos: 3
```
→ 7 productos OK, revisar y corregir los 3 fallidos

### ❌ Error Completo
```
❌ ERROR HTTP 400/500
```
→ Ver mensaje de error y sugerencias

## 🔄 Flujo de Trabajo Recomendado

1. **Preparar CSV**
   - Usar `sample-products.csv` como plantilla
   - Verificar categorías existen en BD
   - Revisar nombres únicos

2. **Probar con archivo pequeño**
   - Crear CSV con 2-3 productos
   - Ejecutar script
   - Verificar resultado

3. **Importación completa**
   - Usar archivo CSV completo
   - Revisar resumen
   - Verificar productos en aplicación web

4. **Corrección de errores**
   - Si hay errores, revisar líneas indicadas
   - Corregir CSV
   - Reintentar

## 📚 Documentación Completa

- 📖 [Guía completa del script](./GUIA_IMPORTAR_MASIVO.md)
- 🔌 [Documentación del endpoint API](./API_ENDPOINT_IMPORTAR_CSV.md)
- 📦 [Resumen de implementación](./RESUMEN_IMPORTACION_CSV.md)
- 📄 [Archivo CSV de ejemplo](./sample-products.csv)

## 💡 Tips

- ✅ Siempre hacer backup de la BD antes de importaciones grandes
- ✅ Probar primero con archivo pequeño
- ✅ Revisar categorías y proveedores antes de importar
- ✅ Usar UTF-8 para caracteres especiales en el CSV
- ✅ Guardar log de importaciones importantes

## 🆚 Comparación con Scripts Anteriores

| Característica | importar-simple.ps1 | importar-masivo.ps1 ⭐ |
|----------------|---------------------|------------------------|
| Interactivo | ❌ No | ✅ Sí |
| Validación de archivo | ✅ Básica | ✅ Completa |
| Formato de respuesta | ❌ Texto plano | ✅ JSON formateado |
| Manejo de errores | ⚠️ Básico | ✅ Avanzado |
| Sugerencias de corrección | ❌ No | ✅ Sí |
| Opciones de reintento | ❌ No | ✅ Sí |
| Ayuda integrada | ❌ No | ✅ Sí |
| Mensajes coloreados | ⚠️ Parcial | ✅ Completo |

## 🎓 Comandos Útiles

```powershell
# Ver ayuda del script
Get-Help .\importar-masivo.ps1 -Full

# Listar archivos CSV en el directorio
Get-ChildItem *.csv

# Ver contenido de un CSV
Get-Content sample-products.csv | Select-Object -First 5

# Verificar si el backend está corriendo
Test-NetConnection localhost -Port 5135

# Ver productos recién creados (requiere backend corriendo)
Invoke-RestMethod -Uri "http://localhost:5135/api/Productos" | 
    Select-Object -Last 5 -Property IdProducto, NombreBase, Precio
```

---

**Versión:** 1.0  
**Última actualización:** Enero 2025  
**Compatibilidad:** PowerShell 5.1+, Windows 10/11
