# Script para preprocesar archivos CSV
# Normaliza precios, limpia datos y genera un archivo UTF-8 compatible

# Configuración de codificación
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# Función para limpiar y normalizar precios
function Clean-Price {
    param (
        [string]$price
    )
    
    if ([string]::IsNullOrWhiteSpace($price)) {
        return ""
    }
    
    # Eliminar símbolos de moneda y espacios
    $cleaned = $price -replace '[$€£¥]', '' -replace '\s', ''
    
    # Normalizar formato de precio
    # Formato US: 1,234.56 -> 1234.56
    # Formato EU: 1.234,56 -> 1234.56
    
    # Detectar formato US (1,234.56)
    if ($cleaned -match '^\d+,\d{3}\.\d{2}$') {
        $cleaned = $cleaned -replace ',', ''
        return $cleaned
    }
    # Detectar formato EU (1.234,56)
    elseif ($cleaned -match '^\d+\.\d{3},\d{2}$') {
        $cleaned = ($cleaned -replace '\.', '') -replace ',', '.'
        return $cleaned
    }
    # Si ya está en formato correcto (1234.56)
    elseif ($cleaned -match '^\d+\.\d{2}$') {
        return $cleaned
    }
    # Si es un número entero, agregar decimales
    elseif ($cleaned -match '^\d+$') {
        return "$cleaned.00"
    }
    # Otros casos, devolver tal cual
    else {
        return $cleaned
    }
}

# Función para validar campos
function Validate-Field {
    param (
        [string]$value,
        [string]$fieldName
    )
    
    if ([string]::IsNullOrWhiteSpace($value)) {
        return "Campo '$fieldName' vacío"
    }
    
    return $null
}

# Función para obtener la ruta del archivo de entrada
function Get-InputFilePath {
    $defaultPath = "productos.csv"
    
    if (Test-Path $defaultPath) {
        Write-Host "Archivo encontrado: $defaultPath" -ForegroundColor Green
        return $defaultPath
    }
    
    Write-Host "No se encontró el archivo predeterminado 'productos.csv'" -ForegroundColor Yellow
    Write-Host "Archivos CSV disponibles en el directorio actual:" -ForegroundColor Cyan
    
    $csvFiles = Get-ChildItem -Filter "*.csv" | Select-Object -ExpandProperty Name
    
    if ($csvFiles.Count -eq 0) {
        Write-Host "No se encontraron archivos CSV en el directorio actual" -ForegroundColor Red
        Write-Host "Por favor, coloque un archivo CSV en este directorio y vuelva a ejecutar el script" -ForegroundColor Yellow
        exit
    }
    
    for ($i = 0; $i -lt $csvFiles.Count; $i++) {
        Write-Host "[$($i+1)] $($csvFiles[$i])" -ForegroundColor Cyan
    }
    
    Write-Host ""
    $selection = Read-Host "Seleccione un archivo (1-$($csvFiles.Count)) o ingrese la ruta completa a otro archivo CSV"
    
    if ($selection -match '^\d+$' -and [int]$selection -ge 1 -and [int]$selection -le $csvFiles.Count) {
        $selectedFile = $csvFiles[[int]$selection - 1]
        Write-Host "Archivo seleccionado: $selectedFile" -ForegroundColor Green
        return $selectedFile
    }
    elseif (Test-Path $selection) {
        if ($selection -like "*.csv") {
            Write-Host "Archivo seleccionado: $selection" -ForegroundColor Green
            return $selection
        }
        else {
            Write-Host "El archivo seleccionado no es un archivo CSV" -ForegroundColor Red
            exit
        }
    }
    else {
        Write-Host "Archivo no encontrado: $selection" -ForegroundColor Red
        exit
    }
}

# Función para generar nombre de archivo de salida
function Get-OutputFilePath {
    param (
        [string]$inputPath
    )
    
    $directory = Split-Path -Parent $inputPath
    if ([string]::IsNullOrEmpty($directory)) {
        $directory = "."
    }
    
    $filename = Split-Path -Leaf $inputPath
    $filenameWithoutExt = [System.IO.Path]::GetFileNameWithoutExtension($filename)
    
    $outputPath = Join-Path $directory "$filenameWithoutExt-procesado.csv"
    
    # Verificar si el archivo ya existe
    if (Test-Path $outputPath) {
        Write-Host "El archivo de salida '$outputPath' ya existe." -ForegroundColor Yellow
        $response = Read-Host "¿Desea sobrescribirlo? (S/N)"
        
        if ($response -ne 'S' -and $response -ne 's') {
            $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
            $outputPath = Join-Path $directory "$filenameWithoutExt-procesado-$timestamp.csv"
            Write-Host "Se usará un nuevo nombre de archivo: $outputPath" -ForegroundColor Green
        }
        else {
            Write-Host "Se sobrescribirá el archivo existente" -ForegroundColor Yellow
        }
    }
    
    return $outputPath
}

