# Script mejorado para importar productos
$ApiUrl = "http://localhost:5135/api/Productos/ImportarCsv"
$CsvFile = "sample-products.csv"

Write-Host "Importando $CsvFile..." -ForegroundColor Yellow

# Verificar que el archivo existe
if (-not (Test-Path $CsvFile)) {
    Write-Host "Error: No se encontró el archivo $CsvFile" -ForegroundColor Red
    exit 1
}

# Usar curl.exe con opciones para mostrar la respuesta completa
Write-Host "Enviando solicitud al servidor..." -ForegroundColor Cyan
$response = curl.exe -s -F "file=@$CsvFile" $ApiUrl

Write-Host "`nRespuesta del servidor:" -ForegroundColor Green
Write-Host $response

Write-Host "`nImportación completada. Verifique los resultados en la respuesta anterior." -ForegroundColor Yellow