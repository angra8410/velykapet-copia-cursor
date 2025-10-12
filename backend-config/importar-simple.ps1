<#
.SYNOPSIS
    Script SIMPLE para importar productos desde CSV a la API de VelyKapet

.DESCRIPTION
    Este script usa curl.exe (incluido en Windows 10+) para enviar un archivo CSV
    al endpoint de importación masiva de productos. Es la forma MÁS SIMPLE y CONFIABLE.

.NOTES
    Archivo: importar-simple.ps1
    Autor: VelyKapet Development Team
    Versión: 2.0 (Mejorada con diagnósticos y manejo de errores)
#>

# ══════════════════════════════════════════════════════════════════════════════
# CONFIGURACIÓN
# ══════════════════════════════════════════════════════════════════════════════
$ApiUrl = "http://localhost:5135/api/Productos/ImportarCsv"
$CsvFile = "sample-products.csv"

# ══════════════════════════════════════════════════════════════════════════════
# BANNER
# ══════════════════════════════════════════════════════════════════════════════
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║      IMPORTADOR SIMPLE DE PRODUCTOS - VelyKapet (usando curl.exe)     ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ══════════════════════════════════════════════════════════════════════════════
# VALIDACIONES
# ══════════════════════════════════════════════════════════════════════════════
Write-Host "📋 Validando prerequisitos..." -ForegroundColor Yellow
Write-Host ""

