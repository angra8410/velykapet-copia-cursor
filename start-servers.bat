@echo off
echo.
echo ========================================
echo  🚀 VentasPet - Iniciando Servidores
echo ========================================
echo.

REM Verificar si Node.js está disponible
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error: Node.js no encontrado
    echo Por favor instala Node.js desde https://nodejs.org
    pause
    exit /b 1
)

REM Verificar si .NET está disponible
where dotnet >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error: .NET no encontrado
    echo Por favor instala .NET desde https://dotnet.microsoft.com
    pause
    exit /b 1
)

echo ✅ Node.js disponible
echo ✅ .NET disponible
echo.

REM Crear directorio para logs si no existe
if not exist "logs" mkdir logs

echo 🌐 Iniciando Frontend Server...
start "VentasPet Frontend" cmd /k "echo 🌐 FRONTEND SERVER && echo. && node simple-server.cjs"

echo.
echo ⏳ Esperando 3 segundos antes de iniciar backend...
timeout /t 3 /nobreak >nul

echo 🔧 Iniciando Backend API...

REM Buscar la carpeta del backend .NET
set "BACKEND_PATH="

REM Primero buscar en el directorio actual
for /d %%i in (VentasPetApi* ventas_pet_api* backend* api*) do (
    if exist "%%i\Program.cs" (
        set "BACKEND_PATH=%%i"
        goto :found_backend
    )
    if exist "%%i\*.csproj" (
        set "BACKEND_PATH=%%i"
        goto :found_backend
    )
)

REM Si no se encuentra, buscar en directorios hermanos
if "%BACKEND_PATH%"=="" (
    if exist "..\ventas_pet\ventas_pet_api_dotnet\VentasPetApi.csproj" (
        set "BACKEND_PATH=..\ventas_pet\ventas_pet_api_dotnet"
        goto :found_backend
    )
    if exist "..\ventas_pet_api\VentasPetApi.csproj" (
        set "BACKEND_PATH=..\ventas_pet_api"
        goto :found_backend
    )
)

:found_backend
if "%BACKEND_PATH%"=="" (
    echo ❌ No se encontró el proyecto backend .NET
    echo Buscando archivos .csproj...
    dir *.csproj /s /b 2>nul
    dir ..\*.csproj /s /b 2>nul
    echo.
    echo 💡 El frontend funcionará sin backend, pero necesitarás iniciar el backend manualmente.
    echo 🔧 Backend esperado en: localhost:5135
    echo.
    pause
    goto :skip_backend
)

echo ✅ Backend encontrado en: %BACKEND_PATH%
start "VentasPet Backend" cmd /k "echo 🔧 BACKEND API && echo. && cd /d %BACKEND_PATH% && dotnet run"
goto :show_info

:skip_backend
echo ⚠️ Continuando solo con frontend...
echo.

:show_info
echo.
echo ========================================
echo  🎉 Servidores Iniciándose...
echo ========================================
echo.
echo 🌐 Frontend: http://localhost:3333
if not "%BACKEND_PATH%"=="" (
    echo 🔧 Backend:  http://localhost:5135
    echo 📜 Swagger:  http://localhost:5135/swagger
) else (
    echo ⚠️ Backend:  No iniciado (iniciar manualmente)
    echo 📝 Nota:     El frontend funciona con datos simulados
)
echo.
echo ⏹️  Para detener: Cerrar las ventanas o Ctrl+C
echo.
if not "%BACKEND_PATH%"=="" (
    echo ℹ️  Las ventanas se abrirán en unos segundos...
) else (
    echo ℹ️  La ventana del frontend se abrió. Para backend, ir a:
    echo     cd ..\ventas_pet\ventas_pet_api_dotnet && dotnet run
)
echo.
pause
