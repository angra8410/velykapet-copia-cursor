# PowerShell Scripts - Buenas Prácticas y Recomendaciones

## 📋 Resumen

Este documento describe las buenas prácticas implementadas en los scripts PowerShell del proyecto y proporciona recomendaciones para evitar errores comunes de sintaxis y estructura.

## ✅ Scripts Validados

Los siguientes scripts han sido verificados y validados:

1. **importar-masivo.ps1** - Script de importación masiva de productos desde CSV
2. **preprocesar-csv.ps1** - Script de preprocesamiento y limpieza de archivos CSV
3. **test-importacion-csv.ps1** - Script de prueba automatizada del proceso de importación

## 🔧 Correcciones Realizadas

### importar-masivo.ps1
**Problema identificado:** Bloque `try` con doble cierre de llave (línea 108)
```powershell
# ❌ Incorrecto (antes)
    Write-Host "..." -ForegroundColor Cyan
}
}
catch {

# ✅ Correcto (después)
    Write-Host "..." -ForegroundColor Cyan
}
catch {
```

**Causa:** Error de edición que añadió una llave de cierre extra, causando que el bloque `try-catch` quedara mal formado.

**Solución:** Eliminación de la llave duplicada para restaurar la estructura correcta del bloque `try-catch`.

## 📚 Buenas Prácticas Implementadas

### 1. Encoding UTF-8
Todos los scripts configuran correctamente el encoding UTF-8:

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
```

**Por qué es importante:** Garantiza que los caracteres especiales (acentos, emojis, símbolos de moneda) se muestren correctamente.

### 2. Validación de Parámetros
Los scripts incluyen validación de parámetros y archivos:

```powershell
if (-not (Test-Path $CsvFile)) {
    Write-Host "Error: No se encontró el archivo $CsvFile"
    exit
}
```

### 3. Manejo de Errores Robusto
Uso de bloques `try-catch` con mensajes de error descriptivos:

```powershell
try {
    # Código que puede fallar
}
catch {
    Write-Host "Error al realizar la petición: $_" -ForegroundColor Red
    # Sugerencias específicas según el tipo de error
}
```

### 4. Expresiones Regulares Correctas
Las regex están correctamente formateadas y escapadas:

```powershell
# Limpieza de símbolos de moneda
$cleaned = $Price.Trim() -replace '[\$€£¥₹]', '' -replace '\s', ''

# Validación de formatos de precio
if ($cleaned -match '^[\d]+[,][\d]{3}[.][\d]{2}$') {
    # Formato US con miles: 20,400.00
}
```

### 5. Mensajes Visuales y Consistentes
Uso de colores, emojis y formato consistente:

```powershell
Write-Host "✅ ÉXITO: Operación completada" -ForegroundColor Green
Write-Host "⚠️  ADVERTENCIA: Revisar configuración" -ForegroundColor Yellow
Write-Host "❌ ERROR: Operación fallida" -ForegroundColor Red
```

## 🛠️ Herramientas Recomendadas

### 1. Visual Studio Code
**Editor recomendado** con las siguientes extensiones:

- **PowerShell Extension** (ms-vscode.powershell)
  - Resaltado de sintaxis en tiempo real
  - IntelliSense y autocompletado
  - Detección de errores de sintaxis
  - Debugging integrado

**Configuración recomendada (.vscode/settings.json):**
```json
{
    "powershell.codeFormatting.preset": "OTBS",
    "powershell.codeFormatting.alignPropertyValuePairs": true,
    "powershell.scriptAnalysis.enable": true,
    "files.encoding": "utf8"
}
```

### 2. PowerShell ISE
Editor nativo de Windows con:
- Validación de sintaxis automática
- Debugging paso a paso
- Consola integrada

### 3. PSScriptAnalyzer
Herramienta de análisis estático de código:

```powershell
# Instalar PSScriptAnalyzer
Install-Module -Name PSScriptAnalyzer -Force -Scope CurrentUser

