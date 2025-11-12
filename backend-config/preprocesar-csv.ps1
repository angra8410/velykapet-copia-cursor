# Script para preprocesar archivos CSV
# Normaliza precios, limpia datos y genera un archivo UTF-8 compatible

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

function Clean-Price {
    param (
        [string]$price
    )
    if ([string]::IsNullOrWhiteSpace($price)) {
        return ""
    }
    $cleaned = $price -replace '\$', '' -replace '\s', ''
    if ($cleaned -match '^\d{1,3}(,\d{3})*\.\d{2}$') {
        $cleaned = $cleaned -replace ',', ''
        return $cleaned
    }
    elseif ($cleaned -match '^\d{1,3}(\.\d{3})*,\d{2}$') {
        $cleaned = ($cleaned -replace '\.', '') -replace ',', '.'
        return $cleaned
    }
    elseif ($cleaned -match '^\d+\.\d{2}$') {
        return $cleaned
    }
    elseif ($cleaned -match '^\d+$') {
        return "$cleaned.00"
    }
    else {
        return $cleaned
    }
}

function Validate-Field {
    param (
        [string]$value,
        [string]$fieldName
    )
    $trimmed = $value
    if ($null -ne $trimmed) { $trimmed = $trimmed.Trim() }
    if ([string]::IsNullOrWhiteSpace($trimmed)) {
        return "Campo '$fieldName' vacío"
    }
    return $null
}

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

function Process-CsvFile {
    param (
        [string]$inputPath,
        [string]$outputPath
    )
    Write-Host ""
    Write-Host "--------------------------------------------------------" -ForegroundColor Cyan
    Write-Host "PROCESANDO ARCHIVO CSV" -ForegroundColor Green
    Write-Host "--------------------------------------------------------" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Archivo de entrada: $inputPath" -ForegroundColor Yellow
    Write-Host "Archivo de salida: $outputPath" -ForegroundColor Yellow
    Write-Host ""
    $stats = @{
        TotalRows = 0
        ProcessedRows = 0
        SkippedRows = 0
        CleanedPrices = 0
        Errors = @()
    }
    try {
        $data = Import-Csv -Path $inputPath -Encoding UTF8 -ErrorAction Stop
        if ($data.Count -eq 0) {
            Write-Host "El archivo CSV está vacío" -ForegroundColor Red
            return
        }
        $stats.TotalRows = $data.Count
        $processedData = @()
        foreach ($row in $data) {
            $stats.ProcessedRows++
            $rowErrors = @()
            $nombreError = Validate-Field $row.NAME "NAME"
            if ($nombreError) {
                $rowErrors += $nombreError
            }
            $precioOriginal = $row.PRICE
            $precioLimpiado = Clean-Price $precioOriginal
            $precioError = Validate-Field $precioLimpiado "PRICE"
            if ($precioError) {
                $rowErrors += $precioError
            }
            if ($rowErrors.Count -gt 0) {
                $stats.SkippedRows++
                $stats.Errors += @{
                    Row = $stats.ProcessedRows
                    Errors = $rowErrors
                    Data = $row
                }
                continue
            }
            if ($precioLimpiado -ne $precioOriginal) {
                $stats.CleanedPrices++
            }
            $row.PRICE = $precioLimpiado
            $processedData += $row
        }
        $processedData | Export-Csv -Path $outputPath -Encoding UTF8 -NoTypeInformation
        Write-Host "ESTADÍSTICAS DE PROCESAMIENTO:" -ForegroundColor Magenta
        Write-Host "   Total de filas: $($stats.TotalRows)" -ForegroundColor Gray
        Write-Host "   Filas procesadas: $($stats.ProcessedRows - $stats.SkippedRows)" -ForegroundColor Green
        Write-Host "   Filas omitidas: $($stats.SkippedRows)" -ForegroundColor Yellow
        Write-Host "   Precios normalizados: $($stats.CleanedPrices)" -ForegroundColor Cyan
        Write-Host ""
        if ($stats.Errors.Count -gt 0) {
            Write-Host "ERRORES ENCONTRADOS: $($stats.Errors.Count)" -ForegroundColor Red
            Write-Host ""
            # CHANGELOG: Renamed $error to $errorItem to avoid PSScriptAnalyzer error (readonly automatic variable)
            foreach ($errorItem in $stats.Errors) {
                Write-Host ("   Fila $($errorItem.Row):") -ForegroundColor Red
                foreach ($errorMsg in $errorItem.Errors) {
                    Write-Host ("      - $errorMsg") -ForegroundColor DarkRed
                }
                $errorData = $errorItem.Data | Format-List | Out-String
                Write-Host "      Datos:" -ForegroundColor DarkYellow
                Write-Host ("      " + ($errorData.Trim() -replace "`n", "`n      ")) -ForegroundColor Gray
                Write-Host ""
            }
        }
        Write-Host "Archivo procesado correctamente y guardado en: $outputPath" -ForegroundColor Green
    }
    catch {
        Write-Host "Error al procesar el archivo: $_" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "--------------------------------------------------------" -ForegroundColor Cyan
}

# ---- EJECUCIÓN PRINCIPAL ----
$inputPath = Get-InputFilePath
$outputPath = Get-OutputFilePath $inputPath
Process-CsvFile $inputPath $outputPath