# Verificar que curl.exe existe
if (-not (Get-Command curl.exe -ErrorAction SilentlyContinue)) {
    Write-Host "❌ ERROR: curl.exe no está disponible" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 SOLUCIÓN:" -ForegroundColor Yellow
    Write-Host "   curl.exe viene incluido en Windows 10 (versión 1803+) y Windows 11" -ForegroundColor Gray
    Write-Host "   Si no lo tiene, actualice Windows o use importar-masivo.ps1" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

# Verificar que el archivo CSV existe
if (-not (Test-Path $CsvFile)) {
    Write-Host "❌ ERROR: No se encontró el archivo '$CsvFile'" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 SOLUCIÓN:" -ForegroundColor Yellow
    Write-Host "   1. Verifique que está en el directorio correcto (backend-config)" -ForegroundColor Gray
    Write-Host "   2. Verifique que el archivo existe: ls $CsvFile" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

# Verificar que el backend está ejecutándose
Write-Host "🔍 Verificando conexión con el backend..." -ForegroundColor Yellow
$testResponse = curl.exe -s -o /dev/null -w "%{http_code}" http://localhost:5135/api/Productos 2>$null
if ($testResponse -ne "200" -and $testResponse -ne "401") {
    Write-Host "❌ ERROR: El backend no está ejecutándose o no responde" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 SOLUCIÓN:" -ForegroundColor Yellow
    Write-Host "   1. Abra una nueva terminal PowerShell" -ForegroundColor Gray
    Write-Host "   2. Navegue al directorio: cd backend-config" -ForegroundColor Gray
    Write-Host "   3. Ejecute el backend: dotnet run" -ForegroundColor Gray
    Write-Host "   4. Espere a que inicie (verá 'Now listening on: http://localhost:5135')" -ForegroundColor Gray
    Write-Host "   5. Vuelva a ejecutar este script en otra terminal" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

Write-Host "✅ Backend está ejecutándose correctamente" -ForegroundColor Green
Write-Host ""

# ══════════════════════════════════════════════════════════════════════════════
# IMPORTACIÓN
# ══════════════════════════════════════════════════════════════════════════════
Write-Host "📦 Archivo CSV: $CsvFile" -ForegroundColor Cyan
Write-Host "🌐 URL del API: $ApiUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "📤 Enviando archivo CSV al servidor..." -ForegroundColor Yellow
Write-Host ""

# Ejecutar curl.exe con opciones verbosas para capturar el código de estado HTTP
$httpCode = ""
$response = curl.exe -s -w "`n%{http_code}" -X POST -F "file=@$CsvFile" $ApiUrl

# Separar el código HTTP del cuerpo de la respuesta
$lines = $response -split "`n"
$httpCode = $lines[-1]
$body = ($lines[0..($lines.Length - 2)] -join "`n").Trim()

Write-Host "📊 Código HTTP: $httpCode" -ForegroundColor Cyan
Write-Host ""

# ══════════════════════════════════════════════════════════════════════════════
# MANEJO DE RESPUESTA
# ══════════════════════════════════════════════════════════════════════════════
if ($httpCode -eq "200") {
    Write-Host "✅ ÉXITO: Importación completada correctamente" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Respuesta del servidor:" -ForegroundColor Cyan
    Write-Host $body
    Write-Host ""
}
elseif ($httpCode -eq "400") {
    Write-Host "❌ ERROR 400: Solicitud incorrecta" -ForegroundColor Red
    Write-Host ""
    Write-Host "📋 Respuesta del servidor:" -ForegroundColor Yellow
    Write-Host $body
    Write-Host ""
    Write-Host "💡 POSIBLES CAUSAS:" -ForegroundColor Yellow
    Write-Host "   • El archivo CSV está vacío o mal formateado" -ForegroundColor Gray
    Write-Host "   • El archivo no tiene extensión .csv" -ForegroundColor Gray
    Write-Host "   • Faltan campos obligatorios en el CSV (NAME, CATEGORIA, PRICE)" -ForegroundColor Gray
    Write-Host ""
}
elseif ($httpCode -eq "404") {
    Write-Host "❌ ERROR 404: Endpoint no encontrado" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 POSIBLES CAUSAS:" -ForegroundColor Yellow
    Write-Host "   • La URL del endpoint es incorrecta" -ForegroundColor Gray
    Write-Host "   • El backend no tiene el controlador ProductosController" -ForegroundColor Gray
    Write-Host "   • Verifique que la URL sea: $ApiUrl" -ForegroundColor Gray
    Write-Host ""
}
elseif ($httpCode -eq "405") {
    Write-Host "❌ ERROR 405: Método no permitido" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 POSIBLES CAUSAS:" -ForegroundColor Yellow
    Write-Host "   • El endpoint no acepta el método POST" -ForegroundColor Gray
    Write-Host "   • La ruta del endpoint es incorrecta (debe ser /api/Productos/ImportarCsv)" -ForegroundColor Gray
    Write-Host "   • El backend no tiene el método [HttpPost('ImportarCsv')] configurado" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🔧 VERIFICAR EN EL BACKEND:" -ForegroundColor Yellow
    Write-Host "   Archivo: Controllers/ProductosController.cs" -ForegroundColor Gray
    Write-Host "   Debe tener: [HttpPost(`"ImportarCsv`")]" -ForegroundColor Gray
    Write-Host ""
}
elseif ($httpCode -eq "415") {
    Write-Host "❌ ERROR 415: Tipo de medio no soportado" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 POSIBLES CAUSAS:" -ForegroundColor Yellow
    Write-Host "   • El Content-Type es incorrecto" -ForegroundColor Gray
    Write-Host "   • El backend no acepta multipart/form-data" -ForegroundColor Gray
    Write-Host ""
}
elseif ($httpCode -eq "500") {
    Write-Host "❌ ERROR 500: Error interno del servidor" -ForegroundColor Red
    Write-Host ""
    Write-Host "📋 Respuesta del servidor:" -ForegroundColor Yellow
    Write-Host $body
    Write-Host ""
    Write-Host "💡 POSIBLES CAUSAS:" -ForegroundColor Yellow
    Write-Host "   • Error en la base de datos (tablas faltantes, referencias incorrectas)" -ForegroundColor Gray
    Write-Host "   • Datos en el CSV que no cumplen las validaciones del backend" -ForegroundColor Gray
    Write-Host "   • Revise los logs del backend para más detalles" -ForegroundColor Gray
    Write-Host ""
}
else {
    Write-Host "⚠️  CÓDIGO HTTP INESPERADO: $httpCode" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📋 Respuesta del servidor:" -ForegroundColor Cyan
    Write-Host $body
    Write-Host ""
}

Write-Host "════════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""