# Script simplificado
$ApiUrl = "http://localhost:5135/api/Productos/ImportarCsv"
$CsvFile = "sample-products.csv"

# Verificar archivo
if (-not (Test-Path $CsvFile)) {
    Write-Host "Error: No se encontró el archivo $CsvFile"
    exit
}

Write-Host "Importando productos desde $CsvFile"

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

    # Enviar petición
    $response = Invoke-WebRequest -Uri $ApiUrl -Method Post -ContentType "multipart/form-data; boundary=$boundary" -Body $bodyLines

    # Mostrar respuesta
    Write-Host "Importación completada"
    $jsonObject = $response.Content | ConvertFrom-Json
    Write-Host "Total: $($jsonObject.totalProcessed)"
    Write-Host "Exitosos: $($jsonObject.successCount)"
    Write-Host "Fallidos: $($jsonObject.failureCount)"
}
catch {
<<<<<<< HEAD
    Write-Host "Error: $_"
=======
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
>>>>>>> 93f1867ebac3671454dfee340fd34f1e8c1fc37e
}

Write-Host "Fin"