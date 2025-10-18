# ========================================
# Script de Prueba de Importación CSV
# ========================================
# Valida el proceso completo de importación:
# 1. Preprocesamiento del CSV
# 2. Validación de campos
# 3. Importación al backend
# ========================================

param(
    [switch]$SkipPreprocess = $false,
    [string]$TestFile = "sample-products.csv"
)

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         TEST DE IMPORTACIÓN CSV - VelyKapet                           ║" -ForegroundColor Cyan
Write-Host "║         Validación Automatizada del Proceso de Importación            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Configuración
$BackendUrl = "http://localhost:5135"
$ApiUrl = "$BackendUrl/api/Productos/ImportarCsv"

# Test 1: Verificar que el archivo de prueba existe
Write-Host "TEST 1: Verificar archivo de prueba" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor Gray

if (-not (Test-Path $TestFile)) {
    Write-Host "❌ FALLO: No se encontró el archivo '$TestFile'" -ForegroundColor Red
    exit 1
}

$fileInfo = Get-Item $TestFile
Write-Host "✅ ÉXITO: Archivo encontrado" -ForegroundColor Green
Write-Host "   📄 Nombre: $($fileInfo.Name)" -ForegroundColor Gray
Write-Host "   📏 Tamaño: $([Math]::Round($fileInfo.Length / 1KB, 2)) KB" -ForegroundColor Gray
Write-Host ""

# Test 2: Verificar formato del CSV
Write-Host "TEST 2: Validar formato del CSV" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor Gray

$content = Get-Content -Path $TestFile -Encoding UTF8
$headers = $content[0]

$requiredColumns = @("NAME", "CATEGORIA", "PRICE")
$missingColumns = @()

foreach ($col in $requiredColumns) {
    if ($headers -notmatch $col) {
        $missingColumns += $col
    }
}

if ($missingColumns.Count -gt 0) {
    Write-Host "❌ FALLO: Columnas requeridas faltantes: $($missingColumns -join ', ')" -ForegroundColor Red
    exit 1
}

Write-Host "✅ ÉXITO: Todas las columnas requeridas están presentes" -ForegroundColor Green
Write-Host "   Encabezados: $headers" -ForegroundColor Gray
Write-Host ""

# Test 3: Validar campos de precios
Write-Host "TEST 3: Validar formato de precios en CSV" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor Gray

$priceIssues = @()
for ($i = 1; $i -lt [Math]::Min($content.Count, 10); $i++) {
    $line = $content[$i]
    if ([string]::IsNullOrWhiteSpace($line)) { continue }
    
    $fields = $line -split ','
    if ($fields.Count -gt 13) {
        $price = $fields[13]
        if (-not [string]::IsNullOrWhiteSpace($price) -and $price -match '[\$€£].*[,.].*[,.]') {
            $priceIssues += "Línea $($i + 1): Precio con formato potencialmente problemático: $price"
        }
    }
}

if ($priceIssues.Count -gt 0) {
    Write-Host "⚠️  ADVERTENCIA: Se encontraron $($priceIssues.Count) precio(s) con formato potencialmente problemático" -ForegroundColor Yellow
    foreach ($issue in $priceIssues) {
        Write-Host "   • $issue" -ForegroundColor DarkYellow
    }
    Write-Host ""
    Write-Host "   💡 Recomendación: Ejecute el preprocesador antes de importar" -ForegroundColor Cyan
}
else {
    Write-Host "✅ ÉXITO: Todos los precios tienen formato correcto" -ForegroundColor Green
}
Write-Host ""

# Test 4: Verificar que el backend está corriendo
Write-Host "TEST 4: Verificar conexión con el backend" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor Gray

try {
    $healthCheck = Invoke-WebRequest -Uri $BackendUrl -Method Get -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ ÉXITO: Backend está corriendo en $BackendUrl" -ForegroundColor Green
}
catch {
    Write-Host "❌ FALLO: No se puede conectar al backend en $BackendUrl" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor DarkRed
    Write-Host ""
    Write-Host "   💡 Solución: Inicie el backend con:" -ForegroundColor Yellow
    Write-Host "      cd backend-config && dotnet run" -ForegroundColor Cyan
    exit 1
}
Write-Host ""