# Analizar un script
Invoke-ScriptAnalyzer -Path .\importar-masivo.ps1

# Analizar todos los scripts
Get-ChildItem -Path . -Filter *.ps1 | ForEach-Object {
    Invoke-ScriptAnalyzer -Path $_.FullName
}
```

## ✅ Validación de Scripts

### Validación Manual
Para verificar la sintaxis de un script:

```powershell
# Método 1: Parser básico
$null = [System.Management.Automation.PSParser]::Tokenize((Get-Content 'script.ps1' -Raw), [ref]$null)

# Método 2: AST Parser (más completo)
$errors = $null
$tokens = $null
[void][System.Management.Automation.Language.Parser]::ParseFile('script.ps1', [ref]$tokens, [ref]$errors)

if ($errors.Count -gt 0) {
    Write-Host "Errores encontrados:"
    $errors | ForEach-Object {
        Write-Host "  Línea $($_.Extent.StartLineNumber): $($_.Message)"
    }
}
```

### Script de Validación Automatizada
Crear `validate-scripts.ps1`:

```powershell
$scripts = Get-ChildItem -Path . -Filter *.ps1
$allValid = $true

foreach ($script in $scripts) {
    Write-Host "Validando: $($script.Name)" -ForegroundColor Yellow
    
    $errors = $null
    $tokens = $null
    [void][System.Management.Automation.Language.Parser]::ParseFile($script.FullName, [ref]$tokens, [ref]$errors)
    
    if ($errors.Count -gt 0) {
        Write-Host "  ❌ Errores encontrados" -ForegroundColor Red
        $errors | ForEach-Object {
            Write-Host "     Línea $($_.Extent.StartLineNumber): $($_.Message)" -ForegroundColor DarkRed
        }
        $allValid = $false
    } else {
        Write-Host "  ✅ Sin errores" -ForegroundColor Green
    }
}

