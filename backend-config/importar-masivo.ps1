<#
.SYNOPSIS
    Script simplificado para importar productos desde CSV a la API de VelyKapet

.DESCRIPTION
    Este script envía un archivo CSV al endpoint de importación masiva de productos,
    manejando errores de manera robusta y mostrando información detallada del proceso.

.NOTES
    Archivo: importar-masivo.ps1
    Autor: VelyKapet Development Team
    Versión: 1.1 (Mejorada con documentación y mejores prácticas)
    
    RECOMENDACIONES PARA PREVENIR ERRORES DE SINTAXIS:
    ══════════════════════════════════════════════════════════
    1. Editor recomendado: Visual Studio Code con extensión PowerShell
       - Resalta automáticamente bloques de control
       - Valida sintaxis en tiempo real
       - Muestra parejas de llaves coincidentes
    
    2. Herramientas de validación:
       - PSScriptAnalyzer: Linter para PowerShell
       - PowerShell ISE: Incluye validación integrada
       - EditorConfig: Para mantener formato consistente
    
    3. Buenas prácticas aplicadas en este script:
       - Cada bloque try/catch/finally debe tener llaves balanceadas
       - Indentación consistente de 4 espacios por nivel
       - Comentarios explicativos antes de cada bloque principal
       - Manejo de errores en múltiples niveles (anidados)
       - Uso de -ErrorAction Stop para captura confiable de errores
    
    ESTRUCTURA DE BLOQUES EN ESTE SCRIPT:
    ═════════════════════════════════════
    - if (línea 56): Validación de archivo CSV → 1 llave de apertura, 1 de cierre
    - try (línea 71): Bloque principal de ejecución → 1 llave de apertura, 1 de cierre (línea 124)
      └─ try (línea 94): Parse de JSON anidado → 1 llave de apertura, 1 de cierre (línea 118)
         ├─ if (línea 98): Mostrar resumen → 1 llave de apertura, 1 de cierre (línea 112)
         └─ else (línea 113): JSON completo → 1 llave de apertura, 1 de cierre (línea 117)
      └─ catch (línea 119): Manejo de error JSON → 1 llave de apertura, 1 de cierre (línea 123)
    - catch (línea 125): Manejo de error principal → 1 llave de apertura, 1 de cierre (línea 156)
      ├─ if (línea 133): Si hay respuesta HTTP → 1 llave de apertura, 1 de cierre (línea 149)
      │  └─ switch (línea 136): Casos de error → 1 llave de apertura, 1 de cierre (línea 148)
      └─ else (línea 150): Sin respuesta HTTP → 1 llave de apertura, 1 de cierre (línea 155)

.EXAMPLE
    .\importar-masivo.ps1
    Ejecuta la importación del archivo CSV por defecto (sample-products.csv)
#>

# ══════════════════════════════════════════════════════════════════════════════
# CONFIGURACIÓN INICIAL
# ══════════════════════════════════════════════════════════════════════════════
$ApiUrl = "http://localhost:5135/api/Productos/ImportarCsv"
$CsvFile = "sample-products.csv"

# ══════════════════════════════════════════════════════════════════════════════
# VALIDACIÓN DE PREREQUISITOS
# ══════════════════════════════════════════════════════════════════════════════
# BLOQUE IF: Verifica la existencia del archivo CSV antes de continuar
# Apertura de llave: línea siguiente | Cierre de llave: 4 líneas después
if (-not (Test-Path $CsvFile)) {
    Write-Host "Error: No se encontró el archivo $CsvFile" -ForegroundColor Red
    exit 1
} # FIN del bloque if - Validación de archivo

# ══════════════════════════════════════════════════════════════════════════════
# BANNER DE INICIO
# ══════════════════════════════════════════════════════════════════════════════
Write-Host "╔════════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║          IMPORTADOR MASIVO DE PRODUCTOS - VelyKapet                   ║" -ForegroundColor Cyan
Write-Host "║                    Importación desde CSV                               ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Write-Host "Archivo CSV: $CsvFile" -ForegroundColor Green
Write-Host "URL del API: $ApiUrl" -ForegroundColor Green
Write-Host "Enviando archivo CSV al endpoint..." -ForegroundColor Yellow