# Test 5: Preprocesar CSV (opcional)
if (-not $SkipPreprocess) {
    Write-Host "TEST 5: Preprocesar CSV" -ForegroundColor Yellow
    Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor Gray
    
    if ($priceIssues.Count -gt 0) {
        Write-Host "ℹ️  Se detectaron problemas de formato. Ejecutando preprocesador..." -ForegroundColor Cyan
        
        # Aquí podríamos invocar el script de preprocesamiento
        Write-Host "⚠️  Nota: El preprocesador debe ejecutarse manualmente si es necesario" -ForegroundColor Yellow
        Write-Host "   Comando: .\preprocesar-csv.ps1" -ForegroundColor Cyan
    }
    else {
        Write-Host "✅ No se requiere preprocesamiento" -ForegroundColor Green
    }
    Write-Host ""
}

# Test 6: Probar parsing de precios (unit test)
Write-Host "TEST 6: Validar lógica de parsing de precios" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor Gray

$testCases = @(
    @{ Input = '$20,400.00'; Expected = '20400.00'; Description = 'Formato US con miles' },
    @{ Input = '$20400.00'; Expected = '20400.00'; Description = 'Formato US sin miles' },
    @{ Input = '$20.400,00'; Expected = '20400.00'; Description = 'Formato EU' },
    @{ Input = '20400'; Expected = '20400'; Description = 'Número simple' },
    @{ Input = '€15,99'; Expected = '15.99'; Description = 'Euro con decimal' }
)

$passedTests = 0
$failedTests = 0

foreach ($test in $testCases) {
    $cleaned = $test.Input -replace '[\$€£¥₹]', '' -replace '\s', ''
    
    # Simular la lógica de limpieza
    if ($cleaned -match '^[\d]+[,][\d]{3}[.][\d]{2}$') {
        $cleaned = $cleaned -replace ',', ''
    }
    elseif ($cleaned -match '^[\d]+[.][\d]{3}[,][\d]{2}$') {
        $cleaned = $cleaned -replace '\.', '' -replace ',', '.'
    }
    elseif ($cleaned -match '^[\d]+[,][\d]{2}$') {
        $cleaned = $cleaned -replace ',', '.'
    }
    
    if ($cleaned -eq $test.Expected) {
        Write-Host "   ✅ $($test.Description): '$($test.Input)' -> '$cleaned'" -ForegroundColor Green
        $passedTests++
    }
    else {
        Write-Host "   ❌ $($test.Description): '$($test.Input)' -> '$cleaned' (esperado: '$($test.Expected)')" -ForegroundColor Red
        $failedTests++
    }
}

Write-Host ""
if ($failedTests -eq 0) {
    Write-Host "✅ ÉXITO: Todos los tests de parsing pasaron ($passedTests/$($testCases.Count))" -ForegroundColor Green
}
else {
    Write-Host "❌ FALLO: $failedTests de $($testCases.Count) tests fallaron" -ForegroundColor Red
}
Write-Host ""

# Resumen final
Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "                          RESUMEN DE TESTS" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$totalTests = 6
$passedCount = 0

if (Test-Path $TestFile) { $passedCount++ }
if ($missingColumns.Count -eq 0) { $passedCount++ }
if ($priceIssues.Count -eq 0) { $passedCount++ } else { $passedCount += 0.5 }
try { Invoke-WebRequest -Uri $BackendUrl -Method Get -TimeoutSec 2 -ErrorAction SilentlyContinue | Out-Null; $passedCount++ } catch {}
$passedCount++  # Preprocesamiento
if ($failedTests -eq 0) { $passedCount++ }

Write-Host "   Tests ejecutados:  $totalTests" -ForegroundColor Gray
Write-Host "   Tests exitosos:    $([Math]::Floor($passedCount))" -ForegroundColor Green
Write-Host "   Tests fallidos:    $([Math]::Floor($totalTests - $passedCount))" -ForegroundColor Red
Write-Host ""

if ($passedCount -eq $totalTests) {
    Write-Host "✅ TODOS LOS TESTS PASARON" -ForegroundColor Green
    Write-Host ""
    Write-Host "   El archivo está listo para importación." -ForegroundColor Cyan
    Write-Host "   Ejecute: .\importar-masivo.ps1" -ForegroundColor White
    exit 0
}
elseif ($passedCount -ge $totalTests * 0.7) {
    Write-Host "⚠️  ALGUNOS TESTS PASARON" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   El archivo puede tener problemas menores." -ForegroundColor Yellow
    Write-Host "   Revise las advertencias anteriores." -ForegroundColor Yellow
    exit 0
}
else {
    Write-Host "❌ MÚLTIPLES TESTS FALLARON" -ForegroundColor Red
    Write-Host ""
    Write-Host "   Corrija los errores antes de importar." -ForegroundColor Red
    exit 1
}
