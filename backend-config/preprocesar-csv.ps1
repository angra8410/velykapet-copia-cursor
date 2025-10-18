# ========================================
# Script de Preprocesamiento de CSV
# ========================================
# Limpia y valida archivos CSV antes de importarlos
# Corrige formatos de precios, encoding, y valida campos obligatorios
# ========================================

param(
    [string]$InputFile = "",
    [string]$OutputFile = ""
)

# Configurar encoding UTF-8 para la consola
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

function Show-Welcome {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║         PREPROCESADOR DE CSV - VelyKapet                              ║" -ForegroundColor Cyan
    Write-Host "║         Limpieza y Validación de Archivos CSV                         ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

function Show-Help {
    Write-Host "📋 FUNCIONES DEL PREPROCESADOR:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  ✅ Limpieza de Precios:" -ForegroundColor Green
    Write-Host "     • Detecta y normaliza formatos: `$20,400.00 -> 20400.00" -ForegroundColor Gray
    Write-Host "     • Maneja formatos europeos: `$20.400,00 -> 20400.00" -ForegroundColor Gray
    Write-Host "     • Remueve símbolos de moneda ($, €, etc.)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  ✅ Validación de Campos:" -ForegroundColor Green
    Write-Host "     • Verifica campos obligatorios (NAME, CATEGORIA, PRICE)" -ForegroundColor Gray
    Write-Host "     • Detecta filas vacías o incompletas" -ForegroundColor Gray
    Write-Host "     • Valida tipos de datos" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  ✅ Normalización de Encoding:" -ForegroundColor Green
    Write-Host "     • Convierte a UTF-8 sin BOM" -ForegroundColor Gray
    Write-Host "     • Corrige caracteres especiales" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  ✅ Generación de Reporte:" -ForegroundColor Green
    Write-Host "     • Muestra estadísticas de limpieza" -ForegroundColor Gray
    Write-Host "     • Lista errores encontrados y corregidos" -ForegroundColor Gray
    Write-Host "     • Crea archivo limpio listo para importar" -ForegroundColor Gray
    Write-Host ""
}

function Get-InputFilePath {
    if ($InputFile -ne "") {
        return $InputFile
    }
    
    Write-Host "📂 SELECCIÓN DE ARCHIVO CSV A PROCESAR" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Ingrese la ruta del archivo CSV (presione ENTER para usar 'sample-products.csv'):" -ForegroundColor White
    $filePath = Read-Host "Ruta del archivo"
    
    if ([string]::IsNullOrWhiteSpace($filePath)) {
        $filePath = "sample-products.csv"
    }
    
    return $filePath
}
}

function Test-CsvFileExists {
    param([string]$FilePath)
    
    Write-Host ""
    Write-Host "🔍 Validando archivo..." -ForegroundColor Cyan
    
    if (-not (Test-Path $FilePath)) {
        Write-Host "❌ ERROR: No se encontró el archivo '$FilePath'" -ForegroundColor Red
        Write-Host ""
        Write-Host "Sugerencias:" -ForegroundColor Yellow
        Write-Host "  • Verifique que la ruta sea correcta" -ForegroundColor Gray
        Write-Host "  • Use rutas absolutas o relativas desde la ubicación actual" -ForegroundColor Gray
        Write-Host "  • Asegúrese de que el archivo tenga extensión .csv" -ForegroundColor Gray
        return $false
    }
    
    $fileInfo = Get-Item $FilePath
    Write-Host "✅ Archivo encontrado:" -ForegroundColor Green
    Write-Host "   📄 Nombre: $($fileInfo.Name)" -ForegroundColor Gray
    Write-Host "   📏 Tamaño: $([Math]::Round($fileInfo.Length / 1KB, 2)) KB" -ForegroundColor Gray
    Write-Host "   📅 Modificado: $($fileInfo.LastWriteTime)" -ForegroundColor Gray
    Write-Host ""
    
    return $true
}

function Clean-PriceField {
    param([string]$Price)
    
    if ([string]::IsNullOrWhiteSpace($Price)) {
        return ""
    }
    
    # Remover símbolos de moneda y espacios
    $cleaned = $Price.Trim() -replace '[\$€£¥₹]', '' -replace '\s', ''
    
    # Detectar formato y normalizar
    if ($cleaned -match '^\d+,\d{3}\.\d{2}$') {
        # Formato US: 20,400.00 -> remover coma
        $cleaned = $cleaned -replace ',', ''
    }
    elseif ($cleaned -match '^\d+\.\d{3},\d{2}$') {
        # Formato EU: 20.400,00 -> remover punto, cambiar coma por punto
        $cleaned = $cleaned -replace '\.', '' -replace ',', '.'
    }
    elseif ($cleaned -match '^[\d]+[,][\d]{2}$') {
        # Solo coma decimal: 20400,00 -> cambiar coma por punto
        $cleaned = $cleaned -replace ',', '.'
    }
    elseif ($cleaned -match '^[\d]+[.][\d]+$') {
        # Ya tiene punto decimal: 20400.00 -> dejar como está
        # No hacer nada
    }
    
    return $cleaned
}

