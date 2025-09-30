@echo off
echo.
echo ========================================
echo  🚀 Instalando Backend .NET VelyKapet
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

REM Crear directorio del backend
set "BACKEND_DIR=..\VentasPetApi"
if not exist "%BACKEND_DIR%" (
    echo 📁 Creando directorio del backend...
    mkdir "%BACKEND_DIR%"
)

cd /d "%BACKEND_DIR%"

echo.
echo 🔧 Creando proyecto ASP.NET Core Web API...
dotnet new webapi -n VentasPetApi --framework net8.0

echo.
echo 📦 Instalando paquetes NuGet necesarios...
cd VentasPetApi

REM Entity Framework Core
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package Microsoft.EntityFrameworkCore.Design

REM Autenticación JWT
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package System.IdentityModel.Tokens.Jwt

REM Swagger
dotnet add package Swashbuckle.AspNetCore

REM CORS
dotnet add package Microsoft.AspNetCore.Cors

REM AutoMapper
dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection

REM BCrypt para hash de contraseñas
dotnet add package BCrypt.Net-Next

echo.
echo 📋 Copiando archivos de configuración...

REM Crear directorios
mkdir Models 2>nul
mkdir Data 2>nul
mkdir Controllers 2>nul
mkdir Services 2>nul
mkdir DTOs 2>nul

echo.
echo ✅ Backend creado exitosamente en: %BACKEND_DIR%\VentasPetApi
echo.
echo 📋 Próximos pasos:
echo    1. Copiar los archivos de configuración
echo    2. Configurar Program.cs
echo    3. Crear las migraciones
echo    4. Ejecutar el backend
echo.
echo 💡 Para continuar:
echo    cd %BACKEND_DIR%\VentasPetApi
echo    dotnet run
echo.
pause
