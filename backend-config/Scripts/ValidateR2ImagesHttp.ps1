# ============================================================================
# Script PowerShell: Validación HTTP de Imágenes en Cloudflare R2
# ============================================================================
# Proyecto: VelyKapet E-commerce
# Fecha: Enero 2025
# Objetivo: Validar que las URLs de imágenes en R2 sean accesibles vía HTTP
#
# REQUISITOS:
# - PowerShell 5.1 o superior
# - Acceso a SQL Server con la base de datos VentasPet_Nueva
# - Conexión a Internet para verificar URLs de R2
#
# USO:
# .\ValidateR2ImagesHttp.ps1
# .\ValidateR2ImagesHttp.ps1 -Verbose
# .\ValidateR2ImagesHttp.ps1 -ExportReport $true
# ============================================================================

param(
    [string]$ServerName = "localhost",
    [string]$DatabaseName = "VentasPet_Nueva",
    [bool]$ExportReport = $true,
    [string]$ReportPath = ".\R2_Image_Validation_Report.html"
)

# Colores para output
$ColorSuccess = "Green"
$ColorWarning = "Yellow"
$ColorError = "Red"
$ColorInfo = "Cyan"

Write-Host "`n╔════════════════════════════════════════════════════════════════════════╗" -ForegroundColor $ColorInfo
Write-Host "║  🔍 VALIDACIÓN HTTP DE IMÁGENES EN CLOUDFLARE R2                     ║" -ForegroundColor $ColorInfo
Write-Host "║  Verificando accesibilidad de URLs en producción                      ║" -ForegroundColor $ColorInfo
Write-Host "╚════════════════════════════════════════════════════════════════════════╝`n" -ForegroundColor $ColorInfo

# ============================================================================
# FUNCIÓN: Conectar a SQL Server
# ============================================================================
function Connect-Database {
    param(
        [string]$Server,
        [string]$Database
    )
    
    Write-Host "📡 Conectando a SQL Server..." -ForegroundColor $ColorInfo
    Write-Host "   Servidor: $Server" -ForegroundColor Gray
    Write-Host "   Base de datos: $Database`n" -ForegroundColor Gray
    
    try {
        $connectionString = "Server=$Server;Database=$Database;Integrated Security=True;TrustServerCertificate=True;"
        $connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
        $connection.Open()
        
        Write-Host "   ✅ Conexión establecida exitosamente`n" -ForegroundColor $ColorSuccess
        return $connection
    }
    catch {
        Write-Host "   ❌ Error al conectar: $($_.Exception.Message)`n" -ForegroundColor $ColorError
        exit 1
    }
}

# ============================================================================
# FUNCIÓN: Obtener URLs de la base de datos
# ============================================================================
function Get-ProductImageUrls {
    param(
        [System.Data.SqlClient.SqlConnection]$Connection
    )
    
    Write-Host "📋 Obteniendo URLs de productos..." -ForegroundColor $ColorInfo
    
    $query = @"
SELECT 
    p.IdProducto,
    p.NombreBase,
    p.TipoMascota,
    p.URLImagen,
    p.Activo
FROM Productos p
WHERE p.URLImagen IS NOT NULL 
  AND p.URLImagen != ''
  AND p.URLImagen LIKE 'https://www.velykapet.com/%'
ORDER BY p.IdProducto;
"@
    
    try {
        $command = $Connection.CreateCommand()
        $command.CommandText = $query
        $adapter = New-Object System.Data.SqlClient.SqlDataAdapter($command)
        $dataset = New-Object System.Data.DataSet
        $adapter.Fill($dataset) | Out-Null
        
        $productos = $dataset.Tables[0]
        Write-Host "   ✅ $($productos.Rows.Count) productos encontrados con URLs de R2`n" -ForegroundColor $ColorSuccess
        
        return $productos
    }
    catch {
        Write-Host "   ❌ Error al obtener URLs: $($_.Exception.Message)`n" -ForegroundColor $ColorError
        return $null
    }
}

# ============================================================================
# FUNCIÓN: Validar accesibilidad HTTP de una URL
# ============================================================================
function Test-ImageUrl {
    param(
        [string]$Url,
        [int]$TimeoutSeconds = 10
    )
    
    try {
        $request = [System.Net.WebRequest]::Create($Url)
        $request.Method = "HEAD"
        $request.Timeout = $TimeoutSeconds * 1000
        
        $response = $request.GetResponse()
        $statusCode = [int]$response.StatusCode
        $contentType = $response.ContentType
        $contentLength = $response.ContentLength
        
        $response.Close()
        
        return @{
            Success = $true
            StatusCode = $statusCode
            ContentType = $contentType
            ContentLength = $contentLength
            ErrorMessage = $null
        }
    }
    catch [System.Net.WebException] {
        $statusCode = if ($_.Exception.Response) { 
            [int]$_.Exception.Response.StatusCode 
        } else { 
            0 
        }
        
        return @{
            Success = $false
            StatusCode = $statusCode
            ContentType = $null
            ContentLength = 0
            ErrorMessage = $_.Exception.Message
        }
    }
    catch {
        return @{
            Success = $false
            StatusCode = 0
            ContentType = $null
            ContentLength = 0
            ErrorMessage = $_.Exception.Message
        }
    }
}

