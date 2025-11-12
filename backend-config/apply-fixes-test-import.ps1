# apply-fixes-test-import.ps1
# Ubicación: ejecutar desde backend-config
# Hace backup y corrige test-importacion-csv.ps1 (reemplaza secuencias corruptas y corrige líneas problemáticas)

$path = Join-Path (Get-Location) 'test-importacion-csv.ps1'
if (-not (Test-Path $path)) {
    Write-Error "No se encontró $path. Ejecuta este script desde la carpeta backend-config."
    exit 1
}

# 1) Backup
$bak = "$path.bak"
Copy-Item $path $bak -Force
Write-Host "Backup creado en: $bak"

# 2) Leer todo el archivo
$lines = Get-Content $path

# 3) Reemplazos globales de secuencias corruptas por sus equivalentes correctos
# (conservador: sólo cambios de texto, no lógica)
for ($i = 0; $i -lt $lines.Count; $i++) {
    $l = $lines[$i]

    # Map de reemplazos comunes (heurísticos, no agresivos)
    $l = $l -replace 'â€¢','-'            # bullets corruptos
    $l = $l -replace 'â•','-'             # bullets alternativos
    $l = $l -replace 'âœ…','✓'            # tick
    $l = $l -replace 'ðŸ\w*',''           # quita secuencias emoji corruptas (heurístico)
    $l = $l -replace 'â‚¬','€'            # euro corrupto
    $l = $l -replace '¬Â£','£'           # libra corrupta
    $l = $l -replace 'â‚¹',''             # eliminar subscript corrupto
    # letras acentuadas corruptas comunes
    $l = $l -replace 'Ã¡','á' -replace 'Ã©','é' -replace 'Ã­','í' -replace 'Ã³','ó' -replace 'Ãº','ú' -replace 'Ã±','ñ'
    # limpiar marcas de "Â" sobrantes (aparecen tras malas decodificaciones)
    $l = $l -replace 'Â',''

    $lines[$i] = $l
}

# 4) Reemplazos específicos y seguros en las líneas reportadas por tu error
# Las posiciones son 1-based en el reporte; aquí se usan índices 0-based.
# En tu salida las líneas problemáticas fueron 81 y 152 (1-based), por lo tanto índices 80 y 151.

# Comprobar que el archivo tiene al menos esas líneas
if ($lines.Count -gt 80) {
    # Reemplaza la condición con una versión segura usando símbolos correctos y comillas simples
    $lines[80] = $lines[80] -replace '.*', "            if (-not [string]::IsNullOrWhiteSpace(`$price) -and `$price -match '[$€£].*[,.].*[,.]') {"
    Write-Host "Línea 81 (index 80) reemplazada por expresión segura."
} else {
    Write-Warning "El archivo tiene menos de 81 líneas; no reemplacé la línea 81 automáticamente."
}

if ($lines.Count -gt 151) {
    # Reemplaza la limpieza de símbolos por una versión segura
    $lines[151] = $lines[151] -replace '.*', "    `$cleaned = `$test.Input -replace '[$€£¥]', '' -replace '\s',''"
    Write-Host "Línea 152 (index 151) reemplazada por expresión segura."
} else {
    Write-Warning "El archivo tiene menos de 152 líneas; no reemplacé la línea 152 automáticamente."
}

# 5) Corregir clases corruptas restantes en todo el buffer (si existieran)
for ($i = 0; $i -lt $lines.Count; $i++) {
    $lines[$i] = $lines[$i] -replace '\[\$â‚¬Â£\]','[$€£]'
    $lines[$i] = $lines[$i] -replace '\[\$â‚¬Â£Â¥â‚¹\]','[$€£¥]'
}

# 6) Reescribir el archivo con UTF-8 BOM (para compatibilidad con PowerShell 5.1)
$utf8WithBom = New-Object System.Text.UTF8Encoding($true)
[System.IO.File]::WriteAllLines($path, $lines, $utf8WithBom)
Write-Host "Archivo escrito en UTF-8 (BOM) y cambios aplicados a: $path"

# 7) Ejecutar validate-scripts.ps1 para verificar
Write-Host "`nEjecutando validate-scripts.ps1..."
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
try {
    .\validate-scripts.ps1 -Verbose | Tee-Object validate-after-sanitize.txt
    Write-Host "`nvalidate-scripts finalizó. Revisa validate-after-sanitize.txt"
} catch {
    Write-Error "`nvalidate-scripts falló. Revisa validate-after-sanitize.txt y restaura el backup si es necesario: Copy-Item $bak $path -Force"
    exit 2
}

Write-Host "`nHecho. Si validate-scripts pasó, ejecuta:"
Write-Host "    .\test-importacion-csv.ps1 -TestFile '.\sample-products-small-procesado.csv'"
Write-Host "Si algo sale mal restaura el backup con:"
Write-Host "    Copy-Item $bak $path -Force"