# Función principal
function Process-CsvFile {
    param (
        [string]$inputPath,
        [string]$outputPath
    )
    
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "🔄 PROCESANDO ARCHIVO CSV" -ForegroundColor Green
    Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📂 Archivo de entrada: $inputPath" -ForegroundColor Yellow
    Write-Host "📂 Archivo de salida: $outputPath" -ForegroundColor Yellow
    Write-Host ""
    
    # Estadísticas
    $stats = @{
        TotalRows = 0
        ProcessedRows = 0
        SkippedRows = 0
        CleanedPrices = 0
        Errors = @()
    }
    
    try {
        # Leer archivo CSV
        $data = Import-Csv -Path $inputPath -Encoding UTF8 -ErrorAction Stop
        
        # Verificar si hay datos
        if ($data.Count -eq 0) {
            Write-Host "El archivo CSV está vacío" -ForegroundColor Red
            return
        }
        
        $stats.TotalRows = $data.Count
        
        # Crear array para almacenar filas procesadas
        $processedData = @()
        
        # Procesar cada fila
        foreach ($row in $data) {
            $stats.ProcessedRows++
            $rowErrors = @()
            
            # Validar campos obligatorios
            $nombreError = Validate-Field $row.Nombre "Nombre"
            if ($nombreError) {
                $rowErrors += $nombreError
            }
            
            $precioError = Validate-Field $row.Precio "Precio"
            if ($precioError) {
                $rowErrors += $precioError
            }
            
            # Si hay errores, registrarlos y saltar la fila
            if ($rowErrors.Count -gt 0) {
                $stats.SkippedRows++
                $stats.Errors += @{
                    Row = $stats.ProcessedRows
                    Errors = $rowErrors
                    Data = $row
                }
                continue
            }
            
            # Limpiar precio
            $originalPrice = $row.Precio
            $cleanedPrice = Clean-Price $originalPrice
            
            if ($cleanedPrice -ne $originalPrice) {
                $stats.CleanedPrices++
            }
            
            # Actualizar precio en la fila
            $row.Precio = $cleanedPrice
            
            # Agregar fila procesada
            $processedData += $row
        }
        
        # Guardar datos procesados
        $processedData | Export-Csv -Path $outputPath -Encoding UTF8 -NoTypeInformation
        
        # Mostrar estadísticas
        Write-Host "📊 ESTADÍSTICAS DE PROCESAMIENTO:" -ForegroundColor Magenta
        Write-Host "   📋 Total de filas: $($stats.TotalRows)" -ForegroundColor Gray
        Write-Host "   ✅ Filas procesadas: $($stats.ProcessedRows - $stats.SkippedRows)" -ForegroundColor Green
        Write-Host "   ⚠️ Filas omitidas: $($stats.SkippedRows)" -ForegroundColor Yellow
        Write-Host "   💰 Precios normalizados: $($stats.CleanedPrices)" -ForegroundColor Cyan
        Write-Host ""
        
        # Mostrar errores si los hay
        if ($stats.Errors.Count -gt 0) {
            Write-Host "⚠️ ERRORES ENCONTRADOS: $($stats.Errors.Count)" -ForegroundColor Red
            Write-Host ""
            
            foreach ($error in $stats.Errors) {
                Write-Host "   ❌ Fila $($error.Row):" -ForegroundColor Red
                foreach ($errorMsg in $error.Errors) {
                    Write-Host "      • $errorMsg" -ForegroundColor DarkRed
                }
                
                # Mostrar datos de la fila con error
                $errorData = $error.Data | Format-List | Out-String
                Write-Host "      Datos:" -ForegroundColor DarkYellow
                Write-Host "      $($errorData.Trim() -replace "`n", "`n      ")" -ForegroundColor Gray
                Write-Host ""
            }
        }
        
        Write-Host "✅ Archivo procesado correctamente y guardado en: $outputPath" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Error al procesar el archivo: $_" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
}

# Ejecución principal
$inputPath = Get-InputFilePath
$outputPath = Get-OutputFilePath $inputPath
Process-CsvFile $inputPath $outputPath