# ============================================================================
# FUNCIÓN: Formatear tamaño de archivo
# ============================================================================
function Format-FileSize {
    param([long]$Size)
    
    if ($Size -ge 1MB) {
        return "{0:N2} MB" -f ($Size / 1MB)
    }
    elseif ($Size -ge 1KB) {
        return "{0:N2} KB" -f ($Size / 1KB)
    }
    else {
        return "$Size bytes"
    }
}

# ============================================================================
# MAIN SCRIPT
# ============================================================================

# Conectar a la base de datos
$connection = Connect-Database -Server $ServerName -Database $DatabaseName

# Obtener URLs de productos
$productos = Get-ProductImageUrls -Connection $connection

if ($null -eq $productos -or $productos.Rows.Count -eq 0) {
    Write-Host "⚠️  No se encontraron productos con URLs de R2 para validar" -ForegroundColor $ColorWarning
    $connection.Close()
    exit 0
}

# Inicializar contadores
$totalProductos = $productos.Rows.Count
$productosValidos = 0
$productosInvalidos = 0
$productosPendientes = 0

# Array para almacenar resultados
$resultados = @()

Write-Host "🔍 Validando accesibilidad de $totalProductos URLs...`n" -ForegroundColor $ColorInfo
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n"

# Validar cada URL
$contador = 0
foreach ($producto in $productos.Rows) {
    $contador++
    $url = $producto.URLImagen
    $idProducto = $producto.IdProducto
    $nombreBase = $producto.NombreBase
    
    Write-Progress -Activity "Validando imágenes" -Status "Producto $contador de $totalProductos" -PercentComplete (($contador / $totalProductos) * 100)
    
    # Validar URL
    $validacion = Test-ImageUrl -Url $url
    
    # Crear objeto de resultado
    $resultado = [PSCustomObject]@{
        IdProducto = $idProducto
        NombreBase = $nombreBase
        TipoMascota = $producto.TipoMascota
        URL = $url
        Accesible = $validacion.Success
        StatusCode = $validacion.StatusCode
        ContentType = $validacion.ContentType
        TamanoArchivo = if ($validacion.ContentLength -gt 0) { Format-FileSize $validacion.ContentLength } else { "Desconocido" }
        ErrorMessage = $validacion.ErrorMessage
        Activo = $producto.Activo
    }
    
    $resultados += $resultado
    
    # Actualizar contadores
    if ($validacion.Success) {
        $productosValidos++
        Write-Host "   ✅ [$contador/$totalProductos] ID $idProducto - $nombreBase" -ForegroundColor $ColorSuccess
        Write-Host "      URL: $url" -ForegroundColor Gray
        Write-Host "      Tamaño: $($resultado.TamanoArchivo), Tipo: $($validacion.ContentType)`n" -ForegroundColor Gray
    }
    elseif ($validacion.StatusCode -eq 404) {
        $productosInvalidos++
        Write-Host "   ❌ [$contador/$totalProductos] ID $idProducto - $nombreBase" -ForegroundColor $ColorError
        Write-Host "      URL: $url" -ForegroundColor Gray
        Write-Host "      Error: Imagen no encontrada (404 Not Found)`n" -ForegroundColor $ColorError
    }
    else {
        $productosInvalidos++
        Write-Host "   ⚠️  [$contador/$totalProductos] ID $idProducto - $nombreBase" -ForegroundColor $ColorWarning
        Write-Host "      URL: $url" -ForegroundColor Gray
        Write-Host "      Error: $($validacion.ErrorMessage)`n" -ForegroundColor $ColorWarning
    }
}

Write-Progress -Activity "Validando imágenes" -Completed

# ============================================================================
# RESUMEN
# ============================================================================
Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n"
Write-Host "📊 RESUMEN DE VALIDACIÓN`n" -ForegroundColor $ColorInfo

$porcentajeValidos = [math]::Round(($productosValidos / $totalProductos) * 100, 2)
$porcentajeInvalidos = [math]::Round(($productosInvalidos / $totalProductos) * 100, 2)

Write-Host "   Total de productos:      $totalProductos"
Write-Host "   ✅ Imágenes accesibles:  $productosValidos ($porcentajeValidos%)" -ForegroundColor $ColorSuccess
Write-Host "   ❌ Imágenes no accesibles: $productosInvalidos ($porcentajeInvalidos%)" -ForegroundColor $(if ($productosInvalidos -eq 0) { $ColorSuccess } else { $ColorError })

