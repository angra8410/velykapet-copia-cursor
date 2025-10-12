<#
.SYNOPSIS
    Script rápido para limpiar productos de prueba (SQLite)

.DESCRIPTION
    Este script ejecuta el SQL de limpieza de forma simple y directa usando SQLite

.NOTES
    Archivo: limpiar-productos-prueba-rapido.ps1
    Versión: 1.0
#>

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     LIMPIEZA RÁPIDA DE PRODUCTOS DE PRUEBA - VelyKapet (SQLite)       ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "VentasPet.db")) {
    Write-Host "❌ Error: No se encontró VentasPet.db" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Asegúrese de ejecutar este script desde el directorio backend-config" -ForegroundColor Yellow
    Write-Host "   cd backend-config" -ForegroundColor Gray
    Write-Host "   .\limpiar-productos-prueba-rapido.ps1" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

# Verificar que existe el script SQL
if (-not (Test-Path "Data\limpiar-productos-prueba-sqlite.sql")) {
    Write-Host "❌ Error: No se encontró el script SQL" -ForegroundColor Red
    exit 1
}

# Verificar que sqlite3 está disponible
if (-not (Get-Command sqlite3 -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Error: sqlite3 no está disponible" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 SOLUCIÓN:" -ForegroundColor Yellow
    Write-Host "   1. Descargue SQLite desde: https://www.sqlite.org/download.html" -ForegroundColor Gray
    Write-Host "   2. O use el script SQL desde DB Browser for SQLite" -ForegroundColor Gray
    Write-Host "   3. O use el script de limpieza vía API: .\limpiar-productos-prueba.ps1" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

# Ejecutar el script SQL
Write-Host "🗑️  Ejecutando limpieza..." -ForegroundColor Yellow
Write-Host ""

$result = sqlite3 VentasPet.db ".read Data/limpiar-productos-prueba-sqlite.sql" 2>&1

# Mostrar solo las líneas relevantes
$result | Select-String -Pattern "🔍|✅|❌|📊|Total_Productos|Variaciones" | ForEach-Object {
    Write-Host $_.Line
}

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Limpieza completada. Puede ejecutar una nueva importación con:" -ForegroundColor Green
Write-Host "   .\test-importar-csv.ps1" -ForegroundColor Gray
Write-Host "   o" -ForegroundColor Gray
Write-Host "   .\importar-simple.ps1" -ForegroundColor Gray
Write-Host ""
