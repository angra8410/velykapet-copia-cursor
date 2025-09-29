@echo off
echo.
echo ========================================
echo  🔧 VentasPet - Solo Backend API
echo ========================================
echo.

REM Verificar si .NET está disponible
where dotnet >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error: .NET no encontrado
    echo Por favor instala .NET desde https://dotnet.microsoft.com
    pause
    exit /b 1
)

echo ✅ .NET disponible

REM Buscar el proyecto backend
set "BACKEND_PATH="

if exist "..\ventas_pet\ventas_pet_api_dotnet\VentasPetApi.csproj" (
    set "BACKEND_PATH=..\ventas_pet\ventas_pet_api_dotnet"
    echo ✅ Backend encontrado en: %BACKEND_PATH%
) else if exist "..\ventas_pet_api\VentasPetApi.csproj" (
    set "BACKEND_PATH=..\ventas_pet_api"
    echo ✅ Backend encontrado en: %BACKEND_PATH%
) else (
    echo ❌ No se encontró el proyecto backend .NET
    echo Buscando en ubicaciones posibles...
    dir ..\*.csproj /s /b 2>nul
    echo.
    echo 💡 Ubicaciones esperadas:
    echo   - ..\ventas_pet\ventas_pet_api_dotnet\
    echo   - ..\ventas_pet_api\
    echo.
    pause
    exit /b 1
)

echo.
echo 🔧 Iniciando Backend API...
echo 💡 URLs disponibles:
echo    Backend: http://localhost:5135
echo    Swagger: http://localhost:5135/swagger
echo.
echo ⏹️  Para detener: Ctrl+C
echo.

cd /d "%BACKEND_PATH%"
dotnet run