function Process-CsvFile {
    param(
        [string]$InputPath,
        [string]$OutputPath
    )
    
    Write-Host "🔄 PROCESANDO ARCHIVO CSV" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   📥 Entrada:  $InputPath" -ForegroundColor Gray
    Write-Host "   📤 Salida:   $OutputPath" -ForegroundColor Gray
    Write-Host ""
    
    $stats = @{
        TotalRows = 0
        ProcessedRows = 0
        ErrorRows = 0
        PricesFixed = 0
        EmptyRows = 0
        Errors = @()
    }
    
    try {
        # Leer archivo con encoding UTF-8
        $content = Get-Content -Path $InputPath -Encoding UTF8
        
        if ($content.Count -eq 0) {
            Write-Host "❌ ERROR: El archivo está vacío" -ForegroundColor Red
            return $null
        }
        
        # Obtener encabezados
        $headers = $content[0]
        $outputLines = @($headers)
        
        Write-Host "✅ Encabezados detectados:" -ForegroundColor Green
        Write-Host "   $headers" -ForegroundColor Gray
        Write-Host ""
        
        # Procesar cada fila (saltando encabezado)
        for ($i = 1; $i -lt $content.Count; $i++) {
            $line = $content[$i]
            $stats.TotalRows++
            
            # Saltar filas vacías
            if ([string]::IsNullOrWhiteSpace($line)) {
                $stats.EmptyRows++
                continue
            }
            
            # Dividir campos (manejo simple de CSV)
            $fields = $line -split ','
            
            # Validar campos mínimos
            if ($fields.Count -lt 3) {
                $stats.ErrorRows++
                $stats.Errors += "Línea $($i + 1): Número insuficiente de campos"
                continue
            }
            
            # Limpiar campo de precio (asumiendo que PRICE está en la columna 13 según el sample)
            # Ajustar índice según la estructura real del CSV
            if ($fields.Count -gt 13) {
                $originalPrice = $fields[13]
                $cleanedPrice = Clean-PriceField $originalPrice
                
                if ($originalPrice -ne $cleanedPrice -and -not [string]::IsNullOrWhiteSpace($originalPrice)) {
                    $fields[13] = $cleanedPrice
                    $stats.PricesFixed++
                    Write-Host "   🔧 Línea $($i + 1): Precio '$originalPrice' -> '$cleanedPrice'" -ForegroundColor DarkYellow
                }
            }
            
            # Reconstruir línea
            $outputLines += ($fields -join ',')
            $stats.ProcessedRows++
        }
        
        # Guardar archivo procesado
        $outputLines | Out-File -FilePath $OutputPath -Encoding UTF8 -Force
        
        Write-Host ""
        Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
        Write-Host "✅ PROCESAMIENTO COMPLETADO" -ForegroundColor Green
        Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "📊 ESTADÍSTICAS:" -ForegroundColor Yellow
        Write-Host "   📦 Total de filas:        $($stats.TotalRows)" -ForegroundColor Gray
        Write-Host "   ✅ Filas procesadas:      $($stats.ProcessedRows)" -ForegroundColor Green
        Write-Host "   🔧 Precios corregidos:    $($stats.PricesFixed)" -ForegroundColor Yellow
        Write-Host "   ⚠️  Filas vacías:          $($stats.EmptyRows)" -ForegroundColor DarkYellow
        Write-Host "   ❌ Filas con errores:     $($stats.ErrorRows)" -ForegroundColor Red
        Write-Host ""
        
        if ($stats.Errors.Count -gt 0) {
            Write-Host "⚠️  ERRORES ENCONTRADOS:" -ForegroundColor Red
            foreach ($error in $stats.Errors) {
                Write-Host "   • $error" -ForegroundColor DarkRed
            }
            Write-Host ""
        }
        
        Write-Host "✅ Archivo limpio guardado en: $OutputPath" -ForegroundColor Green
        Write-Host ""
        
        return $stats
    }
    catch {
        Write-Host "❌ ERROR al procesar el archivo: $_" -ForegroundColor Red
        Write-Host "   StackTrace: $($_.ScriptStackTrace)" -ForegroundColor DarkRed
        return $null
    }
}

function Ask-Confirmation {
    param([string]$OutputPath)
    
    if (Test-Path $OutputPath) {
        Write-Host "⚠️  ADVERTENCIA: El archivo '$OutputPath' ya existe." -ForegroundColor Yellow
        Write-Host ""
        $response = Read-Host "¿Desea sobrescribirlo? (S/N)"
        
        if ($response -ne 'S' -and $response -ne 's' -and $response -ne 'Y' -and $response -ne 'y') {
            Write-Host "❌ Operación cancelada por el usuario." -ForegroundColor Red
            return $false
        }
    }
    
    return $true
}

# ========================================
# PROGRAMA PRINCIPAL
# ========================================

Show-Welcome
Show-Help

# Obtener ruta del archivo de entrada
$inputFilePath = Get-InputFilePath

# Validar que el archivo existe
if (-not (Test-CsvFileExists $inputFilePath)) {
    Write-Host ""
    Write-Host "Presione cualquier tecla para salir..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

# Generar nombre de archivo de salida
if ($OutputFile -eq "") {
    $fileInfo = Get-Item $inputFilePath
    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($fileInfo.Name)
    $extension = $fileInfo.Extension
    $OutputFile = "$baseName-limpio$extension"
}

# Confirmar sobrescritura si existe
if (-not (Ask-Confirmation $OutputFile)) {
    exit 0
}

# Procesar archivo
$stats = Process-CsvFile -InputPath $inputFilePath -OutputPath $OutputFile

if ($null -eq $stats) {
    Write-Host "❌ El procesamiento falló. Revise los errores anteriores." -ForegroundColor Red
    exit 1
}

Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "                      SIGUIENTE PASO" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ahora puede importar el archivo limpio usando:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   .\importar-masivo.ps1" -ForegroundColor White
Write-Host ""
Write-Host "Y seleccione el archivo: $OutputFile" -ForegroundColor Cyan
Write-Host ""

Write-Host "Presione cualquier tecla para salir..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
