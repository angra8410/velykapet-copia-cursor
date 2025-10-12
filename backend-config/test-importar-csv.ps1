# Script para importar productos desde CSV
# Configuración
$ApiUrl = "http://localhost:5135/api/Productos/ImportarCsv"
$CsvFile = "sample-products.csv"

# Verificar que el archivo CSV existe
if (-not (Test-Path $CsvFile)) {
    Write-Host "Error: No se encontró el archivo $CsvFile" -ForegroundColor Red
    exit 1
}

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
    Write-Host $response.Content
}
catch {
    Write-Host "Error al realizar la petición: $_" -ForegroundColor Red
}

Write-Host "Fin de la prueba" -ForegroundColor Cyan