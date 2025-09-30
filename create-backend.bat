@echo off
echo.
echo ========================================
echo  🚀 Creando Backend .NET para VelyKapet
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

echo.
echo ✅ Backend creado exitosamente en: %BACKEND_DIR%\VentasPetApi
echo.
echo 📋 Próximos pasos:
echo    1. Configurar la cadena de conexión
echo    2. Crear los modelos y DbContext
echo    3. Configurar JWT y CORS
echo    4. Crear los controladores
echo.
pause
