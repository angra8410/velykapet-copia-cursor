# Script simplificado
$ApiUrl = "http://localhost:5135/api/Productos/ImportarCsv"
$CsvFile = "sample-products.csv"

# Configurar encoding UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# Verificar archivo
if (-not (Test-Path $CsvFile)) {
    Write-Host "Error: No se encontró el archivo $CsvFile"
    exit
}

Write-Host "Importando productos desde $CsvFile"

try {
    # Preparar archivo
    $fileBin = [System.IO.File]::ReadAllBytes((Resolve-Path $CsvFile))
    $boundary = [System.Guid]::NewGuid().ToString()
    $LF = "`r`n"

    # Construir cuerpo
    $bodyLines = (
        "--$boundary",
        "Content-Disposition: form-data; name=`"file`"; filename=`"$CsvFile`"",
        "Content-Type: text/csv",
        "",
        [System.Text.Encoding]::UTF8.GetString($fileBin),
        "--$boundary--",
        ""
    ) -join $LF

    # Enviar petición
    $response = Invoke-WebRequest -Uri $ApiUrl -Method Post -ContentType "multipart/form-data; boundary=$boundary" -Body $bodyLines

    # Mostrar respuesta
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "✅ IMPORTACIÓN COMPLETADA" -ForegroundColor Green
    Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
    
    $jsonObject = $response.Content | ConvertFrom-Json
    
    Write-Host "📊 RESUMEN:" -ForegroundColor Yellow
    Write-Host "   📦 Total procesados: $($jsonObject.TotalProcessed)" -ForegroundColor Gray
    Write-Host "   ✅ Exitosos:         $($jsonObject.SuccessCount)" -ForegroundColor Green
    Write-Host "   ❌ Fallidos:         $($jsonObject.FailureCount)" -ForegroundColor Red
    Write-Host ""
    
    if ($jsonObject.Message) {
        Write-Host "💬 MENSAJE:" -ForegroundColor Yellow
        Write-Host "   $($jsonObject.Message)" -ForegroundColor Gray
        Write-Host ""
    }
    
    # Mostrar productos creados
    if ($jsonObject.CreatedProducts -and $jsonObject.CreatedProducts.Count -gt 0) {
        Write-Host "✨ PRODUCTOS CREADOS: $($jsonObject.CreatedProducts.Count)" -ForegroundColor Green
        Write-Host ""
        $count = 0
        foreach ($producto in $jsonObject.CreatedProducts) {
            $count++
            Write-Host "   $count. [ID: $($producto.IdProducto)] $($producto.NombreBase)" -ForegroundColor Cyan
            if ($producto.Variaciones -and $producto.Variaciones.Count -gt 0) {
                foreach ($variacion in $producto.Variaciones) {
                    Write-Host "      • $($variacion.Presentacion) - Precio: `$$($variacion.Precio) - Stock: $($variacion.Stock)" -ForegroundColor Gray
                }
            }
            if ($count -ge 10) {
                Write-Host "   ... y $($jsonObject.CreatedProducts.Count - 10) más" -ForegroundColor Gray
                break
            }
        }
        Write-Host ""
    }
    
    # Mostrar errores detallados
    if ($jsonObject.DetailedErrors -and $jsonObject.DetailedErrors.Count -gt 0) {
        Write-Host "⚠️  ERRORES DETALLADOS: $($jsonObject.DetailedErrors.Count)" -ForegroundColor Red
        Write-Host ""
        foreach ($error in $jsonObject.DetailedErrors) {
            Write-Host "   ❌ Línea $($error.LineNumber): $($error.ProductName)" -ForegroundColor Red
            Write-Host "      Tipo: $($error.ErrorType)" -ForegroundColor DarkRed
            Write-Host "      Error: $($error.ErrorMessage)" -ForegroundColor DarkRed
            
            if ($error.FieldErrors) {
                Write-Host "      Campos con error:" -ForegroundColor DarkYellow
                foreach ($fieldError in $error.FieldErrors.GetEnumerator()) {
                    Write-Host "         • $($fieldError.Key): $($fieldError.Value)" -ForegroundColor Yellow
                }
            }
            Write-Host ""
        }
    }
    elseif ($jsonObject.Errors -and $jsonObject.Errors.Count -gt 0) {
        Write-Host "⚠️  ERRORES: $($jsonObject.Errors.Count)" -ForegroundColor Red
        Write-Host ""
        foreach ($error in $jsonObject.Errors) {
            Write-Host "   • $error" -ForegroundColor DarkRed
        }
        Write-Host ""
    }
    
    Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
}
}
catch {
    # MANEJO DE ERRORES PRINCIPAL
    Write-Host "Error al realizar la petición: $_" -ForegroundColor Red

    Write-Host ""
    Write-Host "💡 SUGERENCIAS PARA RESOLVER EL ERROR:" -ForegroundColor Yellow
    Write-Host ""

    if ($_.Exception.Response) {
        $statusCode = [int]$_.Exception.Response.StatusCode

        switch ($statusCode) {
            400 {
                Write-Host "   • Revise el formato del archivo CSV" -ForegroundColor Gray
                Write-Host "   • Verifique que los campos obligatorios estén presentes" -ForegroundColor Gray
            }
            404 {
                Write-Host "   • El endpoint no fue encontrado" -ForegroundColor Gray
                Write-Host "   • Verifique la URL de la API: $ApiUrl" -ForegroundColor Gray
            }
            405 {
                Write-Host "   • ERROR 405: Método no permitido" -ForegroundColor Red
                Write-Host "   • El endpoint no acepta el método POST o la ruta es incorrecta" -ForegroundColor Gray
                Write-Host "   • Verifique que el backend tenga [HttpPost('ImportarCsv')] configurado" -ForegroundColor Gray
                Write-Host "   • La ruta debe ser: /api/Productos/ImportarCsv" -ForegroundColor Gray
            }
            415 {
                Write-Host "   • ERROR 415: Tipo de medio no soportado" -ForegroundColor Red
                Write-Host "   • El Content-Type multipart/form-data no es aceptado" -ForegroundColor Gray
                Write-Host "   • Verifique la configuración del backend" -ForegroundColor Gray
            }
            500 {
                Write-Host "   • ERROR 500: Error interno del servidor" -ForegroundColor Red
                Write-Host "   • Revise los logs del backend para más detalles" -ForegroundColor Gray
                Write-Host "   • Puede haber problemas de base de datos o validación" -ForegroundColor Gray
            }
            default {
                Write-Host "   • Código de estado HTTP: $statusCode" -ForegroundColor Gray
            }
        }
    }
    else {
        Write-Host "   • Verifique que el servidor backend esté ejecutándose" -ForegroundColor Gray
        Write-Host "   • URL esperada: http://localhost:5135" -ForegroundColor Gray
        Write-Host "   • Comando para iniciar: cd backend-config" -ForegroundColor Gray
        Write-Host "   • Luego ejecute: dotnet run" -ForegroundColor Gray
    }
}

Write-Host "Fin"