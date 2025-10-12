<#
.SYNOPSIS
    Script simplificado para importar productos desde CSV a la API de VelyKapet

.DESCRIPTION
    Este script envía un archivo CSV al endpoint de importación masiva de productos,
    manejando errores de manera robusta y mostrando información detallada del proceso.

.NOTES
    Archivo: importar-masivo.ps1
    Autor: VelyKapet Development Team
    Versión: 1.1 (Mejorada con documentación y mejores prácticas)
#>

# ══════════════════════════════════════════════════════════════════════════════
# CONFIGURACIÓN INICIAL
# ══════════════════════════════════════════════════════════════════════════════
$ApiUrl = "http://localhost:5135/api/Productos/ImportarCsv"
$CsvFile = "sample-products.csv"

# ══════════════════════════════════════════════════════════════════════════════
# VALIDACIÓN DE PREREQUISITOS
# ══════════════════════════════════════════════════════════════════════════════
if (-not (Test-Path $CsvFile)) {
    Write-Host "Error: No se encontró el archivo $CsvFile" -ForegroundColor Red
    exit 1
}

# ══════════════════════════════════════════════════════════════════════════════
# BANNER DE INICIO
# ══════════════════════════════════════════════════════════════════════════════
Write-Host "╔════════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║          IMPORTADOR MASIVO DE PRODUCTOS - VelyKapet                   ║" -ForegroundColor Cyan
Write-Host "║                    Importación desde CSV                               ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Write-Host "Archivo CSV: $CsvFile" -ForegroundColor Green
Write-Host "URL del API: $ApiUrl" -ForegroundColor Green
Write-Host "Enviando archivo CSV al endpoint..." -ForegroundColor Yellow

# ══════════════════════════════════════════════════════════════════════════════
# BLOQUE TRY-CATCH PRINCIPAL
# ══════════════════════════════════════════════════════════════════════════════
try {
    # Preparación del archivo para envío multipart/form-data
    $fileBin = [System.IO.File]::ReadAllBytes((Resolve-Path $CsvFile))
    $boundary = [System.Guid]::NewGuid().ToString()
    $LF = "`r`n"

    # Construcción del cuerpo multipart siguiendo RFC 2046
    $bodyLines = (
        "--$boundary",
        "Content-Disposition: form-data; name=`"file`"; filename=`"$CsvFile`"",
        "Content-Type: text/csv",
        "",
        [System.Text.Encoding]::UTF8.GetString($fileBin),
        "--$boundary--",
        ""
    ) -join $LF

    # Envío de petición HTTP POST con el archivo CSV
    $response = Invoke-WebRequest -Uri $ApiUrl -Method Post -ContentType "multipart/form-data; boundary=$boundary" -Body $bodyLines -ErrorAction Stop

    # Procesamiento de respuesta exitosa
    Write-Host "Importación completada con éxito" -ForegroundColor Green
    Write-Host "Respuesta del servidor:" -ForegroundColor Cyan

    # BLOQUE TRY-CATCH ANIDADO para parsing de JSON
    try {
        $jsonObject = $response.Content | ConvertFrom-Json

        if ($jsonObject.totalProcessed -or $jsonObject.TotalProcessed) {
            # Normalización de nombres de propiedades (camelCase vs PascalCase)
            $totalProcessed = if ($jsonObject.totalProcessed) { $jsonObject.totalProcessed } else { $jsonObject.TotalProcessed }
            $successCount = if ($jsonObject.successCount) { $jsonObject.successCount } else { $jsonObject.SuccessCount }
            $failureCount = if ($jsonObject.failureCount) { $jsonObject.failureCount } else { $jsonObject.FailureCount }

            # Mostrar resumen estructurado
            Write-Host "📊 RESUMEN DE LA IMPORTACIÓN:" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "   📦 Total procesados: " -NoNewline -ForegroundColor Gray
            Write-Host "$totalProcessed" -ForegroundColor White
            Write-Host "   ✅ Exitosos:         " -NoNewline -ForegroundColor Gray
            Write-Host "$successCount" -ForegroundColor Green
            Write-Host "   ❌ Fallidos:         " -NoNewline -ForegroundColor Gray
            Write-Host "$failureCount" -ForegroundColor $(if ($failureCount -gt 0) { "Red" } else { "Green" })
            Write-Host ""
        }
        else {
            # Fallback: Si no hay estructura de resumen, mostrar JSON completo
            Write-Host $response.Content -ForegroundColor White
            Write-Host ""
        }
    }
    catch {
        # Manejo elegante de error: Si el JSON no es parseable, mostrar texto plano
        Write-Host $response.Content -ForegroundColor White
        Write-Host ""
    }
}
catch {
    # MANEJO DE ERRORES PRINCIPAL
    Write-Host "Error al realizar la petición: $_" -ForegroundColor Red

    Write-Host ""
    Write-Host "💡 SUGERENCIAS PARA RESOLVER EL ERROR:" -ForegroundColor Yellow
    Write-Host ""

    if ($_.Exception.Response) {
        $statusCode = [int]$_.Exception.Response.StatusCode

        switch ($statusCode) {
            400 {
                Write-Host "   • Revise el formato del archivo CSV" -ForegroundColor Gray
                Write-Host "   • Verifique que los campos obligatorios estén presentes" -ForegroundColor Gray
            }
            404 {
                Write-Host "   • El endpoint no fue encontrado" -ForegroundColor Gray
                Write-Host "   • Verifique la URL de la API: $ApiUrl" -ForegroundColor Gray
            }
            405 {
                Write-Host "   • ERROR 405: Método no permitido" -ForegroundColor Red
                Write-Host "   • El endpoint no acepta el método POST o la ruta es incorrecta" -ForegroundColor Gray
                Write-Host "   • Verifique que el backend tenga [HttpPost('ImportarCsv')] configurado" -ForegroundColor Gray
                Write-Host "   • La ruta debe ser: /api/Productos/ImportarCsv" -ForegroundColor Gray
            }
            415 {
                Write-Host "   • ERROR 415: Tipo de medio no soportado" -ForegroundColor Red
                Write-Host "   • El Content-Type multipart/form-data no es aceptado" -ForegroundColor Gray
                Write-Host "   • Verifique la configuración del backend" -ForegroundColor Gray
            }
            500 {
                Write-Host "   • ERROR 500: Error interno del servidor" -ForegroundColor Red
                Write-Host "   • Revise los logs del backend para más detalles" -ForegroundColor Gray
                Write-Host "   • Puede haber problemas de base de datos o validación" -ForegroundColor Gray
            }
            default {
                Write-Host "   • Código de estado HTTP: $statusCode" -ForegroundColor Gray
            }
        }
    }
    else {
        Write-Host "   • Verifique que el servidor backend esté ejecutándose" -ForegroundColor Gray
        Write-Host "   • URL esperada: http://localhost:5135" -ForegroundColor Gray
        Write-Host "   • Comando para iniciar: cd backend-config" -ForegroundColor Gray
        Write-Host "   • Luego ejecute: dotnet run" -ForegroundColor Gray
    }
}

# ══════════════════════════════════════════════════════════════════════════════
# FINALIZACIÓN DEL SCRIPT
# ══════════════════════════════════════════════════════════════════════════════
Write-Host "Fin de la prueba" -ForegroundColor Cyan