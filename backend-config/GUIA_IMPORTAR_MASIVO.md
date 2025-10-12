# 📦 Guía del Importador Masivo de Productos - PowerShell

## 🎯 Descripción

Script interactivo mejorado para importar productos masivamente desde archivos CSV hacia la API de VelyKapet. Diseñado para ser autoexplicativo, robusto y fácil de usar.

## ✨ Características

### 🎨 Interfaz Interactiva
- ✅ Menú de bienvenida con instrucciones claras
- ✅ Solicitud interactiva del archivo CSV con sugerencia por defecto
- ✅ Mensajes de progreso en cada paso del proceso
- ✅ Colores y formato visual para mejor legibilidad

### 🔍 Validaciones Robustas
- ✅ Verificación de existencia del archivo antes de enviar
- ✅ Validación de extensión .csv con opción de continuar
- ✅ Información detallada del archivo (tamaño, fecha de modificación)
- ✅ Confirmación antes de proceder con la importación

### 📊 Respuestas Claras
- ✅ Formato JSON automático de las respuestas del servidor
- ✅ Resumen visual de la importación (procesados, exitosos, fallidos)
- ✅ Listado de errores encontrados por línea
- ✅ Productos creados con sus IDs
- ✅ Mensajes de error HTTP con sugerencias de solución

### 🔄 Manejo de Errores
- ✅ Detección y manejo de errores de conexión
- ✅ Sugerencias específicas según el código de error HTTP
- ✅ Opción de reintentar en caso de error
- ✅ Opción de seleccionar otro archivo
- ✅ Logs detallados del proceso

### 📚 Documentación Integrada
- ✅ Ayuda sobre formato CSV esperado
- ✅ Ejemplos de uso en pantalla
- ✅ Referencias a documentación completa
- ✅ Comentarios explicativos en el código

## 🚀 Uso

### Requisitos Previos

1. **PowerShell 5.1 o superior** (incluido en Windows 10/11)
2. **Backend ejecutándose** en `http://localhost:5135`
3. **Archivo CSV** con el formato correcto

### Inicio Rápido

```powershell
# Navegar al directorio backend-config
cd backend-config

# Ejecutar el script
.\importar-masivo.ps1
```

### Ejemplo de Uso Interactivo

```
PS> .\importar-masivo.ps1

╔════════════════════════════════════════════════════════════════════════╗
║          IMPORTADOR MASIVO DE PRODUCTOS - VelyKapet                   ║
║                    Importación desde CSV                               ║
╚════════════════════════════════════════════════════════════════════════╝

📋 FORMATO DEL ARCHIVO CSV:

El archivo CSV debe contener las siguientes columnas:

  CAMPOS OBLIGATORIOS:
    • CATEGORIA    - Categoría del producto (debe existir en BD)
    • NAME         - Nombre único del producto
    • PRICE        - Precio del producto (acepta formato $20,400.00)

  CAMPOS OPCIONALES:
    • description  - Descripción del producto
    • presentacion - Presentación (ej: '500 GR', '1.5 KG')
    • stock        - Stock disponible (por defecto 0)
    • imageUrl     - URL de la imagen del producto
    • proveedor    - Nombre del proveedor
    • sku          - SKU del producto

  EJEMPLO DE CSV:
    ID,CATEGORIA,NAME,PRICE,stock,presentacion,imageUrl
    1,Alimento para Gatos,BR FOR CAT VET,$20400.00,10,500 GR,https://...

  📚 Documentación completa: backend-config/API_ENDPOINT_IMPORTAR_CSV.md
  📄 Archivo de ejemplo: backend-config/sample-products.csv

📂 SELECCIÓN DE ARCHIVO

Por favor, ingrese la ruta del archivo CSV a importar
Presione ENTER para usar el archivo por defecto: sample-products.csv

Ruta del archivo: [presiona ENTER]

🔍 Validando archivo...
✅ Archivo encontrado:
   📄 Nombre: sample-products.csv
   📏 Tamaño: 1.23 KB
   📅 Modificado: 12/01/2025 10:30:00

¿Desea proceder con la importación? (S/N): S

📤 ENVIANDO SOLICITUD AL SERVIDOR

   🌐 URL: http://localhost:5135/api/Productos/ImportarCsv
   📄 Archivo: sample-products.csv

Por favor espere...

═══════════════════════════════════════════════════════════════════════
✅ RESPUESTA DEL SERVIDOR (HTTP 200)
═══════════════════════════════════════════════════════════════════════

📊 RESUMEN DE LA IMPORTACIÓN:

   📦 Total procesados: 3
   ✅ Exitosos:         3
   ❌ Fallidos:         0

💬 MENSAJE:
   Importación completada: 3 productos creados, 0 errores.

✨ PRODUCTOS CREADOS: 3

   1. [101] BR FOR CAT VET CONTROL DE PESO X 500GR
   2. [102] BR FOR CAT VET CONTROL DE PESO X 1.5 KG
   3. [103] BR FOR CAT VET CONTROL DE PESO X 3 KG

═══════════════════════════════════════════════════════════════════════

¿Desea importar otro archivo? (S/N): N

╔════════════════════════════════════════════════════════════════════════╗
║              Gracias por usar el Importador de VelyKapet              ║
╚════════════════════════════════════════════════════════════════════════╝
```

