# Script simplificado para importar productos desde CSV
# Configuración
$ApiUrl = "http://localhost:5135/api/Productos/ImportarCsv"
$CsvFile = "sample-products.csv"

# Verificar que el archivo CSV existe
if (-not (Test-Path $CsvFile)) {
    Write-Host "Error: No se encontró el archivo $CsvFile" -ForegroundColor Red
    exit 1
}

Write-Host "╔════════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║          IMPORTADOR MASIVO DE PRODUCTOS - VelyKapet                   ║" -ForegroundColor Cyan
Write-Host "║                    Importación desde CSV                               ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Write-Host "Archivo CSV: $CsvFile" -ForegroundColor Green
Write-Host "URL del API: $ApiUrl" -ForegroundColor Green
Write-Host "Enviando archivo CSV al endpoint..." -ForegroundColor Yellow

try {
    # Crear un objeto para la solicitud multipart/form-data
    $fileBin = [System.IO.File]::ReadAllBytes((Resolve-Path $CsvFile))
    $boundary = [System.Guid]::NewGuid().ToString()
    $LF = "`r`n"
    
    $bodyLines = (
        "--$boundary",
        "Content-Disposition: form-data; name=`"file`"; filename=`"$CsvFile`"",
        "Content-Type: text/csv",
        "",
        [System.Text.Encoding]::UTF8.GetString($fileBin),
        "--$boundary--",
        ""
    ) -join $LF
    
    # Realizar la petición POST con el archivo CSV
    $response = Invoke-WebRequest -Uri $ApiUrl -Method Post -ContentType "multipart/form-data; boundary=$boundary" -Body $bodyLines -ErrorAction Stop
    
    # Mostrar la respuesta
    Write-Host "Importación completada con éxito" -ForegroundColor Green
    Write-Host "Respuesta del servidor:" -ForegroundColor Cyan
    
    try {
        $jsonObject = $response.Content | ConvertFrom-Json
        
        # Mostrar resumen si está disponible
        if ($jsonObject.totalProcessed -or $jsonObject.TotalProcessed) {
            $totalProcessed = if ($jsonObject.totalProcessed) { $jsonObject.totalProcessed } else { $jsonObject.TotalProcessed }
            $successCount = if ($jsonObject.successCount) { $jsonObject.successCount } else { $jsonObject.SuccessCount }
            $failureCount = if ($jsonObject.failureCount) { $jsonObject.failureCount } else { $jsonObject.FailureCount }
            
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
            # Si no hay estructura de resumen, mostrar JSON completo
            Write-Host $response.Content -ForegroundColor White
            Write-Host ""
        }
    }
    catch {
        # Si hay error parseando el JSON, mostrar el contenido sin formato
        Write-Host $response.Content -ForegroundColor White
        Write-Host ""
    }
}
catch {
    Write-Host "Error al realizar la petición: $_" -ForegroundColor Red
    
    # Sugerencias según el tipo de error
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

Write-Host "Fin de la prueba" -ForegroundColor Cyan