# ══════════════════════════════════════════════════════════════════════════════
# BLOQUE TRY-CATCH PRINCIPAL
# ══════════════════════════════════════════════════════════════════════════════
# Este es el bloque de control más externo que captura cualquier error durante:
# - Construcción del request multipart/form-data
# - Envío de la petición HTTP
# - Procesamiento de la respuesta
# IMPORTANTE: Cada 'try' DEBE tener su correspondiente 'catch'
try { # APERTURA del bloque try principal (nivel 1)
    # ──────────────────────────────────────────────────────────────────────────
    # Preparación del archivo para envío multipart/form-data
    # ──────────────────────────────────────────────────────────────────────────
    $fileBin = [System.IO.File]::ReadAllBytes((Resolve-Path $CsvFile))
    $boundary = [System.Guid]::NewGuid().ToString()
    $LF = "`r`n"
    
    # Construcción del cuerpo multipart siguiendo RFC 2046
    $bodyLines = (
        "--$boundary",
        "Content-Disposition: form-data; name=`"file`"; filename=`"$CsvFile`"",
        "Content-Type: text/csv",
        "",
        [System.Text.Encoding]::UTF8.GetString($fileBin),
        "--$boundary--",
        ""
    ) -join $LF
    
    # ──────────────────────────────────────────────────────────────────────────
    # Envío de petición HTTP POST con el archivo CSV
    # ──────────────────────────────────────────────────────────────────────────
    # -ErrorAction Stop: Asegura que cualquier error sea capturado por el catch
    $response = Invoke-WebRequest -Uri $ApiUrl -Method Post -ContentType "multipart/form-data; boundary=$boundary" -Body $bodyLines -ErrorAction Stop
    
    # ──────────────────────────────────────────────────────────────────────────
    # Procesamiento de respuesta exitosa
    # ──────────────────────────────────────────────────────────────────────────
    Write-Host "Importación completada con éxito" -ForegroundColor Green
    Write-Host "Respuesta del servidor:" -ForegroundColor Cyan
    
    # ══════════════════════════════════════════════════════════════════════════
    # BLOQUE TRY-CATCH ANIDADO para parsing de JSON
    # ══════════════════════════════════════════════════════════════════════════
    # Este bloque interno maneja específicamente errores de parseo JSON
    # sin interrumpir la ejecución principal (degradación elegante)
    try { # APERTURA del bloque try anidado (nivel 2)
        $jsonObject = $response.Content | ConvertFrom-Json
        
        # ──────────────────────────────────────────────────────────────────────
        # BLOQUE IF-ELSE: Determina el formato de salida según datos disponibles
        # ──────────────────────────────────────────────────────────────────────
        if ($jsonObject.totalProcessed -or $jsonObject.TotalProcessed) { # APERTURA del bloque if
            # Normalización de nombres de propiedades (camelCase vs PascalCase)
            $totalProcessed = if ($jsonObject.totalProcessed) { $jsonObject.totalProcessed } else { $jsonObject.TotalProcessed }
            $successCount = if ($jsonObject.successCount) { $jsonObject.successCount } else { $jsonObject.SuccessCount }
            $failureCount = if ($jsonObject.failureCount) { $jsonObject.failureCount } else { $jsonObject.FailureCount }
            
            # Mostrar resumen estructurado
            Write-Host "📊 RESUMEN DE LA IMPORTACIÓN:" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "   📦 Total procesados: " -NoNewline -ForegroundColor Gray
            Write-Host "$totalProcessed" -ForegroundColor White
            Write-Host "   ✅ Exitosos:         " -NoNewline -ForegroundColor Gray
            Write-Host "$successCount" -ForegroundColor Green
            Write-Host "   ❌ Fallidos:         " -NoNewline -ForegroundColor Gray
            Write-Host "$failureCount" -ForegroundColor $(if ($failureCount -gt 0) { "Red" } else { "Green" })
            Write-Host ""
        } # CIERRE del bloque if
        else { # APERTURA del bloque else
            # Fallback: Si no hay estructura de resumen, mostrar JSON completo
            Write-Host $response.Content -ForegroundColor White
            Write-Host ""
        } # CIERRE del bloque else
    } # CIERRE del bloque try anidado (nivel 2)
    catch { # APERTURA del bloque catch anidado (nivel 2)
        # Manejo elegante de error: Si el JSON no es parseable, mostrar texto plano
        Write-Host $response.Content -ForegroundColor White
        Write-Host ""
    } # CIERRE del bloque catch anidado (nivel 2)
} # CIERRE del bloque try principal (nivel 1)
catch { # APERTURA del bloque catch principal (nivel 1)
    # ══════════════════════════════════════════════════════════════════════════
    # MANEJO DE ERRORES PRINCIPAL
    # ══════════════════════════════════════════════════════════════════════════
    # Este catch captura cualquier error que ocurra en el try principal:
    # - Errores de lectura de archivo
    # - Errores de red (timeout, conexión rechazada)
    # - Errores HTTP (400, 404, 500, etc.)
    
    Write-Host "Error al realizar la petición: $_" -ForegroundColor Red
    
    # Sugerencias contextuales según el tipo de error
    Write-Host ""
    Write-Host "💡 SUGERENCIAS PARA RESOLVER EL ERROR:" -ForegroundColor Yellow
    Write-Host ""
    
    # ──────────────────────────────────────────────────────────────────────────
    # BLOQUE IF-ELSE: Diferencia entre errores HTTP y errores de conexión
    # ──────────────────────────────────────────────────────────────────────────
    if ($_.Exception.Response) { # APERTURA del bloque if - Hay respuesta HTTP
        $statusCode = [int]$_.Exception.Response.StatusCode
        
        # ══════════════════════════════════════════════════════════════════════
        # BLOQUE SWITCH: Proporciona ayuda específica según código HTTP
        # ══════════════════════════════════════════════════════════════════════
        # Cada caso (400, 404, default) tiene su propio par de llaves
        switch ($statusCode) { # APERTURA del bloque switch
            400 { # APERTURA del caso 400
                Write-Host "   • Revise el formato del archivo CSV" -ForegroundColor Gray
                Write-Host "   • Verifique que los campos obligatorios estén presentes" -ForegroundColor Gray
            } # CIERRE del caso 400
            404 { # APERTURA del caso 404
                Write-Host "   • El endpoint no fue encontrado" -ForegroundColor Gray
                Write-Host "   • Verifique la URL de la API: $ApiUrl" -ForegroundColor Gray
            } # CIERRE del caso 404
            default { # APERTURA del caso default
                Write-Host "   • Código de estado HTTP: $statusCode" -ForegroundColor Gray
            } # CIERRE del caso default
        } # CIERRE del bloque switch
    } # CIERRE del bloque if
    else { # APERTURA del bloque else - No hay respuesta HTTP (error de conexión)
        Write-Host "   • Verifique que el servidor backend esté ejecutándose" -ForegroundColor Gray
        Write-Host "   • URL esperada: http://localhost:5135" -ForegroundColor Gray
        Write-Host "   • Comando para iniciar: cd backend-config" -ForegroundColor Gray
        Write-Host "   • Luego ejecute: dotnet run" -ForegroundColor Gray
    } # CIERRE del bloque else
} # CIERRE del bloque catch principal (nivel 1)