## 📋 Formato del Archivo CSV

### Campos Requeridos

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `CATEGORIA` | Texto | Categoría del producto (debe existir en BD) | "Alimento para Gatos" |
| `NAME` | Texto | Nombre único del producto | "BR FOR CAT VET CONTROL DE PESO X 500GR" |
| `PRICE` | Texto/Número | Precio del producto | "$20,400.00" o "20400" |

### Campos Opcionales

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `description` | Texto | Descripción del producto | "Alimento para control de peso" |
| `presentacion` | Texto | Presentación de la variación | "500 GR", "1.5 KG", "3 KG" |
| `stock` | Número | Stock disponible | 10 |
| `imageUrl` | URL | URL de la imagen del producto | "https://www.velykapet.com/..." |
| `proveedor` | Texto | Nombre del proveedor | "CDM" |
| `sku` | Texto | SKU del producto | "300100101" |
| `CATEGORIA ALIMENTOS` | Texto | Categoría de alimento | "ALIMENTO SECO" |
| `SUBCATEGORIA` | Texto | Subcategoría | "DIETA SECA PRESCRITA" |
| `PRESENTACION EMPAQUE` | Texto | Tipo de empaque | "BOLSA", "LATA" |
| `MARCA` | Texto | Marca del producto | "BR", "Royal Canin" |

### Archivo de Ejemplo

Ver `backend-config/sample-products.csv` para un ejemplo completo y funcional.

## ⚠️ Manejo de Errores

### Errores Comunes y Soluciones

#### Error: Servidor no disponible (HTTP 0)
```
❌ ERROR EN LA IMPORTACIÓN (HTTP 0)

💡 SUGERENCIAS PARA RESOLVER EL ERROR:

   • Verifique que el servidor backend esté ejecutándose
   • URL esperada: http://localhost:5135
   • Comando para iniciar: cd backend-config && dotnet run
```

**Solución**: Iniciar el backend
```powershell
cd backend-config
dotnet run --urls="http://localhost:5135"
```

#### Error: Formato incorrecto (HTTP 400)
```
❌ ERROR EN LA IMPORTACIÓN (HTTP 400)

💡 SUGERENCIAS PARA RESOLVER EL ERROR:

   • Revise el formato del archivo CSV
   • Verifique que los campos obligatorios estén presentes
   • Consulte la documentación en API_ENDPOINT_IMPORTAR_CSV.md
```

**Solución**: Revisar el CSV y asegurar que tiene los campos obligatorios (CATEGORIA, NAME, PRICE)

#### Error: Categoría no encontrada

```
⚠️  ERRORES ENCONTRADOS:

   • Línea 3: Categoría 'CATEGORIA_INVALIDA' no encontrada.
```

**Solución**: Verificar que las categorías existan en la base de datos

#### Error: Producto duplicado

```
⚠️  ERRORES ENCONTRADOS:

   • Línea 5: El producto 'NOMBRE_DUPLICADO' ya existe.
```

**Solución**: Cambiar el nombre del producto o eliminar el duplicado del CSV

## 🔧 Opciones Avanzadas

### Especificar URL de API Personalizada

```powershell
.\importar-masivo.ps1 -ApiUrl "http://miservidor:8080/api/Productos/ImportarCsv"
```

### Usar Archivo Específico sin Interacción

Aunque el script es interactivo por diseño, puedes automatizar la entrada usando:

```powershell
# Crear un archivo con la ruta del CSV
"productos.csv" | .\importar-masivo.ps1
```

