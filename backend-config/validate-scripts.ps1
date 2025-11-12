# ========================================
# Script de Validación Automática de Scripts PowerShell
# ========================================
# Valida sintaxis, encoding y buenas prácticas
# en todos los scripts PowerShell del proyecto
# ========================================

param(
    [switch]$Verbose = $false,
    [switch]$CI = $false,
    [string]$Path = "."
)

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# Colores y símbolos
$ErrorColor = "Red"
$WarningColor = "Yellow"
$SuccessColor = "Green"
$InfoColor = "Cyan"

function Write-TestHeader {
    param([string]$Message)
    if (-not $CI) {
        Write-Host ""
        Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor $InfoColor
        Write-Host "  $Message" -ForegroundColor $InfoColor
        Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor $InfoColor
        Write-Host ""
    }
}

function Write-TestResult {
    param(
        [bool]$Success,
        [string]$Message
    )
    
    if ($Success) {
        Write-Host "  ✅ $Message" -ForegroundColor $SuccessColor
    } else {
        Write-Host "  ❌ $Message" -ForegroundColor $ErrorColor
    }
}

function Test-ScriptSyntax {
    param([string]$ScriptPath)
    
    try {
        $errors = $null
        $tokens = $null
        [void][System.Management.Automation.Language.Parser]::ParseFile(
            $ScriptPath, 
            [ref]$tokens, 
            [ref]$errors
        )
        
        if ($errors.Count -eq 0) {
            return @{
                Success = $true
                Errors = @()
            }
        } else {
            return @{
                Success = $false
                Errors = $errors | ForEach-Object {
                    "Línea $($_.Extent.StartLineNumber): $($_.Message)"
                }
            }
        }
    } catch {
        return @{
            Success = $false
            Errors = @("Error al parsear: $_")
        }
    }
}

function Test-ScriptEncoding {
    param([string]$ScriptPath)
    
    try {
        $content = Get-Content -Path $ScriptPath -Raw -Encoding UTF8
        
        # Verificar si hay caracteres de encoding problemáticos
        $problematicChars = $content -match '[^\x00-\x7F\u0080-\uFFFF]'
        
        if (-not $problematicChars) {
            return @{
                Success = $true
                Message = "Encoding UTF-8 correcto"
            }
        } else {
            return @{
                Success = $false
                Message = "Posibles problemas de encoding detectados"
            }
        }
    } catch {
        return @{
            Success = $false
            Message = "Error al verificar encoding: $_"
        }
    }
}

function Test-BalancedBraces {
    param([string]$ScriptPath)
    
    try {
        $content = Get-Content -Path $ScriptPath -Raw
        
        # Contar llaves
        $openBraces = ([regex]::Matches($content, '\{')).Count
        $closeBraces = ([regex]::Matches($content, '\}')).Count
        
        if ($openBraces -eq $closeBraces) {
            return @{
                Success = $true
                Message = "Llaves balanceadas ($openBraces pares)"
            }
        } else {
            return @{
                Success = $false
                Message = "Llaves desbalanceadas (Abiertas: $openBraces, Cerradas: $closeBraces)"
            }
        }
    } catch {
        return @{
            Success = $false
            Message = "Error al verificar llaves: $_"
        }
    }
}

function Test-TryCatchBlocks {
    param([string]$ScriptPath)
    
    try {
        $content = Get-Content -Path $ScriptPath -Raw
        
        # Buscar bloques try sin catch/finally
        $tryPattern = '(?s)try\s*\{[^}]*\}'
        $catchPattern = 'catch\s*\{'
        $finallyPattern = 'finally\s*\{'
        
        $tryBlocks = ([regex]::Matches($content, $tryPattern)).Count
        $catchBlocks = ([regex]::Matches($content, $catchPattern)).Count
        $finallyBlocks = ([regex]::Matches($content, $finallyPattern)).Count
        
        $handledBlocks = $catchBlocks + $finallyBlocks
        
        if ($tryBlocks -eq 0 -or $tryBlocks -eq $handledBlocks) {
            return @{
                Success = $true
                Message = "Bloques try-catch correctos"
            }
        } else {
            return @{
                Success = $false
                Message = "Posibles bloques try sin catch/finally ($tryBlocks try, $handledBlocks manejados)"
            }
        }
    } catch {
        return @{
            Success = $false
            Message = "Error al verificar bloques try-catch: $_"
        }
    }
}

# ========================================
# PROGRAMA PRINCIPAL
# ========================================

