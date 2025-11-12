# Fix script: fix-test-importacion-csv.ps1
# UBICACIÓN: ejecutar desde backend-config
# Hace backup y corrige secuencias corruptas en test-importacion-csv.ps1

$target = Join-Path (Get-Location) 'test-importacion-csv.ps1'
if (-not (Test-Path $target)) {
    Write-Error "No se encontró $target. Ejecuta desde backend-config."
    exit 1
}

# 1) Backup
$bak = "$target.bak"
Copy-Item $target $bak -Force
Write-Host "Backup creado: $bak"

# 2) Leer contenido en bruto
$text = Get-Content $target -Raw

# 3) Reemplazos seguros (mapa conocido)
$map = @{
    'â€¢' = '-'
    'â•' = '-'
    'âœ…' = '✓'
    'ðŸ' = ''           # elimina secuencias de emoji corruptas (heurístico)
    'â‚¬' = '€'
    'â€˜' = "'"
    'â€™' = "'"
    'â€œ' = '"'
    'â€'  = '"'
    'Ã¡' = 'á'
    'Ã©' = 'é'
    'Ã­' = 'í'
    'Ã³' = 'ó'
    'Ãº' = 'ú'
    'Ã±' = 'ñ'
}

foreach ($k in $map.Keys) {
    $text = $text -replace [regex]::Escape($k), $map[$k]
}

# 4) Correcciones específicas detectadas en run
# Reemplaza clases corruptas por clases correctas
$text = $text -replace '\[\$â‚¬Â£\]', '[$€£]'
$text = $text -replace '\[\$â‚¬Â£Â¥â‚¹\]', '[$€£¥]'
# Asegurar la expresión usada en tu script (primer match problemático)
$text = $text -replace "\-match\s+'\\\[\$.*?\\\].*?'", "-match '[$€£].*[,.].*[,.]'"

# 5) Reemplazo directo para la línea de $cleaned si quedó corrupta
# Busca y sustituye la variante corrupta por la versión sana
$text = $text -replace "\-replace\s+'\[\\\$\Â\‚\¬\Â\£\Â\¥\Â\¹\]',\s*''", "-replace '[$€£¥]', ''"
# fallback genérico que corrige las formas vistas
$text = $text -replace "\-replace\s+'\[\\\$\Â\‚\¬\Â\£\].*?'\s*,\s*''", "-replace '[$€£¥]', ''"

# 6) Eliminar caracteres de control no imprimibles (excepto tab/newline)
$chars = ($text.ToCharArray() | Where-Object {
    $c = [int]$_
    $c -eq 9 -or $c -eq 10 -or $c -eq 13 -or ($c -ge 32 -and $c -le 0x10FFFF)
})
$text = -join $chars

# 7) Escribir con BOM UTF-8
$utf8WithBom = New-Object System.Text.UTF8Encoding($true)
[System.IO.File]::WriteAllText($target, $text, $utf8WithBom)
Write-Host "Archivo reescrito en UTF-8 BOM: $target"

# 8) Ejecutar validate-scripts para verificar
Write-Host "Ejecutando validate-scripts.ps1..."
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
try {
    .\validate-scripts.ps1 -Verbose | Tee-Object validate-after-sanitize.txt
    Write-Host "validate-scripts finalizado. Salida en validate-after-sanitize.txt"
} catch {
    Write-Error "validate-scripts falló. Revisa validate-after-sanitize.txt y el backup $bak"
    exit 2
}

Write-Host "Hecho. Si todo OK ejecuta el test: .\test-importacion-csv.ps1 -TestFile '.\sample-products-small-procesado.csv'"