if (-not $allValid) { exit 1 }
```

## 🔍 Errores Comunes y Cómo Evitarlos

### 1. Bloques sin Cerrar
❌ **Incorrecto:**
```powershell
function Get-Data {
    $result = "data"
    return $result
# Falta }
```

✅ **Correcto:**
```powershell
function Get-Data {
    $result = "data"
    return $result
}
```

**Prevención:** 
- Usar un editor con coincidencia de llaves
- Mantener indentación consistente
- Verificar que cada `{` tenga su correspondiente `}`

### 2. Cadenas sin Terminar
❌ **Incorrecto:**
```powershell
Write-Host "Este es un mensaje sin terminar
Write-Host "Otro mensaje"
```

✅ **Correcto:**
```powershell
Write-Host "Este es un mensaje completo"
Write-Host "Otro mensaje"
```

**Prevención:**
- Usar resaltado de sintaxis
- Verificar que las comillas estén balanceadas
- Usar comillas apropiadas: `"` para interpolación, `'` para cadenas literales

### 3. Try sin Catch/Finally
❌ **Incorrecto:**
```powershell
try {
    $result = Get-Content "file.txt"
}
# Falta catch o finally
```

✅ **Correcto:**
```powershell
try {
    $result = Get-Content "file.txt"
}
catch {
    Write-Host "Error: $_"
}
```

### 4. Expresiones Regulares Mal Formateadas
❌ **Incorrecto:**
```powershell
# Símbolos especiales sin escapar
$cleaned = $text -replace '[$€]', ''
```

✅ **Correcto:**
```powershell
# Símbolos especiales correctamente escapados
$cleaned = $text -replace '[\$€]', ''
```

### 5. Problemas de Encoding
❌ **Problemático:**
```powershell
# Caracteres extraños: â‚¬Â£Â¥â‚¹
$cleaned = $text -replace '[â‚¬Â£Â¥â‚¹]', ''
```

✅ **Correcto:**
```powershell
# Caracteres Unicode correctos
$cleaned = $text -replace '[\$€£¥₹]', ''
```

**Prevención:**
- Guardar archivos con encoding UTF-8
- Configurar el editor para usar UTF-8 sin BOM
- Verificar la codificación con `file` o `Get-Content -Encoding`

## 🧪 Testing Automatizado

### Crear Tests con Pester
Instalar Pester (framework de testing para PowerShell):

```powershell
Install-Module -Name Pester -Force -Scope CurrentUser
```

Ejemplo de test (`importar-masivo.Tests.ps1`):

```powershell
Describe 'importar-masivo.ps1' {
    Context 'Validación de sintaxis' {
        It 'No debe tener errores de parsing' {
            $errors = $null
            $tokens = $null
            [void][System.Management.Automation.Language.Parser]::ParseFile(
                'importar-masivo.ps1', 
                [ref]$tokens, 
                [ref]$errors
            )
            $errors.Count | Should -Be 0
        }
    }
    
    Context 'Validación de encoding' {
        It 'Debe estar en UTF-8' {
            $content = Get-Content 'importar-masivo.ps1' -Raw -Encoding UTF8
            $content | Should -Not -BeNullOrEmpty
        }
    }
}
```

Ejecutar tests:
```powershell
Invoke-Pester -Path .\importar-masivo.Tests.ps1
```

### Integración Continua (CI)
Ejemplo de workflow para GitHub Actions (`.github/workflows/powershell-tests.yml`):

```yaml
name: PowerShell Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install Pester
        shell: pwsh
        run: Install-Module -Name Pester -Force -Scope CurrentUser
      
      - name: Run PSScriptAnalyzer
        shell: pwsh
        run: |
          Install-Module -Name PSScriptAnalyzer -Force -Scope CurrentUser
          $results = Invoke-ScriptAnalyzer -Path ./backend-config/*.ps1
          if ($results) { 
            $results | Format-Table
            exit 1 
          }
      
      - name: Run Pester Tests
        shell: pwsh
        run: Invoke-Pester -Path ./backend-config/*.Tests.ps1 -CI
```

## 📋 Checklist de Revisión de Código

Antes de hacer commit de un script PowerShell, verificar:

- [ ] Sintaxis validada con PSParser o AST Parser
- [ ] Encoding UTF-8 confirmado
- [ ] Todos los bloques `{` tienen su correspondiente `}`
- [ ] Todos los `try` tienen su `catch` o `finally`
- [ ] Todas las cadenas tienen comillas de cierre
- [ ] Expresiones regulares correctamente escapadas
- [ ] Código ejecutado localmente sin errores
- [ ] PSScriptAnalyzer no reporta warnings críticos
- [ ] Indentación consistente
- [ ] Comentarios explicativos donde sea necesario
- [ ] Manejo de errores apropiado
- [ ] Variables y parámetros con nombres descriptivos

## 🔗 Referencias y Recursos

### Documentación Oficial
- [PowerShell Documentation](https://docs.microsoft.com/en-us/powershell/)
- [PowerShell Best Practices](https://docs.microsoft.com/en-us/powershell/scripting/developer/cmdlet/cmdlet-development-guidelines)
- [PowerShell Style Guide](https://poshcode.gitbook.io/powershell-practice-and-style/)

### Herramientas
- [PSScriptAnalyzer](https://github.com/PowerShell/PSScriptAnalyzer)
- [Pester](https://pester.dev/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [PowerShell Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.PowerShell)

### Comunidad
- [PowerShell Gallery](https://www.powershellgallery.com/)
- [r/PowerShell](https://www.reddit.com/r/PowerShell/)
- [PowerShell.org](https://powershell.org/)

## 📝 Notas de Mantenimiento

### Historial de Cambios
- **2025-10-18:** Corrección de error de sintaxis en `importar-masivo.ps1` (doble cierre de llave)
- **2025-10-18:** Validación completa de todos los scripts de importación
- **2025-10-18:** Creación de documentación de buenas prácticas

### Contacto
Para reportar problemas o sugerir mejoras en los scripts, crear un issue en el repositorio del proyecto.
