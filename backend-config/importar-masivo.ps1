<#
.SYNOPSIS
    Script interactivo para importación masiva de productos desde archivo CSV

.DESCRIPTION
    Este script permite importar productos de forma masiva mediante un archivo CSV.
    Incluye validaciones, mensajes claros, formato de respuesta JSON y opciones de reintento.
    Compatible con PowerShell 5.1+ en Windows.

.PARAMETER ApiUrl
    URL del endpoint de la API (por defecto: http://localhost:5135/api/Productos/ImportarCsv)

.EXAMPLE
    .\importar-masivo.ps1
    Ejecuta el script de forma interactiva

.NOTES
    Autor: VelyKapet Team
    Fecha: 2025-01-12
    Versión: 1.0
    Requiere: PowerShell 5.1+
#>

# ============================================================================
# CONFIGURACIÓN
# ============================================================================
param(
    [string]$ApiUrl = "http://localhost:5135/api/Productos/ImportarCsv"
)

# Configuración de codificación UTF-8 para la consola
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# ============================================================================
# FUNCIONES AUXILIARES
# ============================================================================

function Show-Welcome {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║          IMPORTADOR MASIVO DE PRODUCTOS - VelyKapet                   ║" -ForegroundColor Cyan
    Write-Host "║                    Importación desde CSV                               ║" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

function Show-CsvFormatHelp {
    Write-Host "📋 FORMATO DEL ARCHIVO CSV:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "El archivo CSV debe contener las siguientes columnas:" -ForegroundColor White
    Write-Host ""
    Write-Host "  CAMPOS OBLIGATORIOS:" -ForegroundColor Green
    Write-Host "    • CATEGORIA    - Categoría del producto (debe existir en BD)" -ForegroundColor Gray
    Write-Host "    • NAME         - Nombre único del producto" -ForegroundColor Gray
    Write-Host "    • PRICE        - Precio del producto (acepta formato `$20,400.00)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  CAMPOS OPCIONALES:" -ForegroundColor Cyan
    Write-Host "    • description  - Descripción del producto" -ForegroundColor Gray
    Write-Host "    • presentacion - Presentación (ej: '500 GR', '1.5 KG')" -ForegroundColor Gray
    Write-Host "    • stock        - Stock disponible (por defecto 0)" -ForegroundColor Gray
    Write-Host "    • imageUrl     - URL de la imagen del producto" -ForegroundColor Gray
    Write-Host "    • proveedor    - Nombre del proveedor" -ForegroundColor Gray
    Write-Host "    • sku          - SKU del producto" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  EJEMPLO DE CSV:" -ForegroundColor Yellow
    Write-Host "    ID,CATEGORIA,NAME,PRICE,stock,presentacion,imageUrl" -ForegroundColor Gray
    Write-Host "    1,Alimento para Gatos,BR FOR CAT VET,`$20400.00,10,500 GR,https://..." -ForegroundColor Gray
    Write-Host ""
    Write-Host "  📚 Documentación completa: backend-config/API_ENDPOINT_IMPORTAR_CSV.md" -ForegroundColor Cyan
    Write-Host "  📄 Archivo de ejemplo: backend-config/sample-products.csv" -ForegroundColor Cyan
    Write-Host ""
}

function Get-CsvFilePath {
    param(
        [string]$DefaultFile = "sample-products.csv"
    )
    
    Write-Host "📂 SELECCIÓN DE ARCHIVO" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Por favor, ingrese la ruta del archivo CSV a importar" -ForegroundColor White
    Write-Host "Presione ENTER para usar el archivo por defecto: " -NoNewline -ForegroundColor Gray
    Write-Host "$DefaultFile" -ForegroundColor Green
    Write-Host ""
    Write-Host "Ruta del archivo: " -NoNewline -ForegroundColor White
    
    $userInput = Read-Host
    
    if ([string]::IsNullOrWhiteSpace($userInput)) {
        return $DefaultFile
    }
    
    return $userInput.Trim().Trim('"').Trim("'")
}

function Test-CsvFile {
    param(
        [string]$FilePath
    )
    
    Write-Host ""
    Write-Host "🔍 Validando archivo..." -ForegroundColor Cyan
    
    # Verificar si el archivo existe
    if (-not (Test-Path $FilePath)) {
        Write-Host "❌ ERROR: No se encontró el archivo '$FilePath'" -ForegroundColor Red
        Write-Host ""
        Write-Host "Sugerencias:" -ForegroundColor Yellow
        Write-Host "  • Verifique que la ruta sea correcta" -ForegroundColor Gray
        Write-Host "  • Use rutas absolutas o relativas desde la ubicación actual" -ForegroundColor Gray
        Write-Host "  • Asegúrese de que el archivo tenga extensión .csv" -ForegroundColor Gray
        Write-Host ""
        return $false
    }
    
    # Verificar que sea un archivo CSV
    $extension = [System.IO.Path]::GetExtension($FilePath)
    if ($extension -ne ".csv") {
        Write-Host "⚠️  ADVERTENCIA: El archivo no tiene extensión .csv (extensión actual: $extension)" -ForegroundColor Yellow
        Write-Host "¿Desea continuar de todos modos? (S/N): " -NoNewline -ForegroundColor White
        $continue = Read-Host
        if ($continue -ne "S" -and $continue -ne "s") {
            return $false
        }
    }
    
    # Mostrar información del archivo
    $fileInfo = Get-Item $FilePath
    $fileSizeKB = [math]::Round($fileInfo.Length / 1KB, 2)
    
    Write-Host "✅ Archivo encontrado:" -ForegroundColor Green
    Write-Host "   📄 Nombre: $($fileInfo.Name)" -ForegroundColor Gray
    Write-Host "   📏 Tamaño: $fileSizeKB KB" -ForegroundColor Gray
    Write-Host "   📅 Modificado: $($fileInfo.LastWriteTime)" -ForegroundColor Gray
    Write-Host ""
    
    return $true
}

function Invoke-CsvImport {
    param(
        [string]$FilePath,
        [string]$ApiUrl
    )
    
    Write-Host "📤 ENVIANDO SOLICITUD AL SERVIDOR" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   🌐 URL: $ApiUrl" -ForegroundColor Gray
    Write-Host "   📄 Archivo: $FilePath" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Por favor espere..." -ForegroundColor Cyan
    Write-Host ""
    
    try {
        # Leer el archivo y crear el boundary para multipart/form-data
        $fileBin = [System.IO.File]::ReadAllBytes((Resolve-Path $FilePath))
        $fileName = [System.IO.Path]::GetFileName($FilePath)
        $boundary = [System.Guid]::NewGuid().ToString()
        $LF = "`r`n"
        
        # Construir el body de la petición multipart/form-data
        $bodyLines = (
            "--$boundary",
            "Content-Disposition: form-data; name=`"file`"; filename=`"$fileName`"",
            "Content-Type: text/csv",
            "",
            [System.Text.Encoding]::UTF8.GetString($fileBin),
            "--$boundary--",
            ""
        ) -join $LF
        
        # Realizar la petición POST
        $response = Invoke-WebRequest `
            -Uri $ApiUrl `
            -Method Post `
            -ContentType "multipart/form-data; boundary=$boundary" `
            -Body $bodyLines `
            -UseBasicParsing `
            -ErrorAction Stop
        
        return @{
            Success = $true
            StatusCode = $response.StatusCode
            Content = $response.Content
        }
    }
    catch {
        $errorResponse = $null
        $statusCode = 0
        
        if ($_.Exception.Response) {
            $statusCode = [int]$_.Exception.Response.StatusCode
            try {
                $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                $errorResponse = $reader.ReadToEnd()
                $reader.Close()
            }
            catch {
                $errorResponse = $_.Exception.Message
            }
        }
        else {
            $errorResponse = $_.Exception.Message
        }
        
        return @{
            Success = $false
            StatusCode = $statusCode
            Content = $errorResponse
            ErrorMessage = $_.Exception.Message
        }
    }
}

function Format-JsonResponse {
    param(
        [string]$JsonString
    )
    
    try {
        # Intentar parsear y formatear el JSON
        $jsonObject = $JsonString | ConvertFrom-Json
        return ($jsonObject | ConvertTo-Json -Depth 10)
    }
    catch {
        # Si no es JSON válido, retornar el string original
        return $JsonString
    }
}

function Show-ImportResult {
    param(
        [hashtable]$Response
    )
    
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    
    if ($Response.Success) {
        Write-Host "✅ RESPUESTA DEL SERVIDOR (HTTP $($Response.StatusCode))" -ForegroundColor Green
    }
    else {
        Write-Host "❌ ERROR EN LA IMPORTACIÓN (HTTP $($Response.StatusCode))" -ForegroundColor Red
    }
    
    Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
    
    # Formatear y mostrar la respuesta JSON
    $formattedJson = Format-JsonResponse -JsonString $Response.Content
    
    try {
        $jsonObject = $Response.Content | ConvertFrom-Json
        
        # Mostrar resumen si está disponible
        if ($jsonObject.totalProcessed -or $jsonObject.TotalProcessed) {
            $totalProcessed = if ($jsonObject.totalProcessed) { $jsonObject.totalProcessed } else { $jsonObject.TotalProcessed }
            $successCount = if ($jsonObject.successCount) { $jsonObject.successCount } else { $jsonObject.SuccessCount }
            $failureCount = if ($jsonObject.failureCount) { $jsonObject.failureCount } else { $jsonObject.FailureCount }
            
            Write-Host "📊 RESUMEN DE LA IMPORTACIÓN:" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "   📦 Total procesados: " -NoNewline -ForegroundColor Gray
            Write-Host "$totalProcessed" -ForegroundColor White
            Write-Host "   ✅ Exitosos:         " -NoNewline -ForegroundColor Gray
            Write-Host "$successCount" -ForegroundColor Green
            Write-Host "   ❌ Fallidos:         " -NoNewline -ForegroundColor Gray
            Write-Host "$failureCount" -ForegroundColor $(if ($failureCount -gt 0) { "Red" } else { "Green" })
            Write-Host ""
            
            # Mostrar errores si existen
            $errors = if ($jsonObject.errors) { $jsonObject.errors } else { $jsonObject.Errors }
            if ($errors -and $errors.Count -gt 0) {
                Write-Host "⚠️  ERRORES ENCONTRADOS:" -ForegroundColor Red
                Write-Host ""
                foreach ($error in $errors) {
                    Write-Host "   • $error" -ForegroundColor Yellow
                }
                Write-Host ""
            }
            
            # Mostrar mensaje general
            $message = if ($jsonObject.message) { $jsonObject.message } else { $jsonObject.Message }
            if ($message) {
                Write-Host "💬 MENSAJE:" -ForegroundColor Cyan
                Write-Host "   $message" -ForegroundColor White
                Write-Host ""
            }
            
            # Mostrar productos creados (solo resumen)
            $createdProducts = if ($jsonObject.createdProducts) { $jsonObject.createdProducts } else { $jsonObject.CreatedProducts }
            if ($createdProducts -and $createdProducts.Count -gt 0) {
                Write-Host "✨ PRODUCTOS CREADOS: $($createdProducts.Count)" -ForegroundColor Green
                Write-Host ""
                
                # Mostrar primeros 5 productos
                $displayCount = [Math]::Min(5, $createdProducts.Count)
                for ($i = 0; $i -lt $displayCount; $i++) {
                    $product = $createdProducts[$i]
                    $productName = if ($product.nombreBase) { $product.nombreBase } else { $product.NombreBase }
                    $productId = if ($product.idProducto) { $product.idProducto } else { $product.IdProducto }
                    Write-Host "   $($i + 1). [$productId] $productName" -ForegroundColor Gray
                }
                
                if ($createdProducts.Count -gt 5) {
                    Write-Host "   ... y $($createdProducts.Count - 5) producto(s) más" -ForegroundColor Gray
                }
                Write-Host ""
            }
        }
        else {
            # Si no hay estructura de resumen, mostrar JSON completo formateado
            Write-Host $formattedJson -ForegroundColor White
            Write-Host ""
        }
    }
    catch {
        # Si hay error parseando el JSON, mostrar el contenido sin formato
        Write-Host $Response.Content -ForegroundColor White
        Write-Host ""
    }
    
    Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
}

function Show-ErrorHelp {
    param(
        [int]$StatusCode
    )
    
    Write-Host ""
    Write-Host "💡 SUGERENCIAS PARA RESOLVER EL ERROR:" -ForegroundColor Yellow
    Write-Host ""
    
    switch ($StatusCode) {
        0 {
            Write-Host "   • Verifique que el servidor backend esté ejecutándose" -ForegroundColor Gray
            Write-Host "   • URL esperada: http://localhost:5135" -ForegroundColor Gray
            Write-Host "   • Comando para iniciar: cd backend-config && dotnet run" -ForegroundColor Gray
        }
        400 {
            Write-Host "   • Revise el formato del archivo CSV" -ForegroundColor Gray
            Write-Host "   • Verifique que los campos obligatorios estén presentes" -ForegroundColor Gray
            Write-Host "   • Consulte la documentación en API_ENDPOINT_IMPORTAR_CSV.md" -ForegroundColor Gray
        }
        404 {
            Write-Host "   • El endpoint no fue encontrado" -ForegroundColor Gray
            Write-Host "   • Verifique la URL de la API: $ApiUrl" -ForegroundColor Gray
        }
        500 {
            Write-Host "   • Error interno del servidor" -ForegroundColor Gray
            Write-Host "   • Revise los logs del backend para más detalles" -ForegroundColor Gray
            Write-Host "   • Verifique la conexión a la base de datos" -ForegroundColor Gray
        }
        default {
            Write-Host "   • Código de estado HTTP: $StatusCode" -ForegroundColor Gray
            Write-Host "   • Consulte la documentación de la API" -ForegroundColor Gray
        }
    }
    
    Write-Host ""
}

function Ask-Retry {
    Write-Host "¿Desea intentar de nuevo? (S/N): " -NoNewline -ForegroundColor Yellow
    $retry = Read-Host
    return ($retry -eq "S" -or $retry -eq "s")
}

function Ask-ChangeFile {
    Write-Host "¿Desea seleccionar otro archivo? (S/N): " -NoNewline -ForegroundColor Yellow
    $change = Read-Host
    return ($change -eq "S" -or $change -eq "s")
}

# ============================================================================
# PROGRAMA PRINCIPAL
# ============================================================================

# Mostrar bienvenida
Show-Welcome

# Mostrar ayuda sobre el formato CSV
Show-CsvFormatHelp

# Variable para controlar el flujo
$continueImport = $true
$csvFilePath = ""

while ($continueImport) {
    # Solicitar archivo CSV
    $csvFilePath = Get-CsvFilePath
    
    # Validar que el archivo existe
    if (-not (Test-CsvFile -FilePath $csvFilePath)) {
        if (-not (Ask-Retry)) {
            Write-Host ""
            Write-Host "Importación cancelada." -ForegroundColor Yellow
            Write-Host ""
            exit 0
        }
        continue
    }
    
    # Confirmar antes de continuar
    Write-Host "¿Desea proceder con la importación? (S/N): " -NoNewline -ForegroundColor Yellow
    $confirm = Read-Host
    
    if ($confirm -ne "S" -and $confirm -ne "s") {
        Write-Host ""
        Write-Host "Importación cancelada." -ForegroundColor Yellow
        Write-Host ""
        exit 0
    }
    
    # Realizar la importación
    $response = Invoke-CsvImport -FilePath $csvFilePath -ApiUrl $ApiUrl
    
    # Mostrar resultado
    Show-ImportResult -Response $response
    
    # Si hubo error, mostrar ayuda
    if (-not $response.Success) {
        Show-ErrorHelp -StatusCode $response.StatusCode
        
        # Preguntar si desea reintentar o cambiar de archivo
        if (Ask-ChangeFile) {
            continue
        }
        elseif (Ask-Retry) {
            continue
        }
        else {
            $continueImport = $false
        }
    }
    else {
        # Importación exitosa, preguntar si desea importar otro archivo
        Write-Host "¿Desea importar otro archivo? (S/N): " -NoNewline -ForegroundColor Cyan
        $another = Read-Host
        
        if ($another -eq "S" -or $another -eq "s") {
            Write-Host ""
            continue
        }
        else {
            $continueImport = $false
        }
    }
}

# Mensaje de despedida
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║              Gracias por usar el Importador de VelyKapet              ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
