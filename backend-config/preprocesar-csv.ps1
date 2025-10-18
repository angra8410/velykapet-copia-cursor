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

# ... (las demás funciones iguales) ...

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
            foreach ($error in $stats.Errors) {
                Write-Host ("   Fila $($error.Row):") -ForegroundColor Red
                foreach ($errorMsg in $error.Errors) {
                    Write-Host ("      - $errorMsg") -ForegroundColor DarkRed
                }
                $errorData = $error.Data | Format-List | Out-String
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

$inputPath = Get-InputFilePath
$outputPath = Get-OutputFilePath $inputPath
Process-CsvFile $inputPath $outputPath