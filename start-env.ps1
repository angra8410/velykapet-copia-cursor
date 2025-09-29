# Script para iniciar VentasPet en diferentes ambientes

param (
    [Parameter(Mandatory=$false)]
    [string]$Environment = "development"
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " 🚀 VentasPet - Ambiente: $Environment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si existe el archivo .env para el ambiente
$envFile = ".env.$Environment"
if (-not (Test-Path $envFile)) {
    Write-Host "⚠️ Advertencia: No se encontró archivo $envFile" -ForegroundColor Yellow
    Write-Host "📝 Se usará la configuración por defecto (.env)" -ForegroundColor Yellow
    Write-Host ""
}

# Establecer ambiente
$env:NODE_ENV = $Environment

# Iniciar el servidor
Write-Host "🌍 Iniciando servidor en ambiente: $Environment..." -ForegroundColor Green
Write-Host ""

node simple-server.cjs