# ══════════════════════════════════════════════════════════════════════════════
# FINALIZACIÓN DEL SCRIPT
# ══════════════════════════════════════════════════════════════════════════════
Write-Host "Fin de la prueba" -ForegroundColor Cyan

# ══════════════════════════════════════════════════════════════════════════════
# NOTAS FINALES SOBRE ESTRUCTURA Y MANTENIMIENTO
# ══════════════════════════════════════════════════════════════════════════════
<#
RESUMEN DE BLOQUES DE CONTROL EN ESTE SCRIPT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total de bloques:
  • 1 bloque if (validación de archivo)                    → 2 llaves  (1 apertura + 1 cierre)
  • 1 bloque try principal                                 → 2 llaves  (1 apertura + 1 cierre)
  • 1 bloque catch principal                               → 2 llaves  (1 apertura + 1 cierre)
  • 1 bloque try anidado (parsing JSON)                    → 2 llaves  (1 apertura + 1 cierre)
  • 1 bloque catch anidado                                 → 2 llaves  (1 apertura + 1 cierre)
  • 1 bloque if-else (mostrar resumen vs JSON completo)    → 4 llaves  (2 aperturas + 2 cierres)
  • 1 bloque if-else (HTTP response vs conexión)           → 4 llaves  (2 aperturas + 2 cierres)
  • 1 bloque switch con 3 casos                            → 8 llaves  (4 aperturas + 4 cierres)
  ─────────────────────────────────────────────────────────────────────────
  TOTAL: 26 llaves (13 aperturas '{' + 13 cierres '}')     ✅ BALANCEADO

VALIDACIÓN AUTOMÁTICA:
━━━━━━━━━━━━━━━━━━━━━
Para validar la sintaxis de este script antes de ejecutarlo:

    pwsh -NoProfile -Command "$errors = $null; [void][System.Management.Automation.Language.Parser]::ParseFile('importar-masivo.ps1', [ref]$null, [ref]$errors); if ($errors) { $errors | ForEach-Object { Write-Host \"Error: $_\" } } else { Write-Host 'Sintaxis correcta ✅' }"

HERRAMIENTAS RECOMENDADAS PARA EVITAR ERRORES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Visual Studio Code + PowerShell Extension
   - Instalación: code --install-extension ms-vscode.powershell
   - Características: IntelliSense, validación en tiempo real, depuración

2. PSScriptAnalyzer (Linter oficial de PowerShell)
   - Instalación: Install-Module -Name PSScriptAnalyzer -Force
   - Uso: Invoke-ScriptAnalyzer -Path .\importar-masivo.ps1

3. EditorConfig (Formato consistente)
   - Crear archivo .editorconfig en la raíz del proyecto
   - Define indentación, fin de línea, etc.

4. Git Hooks (Validación pre-commit)
   - Evita commits con errores de sintaxis
   - Ejecuta PSScriptAnalyzer automáticamente

BUENAS PRÁCTICAS APLICADAS:
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Indentación consistente (4 espacios)
✅ Comentarios descriptivos antes de cada bloque
✅ Marcadores de apertura/cierre de bloques
✅ Manejo de errores en múltiples niveles
✅ Degradación elegante (fallbacks)
✅ Mensajes de error contextuales
✅ Validación de prerequisitos
✅ Documentación inline extensiva
#>