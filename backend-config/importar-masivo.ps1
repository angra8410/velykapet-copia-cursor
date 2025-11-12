# ========================================
# Script de Importación Masiva de Productos
# ========================================
# Importa productos desde archivo CSV usando API
# Soporta modo DryRun para validación sin importar
# ========================================
#
# CHANGELOG: Added -DryRun parameter for safe testing
#
# Uso:
#   .\importar-masivo.ps1                           # Importación normal
#   .\importar-masivo.ps1 -DryRun                   # Validación sin importar
#   .\importar-masivo.ps1 -InputFile "archivo.csv"  # Archivo personalizado
#   .\importar-masivo.ps1 -InputFile "test.csv" -DryRun # Validación de archivo personalizado
#
# ========================================

param(
    [Parameter(Mandatory=$false)]
    [string]$InputFile = "sample-products.csv",
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun = $false,
    
    [Parameter(Mandatory=$false)]
    [string]$ApiUrl = "http://localhost:5135/api/Productos/ImportarCsv"
)

# Script original
$CsvFile = $InputFile

# Configurar encoding UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# Verificar archivo
if (-not (Test-Path $CsvFile)) {
    Write-Host "❌ Error: No se encontró el archivo $CsvFile" -ForegroundColor Red
    exit 1
}

# Mostrar modo de operación
if ($DryRun) {
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor Magenta
    Write-Host "🔍 MODO DRY-RUN ACTIVADO" -ForegroundColor Magenta
    Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor Magenta
    Write-Host "   Se validará el archivo y preparará la petición SIN enviarla al servidor" -ForegroundColor Gray
    Write-Host "   No se realizarán cambios en la base de datos" -ForegroundColor Gray
    Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor Magenta
    Write-Host ""
}

Write-Host "📁 Archivo: $CsvFile" -ForegroundColor Cyan
Write-Host "🌐 API URL: $ApiUrl" -ForegroundColor Cyan
Write-Host ""

# Validar que el archivo sea CSV
$fileInfo = Get-Item $CsvFile
if ($fileInfo.Extension -ne ".csv") {
    Write-Host "⚠️  Advertencia: El archivo no tiene extensión .csv" -ForegroundColor Yellow
}

Write-Host "📏 Tamaño del archivo: $([Math]::Round($fileInfo.Length / 1KB, 2)) KB" -ForegroundColor Gray

# Mostrar vista previa del contenido
try {
    $csvContent = Get-Content $CsvFile -Encoding UTF8 -TotalCount 5
    Write-Host ""
    Write-Host "📄 Vista previa (primeras 5 líneas):" -ForegroundColor Yellow
    $lineNumber = 1
    foreach ($line in $csvContent) {
        Write-Host "   $lineNumber`: $line" -ForegroundColor Gray
        $lineNumber++
    }
    Write-Host ""
    
    # Contar líneas totales
    $totalLines = (Get-Content $CsvFile -Encoding UTF8 | Measure-Object -Line).Lines
    Write-Host "📊 Total de líneas en el archivo: $totalLines" -ForegroundColor Cyan
    Write-Host "📦 Productos a importar (aprox.): $($totalLines - 1)" -ForegroundColor Cyan
    Write-Host ""
}
catch {
    Write-Host "⚠️  No se pudo leer el contenido del archivo para vista previa" -ForegroundColor Yellow
}

Write-Host "Preparando importación desde $CsvFile..." -ForegroundColor Cyan