Write-TestHeader "VALIDACIÓN DE SCRIPTS POWERSHELL"

# Buscar todos los scripts PowerShell
$scripts = Get-ChildItem -Path $Path -Filter *.ps1 -Recurse | Where-Object {
    $_.Name -notmatch '\.Tests\.ps1$' -and 
    $_.Name -ne 'validate-scripts.ps1'
}

if ($scripts.Count -eq 0) {
    Write-Host "⚠️  No se encontraron scripts PowerShell para validar" -ForegroundColor $WarningColor
    exit 0
}

Write-Host "📋 Scripts encontrados: $($scripts.Count)" -ForegroundColor $InfoColor
Write-Host ""

$totalTests = 0
$passedTests = 0
$failedScripts = @()

foreach ($script in $scripts) {
    Write-Host "📄 Validando: $($script.Name)" -ForegroundColor $InfoColor
    Write-Host "   Ruta: $($script.FullName)" -ForegroundColor Gray
    Write-Host ""
    
    $scriptFailed = $false
    
    # Test 1: Sintaxis
    $totalTests++
    $syntaxResult = Test-ScriptSyntax -ScriptPath $script.FullName
    
    if ($syntaxResult.Success) {
        Write-TestResult -Success $true -Message "Sintaxis válida"
        $passedTests++
    } else {
        Write-TestResult -Success $false -Message "Errores de sintaxis detectados"
        # CHANGELOG: Renamed $error to $errorItem to avoid PSScriptAnalyzer error (readonly automatic variable)
        foreach ($errorItem in $syntaxResult.Errors) {
            Write-Host "     • $errorItem" -ForegroundColor DarkRed
        }
        $scriptFailed = $true
    }
    
    # Test 2: Encoding
    $totalTests++
    $encodingResult = Test-ScriptEncoding -ScriptPath $script.FullName
    
    if ($encodingResult.Success) {
        Write-TestResult -Success $true -Message $encodingResult.Message
        $passedTests++
    } else {
        Write-TestResult -Success $false -Message $encodingResult.Message
        $scriptFailed = $true
    }
    
    # Test 3: Llaves balanceadas
    $totalTests++
    $bracesResult = Test-BalancedBraces -ScriptPath $script.FullName
    
    if ($bracesResult.Success) {
        Write-TestResult -Success $true -Message $bracesResult.Message
        $passedTests++
    } else {
        Write-TestResult -Success $false -Message $bracesResult.Message
        $scriptFailed = $true
    }
    
    # Test 4: Bloques try-catch
    $totalTests++
    $tryCatchResult = Test-TryCatchBlocks -ScriptPath $script.FullName
    
    if ($tryCatchResult.Success) {
        Write-TestResult -Success $true -Message $tryCatchResult.Message
        $passedTests++
    } else {
        Write-TestResult -Success $false -Message $tryCatchResult.Message
        # Este es un warning, no un error crítico
        $passedTests++
    }
    
    if ($scriptFailed) {
        $failedScripts += $script.Name
    }
    
    Write-Host ""
}

# ========================================
# RESUMEN
# ========================================

Write-TestHeader "RESUMEN DE VALIDACIÓN"

Write-Host "  Total de scripts:    $($scripts.Count)" -ForegroundColor Gray
Write-Host "  Total de tests:      $totalTests" -ForegroundColor Gray
Write-Host "  Tests exitosos:      $passedTests" -ForegroundColor $SuccessColor
Write-Host "  Tests fallidos:      $($totalTests - $passedTests)" -ForegroundColor $ErrorColor
Write-Host ""

$successRate = [Math]::Round(($passedTests / $totalTests) * 100, 2)

if ($failedScripts.Count -eq 0) {
    Write-Host "✅ TODOS LOS SCRIPTS SON VÁLIDOS" -ForegroundColor $SuccessColor
    Write-Host "   Tasa de éxito: $successRate%" -ForegroundColor $SuccessColor
    exit 0
} else {
    Write-Host "❌ ALGUNOS SCRIPTS TIENEN ERRORES" -ForegroundColor $ErrorColor
    Write-Host "   Tasa de éxito: $successRate%" -ForegroundColor $WarningColor
    Write-Host ""
    Write-Host "  Scripts con errores:" -ForegroundColor $ErrorColor
    foreach ($failedScript in $failedScripts) {
        Write-Host "    • $failedScript" -ForegroundColor DarkRed
    }
    exit 1
}