### Ejecutar con Política de Ejecución Temporal

Si tienes restricciones de PowerShell:

```powershell
PowerShell -ExecutionPolicy Bypass -File .\importar-masivo.ps1
```

## 📊 Interpretación de Resultados

### Importación Exitosa Completa

```
📊 RESUMEN DE LA IMPORTACIÓN:
   📦 Total procesados: 10
   ✅ Exitosos:         10
   ❌ Fallidos:         0
```

**Interpretación**: Todos los productos se importaron correctamente.

### Importación Parcial

```
📊 RESUMEN DE LA IMPORTACIÓN:
   📦 Total procesados: 10
   ✅ Exitosos:         7
   ❌ Fallidos:         3

⚠️  ERRORES ENCONTRADOS:
   • Línea 3: El producto 'PRODUCTO X' ya existe.
   • Línea 5: Categoría 'INVALIDA' no encontrada.
   • Línea 8: Precio inválido.
```

**Interpretación**: 7 productos se crearon correctamente, 3 tuvieron errores. Los productos exitosos ya están en la base de datos. Revise y corrija el CSV para los productos fallidos.

### Importación Fallida Completa

```
❌ ERROR EN LA IMPORTACIÓN (HTTP 400)
{
  "error": "No se proporcionó ningún archivo o el archivo está vacío."
}
```

**Interpretación**: El archivo no se pudo leer o está vacío. Verifique el archivo y vuelva a intentar.

## 🔄 Flujo de Reintentos

El script ofrece varias opciones cuando ocurre un error:

1. **Cambiar archivo**: Permite seleccionar un archivo diferente sin reiniciar el script
2. **Reintentar**: Vuelve a intentar con el mismo archivo (útil si el error era temporal)
3. **Cancelar**: Sale del script

Ejemplo de flujo:

```
¿Desea seleccionar otro archivo? (S/N): S
   → Vuelve a solicitar la ruta del archivo

¿Desea intentar de nuevo? (S/N): S
   → Reintenta con el mismo archivo

¿Desea intentar de nuevo? (S/N): N
   → Sale del script
```

## 📝 Registro de Actividad

El script muestra toda la actividad en consola, incluyendo:

- ✅ Pasos completados exitosamente
- ⚠️ Advertencias importantes
- ❌ Errores encontrados
- 📊 Resúmenes de operaciones
- 💬 Mensajes informativos

Para guardar la salida en un archivo de log:

```powershell
.\importar-masivo.ps1 | Tee-Object -FilePath "importacion.log"
```

## 🛡️ Mejores Prácticas

### Antes de Importar

1. ✅ Verificar que el backend esté ejecutándose
2. ✅ Hacer una copia de seguridad de la base de datos
3. ✅ Revisar el archivo CSV en un editor de texto/Excel
4. ✅ Probar con un CSV pequeño primero (2-3 productos)
5. ✅ Verificar que las categorías existan en la BD

### Durante la Importación

1. ✅ Leer los mensajes cuidadosamente
2. ✅ No interrumpir el proceso una vez iniciado
3. ✅ Guardar la salida si es una importación grande

### Después de Importar

1. ✅ Revisar el resumen de productos creados
2. ✅ Verificar los errores si los hay
3. ✅ Comprobar en la aplicación web que los productos aparezcan
4. ✅ Verificar imágenes y variaciones

## 🔗 Referencias

- [Documentación completa del endpoint](./API_ENDPOINT_IMPORTAR_CSV.md)
- [Guía de inicio rápido](./QUICK_START_IMPORTAR_CSV.md)
- [Resumen de implementación](./RESUMEN_IMPORTACION_CSV.md)
- [Archivo CSV de ejemplo](./sample-products.csv)

## 📞 Soporte

Si encuentras problemas:

1. Revisa esta guía y la documentación del endpoint
2. Verifica los logs del backend (`dotnet run`)
3. Comprueba que el archivo CSV tenga el formato correcto
4. Asegúrate de que el backend esté ejecutándose en el puerto correcto

## 🔄 Versiones

### v1.0 (Enero 2025)
- ✅ Interfaz interactiva completa
- ✅ Validaciones robustas
- ✅ Formato de respuesta JSON mejorado
- ✅ Manejo de errores con sugerencias
- ✅ Opciones de reintento
- ✅ Documentación integrada
- ✅ Compatible con PowerShell 5.1+

## 📜 Licencia

Este script es parte del proyecto VelyKapet.
