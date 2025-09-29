# VentasPet - Script PowerShell para iniciar Frontend y Backend
# Ejecutar con: .\start-servers.ps1

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " 🚀 VentasPet - Iniciando Servidores" -ForegroundColor Cyan  
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Función para verificar si un comando existe
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Verificar prerequisitos
Write-Host "🔍 Verificando prerequisitos..." -ForegroundColor Yellow

if (-not (Test-Command "node")) {
    Write-Host "❌ Error: Node.js no encontrado" -ForegroundColor Red
    Write-Host "Por favor instala Node.js desde https://nodejs.org" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

if (-not (Test-Command "dotnet")) {
    Write-Host "❌ Error: .NET no encontrado" -ForegroundColor Red
    Write-Host "Por favor instala .NET desde https://dotnet.microsoft.com" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host "✅ Node.js disponible" -ForegroundColor Green
Write-Host "✅ .NET disponible" -ForegroundColor Green
Write-Host ""

# Crear directorio de logs si no existe
if (-not (Test-Path "logs")) {
    New-Item -ItemType Directory -Path "logs" -Force | Out-Null
}

# Función para encontrar el backend
function Find-BackendPath {
    $possiblePaths = @("VentasPetApi", "ventas_pet_api", "backend", "api")
    
    # Buscar en directorio actual
    foreach ($path in $possiblePaths) {
        if (Test-Path $path) {
            $programCs = Join-Path $path "Program.cs"
            $csprojFiles = Get-ChildItem -Path $path -Filter "*.csproj" -ErrorAction SilentlyContinue
            
            if ((Test-Path $programCs) -or $csprojFiles) {
                return $path
            }
        }
    }
    
    # Buscar en directorios hermanos
    $possibleBackendPaths = @(
        "..\ventas_pet\ventas_pet_api_dotnet",
        "..\ventas_pet_api",
        "..\backend"
    )
    
    foreach ($path in $possibleBackendPaths) {
        if (Test-Path $path) {
            $csprojFiles = Get-ChildItem -Path $path -Filter "*.csproj" -ErrorAction SilentlyContinue
            if ($csprojFiles) {
                return $path
            }
        }
    }
    
    # Buscar archivos .csproj en subdirectorios del directorio actual
    $csprojFiles = Get-ChildItem -Recurse -Filter "*.csproj" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($csprojFiles) {
        return $csprojFiles.Directory.FullName
    }
    
    return $null
}

# Iniciar Frontend
Write-Host "🌐 Iniciando Frontend Server..." -ForegroundColor Blue
$frontendProcess = Start-Process -FilePath "pwsh" -ArgumentList "-NoExit", "-Command", "Write-Host '🌐 FRONTEND SERVER' -ForegroundColor Blue; Write-Host ''; node simple-server.cjs" -PassThru -WindowStyle Normal

# Esperar un poco antes de iniciar el backend
Write-Host "⏳ Esperando 3 segundos antes de iniciar backend..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Buscar y iniciar Backend
Write-Host "🔧 Iniciando Backend API..." -ForegroundColor Magenta
$backendPath = Find-BackendPath

if (-not $backendPath) {
    Write-Host "❌ No se encontró el proyecto backend .NET en ubicación esperada" -ForegroundColor Red
    Write-Host "Buscando archivos .csproj..." -ForegroundColor Yellow
    Get-ChildItem -Recurse -Filter "*.csproj" -ErrorAction SilentlyContinue | ForEach-Object { Write-Host "  - $($_.FullName)" -ForegroundColor Gray }
    Write-Host ""
    Write-Host "💡 El frontend funcionará con datos simulados" -ForegroundColor Yellow
    Write-Host "🔧 Para iniciar backend manualmente:" -ForegroundColor Cyan
    Write-Host "   cd ..\ventas_pet\ventas_pet_api_dotnet" -ForegroundColor Gray
    Write-Host "   dotnet run" -ForegroundColor Gray
    Write-Host ""
    Read-Host "Presiona Enter para continuar solo con frontend"
} else {
    Write-Host "✅ Backend encontrado en: $backendPath" -ForegroundColor Green
    
    # Cambiar al directorio del backend y ejecutar
    $backendFullPath = Resolve-Path $backendPath
    $backendProcess = Start-Process -FilePath "pwsh" -ArgumentList "-NoExit", "-Command", "Write-Host '🔧 BACKEND API' -ForegroundColor Magenta; Write-Host ''; Set-Location '$backendFullPath'; dotnet run" -PassThru -WindowStyle Normal
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host " 🎉 Servidores Iniciándose..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Frontend: " -NoNewline -ForegroundColor Blue
Write-Host "http://localhost:3333" -ForegroundColor Cyan
Write-Host "🔧 Backend:  " -NoNewline -ForegroundColor Magenta  
Write-Host "http://localhost:5135" -ForegroundColor Cyan
Write-Host "📖 Swagger:  " -NoNewline -ForegroundColor Yellow
Write-Host "http://localhost:5135/swagger" -ForegroundColor Cyan
Write-Host ""
Write-Host "⏹️  Para detener: Cerrar las ventanas de PowerShell o Ctrl+C" -ForegroundColor Yellow
Write-Host ""
Write-Host "ℹ️  Credenciales de prueba:" -ForegroundColor Cyan
Write-Host "   📧 Email: admin_20250920103519@ventaspet.com" -ForegroundColor Gray
Write-Host "   🔐 Password: Admin123!" -ForegroundColor Gray
Write-Host ""
Write-Host "🌟 ¡Todo listo! Los servidores se están iniciando..." -ForegroundColor Green
Write-Host ""

# Mantener el script corriendo y mostrar información útil
Write-Host "💡 Comandos útiles:" -ForegroundColor Cyan
Write-Host "   - Para ver procesos: Get-Process | Where-Object {`$_.ProcessName -eq 'node' -or `$_.ProcessName -eq 'dotnet'}" -ForegroundColor Gray
Write-Host "   - Para matar procesos: Stop-Process -Name 'node','dotnet' -Force" -ForegroundColor Gray
Write-Host ""

Read-Host "Presiona Enter para cerrar este script (los servidores seguirán corriendo)"