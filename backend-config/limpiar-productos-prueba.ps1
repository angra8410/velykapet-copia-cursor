<#
.SYNOPSIS
    Script para eliminar productos de prueba de la base de datos

.DESCRIPTION
    Este script elimina todos los productos que fueron importados desde CSV
    de prueba, permitiendo empezar con un entorno limpio.

.NOTES
    Archivo: limpiar-productos-prueba.ps1
    Autor: VelyKapet Development Team
    Versión: 1.0
    
.PARAMETER Confirmar
    Si se especifica, solicita confirmación antes de eliminar
#>

param(
    [switch]$Confirmar = $false
)

# ══════════════════════════════════════════════════════════════════════════════
# CONFIGURACIÓN
# ══════════════════════════════════════════════════════════════════════════════
$ApiUrlProductos = "http://localhost:5135/api/Productos"
$ProductosAEliminar = @(
    "BR FOR CAT VET CONTROL DE PESO"
)

# ══════════════════════════════════════════════════════════════════════════════
# BANNER
# ══════════════════════════════════════════════════════════════════════════════
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════════════╗" -ForegroundColor Red
Write-Host "║        LIMPIEZA DE PRODUCTOS DE PRUEBA - VelyKapet                    ║" -ForegroundColor Red
Write-Host "╚════════════════════════════════════════════════════════════════════════╝" -ForegroundColor Red
Write-Host ""
Write-Host "⚠️  ADVERTENCIA: Este script eliminará productos de la base de datos" -ForegroundColor Yellow
Write-Host ""

# ══════════════════════════════════════════════════════════════════════════════
# VERIFICAR BACKEND
# ══════════════════════════════════════════════════════════════════════════════
Write-Host "🔍 Verificando conexión con el backend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $ApiUrlProductos -Method Get -ErrorAction Stop
    Write-Host "✅ Backend está ejecutándose" -ForegroundColor Green
}
catch {
    Write-Host "❌ ERROR: No se puede conectar con el backend" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 SOLUCIÓN:" -ForegroundColor Yellow
    Write-Host "   1. Asegúrese de que el backend esté ejecutándose: dotnet run" -ForegroundColor Gray
    Write-Host "   2. Verifique que esté en http://localhost:5135" -ForegroundColor Gray
    Write-Host ""
    exit 1
}
Write-Host ""

# ══════════════════════════════════════════════════════════════════════════════
# OBTENER PRODUCTOS ACTUALES
# ══════════════════════════════════════════════════════════════════════════════
Write-Host "📦 Obteniendo productos de la base de datos..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $ApiUrlProductos -Method Get -ErrorAction Stop
    $productos = $response.Content | ConvertFrom-Json
    
    Write-Host "✅ Se encontraron $($productos.Count) productos en total" -ForegroundColor Green
    Write-Host ""
}
catch {
    Write-Host "❌ ERROR: No se pudieron obtener los productos" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

# ══════════════════════════════════════════════════════════════════════════════
# BUSCAR PRODUCTOS DE PRUEBA
# ══════════════════════════════════════════════════════════════════════════════
Write-Host "🔍 Buscando productos de prueba para eliminar..." -ForegroundColor Yellow
Write-Host ""

$productosEncontrados = @()

# Buscar productos que coincidan con los nombres de prueba
foreach ($nombrePrueba in $ProductosAEliminar) {
    $productosCoincidentes = $productos | Where-Object { 
        $_.NombreBase -like "*$nombrePrueba*" 
    }
    
    if ($productosCoincidentes) {
        $productosEncontrados += $productosCoincidentes
    }
}

if ($productosEncontrados.Count -eq 0) {
    Write-Host "✅ No se encontraron productos de prueba para eliminar" -ForegroundColor Green
    Write-Host ""
    exit 0
}

Write-Host "📋 Se encontraron $($productosEncontrados.Count) productos de prueba:" -ForegroundColor Cyan
Write-Host ""

foreach ($producto in $productosEncontrados) {
    Write-Host "   • ID: $($producto.IdProducto) - $($producto.NombreBase)" -ForegroundColor Gray
}
Write-Host ""

# ══════════════════════════════════════════════════════════════════════════════
# CONFIRMACIÓN
# ══════════════════════════════════════════════════════════════════════════════
if ($Confirmar) {
    $respuesta = Read-Host "¿Desea eliminar estos productos? (S/N)"
    if ($respuesta -ne "S" -and $respuesta -ne "s") {
        Write-Host ""
        Write-Host "❌ Operación cancelada por el usuario" -ForegroundColor Yellow
        Write-Host ""
        exit 0
    }
    Write-Host ""
}

# ══════════════════════════════════════════════════════════════════════════════
# ELIMINAR PRODUCTOS
# ══════════════════════════════════════════════════════════════════════════════
Write-Host "🗑️  Eliminando productos de prueba..." -ForegroundColor Yellow
Write-Host ""

$eliminadosExitosos = 0
$eliminadosFallidos = 0

foreach ($producto in $productosEncontrados) {
    try {
        $deleteUrl = "$ApiUrlProductos/$($producto.IdProducto)"
        $response = Invoke-WebRequest -Uri $deleteUrl -Method Delete -ErrorAction Stop
        
        Write-Host "   ✅ Eliminado: $($producto.NombreBase)" -ForegroundColor Green
        $eliminadosExitosos++
    }
    catch {
        Write-Host "   ❌ Error eliminando: $($producto.NombreBase)" -ForegroundColor Red
        Write-Host "      Razón: $($_.Exception.Message)" -ForegroundColor Gray
        $eliminadosFallidos++
    }
}

# ══════════════════════════════════════════════════════════════════════════════
# RESUMEN
# ══════════════════════════════════════════════════════════════════════════════
Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📊 RESUMEN DE LIMPIEZA:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   ✅ Eliminados exitosamente: $eliminadosExitosos" -ForegroundColor Green
Write-Host "   ❌ Fallos: $eliminadosFallidos" -ForegroundColor $(if ($eliminadosFallidos -gt 0) { "Red" } else { "Green" })
Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

if ($eliminadosExitosos -gt 0) {
    Write-Host "✅ Base de datos limpiada. Ahora puede ejecutar una nueva importación." -ForegroundColor Green
} else {
    Write-Host "⚠️  No se eliminó ningún producto" -ForegroundColor Yellow
}
Write-Host ""
