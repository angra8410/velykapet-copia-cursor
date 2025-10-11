# Test script para el endpoint POST /api/Productos
# Este script demuestra el uso correcto del endpoint y los errores comunes

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Test del Endpoint POST /api/Productos" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Configuración
$baseUrl = "http://localhost:5135"
$endpoint = "$baseUrl/api/Productos"

# Función para mostrar respuesta de error
function Show-ErrorResponse {
    param($exception)
    
    if ($exception.Exception.Response) {
        try {
            $reader = New-Object System.IO.StreamReader($exception.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            $reader.Close()
            
            # Intentar parsear como JSON
            try {
                $errorJson = $responseBody | ConvertFrom-Json
                Write-Host "Respuesta del servidor:" -ForegroundColor Yellow
                Write-Host ($errorJson | ConvertTo-Json -Depth 5) -ForegroundColor Yellow
            }
            catch {
                Write-Host "Respuesta del servidor (raw):" -ForegroundColor Yellow
                Write-Host $responseBody -ForegroundColor Yellow
            }
        }
        catch {
            Write-Host "No se pudo leer la respuesta del servidor" -ForegroundColor Red
        }
    }
    else {
        Write-Host $exception.Exception.Message -ForegroundColor Red
    }
}

# Test 1: JSON Correcto
Write-Host "Test 1: Request CORRECTO" -ForegroundColor Green
Write-Host "   Este es el formato esperado por el endpoint" -ForegroundColor Gray
Write-Host ""

$headers = @{
    "Content-Type" = "application/json"
}

$correctBody = @'
{
  "nombreBase": "Test Producto PowerShell",
  "descripcion": "Producto de prueba creado con PowerShell",
  "idCategoria": 2,
  "tipoMascota": "Gatos",
  "urlImagen": "https://ejemplo.com/imagen.jpg",
  "idMascotaTipo": 1,
  "idCategoriaAlimento": 2,
  "idSubcategoria": 5,
  "idPresentacion": 1,
  "proveedorId": 1,
  "variacionesProducto": [
    {
      "presentacion": "500 GR",
      "precio": 15000,
      "stock": 10
    },
    {
      "presentacion": "1 KG",
      "precio": 28000,
      "stock": 5
    }
  ]
}
'@

Write-Host "Request body:" -ForegroundColor Cyan
Write-Host $correctBody -ForegroundColor Gray
Write-Host ""

try {
    Write-Host "Enviando request..." -ForegroundColor Cyan
    $response = Invoke-RestMethod `
        -Uri $endpoint `
        -Method Post `
        -Headers $headers `
        -Body $correctBody `
        -ContentType "application/json"
    
    Write-Host "SUCCESS - Producto creado exitosamente" -ForegroundColor Green
    Write-Host "   ID Producto: $($response.idProducto)" -ForegroundColor Cyan
    Write-Host "   Nombre: $($response.nombreBase)" -ForegroundColor Cyan
    Write-Host "   Variaciones creadas: $($response.variaciones.Count)" -ForegroundColor Cyan
    
    foreach ($variacion in $response.variaciones) {
        Write-Host "      - $($variacion.presentacion): `$$($variacion.precio) (Stock: $($variacion.stock))" -ForegroundColor Gray
    }
}
catch {
    Write-Host "FAIL - Error al crear producto:" -ForegroundColor Red
    Show-ErrorResponse $_
}

Write-Host ""
Write-Host "-----------------------------------------------" -ForegroundColor Gray
Write-Host ""

# Test 2: JSON con wrapper INCORRECTO (productoDto)
Write-Host "Test 2: Request INCORRECTO - Usando wrapper 'productoDto'" -ForegroundColor Red
Write-Host "   Este formato NO es soportado y causara error 400" -ForegroundColor Gray
Write-Host ""

$incorrectBody = @'
{
  "productoDto": {
    "nombreBase": "Test Producto Incorrecto",
    "descripcion": "Este formato esta mal",
    "idCategoria": 2,
    "tipoMascota": "Gatos",
    "variacionesProducto": [
      {
        "presentacion": "500 GR",
        "precio": 15000,
        "stock": 10
      }
    ]
  }
}
'@

Write-Host "Request body:" -ForegroundColor Cyan
Write-Host $incorrectBody -ForegroundColor Gray
Write-Host ""