try {
    # Preparar archivo
    $fileBin = [System.IO.File]::ReadAllBytes((Resolve-Path $CsvFile))
    $boundary = [System.Guid]::NewGuid().ToString()
    $LF = "`r`n"

    # Construir cuerpo
    $bodyLines = (
        "--$boundary",
        "Content-Disposition: form-data; name=`"file`"; filename=`"$CsvFile`"",
        "Content-Type: text/csv",
        "",
        [System.Text.Encoding]::UTF8.GetString($fileBin),
        "--$boundary--",
        ""
    ) -join $LF

    if ($DryRun) {
        # MODO DRY-RUN: Mostrar información sin enviar petición
        Write-Host "✅ Archivo validado correctamente" -ForegroundColor Green
        Write-Host ""
        Write-Host "📋 Información de la petición que se enviaría:" -ForegroundColor Yellow
        Write-Host "   • Método: POST" -ForegroundColor Gray
        Write-Host "   • URL: $ApiUrl" -ForegroundColor Gray
        Write-Host "   • Content-Type: multipart/form-data; boundary=$boundary" -ForegroundColor Gray
        Write-Host "   • Tamaño del body: $($bodyLines.Length) bytes" -ForegroundColor Gray
        Write-Host ""
        Write-Host "🔍 Primeras líneas del body preparado:" -ForegroundColor Yellow
        $bodyPreview = $bodyLines.Split("`n") | Select-Object -First 10
        foreach ($line in $bodyPreview) {
            Write-Host "   $line" -ForegroundColor DarkGray
        }
        Write-Host "   ..." -ForegroundColor DarkGray
        Write-Host ""
        Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor Magenta
        Write-Host "✅ VALIDACIÓN DRY-RUN COMPLETADA" -ForegroundColor Green
        Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor Magenta
        Write-Host ""
        Write-Host "💡 Para realizar la importación real, ejecute el script sin -DryRun" -ForegroundColor Yellow
        Write-Host ""
        exit 0
    }

    # Enviar petición (solo si NO es DryRun)
    $response = Invoke-WebRequest -Uri $ApiUrl -Method Post -ContentType "multipart/form-data; boundary=$boundary" -Body $bodyLines

    # Mostrar respuesta
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "✅ IMPORTACIÓN COMPLETADA" -ForegroundColor Green
    Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
    
    try {
        $jsonObject = $response.Content | ConvertFrom-Json
        
        Write-Host "📊 RESUMEN:" -ForegroundColor Yellow
        Write-Host "   📦 Total procesados: $($jsonObject.TotalProcessed)" -ForegroundColor Gray
        Write-Host "   ✅ Exitosos:         $($jsonObject.SuccessCount)" -ForegroundColor Green
        Write-Host "   ❌ Fallidos:         $($jsonObject.FailureCount)" -ForegroundColor Red
        Write-Host ""
        
        if ($jsonObject.Message) {
            Write-Host "💬 MENSAJE:" -ForegroundColor Yellow
            Write-Host "   $($jsonObject.Message)" -ForegroundColor Gray
            Write-Host ""
        }
        
        # Mostrar productos creados
        if ($jsonObject.CreatedProducts -and $jsonObject.CreatedProducts.Count -gt 0) {
            Write-Host "✨ PRODUCTOS CREADOS: $($jsonObject.CreatedProducts.Count)" -ForegroundColor Green
            Write-Host ""
            $count = 0
            foreach ($producto in $jsonObject.CreatedProducts) {
                $count++
                Write-Host "   $count. [ID: $($producto.IdProducto)] $($producto.NombreBase)" -ForegroundColor Cyan
                if ($producto.Variaciones -and $producto.Variaciones.Count -gt 0) {
                    foreach ($variacion in $producto.Variaciones) {
                        Write-Host "      • $($variacion.Presentacion) - Precio: `$$($variacion.Precio) - Stock: $($variacion.Stock)" -ForegroundColor Gray
                    }
                }
                if ($count -ge 10) {
                    Write-Host "   ... y $($jsonObject.CreatedProducts.Count - 10) más" -ForegroundColor Gray
                    break
                }
            }
            Write-Host ""
        }
        
        # Mostrar errores detallados
        if ($jsonObject.DetailedErrors -and $jsonObject.DetailedErrors.Count -gt 0) {
            Write-Host "⚠️  ERRORES DETALLADOS: $($jsonObject.DetailedErrors.Count)" -ForegroundColor Red
            Write-Host ""
            # CHANGELOG: Renamed $error to $errorItem to avoid PSScriptAnalyzer error (readonly automatic variable)
            foreach ($errorItem in $jsonObject.DetailedErrors) {
                Write-Host "   ❌ Línea $($errorItem.LineNumber): $($errorItem.ProductName)" -ForegroundColor Red
                Write-Host "      Tipo: $($errorItem.ErrorType)" -ForegroundColor DarkRed
                Write-Host "      Error: $($errorItem.ErrorMessage)" -ForegroundColor DarkRed
                
                if ($errorItem.FieldErrors) {
                    Write-Host "      Campos con error:" -ForegroundColor DarkYellow
                    foreach ($fieldError in $errorItem.FieldErrors.GetEnumerator()) {
                        Write-Host "         • $($fieldError.Key): $($fieldError.Value)" -ForegroundColor Yellow
                    }
                }
                Write-Host ""
            }
        }
        elseif ($jsonObject.Errors -and $jsonObject.Errors.Count -gt 0) {
            Write-Host "⚠️  ERRORES: $($jsonObject.Errors.Count)" -ForegroundColor Red
            Write-Host ""
            # CHANGELOG: Renamed $error to $errorItem to avoid PSScriptAnalyzer error (readonly automatic variable)
            foreach ($errorItem in $jsonObject.Errors) {
                Write-Host "   • $errorItem" -ForegroundColor DarkRed
            }
            Write-Host ""
        }
    }
    catch {
        Write-Host "Error al procesar la respuesta JSON: $_" -ForegroundColor Red
        Write-Host "Respuesta cruda: $($response.Content)" -ForegroundColor Gray
    }
    
    Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
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

Write-Host "Proceso de importación finalizado" -ForegroundColor Green