# Estado general
Write-Host "`n   Estado general: " -NoNewline
if ($productosInvalidos -eq 0) {
    Write-Host "✅ EXCELENTE - Todas las imágenes son accesibles" -ForegroundColor $ColorSuccess
}
elseif ($porcentajeValidos -ge 80) {
    Write-Host "✅ BUENO - La mayoría de las imágenes son accesibles" -ForegroundColor $ColorSuccess
}
elseif ($porcentajeValidos -ge 50) {
    Write-Host "⚠️  REGULAR - Muchas imágenes requieren atención" -ForegroundColor $ColorWarning
}
else {
    Write-Host "❌ CRÍTICO - La mayoría de las imágenes no son accesibles" -ForegroundColor $ColorError
}

# ============================================================================
# EXPORTAR REPORTE
# ============================================================================
if ($ExportReport) {
    Write-Host "`n📄 Generando reporte HTML..." -ForegroundColor $ColorInfo
    
    $html = @"
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Validación - Imágenes R2</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .stat-box { padding: 20px; border-radius: 8px; text-align: center; }
        .stat-box.success { background: #d4edda; color: #155724; }
        .stat-box.error { background: #f8d7da; color: #721c24; }
        .stat-box h3 { margin: 0; font-size: 2em; }
        .stat-box p { margin: 10px 0 0 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #3498db; color: white; }
        tr:hover { background-color: #f5f5f5; }
        .status { padding: 5px 10px; border-radius: 4px; font-weight: bold; }
        .status.ok { background: #d4edda; color: #155724; }
        .status.error { background: #f8d7da; color: #721c24; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #7f8c8d; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 Reporte de Validación de Imágenes R2</h1>
        <p><strong>Fecha:</strong> $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")</p>
        <p><strong>Servidor:</strong> $ServerName</p>
        <p><strong>Base de datos:</strong> $DatabaseName</p>
        
        <div class="summary">
            <div class="stat-box">
                <h3>$totalProductos</h3>
                <p>Total Productos</p>
            </div>
            <div class="stat-box success">
                <h3>$productosValidos</h3>
                <p>Imágenes OK ($porcentajeValidos%)</p>
            </div>
            <div class="stat-box error">
                <h3>$productosInvalidos</h3>
                <p>Imágenes con Error ($porcentajeInvalidos%)</p>
            </div>
        </div>
        
        <h2>Detalle de Productos</h2>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Producto</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Código HTTP</th>
                    <th>Tamaño</th>
                    <th>Activo</th>
                </tr>
            </thead>
            <tbody>
"@
    
    foreach ($resultado in $resultados) {
        $statusClass = if ($resultado.Accesible) { "ok" } else { "error" }
        $statusText = if ($resultado.Accesible) { "✅ OK" } else { "❌ Error" }
        $activoText = if ($resultado.Activo) { "Sí" } else { "No" }
        
        $html += @"
                <tr>
                    <td>$($resultado.IdProducto)</td>
                    <td>$($resultado.NombreBase)</td>
                    <td>$($resultado.TipoMascota)</td>
                    <td><span class="status $statusClass">$statusText</span></td>
                    <td>$($resultado.StatusCode)</td>
                    <td>$($resultado.TamanoArchivo)</td>
                    <td>$activoText</td>
                </tr>
"@
    }
    
    $html += @"
            </tbody>
        </table>
        
        <div class="footer">
            <p>VelyKapet E-commerce - Sistema de Gestión de Imágenes</p>
            <p>Generado automáticamente por ValidateR2ImagesHttp.ps1</p>
        </div>
    </div>
</body>
</html>
"@
    
    $html | Out-File -FilePath $ReportPath -Encoding UTF8
    Write-Host "   ✅ Reporte exportado a: $ReportPath`n" -ForegroundColor $ColorSuccess
}

# ============================================================================
# RECOMENDACIONES
# ============================================================================
if ($productosInvalidos -gt 0) {
    Write-Host "📌 RECOMENDACIONES:`n" -ForegroundColor $ColorInfo
    
    # Productos con error 404
    $productos404 = $resultados | Where-Object { $_.StatusCode -eq 404 }
    if ($productos404.Count -gt 0) {
        Write-Host "   1. Subir las siguientes imágenes a Cloudflare R2:" -ForegroundColor $ColorWarning
        foreach ($p in $productos404) {
            $nombreArchivo = $p.URL -replace '.*/', ''
            Write-Host "      - $nombreArchivo (Producto: $($p.NombreBase))" -ForegroundColor Gray
        }
        Write-Host ""
    }
    
    Write-Host "   2. Verificar que las imágenes tengan los nombres correctos en R2"
    Write-Host "   3. Revisar configuración de CORS en Cloudflare R2"
    Write-Host "   4. Verificar permisos públicos del bucket R2`n"
}

# Cerrar conexión
$connection.Close()

Write-Host "╔════════════════════════════════════════════════════════════════════════╗" -ForegroundColor $ColorInfo
Write-Host "║  ✅ VALIDACIÓN COMPLETADA                                             ║" -ForegroundColor $ColorInfo
Write-Host "╚════════════════════════════════════════════════════════════════════════╝`n" -ForegroundColor $ColorInfo