try {
    Write-Host "Enviando request..." -ForegroundColor Cyan
    $response = Invoke-RestMethod `
        -Uri $endpoint `
        -Method Post `
        -Headers $headers `
        -Body $incorrectBody `
        -ContentType "application/json"
    
    Write-Host "SUCCESS (inesperado) - El request deberia haber fallado" -ForegroundColor Yellow
}
catch {
    Write-Host "EXPECTED FAIL - Como se esperaba, el request fallo:" -ForegroundColor Yellow
    Show-ErrorResponse $_
    Write-Host ""
    Write-Host "Solucion: Envia el JSON directamente sin wrapper 'productoDto'" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "-----------------------------------------------" -ForegroundColor Gray
Write-Host ""

# Test 3: JSON con tipos incorrectos
Write-Host "Test 3: Request INCORRECTO - Tipos de datos incorrectos" -ForegroundColor Red
Write-Host "   Strings donde deben ir numeros" -ForegroundColor Gray
Write-Host ""

$incorrectTypesBody = @'
{
  "nombreBase": "Test Producto Tipos Incorrectos",
  "descripcion": "Tipos de datos mal definidos",
  "idCategoria": "2",
  "tipoMascota": "Gatos",
  "variacionesProducto": [
    {
      "presentacion": "500 GR",
      "precio": "15000",
      "stock": "10"
    }
  ]
}
'@

Write-Host "Request body:" -ForegroundColor Cyan
Write-Host $incorrectTypesBody -ForegroundColor Gray
Write-Host ""

try {
    Write-Host "Enviando request..." -ForegroundColor Cyan
    $response = Invoke-RestMethod `
        -Uri $endpoint `
        -Method Post `
        -Headers $headers `
        -Body $incorrectTypesBody `
        -ContentType "application/json"
    
    Write-Host "SUCCESS (inesperado) - El request deberia haber fallado o ASP.NET lo convirtio automaticamente" -ForegroundColor Yellow
}
catch {
    Write-Host "EXPECTED FAIL - Como se esperaba, el request fallo:" -ForegroundColor Yellow
    Show-ErrorResponse $_
    Write-Host ""
    Write-Host "Solucion: Usa numeros sin comillas para campos numericos" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "-----------------------------------------------" -ForegroundColor Gray
Write-Host ""

# Test 4: JSON sin variaciones
Write-Host "Test 4: Request INCORRECTO - Sin variaciones" -ForegroundColor Red
Write-Host "   El array variacionesProducto esta vacio" -ForegroundColor Gray
Write-Host ""

$noVariationsBody = @'
{
  "nombreBase": "Test Producto Sin Variaciones",
  "descripcion": "Este producto no tiene variaciones",
  "idCategoria": 2,
  "tipoMascota": "Gatos",
  "variacionesProducto": []
}
'@

Write-Host "Request body:" -ForegroundColor Cyan
Write-Host $noVariationsBody -ForegroundColor Gray
Write-Host ""

try {
    Write-Host "Enviando request..." -ForegroundColor Cyan
    $response = Invoke-RestMethod `
        -Uri $endpoint `
        -Method Post `
        -Headers $headers `
        -Body $noVariationsBody `
        -ContentType "application/json"
    
    Write-Host "SUCCESS (inesperado) - El request deberia haber fallado" -ForegroundColor Yellow
}
catch {
    Write-Host "EXPECTED FAIL - Como se esperaba, el request fallo:" -ForegroundColor Yellow
    Show-ErrorResponse $_
    Write-Host ""
    Write-Host "Solucion: Incluye al menos una variacion en el array 'variacionesProducto'" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Resumen de Tests" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Test 1: Request correcto - Deberia crear el producto" -ForegroundColor Green
Write-Host "Test 2: Wrapper 'productoDto' - Deberia fallar con 400" -ForegroundColor Yellow
Write-Host "Test 3: Tipos incorrectos - Puede fallar o convertirse automaticamente" -ForegroundColor Yellow
Write-Host "Test 4: Sin variaciones - Deberia fallar con 400" -ForegroundColor Yellow
Write-Host ""
Write-Host "Ver documentacion completa en:" -ForegroundColor Cyan
Write-Host "   backend-config/API_ENDPOINT_CREAR_PRODUCTO.md" -ForegroundColor Gray
Write-Host ""
