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
    $fileBin = [System.IO.File]::ReadAllBytes($CsvFile)
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
    Write-Host "Error: $_"
}

Write-Host "Fin"